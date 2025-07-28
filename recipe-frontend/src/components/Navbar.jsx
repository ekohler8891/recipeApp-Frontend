import React from 'react';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import NavLinkPill from "./NavLinkPill";

export default function Navbar() {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/recipes?search=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm("");
        }
    };

    return (
        <nav className="bg-blue-600 p-4 shadow-md flex items-center justify-between">
            <ul className="flex gap-4">
                <li><NavLinkPill to="/" label="Home" /></li>
                <li><NavLinkPill to="/add" label="Add Recipe" /></li>
                <li><NavLinkPill to="/recipes" label="View Recipes" /></li>
                <li><NavLinkPill to="/login" label="Login" /></li>
            </ul>

            <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="rounded px-2 py-1"
                />
                <button
                    type="submit"
                    className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100"
                >
                    Search
                </button>
            </form>
        </nav>
    );
}
