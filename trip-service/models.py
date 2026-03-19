from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class Activity(BaseModel):
    time: str
    description: str
    location: str

class Trip(BaseModel):
    id: Optional[int] = None
    user_id: str
    destination: str
    start_date: date
    end_date: date
    activities: List[Activity] = []