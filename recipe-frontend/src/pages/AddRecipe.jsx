import { useState } from "react";
import Layout from "../components/Layout";

export default function AddRecipe() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        ingredients: "",
        steps: ""
    });

    //images
    const [imageFile, setImageFile] = useState(null);

    // error
    const [error, setError] = useState("");
    // success
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset messages
        setError("");
        setSuccess("");

        const title = formData.title.trim();
        const description = formData.description.trim();
        const ingredientsInput = formData.ingredients.trim();
        const stepsInput = formData.steps.trim();

        if (!title || !description || !ingredientsInput || !stepsInput) {
            setError("All fields are required.");
            return;
        }

        const recipe = {
            title,
            description,
            ingredients: ingredientsInput.split(",").map((i) => i.trim()).filter(Boolean),
            steps: stepsInput.split("\n").map((s) => s.trim()).filter(Boolean),
            imagePath: null 
        };

        // ✅ Upload image if selected
        if (imageFile) {
            const formDataImage = new FormData();
            formDataImage.append("file", imageFile);

            try {
                const uploadRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/recipe/upload`, {
                    method: "POST",
                    body: formDataImage
                });

                if (!uploadRes.ok) throw new Error("Image upload failed");

                const { path } = await uploadRes.json();
                recipe.imagePath = path; // store path in recipe
            } catch (uploadErr) {
                console.error(uploadErr);
                setError("Image upload failed. Please try again.");
                return;
            }
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/recipe`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(recipe)
            });

            if (!response.ok) throw new Error("Failed to save recipe.");

            const savedRecipe = await response.json();
            console.log("Saved to backend:", savedRecipe);
            setSuccess("Recipe saved successfully!");

            // Reset form
            setFormData({
                title: "",
                description: "",
                ingredients: "",
                steps: ""
            });
            setImageFile(null);

            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            console.error(err);
            setError("There was a problem saving your recipe.");
        }
    };



    return (
            <Layout>
            <div className="max-w-xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Add a New Recipe</h1>

                {/* 🔻 Error Message */}
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
