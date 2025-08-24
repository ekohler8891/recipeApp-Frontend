import React from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";


export default function ViewRecipe() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/recipe/${id}`);
                if (!res.ok) throw new Error("Recipe not found.");
                const data = await res.json();
                setRecipe(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchRecipe();
    }, [id]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/recipe/${id}`, {
                method: "DELETE"
            });

            if (!res.ok) throw new Error("Delete failed.");
            navigate("/recipes"); // go back to list after delete
        } catch (err) {
            alert("There was an error deleting the recipe.");
            console.error(err);
        }
    };

    if (error) return <div className="p-4 text-red-600">{error}</div>;
    if (!recipe) return <div className="p-4">Loading...</div>;

    return (
        <Layout>
            <div className="max-w-2xl mx-auto p-4">
                <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
                {/* Image if present */}
                {recipe.imagePath && (
                    <div className="aspect-[4/3] w-full mb-3 rounded overflow-hidden bg-gray-100">
                        <img
                            src={`${process.env.REACT_APP_IMAGE_BASE_URL}${recipe.imagePath}`}
                            alt={recipe.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
                <p className="mb-4">{recipe.description}</p>

                <h2 className="text-xl font-semibold mt-4 mb-2">Ingredients</h2>
                <ul className="list-disc list-inside mb-4">
                    {recipe.ingredients.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>

                <h2 className="text-xl font-semibold mb-2">Steps</h2>
                <ol className="list-decimal list-inside mb-6">
                    {recipe.steps.map((step, idx) => <li key={idx}>{step}</li>)}
                </ol>

                {/* Edit / Delete Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate(`/edit-recipe/${id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </Layout>
    );
}
