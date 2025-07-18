import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditRecipe() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        ingredients: "",
        steps: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRecipe() {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/recipe/${id}`);
                if (!res.ok) throw new Error("Failed to fetch recipe.");
                const data = await res.json();

                setFormData({
                    title: data.title,
                    description: data.description,
                    ingredients: data.ingredients.join(", "),
                    steps: data.steps.join("\n")
                });
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Could not load recipe.");
                setLoading(false);
            }
        }

        fetchRecipe();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Basic validation
        if (!formData.title.trim() || !formData.description.trim() || !formData.ingredients.trim() || !formData.steps.trim()) {
            setError("All fields are required and must not be empty.");
            return;
        }

        const updatedRecipe = {
            id, 
            title: formData.title.trim(),
            description: formData.description.trim(),
            ingredients: formData.ingredients.split(",").map((i) => i.trim()).filter(Boolean),
            steps: formData.steps.split("\n").map((s) => s.trim()).filter(Boolean)
        };

        if (updatedRecipe.ingredients.length < 1 || updatedRecipe.steps.length < 1) {
            setError("Please include at least one ingredient and one step.");
            return;
        }

        try {
            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/recipe/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedRecipe)
            });

            if (!res.ok) throw new Error("Update failed.");
            setSuccess("Recipe updated successfully!");

            setTimeout(() => navigate("/view"), 1500); // Redirect back to View Recipes
        } catch (err) {
            console.error(err);
            setError("There was a problem updating your recipe.");
        }
    };


    if (loading) return <p className="text-center">Loading recipe...</p>;

    return (
        <div className="max-w-xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Edit Recipe</h1>

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

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                    placeholder="Title"
                />
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                    rows={2}
                    placeholder="Short Description"
                />
                <textarea
                    name="ingredients"
                    value={formData.ingredients}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                    rows={3}
                    placeholder="Ingredients (comma separated)"
                />
                <textarea
                    name="steps"
                    value={formData.steps}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                    rows={4}
                    placeholder="Steps (one per line)"
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                    Save Changes
                </button>
            </form>
        </div>
    );
}
