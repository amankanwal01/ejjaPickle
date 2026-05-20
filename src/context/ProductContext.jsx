import React, { createContext, useState, useContext, useEffect } from 'react';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async (params = {}) => {
    try {
      setLoading(true);
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`/api/products?${queryString}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      // Handle the new structure: { products, page, pages }
      setProducts(data.products || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getProductById = (id) => products.find(p => p._id === id || p.id === parseInt(id));

  return (
    <ProductContext.Provider value={{ products, loading, error, getProductById, refreshProducts: fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
