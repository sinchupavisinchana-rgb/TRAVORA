
from datetime import date
from typing import Optional

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from . import models

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TRAVORA API",
    description="Travel planning, budgeting and community platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TripCreate(BaseModel):
    destination: str
    country: str = "India"
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    budget: float = 0


class ExpenseCreate(BaseModel):
    title: str
    category: str = "Other"
    amount: float
    expense_date: Optional[date] = None


class PostCreate(BaseModel):
    author: str = "Traveller"
    location: str
    content: str


class TripResponse(TripCreate):
    id: int
    status: str

    model_config = ConfigDict(from_attributes=True)


class ExpenseResponse(ExpenseCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)


class PostResponse(PostCreate):
    id: int
    likes: int

    model_config = ConfigDict(from_attributes=True)


@app.get("/")
def home():
    return {
        "message": "Welcome to TRAVORA API",
        "status": "running"
    }


@app.get("/api/health")
def health():
    return {"status": "healthy", "application": "TRAVORA"}


@app.post("/api/trips", response_model=TripResponse)
def create_trip(data: TripCreate, db: Session = Depends(get_db)):
    trip = models.Trip(**data.model_dump())
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return trip


@app.get("/api/trips", response_model=list[TripResponse])
def get_trips(db: Session = Depends(get_db)):
    return db.query(models.Trip).order_by(models.Trip.id.desc()).all()


@app.delete("/api/trips/{trip_id}")
def delete_trip(trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(models.Trip).filter(
        models.Trip.id == trip_id
    ).first()

    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    db.delete(trip)
    db.commit()
    return {"message": "Trip deleted successfully"}


@app.post("/api/expenses", response_model=ExpenseResponse)
def create_expense(data: ExpenseCreate, db: Session = Depends(get_db)):
    expense = models.Expense(**data.model_dump())
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense


@app.get("/api/expenses", response_model=list[ExpenseResponse])
def get_expenses(db: Session = Depends(get_db)):
    return db.query(models.Expense).order_by(
        models.Expense.id.desc()
    ).all()


@app.post("/api/posts", response_model=PostResponse)
def create_post(data: PostCreate, db: Session = Depends(get_db)):
    post = models.Post(**data.model_dump())
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@app.get("/api/posts", response_model=list[PostResponse])
def get_posts(db: Session = Depends(get_db)):
    return db.query(models.Post).order_by(
        models.Post.id.desc()
    ).all()


@app.post("/api/posts/{post_id}/like")
def like_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(
        models.Post.id == post_id
    ).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    post.likes += 1
    db.commit()
    return {"message": "Post liked", "likes": post.likes}


@app.get("/api/dashboard")
def dashboard(db: Session = Depends(get_db)):
    trips = db.query(models.Trip).all()
    expenses = db.query(models.Expense).all()
    posts = db.query(models.Post).count()

    total_budget = sum(trip.budget or 0 for trip in trips)
    total_spent = sum(expense.amount for expense in expenses)

    return {
        "total_trips": len(trips),
        "total_budget": total_budget,
        "total_spent": total_spent,
        "remaining_budget": total_budget - total_spent,
        "community_posts": posts
    }
