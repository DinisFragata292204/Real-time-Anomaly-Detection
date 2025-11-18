from fastapi import FastAPI, HTTPException, Depends, status
from datetime import datetime
from sqlalchemy.orm import Session, selectinload
from pydantic import BaseModel
from sqlalchemy import desc, exists, delete
from typing import List
from models import Sensor_class, SensorData_class, Alert_class
from database import get_db

app = FastAPI()

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