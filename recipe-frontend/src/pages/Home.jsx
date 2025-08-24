/**
 * Home Page
 * --
 * The page where the user will start and at this point can navigate to recipe by index.
 * Future plans will have this have be the launching point to go to recipes, 
 * review shopping list, and update kitchen stock etc.
 * 
 */
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function Home() {
    const navigate = useNavigate();

    return (
        <Layout>
            <div className="max-w-2xl mx-auto text-center py-10">
                <h1 className="text-3xl font-bold mb-6">🍲 Welcome to Recipe App</h1>
                <p className="text-gray-600 mb-10">
                    Your personal recipe manager. Add, edit, and browse your favorite
                    recipes all in one place.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {/* Link navigation */}
                    <Link
                        to="/recipes"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow"
                    >
                        📖 View Recipes
                    </Link>

                    {/* Button navigation */}
                    <button
                        onClick={() => navigate("/add")}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow"
                    >
                        ➕ Add Recipe
                    </button>

                    <Link
                        to="/login"
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg shadow"
                    >
                        🔑 Login
                    </Link>
                </div>
            </div>
        </Layout>
    );
}
