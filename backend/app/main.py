import uuid
from typing import List, Optional
from datetime import datetime
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from app.database import init_db, get_session
from app.models import (
    User,
    UserCreate,
    UserLogin,
    UserRead,
    Token,
    JobApplication,
    JobApplicationCreate,
    JobApplicationUpdate,
    JobApplicationRead,
    ActivityLog,
    ActivityLogBase,
    ApplicationStatus
)
from app.auth import get_password_hash, verify_password, create_access_token, decode_access_token

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        init_db()
    except Exception as e:
        print(f"Startup DB init warning: {e}")
    yield

app = FastAPI(
    title="Runway API",
    description="FastAPI Backend service for Runway Job Application Tracker",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- AUTH HELPER ---
def get_current_user_optional(
    authorization: Optional[str] = Header(None),
    session: Session = Depends(get_session)
) -> Optional[User]:
    if not authorization:
        return None
    try:
        token = authorization.replace("Bearer ", "").strip()
        payload = decode_access_token(token)
        if not payload or "sub" not in payload:
            return None
        user_id = uuid.UUID(payload["sub"])
        return session.get(User, user_id)
    except Exception:
        return None

# --- AUTH ENDPOINTS ---

@app.post("/api/v1/auth/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserCreate, session: Session = Depends(get_session)):
    existing_user = session.exec(select(User).where(User.email == user_in.email.lower())).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Pilot account with this email already exists")

    hashed_pw = get_password_hash(user_in.password)
    user = User(
        email=user_in.email.lower(),
        full_name=user_in.full_name or user_in.email.split("@")[0].capitalize(),
        hashed_password=hashed_pw
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    token = create_access_token(data={"sub": str(user.id), "email": user.email})
    user_read = UserRead(id=user.id, email=user.email, full_name=user.full_name, created_at=user.created_at)
    return Token(access_token=token, user=user_read)

@app.post("/api/v1/auth/login", response_model=Token)
def login_user(credentials: UserLogin, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == credentials.email.lower())).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid pilot credentials")

    token = create_access_token(data={"sub": str(user.id), "email": user.email})
    user_read = UserRead(id=user.id, email=user.email, full_name=user.full_name, created_at=user.created_at)
    return Token(access_token=token, user=user_read)

@app.get("/")
def read_root():
    return {"status": "healthy", "service": "Runway API", "version": "1.0.0"}

@app.get("/api/v1/health")
def health_check():
    return {"status": "ok"}

# --- CRUD ENDPOINTS ---

@app.get("/api/v1/jobs", response_model=List[JobApplicationRead])
def read_jobs(
    current_user: Optional[User] = Depends(get_current_user_optional),
    session: Session = Depends(get_session)
):
    if current_user:
        jobs = session.exec(select(JobApplication).where(JobApplication.user_id == current_user.id)).all()
    else:
        jobs = []

    results = []
    for job in jobs:
        tags_list = [t.strip() for t in job.tags.split(",")] if job.tags else []
        logs = session.exec(select(ActivityLog).where(ActivityLog.job_id == job.id)).all()
        history = [ActivityLogBase(status=l.status, date=l.date, note=l.note) for l in logs]
        
        results.append(
            JobApplicationRead(
                id=job.id,
                user_id=job.user_id,
                company=job.company,
                title=job.title,
                location=job.location,
                salary=job.salary,
                url=job.url,
                applied_date=job.applied_date,
                status=job.status,
                notes=job.notes,
                tags=job.tags,
                tags_list=tags_list,
                history=history,
                created_at=job.created_at,
                updated_at=job.updated_at
            )
        )
    return results

@app.post("/api/v1/jobs", response_model=JobApplicationRead, status_code=status.HTTP_201_CREATED)
def create_job(
    job_in: JobApplicationCreate,
    current_user: Optional[User] = Depends(get_current_user_optional),
    session: Session = Depends(get_session)
):
    tags_str = ", ".join(job_in.tags_list) if job_in.tags_list else job_in.tags

    job = JobApplication(
        user_id=current_user.id if current_user else None,
        company=job_in.company,
        title=job_in.title,
        location=job_in.location,
        salary=job_in.salary,
        url=job_in.url,
        applied_date=job_in.applied_date,
        status=job_in.status,
        notes=job_in.notes,
        tags=tags_str
    )
    session.add(job)
    session.commit()
    session.refresh(job)

    log = ActivityLog(
        job_id=job.id,
        status=job.status,
        date=job.applied_date,
        note="Application entry submitted"
    )
    session.add(log)
    session.commit()

    tags_list = [t.strip() for t in job.tags.split(",")] if job.tags else []
    return JobApplicationRead(
        id=job.id,
        user_id=job.user_id,
        company=job.company,
        title=job.title,
        location=job.location,
        salary=job.salary,
        url=job.url,
        applied_date=job.applied_date,
        status=job.status,
        notes=job.notes,
        tags=job.tags,
        tags_list=tags_list,
        history=[ActivityLogBase(status=log.status, date=log.date, note=log.note)],
        created_at=job.created_at,
        updated_at=job.updated_at
    )

@app.patch("/api/v1/jobs/{job_id_str}", response_model=JobApplicationRead)
def update_job(
    job_id_str: str,
    job_in: JobApplicationUpdate,
    session: Session = Depends(get_session)
):
    try:
        job_uuid = uuid.UUID(job_id_str)
        job = session.get(JobApplication, job_uuid)
    except Exception:
        job = None

    if not job:
        raise HTTPException(status_code=404, detail="Job application not found")

    old_status = job.status
    update_data = job_in.dict(exclude_unset=True)

    if "tags_list" in update_data and update_data["tags_list"] is not None:
        update_data["tags"] = ", ".join(update_data["tags_list"])
        del update_data["tags_list"]

    for key, value in update_data.items():
        setattr(job, key, value)

    job.updated_at = datetime.utcnow()
    session.add(job)
    session.commit()
    session.refresh(job)

    if "status" in update_data and update_data["status"] != old_status:
        log = ActivityLog(
            job_id=job.id,
            status=job.status,
            date=datetime.utcnow().strftime("%Y-%m-%d"),
            note=f"Status changed to {job.status.value}"
        )
        session.add(log)
        session.commit()

    tags_list = [t.strip() for t in job.tags.split(",")] if job.tags else []
    logs = session.exec(select(ActivityLog).where(ActivityLog.job_id == job.id)).all()
    history = [ActivityLogBase(status=l.status, date=l.date, note=l.note) for l in logs]

    return JobApplicationRead(
        id=job.id,
        user_id=job.user_id,
        company=job.company,
        title=job.title,
        location=job.location,
        salary=job.salary,
        url=job.url,
        applied_date=job.applied_date,
        status=job.status,
        notes=job.notes,
        tags=job.tags,
        tags_list=tags_list,
        history=history,
        created_at=job.created_at,
        updated_at=job.updated_at
    )

@app.delete("/api/v1/jobs/{job_id_str}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(job_id_str: str, session: Session = Depends(get_session)):
    job = None
    try:
        job_uuid = uuid.UUID(job_id_str)
        job = session.get(JobApplication, job_uuid)
    except Exception:
        pass

    if not job:
        return None

    logs = session.exec(select(ActivityLog).where(ActivityLog.job_id == job.id)).all()
    for l in logs:
        session.delete(l)

    session.delete(job)
    session.commit()
    return None
