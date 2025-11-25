import {useState} from "react";
import { useNavigate } from "react-router-dom";

export default function SimpleLogin(){
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [response, setResponse] = useState(null);

    async function SendLoginToAPI() {
        setResponse("Sending data to backend...");
        const response = await fetch("http://127.0.0.1:8000/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, password})
        })
        const data = await response.json();
        if (response.status !== 200) {
            setResponse(`${data.detail}`);
            return;
        }
        localStorage.setItem("token", data.access_token);
        console.log(data)
        setResponse("Login sucessful!");
        navigate("/Dashboard");
    }

    return (
        <>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <p>Response from server: {response}</p>

            <button onClick={SendLoginToAPI}>Login</button>
        </>
    )
}