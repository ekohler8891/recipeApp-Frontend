/**
 * AddRecipe
 * --
 * Page for adding a recipe in for the first time.
 * Can add images and plan for future will have a import function.
 */
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";


export default function AddRecipe() {
    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        ingredients: [""],
        steps: [""],
        imagePath: ""
    });
    const [imageFile, setImageFile] = useState(null);

    // Feedback state
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Handle text input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Token Auth
    const token = localStorage.getItem("token");
    // Back to login back
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    //Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const title = formData.title.trim();
        const description = formData.description.trim();
        const ingredients = formData.ingredients
            .split(",")
            .map(i => i.trim())
            .filter(i => i.length > 0);

        const steps = formData.steps
            .split("\n")
            .map(s => s.trim())
            .filter(s => s.length > 0);

        if (!title || !description || ingredients.length === 0 || steps.length === 0) {
            setError("All fields are required.");
            return;
        }

        const recipe = {
            title,
            description,
            ingredients: ingredients,
            steps: steps,
            imagePath: null
        };

        
        // Upload image if selected
        if (imageFile) {
            const uploadData = new FormData();
            uploadData.append("file", imageFile);

            try {
                const uploadRes = await fetch(
                    `${process.env.REACT_APP_API_BASE_URL}/recipe/upload-new`,
                    {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        },
                        body: uploadData
                    }
                );
                if (uploadRes.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
                if (!uploadRes.ok) throw new Error("Image upload failed");

                const { path } = await uploadRes.json();

                recipe.imagePath = path;
            } catch (uploadErr) {
                console.error(uploadErr);
                setError("Image upload failed. Please try again.");
                return;
            }
        }

        try {
            // Save recipe
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/recipe`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(recipe)
                }
            );
            if (response.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
            }
            if (!response.ok) throw new Error("Failed to save recipe.");

            setSuccess("Recipe saved successfully!");
            setFormData({ title: "", description: "", ingredients: [""], steps: [""]});
            setImageFile(null);

            setTimeout(() => navigate(`/recipes/`), 3000);

        } catch (err) {
            console.error(err);
            setError(err.message || "An unexpected error occurred.");
        }
    };

    return (
        <Layout>
            <div className="max-w-xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Add a New Recipe</h1>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 text-red-700 p-2 rounded border border-red-300 mb-4">
                        {error}
                    </div>
                )}

                {/* Success message */}
                {success && (
                    <div className="bg-green-100 text-green-700 p-2 rounded border border-green-300 mb-4">
                        {success}
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
                        placeholder="Preparation Steps (each step on a new line)"
                        value={formData.steps}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        rows={4}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        className="w-full border rounded p-2"
                    />

                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </Layout >
    );
}
