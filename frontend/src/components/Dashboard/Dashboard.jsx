import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ListOfSensors from "./ListOfSensors";
import DataOfASensorTable from "./DataOfASensorTable";
import AlertsOfASensorTable from "./AlertsOfASensorTable";

export default function Dashboard() {
    const navigate = useNavigate();
    
    const [sensors, setSensors] = useState([]);
    const [dataOfASensor, setDataOfASensor] = useState([]);
    const [alertOfASensor, setAlertOfASensor] = useState([]);

    useEffect(() => {
        async function mySensors() {
          const res = await fetch("http://127.0.0.1:8000/user/get_sensors", {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${localStorage.getItem("token")}`,
              }
          })
          const data = await res.json();
          setSensors(data);
        }

        mySensors();
    }, []);
    

    function logout() {
        localStorage.removeItem("token");
        navigate("/");
    }
    
    async function fetchSensorData(sensor_id) {
      const res = await fetch(`http://127.0.0.1:8000/user/sensor/get_data/10/${sensor_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        }
      })
      const data = await res.json();
      setDataOfASensor(data);
    }

    async function fetchSensorAlerts(sensor_id) {
      const res = await fetch(`http://127.0.0.1:8000/user/sensor/alerts/${sensor_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        }
      })
      const data = await res.json();
      setAlertOfASensor(data);
    }

    function handleSensorClick(sensor_id) {
        fetchSensorData(sensor_id);
        fetchSensorAlerts(sensor_id);
    }
    
    return (
        <div>
          <div>
            <h1>Dashboard</h1>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <ListOfSensors sensors={sensors} onSensorClick={handleSensorClick} />
            </div>
            <div>
              <DataOfASensorTable data={dataOfASensor} />
            </div>
            <div>
              <AlertsOfASensorTable alerts={alertOfASensor} />
            </div>
          </div>
            <button onClick={() => navigate("/createsensor")}>+ Create a new sensor</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
}
