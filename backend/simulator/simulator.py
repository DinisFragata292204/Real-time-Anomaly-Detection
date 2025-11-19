import requests, random, time

while True:
    value = random.uniform(20, 50)
    sensor_id = 1
    requests.post("http://127.0.0.1:8000/receive_data", json={"sensor_id": sensor_id, "value": value})
    print(f"New data added the value is: {value}. For the {sensor_id}º sensor")
    time.sleep(2)