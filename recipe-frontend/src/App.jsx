import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AddRecipe from './pages/AddRecipe';
import EditRecipe from './pages/EditRecipe';
import ViewRecipes from './pages/ViewRecipes';
import Login from './pages/Login';
import ViewRecipe from "./pages/ViewRecipe";
//import RecipeDetails from './pages/RecipeDetails';

function App() {
    return (
        <Router>
            <Navbar /> { }
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/add" element={<AddRecipe />} />
                <Route path="/edit-recipe/:id" element={<EditRecipe />} />
                <Route path="/recipes" element={<ViewRecipes />} />
                <Route path="/recipe/:id" element={<ViewRecipe />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
