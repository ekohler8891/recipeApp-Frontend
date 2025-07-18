import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AddRecipe from './pages/AddRecipe';
import EditRecipe from './pages/EditRecipe';
import ViewRecipes from './pages/ViewRecipes';
import Login from './pages/Login';
import ViewRecipe from "./pages/ViewRecipe";

function App() {
    return (
        <Router>
            <Navbar /> {}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/add" element={<AddRecipe />} />
                <Route path="/edit/:id" element={<EditRecipe />} />
                <Route path="/view" element={<ViewRecipes />} />
                <Route path="/login" element={<Login />} />
                <Route path="/recipe/:id" element={<ViewRecipe />} />
                <Route path="/view/:id" element={<ViewRecipe />} />
            </Routes>
        </Router>
    );
}

export default App;
