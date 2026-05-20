import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import '../../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const productId = product._id || product.id;
  const displayImage = product.images && product.images.length > 0 ? product.images[0] : (product.image || 'https://via.placeholder.com/300');

  return (
    <div className="product-card">
      <div className="card-img-wrapper" onClick={() => navigate(`/product/${productId}`)}>
        <img src={displayImage} alt={product.name} />
        <div className="variant-label">
          {product.spiceLevel > 3 ? 'Extra Spicy 🌶️' : 'Mellow & Rich'}
        </div>
      </div>
      <div className="card-info">
        <h3 onClick={() => navigate(`/product/${productId}`)}>{product.name}</h3>
        <div className="card-meta">
          <div>
             <p className="price">₹{product.price}</p>
             <p>{product.category} Heritage</p>
          </div>
          <button onClick={() => addToCart(product)} className="action-link">Add to Tray</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
