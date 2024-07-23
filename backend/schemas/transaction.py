from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class TransactionBase(BaseModel):
    employee_id: int
    store_id: int
    check_in: datetime
    check_out: Optional[datetime] = None


class TransactionCreate(BaseModel):
    employee_id: int
    store_id: int


class TransactionUpdate(TransactionBase):
    pass


class Transaction(TransactionBase):
    id: int

    class Config:
        orm_mode = True
