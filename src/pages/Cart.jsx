import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import "../styles/Cart.css";

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="container section-padding cart-empty">
        <div className="empty-state">
          <ShoppingBag size={80} strokeWidth={1} />
          <h2>Your Jar Is Empty</h2>
          <p>It seems you haven't added any authentic Kumaoni pickles yet.</p>
          <Link to="/shop" className="btn-primary">
            Browse Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container section-padding cart-page">
      <div className="cart-header">
        <h1>Your Shopping Cart</h1>
        <span>({cartItems.length} Items)</span>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => (
            // const itemId = item._id || item.id;
            <div key={item._id} className="cart-item">
              <div className="item-img">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="item-details">
                <Link to={item.isCombo ? "/combo" : `/product/${item._id}`}>
                  <h3>{item.name}</h3>
                </Link>
                {item.isCombo && (
                  <div className="combo-contents">{item.items.join(", ")}</div>
                )}
                <p className="item-price">₹{item.price}</p>
              </div>
              <div className="item-quantity">
                <div className="qty-btns">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  >
                    <Minus size={14} />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <div className="item-subtotal">
                <p>₹{item.price * item.quantity}</p>
              </div>
              <button
                className="remove-btn"
                onClick={() => removeFromCart(item._id)}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-card">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{getCartTotal()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free">FREE</span>
            </div>
            <div className="summary-row total">
              <span>Grand Total</span>
              <span>₹{getCartTotal()}</span>
            </div>
            <p className="tax-notice">Inclusive of all taxes</p>
            <button
              className="btn-primary checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
            <Link to="/shop" className="continue-link">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
