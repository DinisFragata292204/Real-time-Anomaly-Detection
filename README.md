# Real-Time Anomaly Detection Platform

A full-stack IoT monitoring platform designed for real-world sensor integrations, anomaly detection, and automated alerting.

Originally conceptualized for smart beehive monitoring systems.

## Key Features

- User authentication with JWT
- Sensor creation and management
- Real-time sensor simulation
- Automatic anomaly detection
- Alert generation system
- User-specific dashboards
- Protected API endpoints

## Screenshots

### Dashboard

<img width="1536" height="693" alt="image" src="https://github.com/user-attachments/assets/3098edd4-c57d-4a83-bf57-b8e3641b3d9d" />

### Sensor Data Simulation

<img width="1533" height="693" alt="image" src="https://github.com/user-attachments/assets/ea33b5bf-569c-47b1-9860-a4787c11a222" />

## Live Demo

Frontend:
[Link](https://real-time-anomaly-detection.dinisfragata2.workers.dev)

Backend API:
[Link](https://resplendent-clarity-production-e82d.up.railway.app/)

API Documentation:
[Docs](https://resplendent-clarity-production-e82d.up.railway.app/docs)

## Project Vision

This platform was originally designed as part of a larger smart beehive monitoring system.

The goal was to connect physical sensors (such as temperature, humidity, weight, or sound sensors) installed inside a beehive to an Arduino-based device, which would continuously send data through the internet to this platform.

The system would then:

* Store sensor readings
* Detect abnormal behavior automatically
* Alert the beekeeper in real time
* Help prevent hive issues such as overheating, humidity imbalance, or colony stress

Although the physical hardware layer was not built, the software architecture was fully designed to support real sensor integration.

To simulate this real-world flow, the current platform includes sensor simulation endpoints and anomaly detection logic.

## Architecture

Sensor / Arduino Device

↓

FastAPI API Endpoint

↓

Anomaly Detection Logic

↓

MySQL Database

↓

React Dashboard

↓

Alert System


## Example Sensor Payload

```json
{
  "sensor_id": "sensor_001",
  "temperature": 38.5,
  "humidity": 92,
  "timestamp": "2026-06-13T14:30:00Z"
}
```

This endpoint can receive data from any external IoT device capable of sending HTTP requests, making the platform hardware-agnostic.
