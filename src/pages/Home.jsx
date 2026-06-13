import React from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/product/ProductCard";
import "../styles/Home.css";

const Home = () => {
  const { products } = useProducts();
  const featured = products.slice(0, 3);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <span className="heritage-label">Est. 2021</span>
            <h1>
              The Soul of the <span>Himalayas</span> in a Jar.
            </h1>
            <p>
              Hand-pounded spices, sun-matured mountain fruits, and the ancient
              wisdom of Kumaon. Every jar is a journey back to the hills.
            </p>
            <div className="hero-btns">
              <Link to="/shop" className="btn-primary">
                Explore Collection
              </Link>
              <Link to="/about" className="btn-secondary">
                Our Story
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <img src="/pickleImages/AaamHome.jpg" alt="Premium Pickles" />
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <h2>Our Signature Pickles</h2>
            <p>Experience the most loved jars of Ejja</p>
          </div>
          <div className="product-grid">
            {featured.length > 0 ? (
              featured.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                />
              ))
            ) : (
              <p>Discovering our signatures...</p>
            )}
          </div>
          <div className="view-all">
            <Link to="/shop" className="btn-secondary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="banner">
        <div className="container">
          <div className="banner-box">
            <div className="banner-content">
              <h3>Create Your Signature Pack</h3>
              <p>
                Pick any 3 or 5 jars and create a custom combination tailored to
                your palate.
              </p>
              <Link to="/combo" className="btn-primary">
                Start Building
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="section-padding trust-section">
        <div className="container trust-grid">
          <div className="trust-item">
            <div className="trust-icon">🌿</div>
            <h4>100% Organic</h4>
            <p>Sourced directly from local high-altitude farms.</p>
          </div>
          <div className="trust-item">
            <div className="trust-icon">☀️</div>
            <h4>Sun-Dried</h4>
            <p>Aged traditionally under the natural Himalayan sun.</p>
          </div>
          <div className="trust-item">
            <div className="trust-icon">🫙</div>
            <h4>Ceramic Cured</h4>
            <p>Stored in earthen jars for authentic fermentation.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
