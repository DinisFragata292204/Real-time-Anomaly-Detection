import os
from fastapi import FastAPI, HTTPException, Depends, status
from sqlalchemy.orm import Session, selectinload
from dotenv import load_dotenv
from pydantic import BaseModel
from sqlalchemy import desc, exists, delete, or_
from typing import List
from models import User_Class, Sensor_class, SensorData_class, Alert_class
from database import get_db
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError, ExpiredSignatureError
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

app = FastAPI()
load_dotenv()

key = os.getenv("KEY")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = HTTPBearer(auto_error=False)

class UserInput(BaseModel):
    username: str
    email: str
    password: str

class LoginInput(BaseModel):
    username: str
    password: str

class UserOutput(BaseModel):
    id: int
    username: str
    email: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class Input_sensor(BaseModel):
    name: str
    type: str
    localization: str

class Input_data(BaseModel):
    sensor_id: int
    value: float

class CreateSensorOutput(BaseModel):
    id: int
    name: str
    type: str
    localization: str
    class Config:
        from_attributes = True

class receiveSensorOutput(BaseModel):
    id: int
    sensor_id: int
    value: float
    timestamp: datetime
    class Config:
        from_attributes = True

class AlertOutput(BaseModel):
    id: int
    sensor_id: int
    value: float
    type: str
    message: str
    timestamp: datetime

    class Config:
        from_attributes = True

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, key, algorithms=["HS256"])
    except ExpiredSignatureError:
        raise HTTPException(401, "Token expired.")
    except JWTError:
        raise HTTPException(401, "Invalid token.")
    username = payload.get("sub")
    if username is None:
        raise HTTPException(401, "Invalid token format.")
    user = db.query(User_Class).filter(User_Class.username == username).first()
    if user is None:
        raise HTTPException(401, "User not found.")
    return user

@app.post("/create_sensor", response_model=CreateSensorOutput, status_code=201)
def create_sensor(user_input_data: Input_sensor, db:Session = Depends(get_db)):
    sensor_exists = db.query(exists().where(Sensor_class.name == user_input_data.name)).scalar()
    
    if sensor_exists:
        raise HTTPException(status_code=409, detail="Sensor already exists.")
    
    add_new_sensor = Sensor_class(name=user_input_data.name, type=user_input_data.type, localization=user_input_data.localization)
    db.add(add_new_sensor)
    db.commit()
    db.refresh(add_new_sensor)

    return add_new_sensor

@app.post("/receive_data", response_model=receiveSensorOutput, status_code=201)
def post_sensor_data(user_input_data: Input_data, db:Session = Depends(get_db)):
    sensor_exists = db.query(exists().where(Sensor_class.id == user_input_data.sensor_id)).scalar()
    
    if not sensor_exists:
        raise HTTPException(status_code=404, detail="Sensor not found.")
    
    if user_input_data.value < -100 or user_input_data.value > 1000:
        raise HTTPException(status_code=400, detail="Invalid value range.")
    
    add_data_to_sensorData = SensorData_class(sensor_id = user_input_data.sensor_id, value=user_input_data.value, timestamp=datetime.now())
    db.add(add_data_to_sensorData)

    if user_input_data.value >= 45:
        type = "High temperature"
        message = "The value was 45+."
        add_data_to_alert = Alert_class(sensor_id = user_input_data.sensor_id, value=user_input_data.value, timestamp=datetime.now(), type=type, message=message)
        db.add(add_data_to_alert)

    db.commit()
    db.refresh(add_data_to_sensorData)
    return add_data_to_sensorData

@app.get("/get_data/{n_reads}", response_model=List[receiveSensorOutput])
def get_sensor_data(n_reads: int, db: Session = Depends(get_db)):
    return db.query(SensorData_class).order_by(desc(SensorData_class.timestamp)).limit(n_reads).all()

@app.get("/alerts", response_model=List[AlertOutput])
def get_alerts(db: Session = Depends(get_db)):
    return db.query(Alert_class).all()







@app.post("/users", response_model=UserOutput, status_code=status.HTTP_201_CREATED)
def create_user(data: UserInput, db: Session = Depends(get_db)):
    user_exists = db.query(exists().where(or_(User_Class.username == data.username, User_Class.email == data.email))).scalar()
    if user_exists:
        raise(HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Error. User already exists."))
    
    password_hash = pwd_context.hash(data.password)
    save_data_of_user = User_Class(username=data.username, email=data.email, password=password_hash)
    db.add(save_data_of_user)
    db.commit()
    db.refresh(save_data_of_user)
    return save_data_of_user

@app.get("/users/check")
def check_user(username_user: str, email_user: str, db: Session = Depends(get_db)):
    username_exists = db.query(exists().where(User_Class.username == username_user)).scalar()
    email_exists = db.query(exists().where(User_Class.email == email_user)).scalar()
    return {"Username exists:": username_exists, "Email exists:": email_exists}

#ex 2
@app.post("/login", response_model=Token)
def login(data: LoginInput, db: Session = Depends(get_db)):
    get_data_of_a_user = db.query(User_Class).where(User_Class.username == data.username).first()
    if not get_data_of_a_user:
        raise(HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Error. User not found."))
    verify_password = pwd_context.verify(data.password, get_data_of_a_user.password)
    if not verify_password:
        raise(HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Error. Password doesn't match."))
    encoded = jwt.encode({"sub": get_data_of_a_user.username, "email": get_data_of_a_user.email, "exp": datetime.now(timezone.utc) + timedelta(days=1)}, key, algorithm="HS256")
    return {"access_token": encoded, "token_type": "bearer"}

@app.get("/me")
def me(current_user = Depends(get_current_user)):
    return current_user