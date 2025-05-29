import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 text-gray-800 space-y-4">
            <h1 className="text-3xl font-bold">Welcome to Recipe Wizard</h1>

            <Link to="/add" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Add a Recipe
            </Link>

            <Link to="/view" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                View Recipes
            </Link>
        </div>
    );
}
