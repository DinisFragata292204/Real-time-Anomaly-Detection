import {useState} from "react";
import { useNavigate } from "react-router-dom";

export default function SimpleLogin(){
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [response, setResponse] = useState(null);

    async function SendLoginToAPI() {
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
        setResponse("Login sucessful!");
        navigate("/Dashboard");
    }

    return (
        <div className="min-h-screen min-w-screen flex items-center justify-center bg-black-500">
            <div className="w-full max-w-sm bg-stone-700 shadow-lg rounded-lg p-6 space-y-4">
                <h1 className="text-2xl font-semibold text-center">Login</h1>

                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <p className="text-sm text-center text-gray-600">
                    {response && `Response from server: ${response}`}
                </p>

                <button
                    onClick={SendLoginToAPI}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded"
                >
                    Login
                </button>

                <button
                    onClick={() => navigate("/createNewUser")}
                    className="w-full border border-gray-300 text-white font-medium py-2 rounded hover:bg-gray-100"
                >
                    Create new user
                </button>
            </div>
        </div>
    )
}