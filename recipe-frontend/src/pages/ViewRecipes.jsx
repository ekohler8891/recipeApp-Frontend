/**
 * ViewRecipes
 * --
 * This page is where it shows all the recipes.
 */

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Layout from "../components/Layout";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function ViewRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState("");;

    const query = useQuery();
    const navigate = useNavigate();

    const searchTerm = query.get("search") || "";
    const [searchInput, setSearchInput] = useState(searchTerm);

    useEffect(() => {
    async function fetchRecipes() {
          try {
            setLoading(true);

            let url = `${process.env.REACT_APP_API_BASE_URL}/recipe`;
            if (searchTerm) {
              url += `?search=${encodeURIComponent(searchTerm)}`;
            }
            

            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch recipes.");

            const data = await response.json();
            setRecipes(data);
            setLoading(false);
          } catch (err) {
            console.error(err);
            setError("Unable to load recipes.");
            setLoading(false);
          }
        }

        fetchRecipes();
    }, [searchTerm]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this recipe?")) return;

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/recipe/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete recipe.");

            setRecipes((prev) => prev.filter((r) => r.id !== id));
            setSuccess("Recipe deleted successfully.");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            console.error(err);
            setError("Could not delete the recipe.");
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/recipes?search=${encodeURIComponent(searchInput)}`);
    };

    return (
        <Layout>
          <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Saved Recipes</h1>

            {/* Messages */}
            {error && (
              <div className="bg-red-100 text-red-700 p-2 rounded border border-red-300 mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 text-green-700 p-2 rounded border border-green-300 mb-4">
                {success}
              </div>
            )}

            {/* 🔍 Search bar */}
            <form onSubmit={handleSearch} className="mb-4 flex gap-2">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full border rounded p-2"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Search
              </button>

              {/* Clear button */}
              <button
                    type="button"
                    onClick={() => { setSearchInput(""); navigate("/recipes"); }}
                    className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                    >
                    Clear
              </button>

            </form>

            {/* Loading */}
            {loading ? (
              <p>Loading recipes...</p>
            ) : recipes.length === 0 ? (
              <p>No recipes found.</p>
            ) : (
              <ul className="space-y-4">
                {recipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="border rounded p-4 shadow mb-4 bg-white hover:bg-gray-100"
                  >
                    <Link to={`/recipe/${recipe.id}`}>
                      <h2 className="text-xl font-semibold">{recipe.title}</h2>

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
                    </Link>
    
                    

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(recipe.id)}
                      className="text-sm text-red-600 hover:underline mt-2"
                    >
                      Delete
                    </button>

                  </div>
                ))}
              </ul>
            )}
          </div>
    </Layout>
    );
}
