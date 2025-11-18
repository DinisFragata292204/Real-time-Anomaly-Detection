from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base
from dotenv import load_dotenv
import os

load_dotenv()

USER = os.getenv("USER")
PASSWORD = os.getenv("PASSWORD")
HOST = os.getenv("HOST")
PORT = os.getenv("PORT")
DATABASE = os.getenv("DATABASE")

DATABASE_URL = f"mysql+mysqlconnector://{USER}:{PASSWORD}@{HOST}:{PORT}/{DATABASE}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

Base.metadata.create_all(engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()