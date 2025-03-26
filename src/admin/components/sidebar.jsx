import { Link, useNavigate } from "react-router-dom";
import "./sidebar.css";
import { Home, Book, Layout, ShoppingBag, Star, Image, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Admin Dashboard</h2>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/admin/dashboard" className="nav-link">
              <Home size={20} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/books" className="nav-link">
              <Book size={20} />
              <span>Books List</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/orders" className="nav-link">
              <ShoppingBag size={20} />
              <span>Orders</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/hero" className="nav-link">
              <Layout size={20} />
              <span>Hero Section</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/new-arrivals" className="nav-link">
              <Star size={20} />
              <span>New Arrivals</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/banner" className="nav-link">
              <Image size={20} />
              <span>Banners</span>
            </Link>
          </li>
          <li className="nav-item logout-item">
            <button onClick={handleLogout} className="nav-link logout-button">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;