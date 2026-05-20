import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Truck, CheckCircle2, ChevronRight, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/Checkout.css';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState('');

  const [address, setAddress] = useState({
    name: user?.name || '',
    phone: '',
    house: '',
    area: '',
    city: '',
    pincode: ''
  });

  const handlePlaceOrder = async () => {
    if (!user) {
      setError('Please login to place an order');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.quantity,
          image: item.images?.[0] || item.image || '',
          price: item.price,
          product: item._id || item.id,
        })),
        shippingAddress: {
          address: `${address.house}, ${address.area}`,
          city: address.city,
          postalCode: address.pincode,
          country: 'India',
        },
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay',
        itemsPrice: getCartTotal(),
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: getCartTotal(),
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      setOrderId(data._id);
      clearCart();
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && step !== 3) {
    navigate('/shop');
    return null;
  }

  return (
    <div className="container section-padding checkout-page">
      <div className="checkout-stepper">
        <div className={`step-item ${step >= 1 ? 'active' : ''}`}>1. Shipping</div>
        <div className={`step-item ${step >= 2 ? 'active' : ''}`}>2. Payment</div>
        <div className={`step-item ${step >= 3 ? 'active' : ''}`}>3. Confirmation</div>
      </div>

      <div className="checkout-layout">
        {step === 1 && (
          <div className="checkout-main">
            <div className="checkout-card">
              <h3>Shipping Information</h3>
              <div className="address-form">
                <input type="text" placeholder="Full Name" value={address.name} onChange={e => setAddress({...address, name: e.target.value})} />
                <input type="text" placeholder="Phone Number" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} />
                <input type="text" placeholder="Flat / House No. / Area" value={address.house} onChange={e => setAddress({...address, house: e.target.value})} />
                <div className="form-row">
                  <input type="text" placeholder="City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
                  <input type="text" placeholder="Pincode" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} />
                </div>
                <button className="btn-primary" onClick={() => setStep(2)}>
                  Continue to Payment <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="checkout-main">
            <div className="checkout-card">
              <h3>Select Payment Method</h3>
              <div className="payment-options">
                <div 
                  className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <div className="option-radio"></div>
                  <div className="option-info">
                    <h4>UPI (Google Pay, PhonePe, etc.)</h4>
                    <p>Instant activation and faster shipping.</p>
                  </div>
                </div>
                <div 
                  className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <div className="option-radio"></div>
                  <div className="option-info">
                    <h4>Cash on Delivery</h4>
                    <p>Pay when you receive your jar.</p>
                  </div>
                </div>
              </div>

              {paymentMethod === 'upi' && (
                <div className="upi-mock">
                  <p>Scan QR or Enter UPI ID</p>
                  <div className="qr-box">QR CODE MOCK</div>
                  <input type="text" placeholder="example@upi" />
                </div>
              )}

              {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

              <div className="step-actions">
                <button className="btn-secondary" onClick={() => setStep(1)}>Back</button>
                <button 
                  className="btn-primary" 
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : `Place Order (₹${getCartTotal()})`}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="checkout-success">
            <div className="success-card">
              <CheckCircle2 size={80} color="#2e7d32" />
              <h2>Order Placed Successfully!</h2>
              <p>Thank you for choosing Ejja Pickles. Your order is being prepared by our traditional artisans.</p>
              <div className="order-details-summary">
                <p>Order ID: #{orderId}</p>
                <p>Delivery in: 3-5 Business Days</p>
              </div>
              <div className="success-btns">
                <Link to="/orders" className="btn-primary">Track Order</Link>
                <Link to="/shop" className="btn-secondary">Continue Shopping</Link>
              </div>
            </div>
          </div>
        )}

        {step !== 3 && (
          <div className="checkout-summary">
            <div className="summary-card">
              <h3>Review Order</h3>
              <div className="review-items">
                {cartItems.map(item => (
                  <div key={item._id || item.id} className="review-item">
                    <span>{item.quantity}x {item.name}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Subtotal</span>
                  <span>₹{getCartTotal()}</span>
                </div>
                <div className="price-row">
                  <span>Shipping</span>
                  <span className="free">FREE</span>
                </div>
                <div className="price-row total">
                  <span>Total</span>
                  <span>₹{getCartTotal()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
