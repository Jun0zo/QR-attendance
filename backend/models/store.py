# models/store.py
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base


class StoreModel(Base):
    __tablename__ = "stores"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, index=True)
    transactions = relationship("TransactionModel", back_populates="store")
    employees = relationship("EmployeeModel", back_populates="store")
