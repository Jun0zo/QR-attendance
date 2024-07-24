from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict


class TransactionBase(BaseModel):
    employee_id: Optional[int] = None
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


class TransactionWithDetails(TransactionBase):
    id: int
    employee_name: str
    store_name: str

    class Config:
        orm_mode = True


class TransactionSummary(BaseModel):
    transactions: List[TransactionWithDetails]
    res_time_summation: Dict[str, float]
