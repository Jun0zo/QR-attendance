# schemas/store.py
from pydantic import BaseModel


class StoreBase(BaseModel):
    name: str


class StoreCreate(StoreBase):
    pass


class StoreUpdate(StoreBase):
    pass


class Store(StoreBase):
    id: int

    class Config:
        orm_mode = True
