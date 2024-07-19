# schemas/transaction.py
from pydantic import BaseModel
from datetime import datetime


class TransactionBase(BaseModel):
    employee_id: int
    store_id: int
    timestamp: datetime
    check_in_out: bool


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(TransactionBase):
    pass


class Transaction(TransactionBase):
    id: int

    class Config:
        orm_mode = True
