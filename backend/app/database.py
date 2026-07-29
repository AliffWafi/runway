import os
from sqlmodel import SQLModel, create_engine, Session, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./runway.db"

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}

engine = create_engine(
    DATABASE_URL, 
    echo=False, 
    connect_args=connect_args,
    pool_pre_ping=True
)

def init_db():
    try:
        SQLModel.metadata.create_all(engine)
    except Exception as e:
        print(f"init_db table creation warning: {e}")

    try:
        with Session(engine) as session:
            if "postgresql" in DATABASE_URL or "postgres" in DATABASE_URL:
                session.exec(text("ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS user_id UUID;"))
                session.exec(text("ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;"))
                session.exec(text("ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;"))
                session.commit()
    except Exception as e:
        print(f"Migration warning: {e}")

def get_session():
    with Session(engine) as session:
        yield session
