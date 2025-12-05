import requests, time, random

API_KEY = "etjiB0ptljawIoFShR62lXM-xRsxjlZ3ZSIgHEmYyds"

while True:
    value = random.randint(20, 42)
    r = requests.post("http://127.0.0.1:8000/receive_data", headers={"X-SENSOR-TOKEN": API_KEY}, json={"value": value})
    print(r.status_code, r.json())
    time.sleep(2)