from typing import Optional, List
from datetime import date, datetime
from enum import Enum
from sqlmodel import SQLModel, Field, Relationship
import uuid

class ApplicationStatus(str, Enum):
    TAXIING = "taxiing"
    HOLDING = "holding"
    CLEARED_FOR_TAKEOFF = "cleared_for_takeoff"
    AIRBORNE = "airborne"
    RETURN_TO_GATE = "return_to_gate"
    HOLDING_PATTERN = "holding_pattern"

# --- USER MODELS ---
class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    full_name: Optional[str] = None

class User(UserBase, table=True):
    __tablename__ = "users"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(UserBase):
    password: str

class UserLogin(SQLModel):
    email: str
    password: str

class UserRead(UserBase):
    id: uuid.UUID
    created_at: datetime

class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead

# --- JOB MODELS ---
class ActivityLogBase(SQLModel):
    status: ApplicationStatus
    date: str
    note: Optional[str] = None

class ActivityLog(ActivityLogBase, table=True):
    __tablename__ = "activity_logs"

    id: Optional[int] = Field(default=None, primary_key=True)
    job_id: uuid.UUID = Field(foreign_key="job_applications.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class JobApplicationBase(SQLModel):
    company: str = Field(index=True)
    title: str = Field(index=True)
    location: Optional[str] = None
    salary: Optional[str] = None
    url: Optional[str] = None
    applied_date: str = Field(default_factory=lambda: date.today().isoformat())
    status: ApplicationStatus = Field(default=ApplicationStatus.TAXIING)
    notes: Optional[str] = None
    tags: Optional[str] = None

class JobApplication(JobApplicationBase, table=True):
    __tablename__ = "job_applications"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: Optional[uuid.UUID] = Field(default=None, foreign_key="users.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class JobApplicationCreate(JobApplicationBase):
    tags_list: Optional[List[str]] = None

class JobApplicationUpdate(SQLModel):
    company: Optional[str] = None
    title: Optional[str] = None
    location: Optional[str] = None
    salary: Optional[str] = None
    url: Optional[str] = None
    applied_date: Optional[str] = None
    status: Optional[ApplicationStatus] = None
    notes: Optional[str] = None
    tags_list: Optional[List[str]] = None

class JobApplicationRead(JobApplicationBase):
    id: uuid.UUID
    user_id: Optional[uuid.UUID] = None
    created_at: datetime
    updated_at: datetime
    tags_list: List[str] = []
    history: List[ActivityLogBase] = []
