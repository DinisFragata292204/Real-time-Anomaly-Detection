import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateNewUser() {
    const API_URL = "https://resplendent-clarity-production-e82d.up.railway.app";

    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userExists, setUserExists] = useState(true);

    const [isUsernameValid, setIsUsernameValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
    const [isNotCreatable, setIsNotCreatable] = useState(true);
    const [passwordErrors, setPasswordErrors] = useState({});
    const [usernameErros, setUsernameErrors] = useState ({});

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);


    const containsNumber = /\d/.test(username);

    useEffect(() => {
        function validatePassword() {
            const passwordErrors = {};

            if (password.length < 6 && password.length > 0) {
                passwordErrors.password = "The password provided should have 6 or more caracters."
                setIsPasswordValid(false);
                setIsConfirmPasswordValid(false);
            }
            if (confirmPassword.length < 6 && password.length > 0) {
                setIsConfirmPasswordValid(false);
            }
            if (password !== confirmPassword && confirmPassword.length >= 6 && password.length >= 6) {
                passwordErrors.password = 'The passwords should match to continue.'
                setIsConfirmPasswordValid(false);
            } 
            else if (password == confirmPassword && confirmPassword.length >= 6 && password.length >= 6){
                setIsConfirmPasswordValid(true);
                setIsPasswordValid(true);
            }
            else if (password.length >= 6) {
                setIsPasswordValid(true);
            }
            else if (password.length < 6) {
                setIsPasswordValid(false);
            }

            setPasswordErrors(passwordErrors);
        }

        validatePassword();
    }, [password, confirmPassword])

    useEffect(() => {
        function validateUsername() {
            const usernameErrors = {};

            if (username.length < 4 && username.length > 0) {
                usernameErrors.username = "The username provided should have 4 or more caracters."
                setIsUsernameValid(false);
            }
            if (username.length == 0) {
                setIsUsernameValid(false);
            }
            if (userExists == true && username.length > 4) {
                usernameErrors.username = "The username provided is already registed."
                setIsUsernameValid(false);
            }
            if (!containsNumber && username.length > 4) {
                usernameErrors.username = 'The username should have numbers.'
                setIsUsernameValid(false);
            } 
            else if (containsNumber && username.length > 4 && userExists == false){
                setIsUsernameValid(true);
            }
            if (isPasswordValid == true && isConfirmPasswordValid == true && containsNumber && username.length > 4 && userExists == false) {
                setIsNotCreatable(false);
            }

            setUsernameErrors(usernameErrors);
        }

        validateUsername();
    }, [username, isPasswordValid, isConfirmPasswordValid, userExists])

    async function createANewUser() {
        if (!username) {return}

        const res = await fetch(`${API_URL}/create_new_user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({username: username, password: password}),
        })
        const data = await res.json();
        setData(data);
    }

    useEffect(() => {
        async function checkUser() {
        const res = await fetch(`${API_URL}/check_if_user_exists`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({username: username}),
        })
        const data = await res.json();

        setUserExists(data ["User exists"]);
    }
        checkUser();
    }, [username]);

    return (
        <div className="min-h-screen min-w-screen flex items-center justify-center bg-cyan-50 dark:bg-stone-700">
            <div className="w-full max-w-sm bg-cyan-200 dark:bg-stone-700 shadow-lg rounded-lg p-6 space-y-4">
                <h1 className="text-2xl font-semibold text-center mb-4">
                    Create a New User
                </h1>
                <div className="flex flex-col">
                    <label className="text-sm mb-1">Username</label>
                    <input
                        className={`bg-white dark:bg-stone-700 w-full rounded px-3 py-2 border focus:outline-none focus:ring-2 ${
                            isUsernameValid
                                ? "border-green-400 focus:ring-green-500"
                                : "border-red-400 focus:ring-red-500"
                        }`}
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {usernameErros.username && (
                        <span className="text-red-500 text-sm">{usernameErros.username}</span>
                    )}
                </div>
                <div className="flex flex-col">
                    <label className="text-sm mb-1">Password</label>
                    <div className="relative">
                        <input
                            className={`bg-white dark:bg-stone-700 w-full rounded px-3 py-2 border focus:outline-none focus:ring-2 ${
                                isPasswordValid
                                    ? "border-green-400 focus:ring-green-500"
                                    : "border-red-400 focus:ring-red-500"
                            }`}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 text-sm dark:text-gray-300 text-black"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    {passwordErrors.password && (
                        <span className="text-red-500 text-sm">{passwordErrors.password}</span>
                    )}
                </div>
                <div className="flex flex-col">
                    <label className="text-sm mb-1">Confirm Password</label>
                    <div className="relative">
                        <input
                            className={`bg-white dark:bg-stone-700 w-full rounded px-3 py-2 border focus:outline-none focus:ring-2 ${
                                isConfirmPasswordValid
                                    ? "border-green-400 focus:ring-green-500"
                                    : "border-red-400 focus:ring-red-500"
                            }`}
                            type={showConfirm ? "text" : "password"}
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-0 text-sm dark:text-gray-300 text-black"
                        >
                            {showConfirm ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>
                {data !== null && (
                    <p className="text-green-500 text-center text-sm">
                        New user created with username "<strong>{data.username}</strong>".
                    </p>
                )}
                <button
                    disabled={isNotCreatable}
                    className={
                        isNotCreatable
                            ? "w-full bg-gray-400 dark:text-gray-700 text-gray-200 py-2 rounded cursor-not-allowed"
                            : "w-full bg-blue-600 hover:bg-blue-700 dark:text-white text-black py-2 rounded"
                    }
                    onClick={createANewUser}
                >
                    Create new user
                </button>
                <button
                    className="w-full bg-blue-600 hover:bg-blue-700 dark:text-white text-black py-2 rounded"
                    onClick={() => navigate("/")}
                >
                    Back
                </button>
            </div>
        </div>
    );
}