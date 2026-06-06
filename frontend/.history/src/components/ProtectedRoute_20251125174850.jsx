import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const navigate = useNavigate();

    const [isChecking, setIsChecking] = useState(true);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        async function validateToken() {
            try {
                const res = await fetch("http://127.0.0.1:8000/user/isloggedin", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    }
                });

                if (!res.ok) {
                    localStorage.removeItem("token");
                    navigate("/");
                    return;
                }

                setIsValid(true);
            } catch (err) {
                localStorage.removeItem("token");
                navigate("/");
            } finally {
                setIsChecking(false);
            }
        }

        validateToken();

    }, [navigate]);

    if (isChecking) {
        return <p>Checking authentication...</p>;
    }

    return isValid ? children : null;   
}