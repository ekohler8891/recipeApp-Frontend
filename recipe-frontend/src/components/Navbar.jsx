// src/components/Navbar.jsx
import NavLinkPill from "./NavLinkPill";

export default function Navbar() {
    return (
        <nav className="bg-blue-600 p-4 shadow-md">
            <ul className="flex gap-4">
                <li><NavLinkPill to="/" label="Home" /></li>
                <li><NavLinkPill to="/add" label="Add Recipe" /></li>
                <li><NavLinkPill to="/view" label="View Recipes" /></li>
                <li><NavLinkPill to="/login" label="Login" /></li>
            </ul>
        </nav>
    );
}
