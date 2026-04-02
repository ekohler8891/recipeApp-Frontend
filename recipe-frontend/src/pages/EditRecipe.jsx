/**
 * EditRecipe
 * --
 * This is the page that allows updating the recipe and working with the
 * backend project to handle different user defined fields.
 */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";

export default function EditRecipe() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        ingredients: "",
        steps: "",
        imagePath: ""
    });
    const [imageFile, setImageFile] = useState(null);

    // Feedback state
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);

    // Token
    const token = localStorage.getItem("token");


    // Load recipe user defined fields when component mounts
    useEffect(() => {
        // Block access if no token
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchRecipe = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/recipe/${id}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }//,
                        //body: JSON.stringify(data)
                    }
                );
                if (res.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
                if (!res.ok) {
                    // Redirect if recipe not found
                    navigate("/"); 
                    return;
                }

                const data = await res.json();
                setFormData({
                    id: data.id,
                    title: data.title,
                    description: data.description,
                    ingredients: data.ingredients.join(", "),
                    steps: data.steps.join("\n"),
                    imagePath: data.imagePath || ""
                });
            } catch (err) {
                console.error(err);
                setError("Unable to load recipe details.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id, navigate]);


    // Handle text input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle file input changes
    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    //Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const title = formData.title.trim();
        const description = formData.description.trim();
        const ingredientsArr = formData.ingredients.split(",").map((i) => i.trim()).filter(Boolean);
        const stepsArr = formData.steps.split("\n").map((s) => s.trim()).filter(Boolean);
        const token = localStorage.getItem("token");


        if (!title || !description || ingredientsArr.length === 0 || stepsArr.length === 0) {
            setError("All fields are required.");
            return;
        }

        let updatedImagePath = formData.imagePath;

        // If new image selected, upload and delete old
        if (imageFile) {
            const imageForm = new FormData();
            imageForm.append("file", imageFile);
            try {
                const uploadRes = await fetch(
                    `${process.env.REACT_APP_API_BASE_URL}/recipe/upload?oldImagePath=${encodeURIComponent(updatedImagePath || "")}`,
                    {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        },
                        body: imageForm
                    }
                ); 
                if (uploadRes.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
                if (!uploadRes.ok) throw new Error("Image upload failed");
                const { path } = await uploadRes.json();
                updatedImagePath = path;
            } catch (uploadErr) {
                console.error(uploadErr);
                setError("Image upload failed. Please try again.");
                return;
            }
        }

        // Update recipe
        try {
            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/recipe/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: formData.id,
                    title,
                    description,
                    ingredients: ingredientsArr,
                    steps: stepsArr,
                    imagePath: updatedImagePath
                })
            });
            if (res.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
            }
            if (!res.ok) throw new Error("Failed to update recipe");

            setSuccess("Recipe updated successfully!");
            setTimeout(() => navigate(`/recipe/${id}`), 1500);
        } catch (err) {
            console.error(err);
            setError("There was a problem updating your recipe.");
        }
    };

    if (loading) return <Layout><p>Loading...</p></Layout>;

    return (
        <Layout>
            <div className="max-w-xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Edit Recipe</h1>

                {/* Error Message */}
                {error && <div className="bg-red-100 text-red-700 p-2 mb-3 rounded">{error}</div>}

                {/* Success message */}
                {success && <div className="bg-green-100 text-green-700 p-2 mb-3 rounded">{success}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="Title"
                    />

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="Description"
                        rows={2}
                    />

                    <textarea
                        name="ingredients"
                        value={formData.ingredients}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="Ingredients (comma-separated)"
                        rows={3}
                    />

                    <textarea
                        name="steps"
                        value={formData.steps}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="Steps (one per line)"
                        rows={4}
                    />

                    {/* Show current image */}
                    {formData.imagePath && (
                        <img
                            src={`${process.env.REACT_APP_IMAGE_BASE_URL}${formData.imagePath}`}
                            alt="Current"
                            className="w-full h-48 object-cover rounded mb-2"
                        />
                    )}

                    <input type="file" accept="image/*" onChange={handleFileChange} />

                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                        Update Recipe
                    </button>
                </form>
            </div>
        </Layout>
    );
}
