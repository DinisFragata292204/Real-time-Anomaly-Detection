import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ListOfSensors from "./ListOfSensors";
import DataOfASensorTable from "./DataOfASensorTable";
import AlertsOfASensorTable from "./AlertsOfASensorTable";
import SimulateDataModal from "./SimulateDataModal.jsx";

export default function Dashboard() {
  const navigate = useNavigate();

  const API_URL = "https://resplendent-clarity-production-e82d.up.railway.app";

  const [sensors, setSensors] = useState([]);
  const [dataOfASensor, setDataOfASensor] = useState([]);
  const [alertOfASensor, setAlertOfASensor] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [sensor_id, setSensor_id] = useState(null);

  const [simulateDatamessage, setSimulateDataMessage] = useState({});
  const [message, setMessage] = useState("");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToSimulate, setIsToSimulate] = useState(false);
  const [apiKeyData, setAPIKeyData] = useState("");
  const [showSensorToken, setShowSensorToken] = useState("");

  const [open, setOpen] = useState(false);
  const [showSensorTokenOpen, setShowSensorTokenOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const handleCloseShowSensorToken = () => setShowSensorTokenOpen(false);
  const handleOpenShowSensorToken = () => setShowSensorTokenOpen(true);

  useEffect(() => {
    async function loadSensors() {
      const res = await fetch(`${API_URL}/user/get_sensors`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setSensors(data);
    }

    if (!isToSimulate) {
      loadSensors();
    }
  }, [isToSimulate]);

  async function fetchSensorData(sensor_id) {
    const res = await fetch(
      `${API_URL}/user/sensor/get_data/${sensor_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await res.json();
    setDataOfASensor(data);
  }

  async function fetchSensorAlerts(sensor_id) {
    const res = await fetch(
      `${API_URL}/user/sensor/alerts/${sensor_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await res.json();
    setAlertOfASensor(data);
  }

  function handleSensorClick(id) {
    setSelectedSensor(id);
    setSensor_id(id);
    fetchSensorData(id);
    fetchSensorAlerts(id);
  }

  async function simulateData(apiKey) {
    if (!apiKey) return;

    if (!selectedSensor) {
      setMessage("You need to select a sensor to simulate.");
      return;
    }

    const value = Math.floor(Math.random() * (46 - 20 + 1)) + 20;

    const res = await fetch(`${API_URL}/receive_data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-SENSOR-TOKEN": apiKey,
      },
      body: JSON.stringify({ value }),
    });

    const data = await res.json();
    setSimulateDataMessage(data);
    fetchSensorData(sensor_id);
  }

  useEffect(() => {
    if (!isToSimulate) return;

    const interval = setInterval(() => {
      simulateData(apiKeyData);
    }, 2000);

    return () => clearInterval(interval);
  }, [isToSimulate, apiKeyData]);

  function handleSimulateData(apiKey) {
    setAPIKeyData(apiKey);
    setIsToSimulate(true);
  }

  function handleSimulatorStop() {
    setIsToSimulate(false);
  }

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  async function show_SensorToken() {
    if (sensor_id) {
      const res = await fetch(`${API_URL}/user/show_sensor_token/${sensor_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      setShowSensorToken(data);
      handleOpenShowSensorToken();
    }
  }

  return (
    <div className="min-h-screen w-screen dark:bg-gray-900 bg-cyan-100">
      <header className="flex items-center justify-between px-6 py-4 dark:bg-gray-900 bg-white shadow-md">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="md:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Menu
        </button>
        <h1 className="text-xl font-semibold">Dashboard</h1>

        <div className="space-x-3 invisible md:visible">
          {sensor_id && (
            <>
              <button
                onClick={handleOpen}
                className="bg-green-600 hover:bg-green-700 dark:text-white text-black px-4 py-2 rounded"
              >
                Simulate data
              </button>
              <button
                onClick={show_SensorToken}
                className="bg-green-600 hover:bg-green-700 dark:text-white text-black px-4 py-2 rounded"
              >
                Show token
              </button>
            </>
          )}

          <button
            onClick={() => navigate("/createsensor")}
            className="bg-green-600 hover:bg-green-700 dark:text-white text-black px-4 py-2 rounded"
          >
            + Add sensor
          </button>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 dark:text-white text-black px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40"
        ></div>
      )}

      {showSensorTokenOpen && (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center"
            onClick={handleCloseShowSensorToken}
        >
          <div
              className="dark:bg-gray-900 bg-white h-[70%] w-[50%] m-auto p-5 border-2 border-black rounded-[10px] shadow flex gap-5"
              onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col self-center-safe items-center">
                <p className="text-2xl dark:text-white text-black text-center">Copy the token of "{showSensorToken.name}":</p>
                <span className="text-green-500 text-3xl">{showSensorToken.api_key}</span>
                <button className="mt-20" onClick={handleCloseShowSensorToken}>Done</button>
            </div>
          </div>
        </div>
      )}

      <SimulateDataModal
        isOpen={open}
        onClose={handleClose}
        message={message}
        sensor_id={sensor_id}
        simulateDatamessage={simulateDatamessage}
        onButtonClick={handleSimulateData}
        onButtonStopClick={handleSimulatorStop}
        ifsimulationIsRunning={isToSimulate}
        dataOfASensor={dataOfASensor}
      />

      <main className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="md:col-span-1 dark:bg-gray-900 bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Sensors</h2>
          <div className="overflow-y-auto">
            <ListOfSensors
              sensors={sensors}
              onSensorClick={handleSensorClick}
              selectedSensorId={selectedSensor}
            />
          </div>
        </section>

        <section className="md:col-span-2 grid grid-rows-2 gap-4 h-[80vh]">
          <div className="dark:bg-gray-900 bg-white rounded-lg shadow p-4 flex flex-col overflow-hidden">
            <h2 className="text-lg font-semibold mb-3 shrink-0">Data of selected sensor</h2>
            <div className="overflow-y-auto grow">
              <DataOfASensorTable data={dataOfASensor} />
            </div>
          </div>
          <div className="dark:bg-gray-900 bg-white rounded-lg shadow p-4 flex flex-col overflow-hidden">
            <h2 className="text-lg font-semibold mb-3 shrink-0">Alerts of selected sensor</h2>
            <div className="overflow-y-auto grow">
              <AlertsOfASensorTable alerts={alertOfASensor} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}