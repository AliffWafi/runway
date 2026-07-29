import os
import re
from sqlmodel import SQLModel, create_engine, Session, text
from dotenv import load_dotenv

load_dotenv()

RAW_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./runway.db")

def parse_database_url(url: str) -> str:
    if not url:
        return "sqlite:///./runway.db"
    
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
        
    # Automatically convert Supabase IPv6 direct host (db.xxx.supabase.co:5432) to IPv4 Pooler
    if "supabase.co" in url:
        match = re.search(r"db\.([a-z0-9]+)\.supabase\.co", url)
        if match:
            project_ref = match.group(1)
            url = re.sub(
                r"db\.[a-z0-9]+\.supabase\.co:5432",
                "aws-0-ap-southeast-1.pooler.supabase.com:6543",
                url
            )
            if f"postgres.{project_ref}" not in url:
                url = url.replace("postgresql://postgres:", f"postgresql://postgres.{project_ref}:", 1)
            
    return url

DATABASE_URL = parse_database_url(RAW_DATABASE_URL)

connect_args = {}
if "sqlite" in DATABASE_URL:
    connect_args["check_same_thread"] = False
elif ("postgresql" in DATABASE_URL or "postgres" in DATABASE_URL) and "sslmode" not in DATABASE_URL:
    if "localhost" not in DATABASE_URL and "127.0.0.1" not in DATABASE_URL:
        connect_args["sslmode"] = "require"

engine = create_engine(
    DATABASE_URL, 
    echo=False, 
    connect_args=connect_args,
    pool_pre_ping=True
)

def init_db():
    try:
        SQLModel.metadata.create_all(engine)
        with Session(engine) as session:
            if "postgresql" in DATABASE_URL or "postgres" in DATABASE_URL:
                session.exec(text("ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS user_id UUID;"))
                session.exec(text("ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;"))
                session.exec(text("ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;"))
                session.commit()
    except Exception as e:
        print(f"init_db warning: {e}")

def get_session():
    with Session(engine) as session:
        yield session
