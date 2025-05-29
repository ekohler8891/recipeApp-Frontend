import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ViewRecipe() {
    const { id } = useParams(); // index-based ID from route
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("recipes") || "[]");
        setRecipe(stored[id]);
    }, [id]);

    if (!recipe) {
        return <div className="p-4 text-center text-gray-500">Recipe not found.</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
            <p className="mb-4 text-gray-700">{recipe.description}</p>

            <h2 className="text-xl font-semibold mt-6 mb-2">Ingredients</h2>
            <ul className="list-disc list-inside mb-4">
                {recipe.ingredients.map((item, idx) => (
                    <li key={idx}>{item}</li>
                ))}
            </ul>

            <h2 className="text-xl font-semibold mb-2">Preparation Steps</h2>
            <p className="whitespace-pre-line">{recipe.steps}</p>
        </div>
    );
}
