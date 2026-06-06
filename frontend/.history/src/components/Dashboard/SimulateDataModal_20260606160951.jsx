import { useEffect, useState } from "react";

import DataOfASensorTable from "./DataOfASensorTable";

export default function SimulateDataModal({onButtonClick, onButtonStopClick, message, isOpen, onClose, ifsimulationIsRunning, sensor_id, simulateDatamessage, dataOfASensor}) {
    const API_URL = "https://resplendent-clarity-production-e82d.up.railway.app";
    
    const [keyOfAPI, setkeyOfAPI] = useState("");
    const [token, setToken] = useState("");
    const [messageAboutToken, setMessageAboutToken] = useState(false);
    const [messageWarningUser, setMessageWarningUser] = useState(false);

    useEffect(() => {
        async function CheckIfSensorToken() {
            if (sensor_id == null) {return}

            const res = await fetch(`${API_URL}/user/check_sensor_api/${sensor_id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                }
            })
            const data = await res.json();
            setToken(data);

            if (token.api_key == keyOfAPI){
                setMessageAboutToken(true);
            } else {
                setMessageAboutToken(false);
            }
        }
        CheckIfSensorToken();

    }, [keyOfAPI]);
    
    if (!isOpen) return null;

    function handleStop(){
        onButtonStopClick();
    }

    function handleClick(){
        if (messageAboutToken == true){
           onButtonClick(keyOfAPI); 
           setMessageWarningUser(false);
        } else {
            setMessageWarningUser(true);
        }
    }
    
    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="dark:bg-gray-900 bg-white h-[70%] w-[50%] m-auto p-5 border-2 border-black rounded-[10px] shadow flex gap-5"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex-1 flex flex-col self-center-safe">

                    <input
                        className={
                            messageAboutToken
                                ? "w-full border border-green-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                : "w-full border border-red-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        }
                        type="text"
                        placeholder="Insert API"
                        value={keyOfAPI}
                        onChange={(e) => setkeyOfAPI(e.target.value)}
                    />

                    <button
                        disabled={keyOfAPI === ""}
                        className={
                            keyOfAPI !== ""
                                ? "w-full bg-blue-600 dark:text-white text-black font-medium py-2 rounded hover:bg-blue-700 mt-5"
                                : "w-full bg-gray-400 dark:text-gray-700 text-gray-200 font-medium py-2 rounded mt-5 cursor-not-allowed"
                        }
                        onClick={handleClick}
                    >
                        Click
                    </button>

                    {ifsimulationIsRunning && (
                        <button
                            className="w-full bg-red-600 text-white font-medium py-2 rounded hover:bg-red-700 mt-3"
                            onClick={handleStop}
                        >
                            Stop
                        </button>
                    )}

                    <p className="mt-5">{message}</p>

                    {messageWarningUser && (
                        <div className="text-center text-red-500 font-medium mt-3">
                            The API doesn't match with the API of your sensors.
                        </div>
                    )}

                    {simulateDatamessage?.value && (
                        <div className="text-center text-green-600 font-medium mt-3">
                            The value "{simulateDatamessage.value}" was added.
                        </div>
                    )}
                </div>

                <div className="w-[50%] overflow-y-auto pl-4">
                    <DataOfASensorTable data={dataOfASensor || []} small />
                </div>
            </div>
        </div>
    );
}