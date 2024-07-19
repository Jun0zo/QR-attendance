# main.py
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy.sql import func
from datetime import datetime
from database import Base, engine, get_db
from models import EmployeeModel, StoreModel, TransactionModel
from schemas import Employee, EmployeeCreate, EmployeeUpdate, Store, StoreCreate, StoreUpdate, Transaction, TransactionCreate, TransactionUpdate

app = FastAPI()

# CORS 설정
origins = [
    "http://localhost:3000",  # React 앱이 실행되는 주소
]

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
    db_transaction = TransactionModel(**transaction.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@app.get("/transactions/", response_model=List[Transaction])
def read_transactions(year: int = None, month: int = None, store_id: int = None, employee_id: int = None, start_date: datetime = None, end_date: datetime = None, db: Session = Depends(get_db)):
    query = db.query(TransactionModel)
    if year:
        query = query.filter(func.strftime("%Y", TransactionModel.timestamp) == str(year))
    if month:
        query = query.filter(func.strftime("%m", TransactionModel.timestamp) == str(month))
    if store_id:
        query = query.filter(TransactionModel.store_id == store_id)
    if employee_id:
        query = query.filter(TransactionModel.employee_id == employee_id)
    if start_date:
        query = query.filter(TransactionModel.timestamp >= start_date)
    if end_date:
        query = query.filter(TransactionModel.timestamp <= end_date)
    return query.all()

@app.put("/transactions/{transaction_id}", response_model=Transaction)
def update_transaction(transaction_id: int, transaction: TransactionUpdate, db: Session = Depends(get_db)):
    db_transaction = db.query(TransactionModel).filter(TransactionModel.id == transaction_id).first()
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    for key, value in transaction.dict().items():
        setattr(db_transaction, key, value)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@app.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    db_transaction = db.query(TransactionModel).filter(TransactionModel.id == transaction_id).first()
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
def read_employees(db: Session = Depends(get_db)):
    return db.query(EmployeeModel).all()

@app.post("/employees/", response_model=Employee)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    db_employee = EmployeeModel(**employee.dict())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

@app.put("/employees/{employee_id}", response_model=Employee)
def update_employee(employee_id: int, employee: EmployeeUpdate, db: Session = Depends(get_db)):
    db_employee = db.query(EmployeeModel).filter(EmployeeModel.id == employee_id).first()
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    for key, value in employee.dict().items():
        setattr(db_employee, key, value)
    db.commit()
    db.refresh(db_employee)
    return db_employee
