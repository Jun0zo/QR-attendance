# models/transaction.py
from sqlalchemy import Column, Integer, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class TransactionModel(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    store_id = Column(Integer, ForeignKey("stores.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    check_in_out = Column(Boolean)

    employee = relationship("EmployeeModel", back_populates="transactions")
    store = relationship("StoreModel", back_populates="transactions")
