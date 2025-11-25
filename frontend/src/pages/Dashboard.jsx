import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateSensor from "../components/CreateSensor";

export default function Dashboard() {
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
        }
    }, []);

    async function me() {
        const res = await fetch("http://127.0.0.1:8000/me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            }
        })
        const data = await res.json();
        setData(data);
    }

    return (
        <>
            <h1>Dashboard privado</h1>
            <p>Data: {JSON.stringify(data)}</p>
            <button onClick={me}>Search data</button>
            <button onClick={<CreateSensor />}>+ Create a new sensor</button>
        </>
    );
}