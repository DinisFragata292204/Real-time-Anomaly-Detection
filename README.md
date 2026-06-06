Real-Time Anomaly Detection Platform
------------------------------------

This project is a **full-stack web platform** for sensor monitoring and anomaly detection, built with _FastAPI_, _SQLAlchemy_, _MySQL_, and _React_.

The goal of the application is to simulate a **real-world IoT monitoring system**, where each user can create and manage their own sensors, receive data from them, and visualize both sensor readings and automatically generated alerts when abnormal values are detected.

The platform is designed with authentication, and clean architecture in mind. Only the authenticated user who created a sensor can access its data and alerts.

This project was developed primarily as a learning-oriented full-stack application, focusing on understanding how authentication, APIs, databases, and frontend interfaces work together in a realistic scenario.

**Project Structure**

## Project Structure

```text
Real-time-Anomaly-Detection/
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

Backend Setup
-------------

**1\. Create a Virtual Environment**

```cd backend``` 

```python -m venv venv```   

**1.1. Activate the virtual environment:**

Windows

```venv\Scripts\activate```  

Linux / macOS

```source venv/bin/activate```   

**2\. Install Dependencies**

With the virtual environment activated:

```pip install -r requirements.txt ```   

**3\. Database Setup**

Create a MySQL database manually (for example using MySQL Workbench).

**Example:**

```CREATE DATABASE realtime_anomaly_detection;```   

⚠️ **The application automatically creates all tables** on startup using SQLAlchemy, so no manual table creation is required.

**4\. Environment Variables (.env)**

Inside the backend folder, create a file called **.env**.

**Example .env file:**

```env 
USER=root
PASSWORD=your_mysql_password
HOST=localhost  PORT=3306
DATABASE=realtime_anomaly_detection
KEY=your_secret_jwt_key
```   

**Explanation:**

USER, PASSWORD, HOST, PORT, DATABASE → MySQL connection

KEY → Secret key used to sign JWT tokens

**5\. Run the Backend**

Still inside the backend folder:

```python -m uvicorn main:app --reload```   

If everything is correct, the API will be available at:

```http://127.0.0.1:8000```   

You can also access the automatic API documentation at:

```http://127.0.0.1:8000/docs```   

Frontend Setup
--------------

**1\. Install Dependencies**

Inside the frontend folder:

```cd frontend```   

```npm install```   

**2\. Run the Frontend**

```npm run dev```   

The frontend will be available at:

```http://127.0.0.1:5173```

Application Flow
----------------

1.  User creates an account
    
2.  User logs in and receives a JWT token
    
3.  Token is stored on the client side
    
4.  User accesses protected routes (Dashboard)
    
5.  User creates sensors
    
6.  Sensors send data to the backend
    
7.  Abnormal values generate alerts automatically
    
8.  User visualizes sensors, data, and alerts in the dashboard
    

Technologies Used
-----------------

**Backend**

*   Python
    
*   FastAPI
    
*   SQLAlchemy
    
*   MySQL
    
*   JWT
    
*   Pydantic
    

**Frontend**

*   React
    
*   React Router
    
*   JavaScript
    
*   Fetch API

## Security Note

This project uses JWT authentication. Tokens are stored on the client side.

## Project Status

This project is under active development and serves as a learning-oriented
full-stack application.
