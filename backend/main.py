from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy.sql import func
from sqlalchemy.orm import joinedload
from datetime import datetime, date, timedelta
from database import Base, engine, get_db
from models import EmployeeModel, StoreModel, TransactionModel
from schemas import Employee, EmployeeCreate, EmployeeUpdate, Store, StoreCreate, StoreUpdate, Transaction, TransactionWithDetails, TransactionCreate, TransactionUpdate, TransactionSummary
from collections import defaultdict


import time
import sqlalchemy.exc


app = FastAPI()

# CORS 설정
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 데이터베이스 초기화
Base.metadata.create_all(bind=engine)


@app.post("/transactions/", response_model=Transaction)
def create_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    today = date.today()
    retries = 3
    while retries > 0:
        try:
            existing_transaction = db.query(TransactionModel).filter(
                TransactionModel.employee_id == transaction.employee_id,
                func.date(TransactionModel.check_in) == today
            ).first()

            if existing_transaction:
                # 출근 기록이 있는 경우, 퇴근 시간 업데이트
                # utc+9 기준으로 퇴근 시간 업데이트
                existing_transaction.check_out = datetime.now()
                db.commit()
                db.refresh(existing_transaction)
                return existing_transaction
            else:
                # 출근 기록이 없는 경우, 새로운 트랜잭션 추가
                new_transaction = TransactionModel(
                    employee_id=transaction.employee_id,
                    store_id=transaction.store_id,
                    check_in=datetime.now()
                )
                db.add(new_transaction)
                db.commit()
                db.refresh(new_transaction)
                return new_transaction
        except sqlalchemy.exc.OperationalError as e:
            if "database is locked" in str(e):
                retries -= 1
                time.sleep(1)  # 잠시 대기 후 재시도
            else:
                raise e


@app.get("/transactions/", response_model=TransactionSummary)
def read_transactions(year: int = None, month: int = None, store_id: int = None, employee_id: int = None, start_date: datetime = None, end_date: datetime = None, db: Session = Depends(get_db)):
    query = db.query(TransactionModel).join(EmployeeModel).join(StoreModel).options(
        joinedload(TransactionModel.employee),
        joinedload(TransactionModel.store)
    )

    if year:
        query = query.filter(func.strftime(
            "%Y", TransactionModel.check_in) == str(year))
    if month:
        query = query.filter(func.strftime(
            "%m", TransactionModel.check_in) == str(month))
    if store_id:
        query = query.filter(TransactionModel.store_id == store_id)
    if employee_id:
        query = query.filter(TransactionModel.employee_id == employee_id)
    if start_date:
        query = query.filter(TransactionModel.check_in >= start_date)
    if end_date:
        query = query.filter(TransactionModel.check_in <= end_date)
    transactions = query.all()

    res_transactions = []
    res_time_summation = defaultdict(lambda: timedelta(0))

    for transaction in transactions:
        transaction_dict = transaction.__dict__
        transaction_dict['employee_name'] = transaction.employee.name
        transaction_dict['store_name'] = transaction.store.name
        res_transactions.append(TransactionWithDetails(**transaction_dict))
        if transaction.check_in and transaction.check_out:
            res_time_summation[transaction.employee.name] += transaction.check_out - \
                transaction.check_in

    res_time_summation = {k: v.total_seconds(
    ) / 3600 for k, v in res_time_summation.items()}
    print(res_transactions)
    return {"transactions": res_transactions, "res_time_summation": res_time_summation}


@app.put("/transactions/{transaction_id}", response_model=Transaction)
def update_transaction(transaction_id: int, transaction: TransactionUpdate, db: Session = Depends(get_db)):
    db_transaction = db.query(TransactionModel).filter(
        TransactionModel.id == transaction_id).first()
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    for key, value in transaction.dict().items():
        setattr(db_transaction, key, value)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction


@app.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    db_transaction = db.query(TransactionModel).filter(
        TransactionModel.id == transaction_id).first()
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    db.delete(db_transaction)
    db.commit()
    return {"detail": "Transaction deleted"}


@app.get("/stores/", response_model=List[Store])
def read_stores(db: Session = Depends(get_db)):
    return db.query(StoreModel).all()


@app.post("/stores/", response_model=Store)
def create_store(store: StoreCreate, db: Session = Depends(get_db)):
    db_store = StoreModel(**store.dict())
    db.add(db_store)
    db.commit()
    db.refresh(db_store)
    return db_store


@app.get("/employees/", response_model=List[Employee])
def read_employees(store_id: int = None, db: Session = Depends(get_db)):
    query = db.query(EmployeeModel)
    if store_id:
        query = query.filter(EmployeeModel.store_id == store_id)
    return query.all()


@app.post("/employees/", response_model=Employee)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    db_employee = EmployeeModel(**employee.dict())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee


@app.put("/employees/{employee_id}", response_model=Employee)
def update_employee(employee_id: int, employee: EmployeeUpdate, db: Session = Depends(get_db)):
    db_employee = db.query(EmployeeModel).filter(
        EmployeeModel.id == employee_id).first()
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    for key, value in employee.dict().items():
        setattr(db_employee, key, value)
    db.commit()
    db.refresh(db_employee)
    return db_employee
