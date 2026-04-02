import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const token = localStorage.getItem("token");

    const handleLogin = async (e) => {
        e.preventDefault();

        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ username, password })
        });
        if (res.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
        }
        if (!res.ok) {
            alert("Login failed");
            return;
        }

        const data = await res.json();

        // STORE TOKEN
        localStorage.setItem("token", data.token);

        alert("Logged in!");
    };

    return (
        <form onSubmit={handleLogin}>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button type="submit">Login</button>
        </form>
    );
}