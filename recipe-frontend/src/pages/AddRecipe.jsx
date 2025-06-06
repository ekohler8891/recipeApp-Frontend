import { useState } from "react";

export default function AddRecipe() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        ingredients: "",
        steps: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { title, description, ingredients, steps } = formData;

        // 🔸 Basic validation
        if (!title || !description || !ingredients || !steps) {
            setError("All fields are required.");
            return;
        }

        setError(""); // Clear previous error if any

        const recipe = {
            title,
            description,
            ingredients: ingredients.split(",").map((item) => item.trim()),
            steps
        };

        const storedRecipes = JSON.parse(localStorage.getItem("recipes") || "[]");
        storedRecipes.push(recipe);
        localStorage.setItem("recipes", JSON.stringify(storedRecipes));

        console.log("Recipe saved:", recipe);

        // Reset form
        setFormData({
            title: "",
            description: "",
            ingredients: "",
            steps: ""
        });
    };

    return (
        <div className="max-w-xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Add a New Recipe</h1>

            {/* 🔻 Error Message */}
            {error && (
                <div className="bg-red-100 text-red-700 p-2 rounded border border-red-300 mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="title"
                    placeholder="Recipe Title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                    required
                />
                <textarea
                    name="description"
                    placeholder="Short Description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                    rows={2}
                />
                <textarea
                    name="ingredients"
                    placeholder="Ingredients (separated by commas)"
                    value={formData.ingredients}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                    rows={4}
                />
                <textarea
                    name="steps"
                    placeholder="Preparation Steps"
                    value={formData.steps}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                    rows={4}
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}
