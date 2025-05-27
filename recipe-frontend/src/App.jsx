//import { BrowserRouter as Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import AddRecipe from "./pages/AddRecipe";
import Login from "./pages/Login";
//
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <nav>
                <ul style={{ display: 'flex', gap: '1rem' }}>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/add">Add Recipe</Link></li>
                    <li><Link to="/about">Login</Link></li>
                </ul>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/add" element={<AddRecipe />} />
                <Route path="/about" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
