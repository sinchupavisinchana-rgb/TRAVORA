
from sqlalchemy import Column, Integer, String, Float, Text, Date

from .database import Base


class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    destination = Column(String(150), nullable=False)
    country = Column(String(100), default="India")
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    budget = Column(Float, default=0)
    status = Column(String(30), default="Planned")


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    category = Column(String(80), default="Other")
    amount = Column(Float, nullable=False)
    expense_date = Column(Date, nullable=True)


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    author = Column(String(100), default="Traveller")
    location = Column(String(150), nullable=False)
    content = Column(Text, nullable=False)
    likes = Column(Integer, default=0)
