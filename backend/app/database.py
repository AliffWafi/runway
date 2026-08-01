import os
from sqlmodel import SQLModel, create_engine, Session, text
from dotenv import load_dotenv

load_dotenv()

RAW_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./runway.db")

def create_safe_engine(url: str):
    if not url:
        url = "sqlite:///./runway.db"
    
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)

    connect_args = {}
    if "sqlite" in url:
        connect_args["check_same_thread"] = False
    elif ("postgresql" in url or "postgres" in url) and "sslmode" not in url:
        if "localhost" not in url and "127.0.0.1" not in url:
            connect_args["sslmode"] = "require"

    try:
        return create_engine(url, echo=False, connect_args=connect_args, pool_pre_ping=True), url
    except Exception as e:
        print(f"Failed to create database engine ({e}), using safe fallback...")
        fallback_url = "sqlite:///./runway.db"
        return create_engine(fallback_url, echo=False, connect_args={"check_same_thread": False}), fallback_url

engine, DATABASE_URL = create_safe_engine(RAW_DATABASE_URL)

def init_db():
    global engine, DATABASE_URL
    try:
        SQLModel.metadata.create_all(engine)
    except Exception as e:
        print(f"init_db failed with primary engine ({e}), falling back to SQLite...")
        try:
            DATABASE_URL = "sqlite:///./runway.db"
            engine = create_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False})
            SQLModel.metadata.create_all(engine)
        except Exception as err:
            print(f"Fallback init_db warning: {err}")

    try:
        with Session(engine) as session:
            if "postgresql" in DATABASE_URL or "postgres" in DATABASE_URL:
                session.exec(text("ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS user_id UUID;"))
                session.exec(text("ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;"))
                session.exec(text("ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;"))
                # Drop legacy PostgreSQL Enum CHECK constraints to allow new statuses (e.g. radar_contact)
                session.exec(text("ALTER TABLE job_applications DROP CONSTRAINT IF EXISTS job_applications_status_check;"))
                session.exec(text("ALTER TABLE activity_logs DROP CONSTRAINT IF EXISTS activity_logs_status_check;"))
                session.commit()
    except Exception as e:
        print(f"Migration warning: {e}")

def get_session():
    with Session(engine) as session:
        yield session
