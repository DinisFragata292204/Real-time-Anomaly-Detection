import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateSensor() {
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
        }
    }, []);

    async function me() {
        const res = await fetch("http://127.0.0.1:8000/create_sensor", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({name: "New Sensor", type: "Temperature", localization: "lab", user_id: 1}),
        })
        const data = await res.json();
        setData(data);
    }

    return (
        <>
            <h1>Dashboard privado</h1>
            <p>Data: {JSON.stringify(data)}</p>
            <button onClick={me}>Search data</button>
        </>
    );
}