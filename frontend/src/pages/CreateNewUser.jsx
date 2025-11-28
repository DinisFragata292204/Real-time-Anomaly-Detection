import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateSensor() {
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userExists, setUserExists] = useState(true);
    const [reason, setReason] = useState("");

    async function createANewUser() {
        const res = await fetch("http://127.0.0.1:8000/create_new_user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({username: username, email: email, password: password}),
        })
        const data = await res.json();
        setData(data);
    }

    useEffect(() => {
        async function checkUser() {
        const res = await fetch("http://127.0.0.1:8000/check_if_user_exists", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({username: username, email: email}),
        })
        const data = await res.json();

        console.log(data ["User exists"]);
        setUserExists(data ["User exists"]);
        setReason(data ["Reason"]);
    }
        checkUser();
    }, [username, email]);
    return (
        <>
            <h1>Create a new user</h1>
            <p>Data: {JSON.stringify(data)}</p>
            <p>User exists: {JSON.stringify(userExists)}</p>
            <p>Reason: {reason}</p>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="text"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={createANewUser}>Create new user</button>
            <button onClick={() => navigate("/")}>Back to login</button>
        </>
    );
}