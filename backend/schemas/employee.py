# schemas/employee.py
from pydantic import BaseModel

class EmployeeBase(BaseModel):
    name: str
    store_id: int

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    id: int

    class Config:
        orm_mode = True
