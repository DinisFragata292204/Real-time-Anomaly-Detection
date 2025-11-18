from sqlalchemy import Column, Integer, String, ForeignKey, func, DateTime, Float
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User_Class(Base):
    __tablename__ = "User"
    id = Column(Integer, primary_key=True)
    username = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)

    sensors = relationship(
        "Sensor_class",
        back_populates="user",
        cascade="all, delete-orphan"
    )

class Sensor_class(Base):
    __tablename__ = "Sensor"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    type = Column(String(255), nullable=False)
    localization = Column(String(255), nullable=False)

    user_id = Column(Integer, ForeignKey("User.id"), nullable=False)
    
    user = relationship(
        "User_class",
        back_populates="sensors"
    )

    sensor_data = relationship(
        "SensorData_class",
        back_populates="sensor",
        cascade="all, delete-orphan"
    )


    alerts = relationship(
        "Alert_class",
        back_populates="sensor",
        cascade="all, delete-orphan"
    )

class SensorData_class(Base):
    __tablename__ = "SensorData"
    id = Column(Integer, primary_key=True)
    value = Column(Float, nullable=False)
    timestamp = Column(DateTime, nullable=False, server_default=func.now())

    sensor_id = Column(Integer, ForeignKey("Sensor.id"))
    
    sensor = relationship(
        "Sensor_class",
        back_populates="sensor_data"
    )

class Alert_class(Base):
    __tablename__ = "Alert"
    id = Column(Integer, primary_key=True)
    value = Column(Float, nullable=False)
    timestamp = Column(DateTime, nullable=False, server_default=func.now())
    type = Column(String(255), nullable=False)
    message = Column(String(255), nullable=False)

    sensor_id = Column(Integer, ForeignKey("Sensor.id"), index=True, nullable=False)

    sensor = relationship(
        "Sensor_class",
        back_populates="alerts"
    )