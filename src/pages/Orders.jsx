import React, { useEffect, useState } from 'react';
import { Package, Truck, Clock, CheckCircle, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const response = await fetch('/api/orders/myorders', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch orders');
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) return <div className="container section-padding">Loading orders...</div>;
  if (error) return <div className="container section-padding">Error: {error}</div>;

  return (
    <div className="orders-page container section-padding">
      <div className="orders-header">
        <h1>Your Order History</h1>
        <p>Track your traditional jars as they travel from the mountains to your home.</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <Package size={60} strokeWidth={1} />
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-main-info">
                <div className="order-meta">
                  <span className="order-id">Order ID: {order._id}</span>
                  <span className="order-date">Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className={`order-status ${order.isDelivered ? 'delivered' : 'processing'}`}>
                  {order.isDelivered ? (
                    <><CheckCircle size={16} /> Delivered</>
                  ) : (
                    <><Clock size={16} /> Processing</>
                  )}
                </div>
              </div>

              <div className="order-items-preview">
                {order.orderItems.map((item, idx) => (
                   <div key={idx} className="preview-item">
                     <img src={item.image} alt={item.name} />
                     <div>
                       <p className="p-name">{item.name}</p>
                       <p className="p-qty">{item.qty} Jars</p>
                     </div>
                   </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <span>Grand Total:</span>
                  <strong>₹{order.totalPrice}</strong>
                </div>
                <button className="btn-secondary btn-sm">Track Package <ChevronRight size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
