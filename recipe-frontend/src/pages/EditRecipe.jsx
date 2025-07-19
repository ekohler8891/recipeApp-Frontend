import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";

export default function EditRecipe() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        ingredients: "",
        steps: "",
        imagePath: ""
    });
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/recipe/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setFormData({
                    title: data.title,
                    description: data.description,
                    ingredients: data.ingredients.join(", "),
                    steps: data.steps.join("\n"),
                    imagePath: data.imagePath
                });
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.description || !formData.ingredients || !formData.steps) {
            setError("All fields are required.");
            return;
        }

        setError("");
        setSuccess("");

        try {
            let imagePath = formData.imagePath;

            // 🔼 Upload new image if selected
            if (imageFile) {
                const formDataImage = new FormData();
                formDataImage.append("file", imageFile);

                try {
                    const encodedOldPath = encodeURIComponent(formData.imagePath); // old image
                    const uploadRes = await fetch(
                        `${process.env.REACT_APP_API_BASE_URL}/recipe/upload?oldImagePath=${encodedOldPath}`,
                        {
                            method: "POST",
                            body: formDataImage
                        }
                    );

                    if (!uploadRes.ok) throw new Error("Image upload failed.");

                    const { path } = await uploadRes.json();
                    imagePath = path; // assign new path
                } catch (uploadErr) {
                    console.error(uploadErr);
                    setError("Image upload failed. Please try again.");
                    return;
                }
            }


            const updatedRecipe = {
                id: parseInt(id),
                title: formData.title,
                description: formData.description,
                ingredients: formData.ingredients.split(",").map((i) => i.trim()),
                steps: formData.steps.split("\n").map((s) => s.trim()),
                imagePath
            };

            //debugging
            console.log(updatedRecipe)

            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/recipe/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedRecipe)
            });

            if (!res.ok) throw new Error("Failed to update recipe.");

            setSuccess("Recipe updated successfully!");
            setTimeout(() => navigate("/view"), 1000);

        } catch (err) {
            console.error(err);
            setError("An error occurred while updating.");
        }
    };

    return (
        <Layout>
            <div className="max-w-xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Edit Recipe</h1>

                {error && <div className="bg-red-100 text-red-700 p-2 mb-3 rounded">{error}</div>}
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

                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Save Changes
                    </button>
                </form>
            </div>
        </Layout>
    );
}
