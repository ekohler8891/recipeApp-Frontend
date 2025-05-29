import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const [index, setIndex] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const recipes = JSON.parse(localStorage.getItem("recipes") || "[]");

        if (!index || isNaN(index) || index < 0 || index >= recipes.length) {
            setError("Please enter a valid recipe index.");
            return;
        }

        setError("");
        navigate(`/view/${index}`);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Welcome to Recipe App</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="number"
                    min="0"
                    placeholder="Enter recipe index"
                    value={index}
                    onChange={(e) => setIndex(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                >
                    View Recipe
                </button>
            </form>
        </div>
    );
}
