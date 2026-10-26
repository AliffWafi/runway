import os
from sqlmodel import SQLModel, create_engine, Session, text
from dotenv import load_dotenv

load_dotenv()

RAW_DATABASE_URL = os.getenv("DATABASE_URL")
if not RAW_DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is not set. Refusing to start without the Supabase database.")


def normalize_database_url(url: str) -> str:
    # SQLAlchemy 2.1+ maps plain "postgresql://" to the psycopg (v3) driver, which is not installed.
    # Pin the driver explicitly to psycopg2 so the engine always uses psycopg2-binary.
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql+psycopg2://", 1)
    elif url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+psycopg2://", 1)
    return url


DATABASE_URL = normalize_database_url(RAW_DATABASE_URL)

connect_args = {}
if "sqlite" in DATABASE_URL:
    connect_args["check_same_thread"] = False
elif "sslmode" not in DATABASE_URL and "localhost" not in DATABASE_URL and "127.0.0.1" not in DATABASE_URL:
    connect_args["sslmode"] = "require"

# No silent SQLite fallback: if Supabase is unreachable, fail loudly instead of serving an empty database.
engine = create_engine(DATABASE_URL, echo=False, connect_args=connect_args, pool_pre_ping=True)
print(f"Database engine initialised with driver: {engine.url.drivername} host: {engine.url.host}")


def init_db():
    SQLModel.metadata.create_all(engine)

    if engine.url.drivername.startswith("postgresql"):
        try:
            with engine.connect().execution_options(isolation_level="AUTOCOMMIT") as conn:
                try:
                    conn.execute(text("ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS user_id UUID;"))
                    conn.execute(text("ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;"))
                    conn.execute(text("ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;"))
                except Exception as col_e:
                    print(f"Column alter warning: {col_e}")

                # Convert status columns from PostgreSQL Enum to VARCHAR for 100% dynamic status support
                try:
                    conn.execute(text("ALTER TABLE job_applications ALTER COLUMN status TYPE VARCHAR USING status::VARCHAR;"))
                except Exception as enum_e1:
                    print(f"job_applications status convert warning: {enum_e1}")

                try:
                    conn.execute(text("ALTER TABLE activity_logs ALTER COLUMN status TYPE VARCHAR USING status::VARCHAR;"))
                except Exception as enum_e2:
                    print(f"activity_logs status convert warning: {enum_e2}")
        except Exception as e:
            print(f"Migration warning: {e}")


def get_session():
    with Session(engine) as session:
        yield session
