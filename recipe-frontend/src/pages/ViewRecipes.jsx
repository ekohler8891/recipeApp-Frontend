import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function ViewRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchRecipes() {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/recipe`);
                if (!response.ok) {
                    throw new Error("Failed to fetch recipes.");
                }
                const data = await response.json();
                setRecipes(data);
            } catch (err) {
                console.error(err);
                setError("Unable to load recipes.");
            }
        }

        fetchRecipes();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this recipe?")) return;

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/recipe/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete recipe.");
            }

            // Update the UI without re-fetching
            setRecipes((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            console.error(err);
            setError("Could not delete the recipe.");
        }
    };

    const navigate = useNavigate();

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Saved Recipes</h1>

            {error && (
                <div className="bg-red-100 text-red-700 p-2 rounded border border-red-300 mb-4">
                    {error}
                </div>
            )}

            {recipes.length === 0 ? (
                <p>No recipes found.</p>
            ) : (
                    <ul className="space-y-4">
                        {recipes.map((recipe) => (
                            
                            <li key={recipe.id} className="border p-4 rounded shadow-sm">
                                <h2 className="text-xl font-semibold">{recipe.title}</h2>
                                <p className="text-gray-700 italic">{recipe.description}</p>

                                {/* Ingredients */}
                                <h3 className="font-semibold mt-2">Ingredients:</h3>
                                <ul className="list-disc pl-6">
                                    {recipe.ingredients.map((ing, idx) => (
                                        <li key={idx}>{ing}</li>
                                    ))}
                                </ul>

                                {/* Steps */}
                                <h3 className="font-semibold mt-2">Steps:</h3>
                                <ol className="list-decimal pl-6">
                                    {recipe.steps.map((step, idx) => (
                                        <li key={idx}>{step}</li>
                                    ))}
                                </ol>
                                <button
                                    onClick={() => handleDelete(recipe.id)}
                                    className="mt-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => navigate(`/edit/${recipe.id}`)}
                                    className="ml-2 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                                >
                                    Edit
                                </button>

                            </li>
                        ))}
                    </ul>

            )}
        </div>
    );
}
