import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SimpleLogin(){
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [response, setResponse] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNotValidLogin, setIsNotValidLogin] = useState(true);
    const [Erros, setErrors] = useState("");

    const [showPassword, setShowPassword] = useState(false);

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

    useEffect(() => {
        function validateUsername() {
            const Errors = {};

            if (username.length < 4 && username.length > 0) {
                Errors.username = "The username provided should have 4 or more caracters."
            }
            if (password.length < 4 && password.length > 0) {
                Errors.username = "The username provided should have at least 4 caracters."
            }
            if (username.length > 4 && password.length >= 4) {
                setIsNotValidLogin(false);
            }
            if (password.length < 4 || username.length < 4) {
                setIsNotValidLogin(true);
            }

            setErrors(Errors);
        }

        validateUsername();
    }, [username, password])

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
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 text-sm text-gray-300"
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>
                {Erros.username && (
                    <span className="text-red-500 text-sm">{Erros.username}</span>
                )}

                <p className="text-sm text-center text-red-600">
                    {response && `${response}`}
                </p>

                <button
                    disabled={isNotValidLogin}
                        className={
                            isNotValidLogin
                                ? "w-full bg-gray-400 text-gray-700 py-2 rounded cursor-not-allowed"
                                : "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded"
                        }
                    onClick={SendLoginToAPI}
                >
                    Login
                </button>
                {isMenuOpen && (
                    <div
                    onClick={() => setIsMenuOpen(false)}
                    className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40"
                    ></div>
                )}
                    
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