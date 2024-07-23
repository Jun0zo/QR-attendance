from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class TransactionModel(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    store_id = Column(Integer, ForeignKey("stores.id"))
    check_in = Column(DateTime, default=None)
    check_out = Column(DateTime, default=None)

    employee = relationship("EmployeeModel", back_populates="transactions")
    store = relationship("StoreModel", back_populates="transactions")
