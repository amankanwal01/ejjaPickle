import React, { useState, useEffect } from "react";
import { useProducts } from "../context/ProductContext";
import {
  Package,
  Users,
  ShoppingBag,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  X,
  Upload,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/Admin.css";

const AdminDashboard = () => {
  const { products, refreshProducts } = useProducts();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add Product State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [productData, setProductData] = useState({
    name: "",
    price: 0,
    category: "Mango",
    description: "",
    countInStock: 10,
    brand: "Ejja Pickles",
  });
  const [selectedImages, setSelectedImages] = useState([]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(
        "Fetching admin data with token:",
        user?.token?.slice(0, 10) + "...",
      );

      // Fetch Stats
      const statsRes = await fetch("/api/users/stats", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      let statsData;
      const statsText = await statsRes.text();
      try {
        statsData = JSON.parse(statsText);
      } catch (e) {
        console.error("Failed to parse stats JSON:", statsText);
        throw new Error(
          `Server returned non-JSON response for stats: ${statsText.slice(0, 50)}...`,
        );
      }

      if (!statsRes.ok) {
        console.error("Stats Error:", statsData);
        setError(
          statsData.message ||
            `Error ${statsRes.status}: Failed to fetch admin stats.`,
        );
        setLoading(false);
        return;
      }

      // Fetch All Orders
      const ordersRes = await fetch("/api/orders/all", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      let ordersData = [];
      const ordersText = await ordersRes.text();
      if (ordersRes.ok) {
        try {
          ordersData = JSON.parse(ordersText);
        } catch (e) {
          console.error("Failed to parse orders JSON:", ordersText);
        }
      } else {
        let errorData = {};
        try {
          errorData = JSON.parse(ordersText);
        } catch (e) {}
        console.warn(
          "Orders Fetch Warning:",
          errorData.message || `Error ${ordersRes.status}`,
        );
      }

      setStats([
        {
          label: "Total Revenue",
          value: `₹${(statsData.totalRevenue || 0).toLocaleString()}`,
          icon: <TrendingUp />,
          color: "#2e7d32",
        },
        {
          label: "Total Orders",
          value: statsData.orderCount || 0,
          icon: <ShoppingBag />,
          color: "#1565c0",
        },
        {
          label: "Active Users",
          value: statsData.userCount || 0,
          icon: <Users />,
          color: "#ef6c00",
        },
        {
          label: "Products",
          value: statsData.productCount || 0,
          icon: <Package />,
          color: "#6a1b9a",
        },
      ]);

      const validOrders = Array.isArray(ordersData) ? ordersData : [];
      setAllOrders(validOrders);
      setRecentOrders(validOrders.slice(0, 8));
      setLoading(false);
    } catch (err) {
      console.error("Admin Dashboard Fetch Error:", err);
      setError(`Diagnostic: ${err.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.token) {
      fetchAdminData();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleFileChange = (e) => {
    setSelectedImages([...e.target.files]);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setAddLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("price", productData.price);
      formData.append("category", productData.category);
      formData.append("description", productData.description);
      formData.append("countInStock", productData.countInStock);
      formData.append("brand", productData.brand);

      for (let i = 0; i < selectedImages.length; i++) {
        formData.append("images", selectedImages[i]);
      }

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setShowAddModal(false);
        refreshProducts();
        fetchAdminData();
        setProductData({
          name: "",
          price: 0,
          category: "Mango",
          description: "",
          countInStock: 10,
          brand: "Ejja Pickles",
        });
        setSelectedImages([]);
      } else {
        const error = await response.json();
        alert(error.message || "Failed to add product");
      }
    } catch (err) {
      console.error("Error adding product:", err);
      alert("An error occurred");
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (response.ok) {
          refreshProducts();
          fetchAdminData();
        } else {
          const error = await response.json();
          alert(error.message || "Failed to delete product");
        }
      } catch (err) {
        console.error("Error deleting product:", err);
      }
    }
  };

  if (loading)
    return (
      <div className="container section-padding">
        Loading Dashboard Stats...
      </div>
    );

  return (
    <div className="admin-page container section-padding">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage your luxury pickle empire.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Add New Pickle
        </button>
      </div>

      {error && (
        <div
          className="error-alert animate-fade"
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "2rem",
            border: "1px solid #f87171",
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay">
          <div className="admin-modal">
            <div className="modal-header">
              <h3>Add New Product</h3>
              <button
                className="close-btn"
                onClick={() => setShowAddModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddProduct}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={productData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={productData.category}
                    onChange={handleInputChange}
                  >
                    <option value="Mango">Mango</option>
                    <option value="Citrus">Citrus</option>
                    <option value="Mixed">Mixed</option>
                    <option value="Garlic">Garlic</option>
                    <option value="Green Chilli">Green Chilli</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={productData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    name="countInStock"
                    value={productData.countInStock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={productData.description}
                  onChange={handleInputChange}
                  rows="4"
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label>Upload Images (Max 5)</label>
                <div className="file-upload-box">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <Upload size={24} />
                  <span>
                    {selectedImages.length > 0
                      ? `${selectedImages.length} files selected`
                      : "Drag or Click to ChooseBatch Photos"}
                  </span>
                </div>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={addLoading}
                >
                  {addLoading ? "Creating Batch..." : "Add to Collection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-tabs">
        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={activeTab === "inventory" ? "active" : ""}
          onClick={() => setActiveTab("inventory")}
        >
          Inventory
        </button>
        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="admin-overview animate-fade">
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <div key={i} className="stat-card">
                <div
                  className="stat-icon"
                  style={{
                    backgroundColor: `${stat.color}15`,
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </div>
                <div className="stat-info">
                  <p>{stat.label}</p>
                  <h3>{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="admin-grid">
            <div className="admin-card recent-orders">
              <h3>Recent Orders</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        No orders placed yet.
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td>#{order._id.slice(-6)}</td>
                        <td>{order.user?.name || "Guest"}</td>
                        <td>₹{order.totalPrice}</td>
                        <td>
                          <span
                            className={`status-badge ${order.isDelivered ? "delivered" : "processing"}`}
                          >
                            {order.isDelivered ? "Delivered" : "Processing"}
                          </span>
                        </td>
                        <td>
                          {!order.isDelivered && (
                            <button
                              className="table-btn"
                              onClick={async () => {
                                if (window.confirm("Mark as delivered?")) {
                                  const res = await fetch(
                                    `/api/orders/${order._id}/deliver`,
                                    {
                                      method: "PUT",
                                      headers: {
                                        Authorization: `Bearer ${user.token}`,
                                      },
                                    },
                                  );
                                  if (res.ok) fetchAdminData();
                                }
                              }}
                            >
                              Deliver
                            </button>
                          )}
                          <button
                            className="table-btn"
                            style={{ marginLeft: "5px" }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="admin-card best-sellers">
              <h3>Best Selling</h3>
              <div className="seller-list">
                {products.length === 0 ? (
                  <p className="no-data">No products in inventory.</p>
                ) : (
                  products.slice(0, 3).map((p) => {
                    // Try to calculate actual sales from allOrders if available
                    const productSales = allOrders.reduce((acc, order) => {
                      const item = order.orderItems?.find(
                        (it) => it.product === p._id || it.product === p.id,
                      );
                      return acc + (item ? item.qty : 0);
                    }, 0);

                    return (
                      <div key={p.id || p._id} className="seller-item">
                        <img
                          src={
                            p.images?.[0] ||
                            p.image ||
                            "https://via.placeholder.com/100"
                          }
                          alt={p.name}
                        />
                        <div className="seller-info">
                          <h4>{p.name}</h4>
                          <p>{productSales} Sales</p>
                        </div>
                        <div className="seller-revenue">
                          ₹{(p.price * productSales).toLocaleString()}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "inventory" && (
        <div className="admin-inventory animate-fade">
          <div className="admin-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id || p.id}>
                    <td className="table-product">
                      <img
                        src={
                          p.images?.[0] ||
                          p.image ||
                          "https://via.placeholder.com/50"
                        }
                        alt={p.name}
                      />
                      <span>{p.name}</span>
                    </td>
                    <td>{p.category}</td>
                    <td>₹{p.price}</td>
                    <td>{p.countInStock}</td>
                    <td>{p.rating || 0} ⭐</td>
                    <td className="table-actions">
                      <button className="icon-btn edit">
                        <Edit size={16} />
                      </button>
                      <button
                        className="icon-btn delete"
                        onClick={() => handleDeleteProduct(p._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="admin-orders animate-fade">
          <div className="admin-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Delivered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      No orders found in database.
                    </td>
                  </tr>
                ) : (
                  allOrders.map((order) => (
                    <tr key={order._id}>
                      <td>#{order._id.slice(-6)}</td>
                      <td>{order.user?.name || "Guest"}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>₹{order.totalPrice}</td>
                      <td>
                        {order.isPaid ? (
                          <span className="status-badge delivered">Paid</span>
                        ) : (
                          <span className="status-badge processing">
                            Pending
                          </span>
                        )}
                      </td>
                      <td>
                        {order.isDelivered ? (
                          <span className="status-badge delivered">
                            Delivered
                          </span>
                        ) : (
                          <button
                            className="table-btn"
                            onClick={async () => {
                              if (window.confirm("Mark as delivered?")) {
                                const res = await fetch(
                                  `/api/orders/${order._id}/deliver`,
                                  {
                                    method: "PUT",
                                    headers: {
                                      Authorization: `Bearer ${user.token}`,
                                    },
                                  },
                                );
                                if (res.ok) fetchAdminData();
                              }
                            }}
                          >
                            Mark Deliver
                          </button>
                        )}
                      </td>
                      <td>
                        <button className="table-btn">Details</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
