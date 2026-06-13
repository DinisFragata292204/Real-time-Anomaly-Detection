import requests, time, random

API_KEY = "etjiB0ptljawIoFShR62lXM-xRsxjlZ3ZSIgHEmYyds"

while True:
    value = random.randint(20, 42)
    r = requests.post("https://resplendent-clarity-production-e82d.up.railway.app/receive_data", headers={"X-SENSOR-TOKEN": API_KEY}, json={"value": value})
    print(r.status_code, r.json())
    time.sleep(2)