import os
import secrets
from fastapi import FastAPI, HTTPException, Depends, status, Header
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from pydantic import BaseModel
from sqlalchemy import desc, exists, or_
from typing import List
from models import User_Class, Sensor_class, SensorData_class, Alert_class
from database import get_db
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError, ExpiredSignatureError
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()

key = os.getenv("KEY")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = HTTPBearer(auto_error=False)

class UserInput(BaseModel):
    username: str
    password: str

class LoginInput(BaseModel):
    username: str
    password: str

class UserOutput(BaseModel):
    id: int
    username: str
    class Config:
        from_attributes = True

class checkSensorAPIOutput(BaseModel):
    api_key: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class Input_sensor(BaseModel):
    name: str
    type: str
    localization: str

class sensor_input_data(BaseModel):
    value: float

class CreateSensorOutput(BaseModel):
    id: int
    name: str
    type: str
    localization: str
    api_key: str
    class Config:
        from_attributes = True

class receiveSensorOutput(BaseModel):
    id: int
    value: float
    timestamp: datetime
    class Config:
        orm_mode = True

class AlertOutput(BaseModel):
    id: int
    value: float
    type: str
    message: str
    timestamp: datetime

    class Config:
        from_attributes = True

class ReturnSensorsOfUser(BaseModel):
    id: int
    name: str
    type: str
    localization: str

    class Config:
        from_attributes = True

class check_if_user_exists_input(BaseModel):
    username: str

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
        raise HTTPException(401, "user not found.")
    return user

@app.post("/login", response_model=Token)
def login(data: LoginInput, db: Session = Depends(get_db)):
    get_data_of_a_user = db.query(User_Class).where(User_Class.username == data.username).first()
    if not get_data_of_a_user:
        raise(HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found."))
    verify_password = pwd_context.verify(data.password, get_data_of_a_user.password)
    if not verify_password:
        raise(HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Password doesn't match."))
    encoded = jwt.encode({"sub": get_data_of_a_user.username, "exp": datetime.now(timezone.utc) + timedelta(days=1)}, key, algorithm="HS256")
    return {"access_token": encoded, "token_type": "bearer"}

@app.post("/receive_data", response_model=receiveSensorOutput, status_code=201)
def post_sensor_data(sensor_input_data: sensor_input_data, db:Session = Depends(get_db), sensor_token: str = Header(..., alias="X-SENSOR-TOKEN")):
    sensor_exists = db.query(Sensor_class).filter(Sensor_class.api_key == sensor_token).first()
    if not sensor_exists:
        raise HTTPException(status_code=404, detail="Sensor not found.")
    
    if sensor_input_data.value < -100 or sensor_input_data.value > 1000:
        raise HTTPException(status_code=400, detail="Invalid value range.")
    
    add_data_to_sensorData = SensorData_class(sensor_id = sensor_exists.id, value=sensor_input_data.value, timestamp=datetime.now())
    db.add(add_data_to_sensorData)

    if sensor_input_data.value >= 45:
        type = "High temperature"
        message = "The value was 45+."
        add_data_to_alert = Alert_class(sensor_id = sensor_exists.id, value=sensor_input_data.value, timestamp=datetime.now(), type=type, message=message)
        db.add(add_data_to_alert)

    db.commit()
    db.refresh(add_data_to_sensorData)
    return add_data_to_sensorData

@app.post("/create_new_user", response_model=UserOutput, status_code=status.HTTP_201_CREATED)
def create_user(data: UserInput, db: Session = Depends(get_db)):
    user_exists = db.query(exists().where(or_(User_Class.username == data.username))).scalar()
    if user_exists:
        raise(HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User already exists."))
    
    password_hash = pwd_context.hash(data.password)
    save_data_of_user = User_Class(username=data.username, password=password_hash)
    db.add(save_data_of_user)
    db.commit()
    db.refresh(save_data_of_user)
    return save_data_of_user

@app.post("/check_if_user_exists")
def check_user(data: check_if_user_exists_input, db: Session = Depends(get_db)):
    username_exists = db.query(exists().where(User_Class.username == data.username)).scalar()
    if username_exists == True:
        return {"User exists": True, "Reason": "username"}
    return {"User exists": False}

@app.post("/user/create_sensor", response_model=CreateSensorOutput, status_code=201)
def create_sensor(user_input_data: Input_sensor, db:Session = Depends(get_db), current_user: User_Class = Depends(get_current_user)):
    sensor_exists = db.query(exists().where(Sensor_class.name == user_input_data.name, Sensor_class.user_id == current_user.id)).scalar()
    
    if sensor_exists:
        raise HTTPException(status_code=409, detail="Sensor already exists.")
    
    api_key = secrets.token_urlsafe(32) 

    add_new_sensor = Sensor_class(name=user_input_data.name, type=user_input_data.type, localization=user_input_data.localization, user_id=current_user.id, api_key=api_key)
    db.add(add_new_sensor)
    db.commit()
    db.refresh(add_new_sensor)

    return add_new_sensor

@app.get("/user/isloggedin")
def me(current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=401, detail="Not logged in.")
    return {"message": "User is logged in."}

@app.get("/user/sensor/get_data/{sensor_id}", response_model=List[receiveSensorOutput])
def get_sensor_data(sensor_id: int, db: Session = Depends(get_db), current_user: User_Class = Depends(get_current_user)):
    return db.query(SensorData_class).order_by(desc(SensorData_class.timestamp)).filter(SensorData_class.sensor_id == sensor_id).all()

@app.get("/user/sensor/alerts/{sensor_id}", response_model=List[AlertOutput])
def get_alerts(sensor_id: int, db: Session = Depends(get_db)):
    return db.query(Alert_class).filter(Alert_class.sensor_id == sensor_id).all()

@app.get("/user/get_sensors", response_model=List[ReturnSensorsOfUser])
def get_sensors_of_user(db: Session = Depends(get_db), current_user: User_Class = Depends(get_current_user)):
    return db.query(Sensor_class).filter(Sensor_class.user_id == current_user.id).all()

@app.get("/user/check_sensor_api/{sensor_id}", response_model=checkSensorAPIOutput)
def get_sensors_of_user(sensor_id: int, db: Session = Depends(get_db), current_user: User_Class = Depends(get_current_user)):
    sensor = db.query(Sensor_class).filter(Sensor_class.user_id == current_user.id, Sensor_class.id == sensor_id).first()

    if not sensor:
        raise HTTPException(status_code=404, detail="Sensor not found")

    return sensor


#@app.get("/user/me")
#def me(current_user = Depends(get_current_user)):
#   return current_user
