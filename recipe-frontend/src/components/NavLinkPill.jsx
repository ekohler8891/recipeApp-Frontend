// src/components/NavLinkPill.jsx
import { Link, useLocation } from "react-router-dom";

export default function NavLinkPill({ to, label }) {
    const location = useLocation();

    const isActive =
        to === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(to);

    const classes = isActive
        ? "bg-white text-blue-600 rounded-xl px-3 py-1"
        : "hover:bg-blue-500 text-white rounded-xl px-3 py-1";

    return (
        <Link to={to} className={classes}>
            {label}
        </Link>
    );
}
