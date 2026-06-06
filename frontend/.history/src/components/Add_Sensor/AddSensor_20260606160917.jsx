import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateSensor() {
    const API_URL = "https://resplendent-clarity-production-e82d.up.railway.app";
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [localization, setLocalization] = useState("");
    const [isNameValid, setIsNameValid] = useState(false);
    const [isTypeValid, setIsTypeValid] = useState(false);
    const [isLocalizationValid, setIsLocalizationValid] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [Errors, setErrors] = useState({});

    const [Exists, setExists] = useState(true);

    const [open, setOpen] = useState(false);

    const handleClose = (() => setOpen(false), () => navigate("/dashboard"));
    const handleOpen = () => setOpen(true);

    async function addNewSensor() {
        if (isValid == true) {
            const res = await fetch(`${API_URL}/user/create_sensor`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({name: name, type: type, localization: localization}),
            })
            const data = await res.json();
            setData(data);
            handleOpen();
        }
    }

    useEffect(() => {
        function validateName() {
            const Errors = {}

            if (name.length < 4 && name.length >= 1) {
                Errors.error = "The name should have at least 4 caracters."
                setIsNameValid(false);
            }
            if (name.length == 0) {
                setIsNameValid(false);
            }
            if (name.length >= 4) {
                setIsNameValid(true);
            }
            setErrors(Errors);
        } 
        
        validateName()
    }, [name])

    useEffect(() => {
        function validateType() {
            const Errors = {}

            if (type.length < 4 && type.length >= 1) {
                Errors.error = "The type should have at least 4 caracters."
                setIsTypeValid(false);
            }
            if (type.length == 0) {
                setIsTypeValid(false);
            }
            if (type.length >= 4) {
                setIsTypeValid(true);
            }
            setErrors(Errors);
        } 
        
        validateType()
    }, [type])

    useEffect(() => {
        function validateLocalization() {
            const Errors = {}

            if (localization.length < 4 && localization.length >= 1) {
                Errors.error = "The localization should have at least 4 caracters."
                setIsLocalizationValid(false);
            }
            if (localization.length == 0) {
                setIsLocalizationValid(false);
            }
            if (localization.length >= 4) {
                setIsLocalizationValid(true);
            }
            setErrors(Errors);
        } 
        
        validateLocalization()
    }, [localization])

    useEffect(() => {
        async function validateAll() {
            const Errors = {}

            if (name.length >= 4 && type.length >= 4 && localization.length >= 4) {
                const res = await fetch(`http://127.0.0.1:8000/user/check_if_sensor_exists/${name}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                })
                const data = await res.json();

                if (data.detail == false) {
                    Errors.error = "You have already a sensor with this name."
                    setExists(true);
                } else {
                    setExists(false);
                }
            }
    
            if (name.length >= 4 && type.length >= 4 && localization.length >= 4 && Exists == false) {
                setIsValid(true);
            } else {
                setIsValid(false);
            }

            setErrors(Errors);
        } 
        
        validateAll()
    }, [name, type, localization, Exists])

    return (
        <div className="min-h-screen min-w-screen flex items-center justify-center bg-cyan-50 dark:bg-stone-700">
            <div className="w-full max-w-sm dark:bg-stone-700 bg-cyan-200 shadow-lg rounded-lg p-6 space-y-4">
                <h1 className="text-2xl font-semibold text-center mb-4">
                    Add a new sensor
                </h1>
                <div className="flex flex-col">
                    <input
                        className={`mt-3 w-full bg-white dark:bg-stone-700 rounded px-3 py-2 border focus:outline-none focus:ring-2 ${
                            isNameValid
                                ? "border-green-400 focus:ring-green-500"
                                : "border-red-400 focus:ring-red-500"
                        }`}
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        className={`mt-3 w-full bg-white dark:bg-stone-700 rounded px-3 py-2 border focus:outline-none focus:ring-2 ${
                            isTypeValid
                                ? "border-green-400 focus:ring-green-500"
                                : "border-red-400 focus:ring-red-500"
                        }`}
                        type="text"
                        placeholder="Type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    />
                    <input
                        className={`mt-3 w-full bg-white dark:bg-stone-700 rounded px-3 py-2 border focus:outline-none focus:ring-2 ${
                            isLocalizationValid
                                ? "border-green-400 focus:ring-green-500"
                                : "border-red-400 focus:ring-red-500"
                        }`}
                        type="text"
                        placeholder="Localization"
                        value={localization}
                        onChange={(e) => setLocalization(e.target.value)}
                    />

                    {Errors.error && (
                        <span className="text-red-500 text-sm">{Errors.error}</span>
                    )}

                    {open && (
                        <div
                            className="fixed inset-0 bg-black/50 flex items-center justify-center"
                            onClick={handleClose}
                        >
                            <div
                                className="dark:bg-gray-900 bg-white h-[70%] w-[50%] m-auto p-5 border-2 border-black rounded-[10px] shadow flex gap-5"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex flex-col self-center-safe items-center">
                                    <p className="text-2xl text-white text-center">Copy the token of "{data.name}":</p>
                                    <span className="text-green-500 text-3xl">{data.api_key}</span>
                                    <button className="mt-20" onClick={handleClose}>Done</button>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        disabled={!isValid}
                        className={
                            isValid
                                ? "mt-3 w-full dark:text-white text-black py-2 rounded"
                                : "mt-3 w-full bg-gray-400 dark:text-gray-700 text-gray-200 py-2 rounded cursor-not-allowed"
                        }
                        onClick={addNewSensor}
                    >
                        Add a new sensor
                    </button>
                    <button
                        className="mt-5 bg-blue-600 hover:bg-blue-700 dark:text-white text-black py-2 rounded"
                        onClick={() => navigate("/dashboard")}
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
}