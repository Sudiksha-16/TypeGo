import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import "../styles/Navbar.css"; // Import the CSS file

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <h1 className="navbar-title">TypeGo</h1>
      <div className="navbar-links">
      <Link to="/">Home</Link>
        {user ? (
          <div className="navbar-user">
            <span>Hello, {user.username}</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        ) : (
          <div className="navbar-auth">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
