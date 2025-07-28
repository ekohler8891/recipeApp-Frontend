import React from 'react';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function ViewRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState("");
    //search bar
    const query = useQuery();
    const searchTerm = query.get("search")?.toLowerCase() || "";



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

    const filteredRecipes = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm)

    );


    return (
        <Layout>
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
                            {filteredRecipes.length === 0 ? (
                                <p>No matching recipes.</p>
                            ) : (
                                filteredRecipes.map((recipe) => (
                                    <Link key={recipe.id} to={`/recipe/${recipe.id}`}>

                                        <div className="border rounded p-4 shadow mb-4 bg-white hover:bg-gray-100 cursor-pointer">
                                            <h2 className="text-xl font-semibold">{recipe.title}</h2>

                                            {/* ✅ Image if present */}
                                            {recipe.imagePath && (
                                                <div className="aspect-[4/3] w-full mb-3 rounded overflow-hidden bg-gray-100">
                                                    <img
                                                        src={`${process.env.REACT_APP_IMAGE_BASE_URL}${recipe.imagePath}`}
                                                        alt={recipe.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}

                                            <p className="text-gray-600 mb-2">{recipe.description}</p>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </ul>                       
                )}
            </div>
        </Layout>
    );
}
