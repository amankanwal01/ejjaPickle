import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/product/ProductCard";
import "../styles/Shop.css";

const Shop = () => {
  const { products, loading, error, refreshProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Default");

  const categories = [
    "All",
    "Mango",
    "Citrus",
    "Mixed",
    "Garlic",
    "Green Chilli",
  ];

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      refreshProducts({ keyword: searchTerm, category: category });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, category]);

  if (loading && products.length === 0)
    return (
      <div className="container section-padding">
        <h2>Loading our finest batches...</h2>
      </div>
    );
  if (error)
    return (
      <div className="container section-padding">
        <h2>Error: {error}</h2>
        <p>Please check your database connection.</p>
      </div>
    );

  return (
    <div className="shop-page container section-padding">
      <div className="shop-header">
        <span className="badge">The Mountain Store</span>
        <h1>Our Finest Batches</h1>
        <p>
          Curated from every corner of the Kumaon region. Small-batch,
          sun-dried, and traditionally aged.
        </p>
      </div>

      <div className="shop-controls">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search for pickles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <div className="filter-group">
            <label>Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="Default">Default</option>
              <option value="PriceLow">Price: Low to High</option>
              <option value="PriceHigh">Price: High to Low</option>
              <option value="Rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="results-count">
        {/* Showing {filteredProducts.length} products */}
      </div>

      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))
        ) : (
          <div className="no-results">
            <p>No pickles found matching your criteria.</p>
            <button
              className="btn-secondary"
              onClick={() => {
                setSearchTerm("");
                setCategory("All");
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
