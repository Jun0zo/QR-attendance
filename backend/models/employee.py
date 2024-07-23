# models/employee.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class EmployeeModel(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"))
    store = relationship("StoreModel", back_populates="employees")
    transactions = relationship("TransactionModel", back_populates="employee")
