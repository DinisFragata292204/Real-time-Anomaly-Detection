import { useState } from "react";

export default function CreateSensor() {
    const API_URL = "https://resplendent-clarity-production-e82d.up.railway.app";

    const [data, setData] = useState(null);
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [localization, setLocalization] = useState("");

    async function createANewSensor() {
        const res = await fetch(`${API_URL}/create_sensor`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({name: name, type: type, localization: localization}),
        })
        const data = await res.json();
        setData(data);
    }

    return (
        <>
            <h1>Create a sensor</h1>
            <p>Data: {JSON.stringify(data)}</p>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
            />
            <input
                type="text"
                placeholder="Localization"
                value={localization}
                onChange={(e) => setLocalization(e.target.value)}
            />

            <button onClick={createANewSensor}>Create a sensor</button>
        </>
    );
}