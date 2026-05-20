import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Navbar.css";

const Navbar = () => {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo">
          EJJA<span>PICKLES</span>
        </Link>

        <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link to="/shop" onClick={() => setIsMenuOpen(false)}>
            Shop
          </Link>
          <Link to="/combo" onClick={() => setIsMenuOpen(false)}>
            Custom Combo
          </Link>
          {user?.role === "admin" && (
            <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
              Admin
            </Link>
          )}
        </div>

        <div className="nav-actions">
          <Link to="/shop" className="nav-icon">
            <Search size={18} /> <span className="nav-label">Search</span>
          </Link>
          <Link to="/cart" className="nav-icon cart-icon">
            <span className="nav-label">Cart</span>
            <ShoppingCart size={18} />
            {cartCount > 0 && <span className="cart-badge"></span>}
          </Link>
          {user ? (
            <div className="user-dropdown">
              <Link to="/profile" className="nav-icon">
                <User size={18} />
              </Link>
              <button onClick={logout} className="nav-icon">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              Login
            </Link>
          )}
          <button
            className="mobile-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
