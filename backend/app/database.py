
import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Load backend/.env
ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(ENV_PATH)

DATABASE_URL = (
    f"postgresql+psycopg2://"
    f"{os.getenv('DATABASE_USER', 'postgres')}:"
    f"{os.getenv('DATABASE_PASSWORD', '')}@"
    f"{os.getenv('DATABASE_HOST', 'localhost')}:"
    f"{os.getenv('DATABASE_PORT', '5432')}/"
    f"{os.getenv('DATABASE_NAME', 'travora_db')}"
)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def test_database_connection():
    from sqlalchemy import text

    with engine.connect() as connection:
        result = connection.execute(text("SELECT version()"))
        return result.scalar()
