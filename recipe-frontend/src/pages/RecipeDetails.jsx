import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";

export default function RecipeDetails() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchRecipe() {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/recipe/${id}`);
                if (!res.ok) throw new Error("Recipe not found");
                const data = await res.json();
                setRecipe(data);
            } catch (err) {
                setError(err.message);
            }
        }

        fetchRecipe();
    }, [id]);

    if (error) {
        return <Layout><p className="text-red-600">{error}</p></Layout>;
    }

    if (!recipe) {
        return <Layout><p>Loading recipe...</p></Layout>;
    }

    return (
        <Layout>
            <div className="max-w-2xl mx-auto p-4">
                <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
                {/* ✅ Image if present */}
                {recipe.imagePath && (
                    <div className="aspect-[4/3] w-full mb-3 rounded overflow-hidden bg-gray-100">
                        <img
                            src={`${process.env.REACT_APP_IMAGE_BASE_URL}${recipe.imagePath}`}
                            alt={recipe.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}                <p className="mb-4">{recipe.description}</p>

                <h2 className="text-xl font-semibold mt-4 mb-2">Ingredients</h2>
                <ul className="list-disc list-inside">
                    {recipe.ingredients.map((ing, idx) => (
                        <li key={idx}>{ing}</li>
                    ))}
                </ul>

                <h2 className="text-xl font-semibold mt-4 mb-2">Steps</h2>
                <ol className="list-decimal list-inside space-y-1">
                    {recipe.steps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                    ))}
                </ol>
            </div>
        </Layout>
    );
}
