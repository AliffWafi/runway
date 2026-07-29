import os
from sqlmodel import SQLModel, create_engine, Session, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./runway.db"

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Handle Supabase IPv4 Pooler connection port (6543) if port 5432 fails on cloud hosts
if "supabase.co:5432" in DATABASE_URL:
    # Convert direct port 5432 to Supabase Pooler port 6543 for IPv4 compatibility
    DATABASE_URL = DATABASE_URL.replace(":5432", ":6543")

connect_args = {}
if "sqlite" in DATABASE_URL:
    connect_args["check_same_thread"] = False

if ("postgresql" in DATABASE_URL or "postgres" in DATABASE_URL) and "sslmode" not in DATABASE_URL:
    if "localhost" not in DATABASE_URL and "127.0.0.1" not in DATABASE_URL:
        connect_args["sslmode"] = "require"

try:
    engine = create_engine(
        DATABASE_URL, 
        echo=False, 
        connect_args=connect_args,
        pool_pre_ping=True
    )
except Exception as e:
    print(f"PostgreSQL engine failed, falling back to local SQLite: {e}")
    DATABASE_URL = "sqlite:///./runway.db"
    engine = create_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False})

def init_db():
    global engine, DATABASE_URL
    try:
        SQLModel.metadata.create_all(engine)
    except Exception as e:
        print(f"PostgreSQL connection failed ({e}). Falling back to local SQLite database...")
        DATABASE_URL = "sqlite:///./runway.db"
        engine = create_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False})
        SQLModel.metadata.create_all(engine)

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
