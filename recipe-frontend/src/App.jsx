import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AddRecipe from './pages/AddRecipe';
import ViewRecipes from './pages/ViewRecipes';
import Login from './pages/Login';

function App() {
    return (
        <Router>
            <Navbar /> {}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/add" element={<AddRecipe />} />
                <Route path="/view" element={<ViewRecipes />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
