import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import '../../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h2 className="logo">EJJA<span>PICKLES</span></h2>
            <p className="footer-desc">Crafting the finest traditional Kumaoni pickles since 1985. Experience the authentic taste of the Himalayas in every bite.</p>
            <div className="social-links">
              <a href="#"><Facebook size={20} /></a>
              <a href="#"><Instagram size={20} /></a>
              <a href="#"><Twitter size={20} /></a>
            </div>
          </div>
          
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shop">Shop All</Link></li>
              <li><Link to="/combo">Custom Combo</Link></li>
              <li><Link to="/about">Our Story</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h3>Contact Us</h3>
            <ul>
              <li><MapPin size={18} /> Nainital, Uttarakhand, India</li>
              <li><Phone size={18} /> +91 98765 43210</li>
              <li><Mail size={18} /> hello@ejjapickles.com</li>
            </ul>
          </div>

          <div className="footer-newsletter">
            <h3>Newsletter</h3>
            <p>Join our club for exclusive recipes and offers.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Your Email" />
              <button type="submit">Join</button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Ejja Pickles. Built with elegance.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
