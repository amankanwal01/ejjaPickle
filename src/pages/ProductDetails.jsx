import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Minus, Plus, ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import '../styles/ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="container section-padding">Loading product details...</div>;
  if (error) return <div className="container section-padding">Error: {error}</div>;
  if (!product) return <div className="container section-padding">Product not found.</div>;

  const displayImage = product.images && product.images.length > 0 ? product.images[0] : (product.image || 'https://via.placeholder.com/300');

  return (
    <div className="product-details-page container section-padding">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Back to Shop
      </button>

      <div className="product-main">
        <div className="product-gallery">
          <img src={displayImage} alt={product.name} />
          <div className="badge-overlay">{product.category}</div>
        </div>

        <div className="product-info-panel">
          <div className="info-header">
            <h1>{product.name}</h1>
            <div className="rating-row">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.floor(product.rating || 0) ? "var(--primary)" : "none"} color="var(--primary)" />
                ))}
              </div>
              <span>({product.numReviews || 0} customer reviews)</span>
            </div>
            <p className="details-price">₹{product.price}</p>
          </div>

          <p className="short-desc">{product.description}</p>

          <div className="spice-indicator">
            <span>Spice Level:</span>
            <div className="chillis">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < product.spiceLevel ? 'active' : ''}>🌶️</span>
              ))}
            </div>
          </div>

          <div className="action-row">
            <div className="quantity-selector">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus size={16} /></button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)}><Plus size={16} /></button>
            </div>
            <button className="btn-primary buy-btn" onClick={() => addToCart(product, quantity)}>
              <ShoppingCart size={20} /> Add To Cart
            </button>
          </div>

          <div className="product-features">
            <div className="feature">
              <Truck size={20} />
              <div>
                <h6>Fast Delivery</h6>
                <p>Ships in 2-3 days</p>
              </div>
            </div>
            <div className="feature">
              <ShieldCheck size={20} />
              <div>
                <h6>Quality Assured</h6>
                <p>100% Organic Ingredients</p>
              </div>
            </div>
            <div className="feature">
              <RefreshCw size={20} />
              <div>
                <h6>Freshly Packed</h6>
                <p>Small batch production</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="product-tabs">
        <div className="tab-headers">
          <button className={activeTab === 'description' ? 'active' : ''} onClick={() => setActiveTab('description')}>Description</button>
          <button className={activeTab === 'ingredients' ? 'active' : ''} onClick={() => setActiveTab('ingredients')}>Ingredients</button>
          <button className={activeTab === 'reviews' ? 'active' : ''} onClick={() => setActiveTab('reviews')}>Reviews</button>
        </div>
        <div className="tab-content">
          {activeTab === 'description' && (
            <div className="animate-fade">
              <p>{product.description}</p>
              <p style={{ marginTop: '15px' }}>Our pickles are made using cold-pressed mustard oil and sun-dried spices sourced from high-altitude farms in Uttarakhand. This specific variety is a staple in Kumaoni households, known for its deep, complex flavor profile that improves with age.</p>
            </div>
          )}
          {activeTab === 'ingredients' && (
            <ul className="ingredients-list animate-fade">
              {(product.ingredients || ["Mustard Oil", "Himalayan Salt", "Chilli", "Turmeric"]).map((ing, i) => <li key={i}>{ing}</li>)}
            </ul>
          )}
          {activeTab === 'reviews' && (
            <div className="reviews-tab animate-fade">
              <p>Overall Rating: {product.rating || 0}/5 based on {product.numReviews || 0} reviews.</p>
              
              {product.reviews && product.reviews.length > 0 && (
                <div className="reviews-list" style={{ marginTop: '20px' }}>
                  {product.reviews.map((rev, i) => (
                    <div key={i} className="review-item" style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                      <strong>{rev.name}</strong> - {rev.rating}⭐
                      <p>{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              <button className="btn-secondary" style={{ marginTop: '20px' }}>Write a Review</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
