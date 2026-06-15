import React, { useState, useEffect } from "react";
import { Plus, Minus, Trash2, Package } from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import "../styles/ComboBuilder.css";

const ComboBuilder = () => {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(3); // 3 or 5
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const sizes = [
    { label: "Trio Pack (3 Jars)", value: 3, discount: 0.9 }, // 10% off
    { label: "Family Pack (5 Jars)", value: 5, discount: 0.85 }, // 15% off
  ];

  useEffect(() => {
    const basePrice = selectedItems.reduce((acc, item) => acc + item.price, 0);
    const sizeObj = sizes.find((s) => s.value === selectedSize);
    setTotalPrice(Math.round(basePrice * (sizeObj ? sizeObj.discount : 1)));
  }, [selectedItems, selectedSize]);

  const addProduct = (product) => {
    if (selectedItems.length >= selectedSize) {
      alert(`You can only select ${selectedSize} jars for this pack.`);
      return;
    }

    setSelectedItems((prev) => [
      ...prev,
      {
        ...product,
        comboItemId: Date.now() + Math.random(),
      },
    ]);
  };

  const removeProduct = (comboItemId) => {
    setSelectedItems((prev) =>
      prev.filter((item) => item.comboItemId !== comboItemId),
    );
  };

  const handleAddCombo = () => {
    if (selectedItems.length < selectedSize) {
      alert(`Please select ${selectedSize} jars to complete your pack.`);
      return;
    }

    const comboProduct = {
      id: `combo-${Date.now()}`,
      name: `Custom Combo Pack (${selectedSize} Jars)`,
      price: totalPrice,
      image:
        "https://images.unsplash.com/photo-1628100014513-43183597b69c?q=80&w=300&auto=format&fit=crop",
      isCombo: true,
      items: selectedItems.map((i) => i.name),
    };

    addToCart(comboProduct, 1);
    setSelectedItems([]);
    alert("Combo pack added to cart!");
  };

  return (
    <div className="combo-builder container section-padding">
      <div className="builder-header">
        <h1>Custom Combo Pack</h1>
        <p>Bundle your favorites and enjoy exclusive discounts.</p>
      </div>

      <div className="builder-layout">
        <div className="builder-selector">
          <div className="size-selector">
            <h3>Step 1: Choose Your Pack Size</h3>
            <div className="size-btns">
              {sizes.map((s) => (
                <button
                  key={s.value}
                  className={selectedSize === s.value ? "active" : ""}
                  onClick={() => {
                    setSelectedSize(s.value);
                    setSelectedItems([]);
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pickle-selector">
            <h3>Step 2: Select {selectedSize} Pickles</h3>
            <div className="pickle-options">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="pickle-option"
                  onClick={() => addProduct(product)}
                >
                  <img src={product.image} alt={product.name} />
                  <div className="option-info">
                    <h4>{product.name}</h4>
                    <p>₹{product.price}</p>
                  </div>
                  <div className="selection-indicator">
                    <Plus size={16} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="builder-summary">
          <div className="summary-card">
            <h3>Combo Summary</h3>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${(selectedItems.length / selectedSize) * 100}%`,
                }}
              ></div>
              <span>
                {selectedItems.length} of {selectedSize} Selected
              </span>
            </div>

            <div className="selected-list">
              {selectedItems.length > 0 ? (
                selectedItems.map((item) => (
                  <div key={item.comboItemId} className="selected-item">
                    <span>{item.name}</span>
                    <button onClick={() => removeProduct(item.comboItemId)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="empty-selection">
                  <Package size={40} />
                  <p>No items selected yet</p>
                </div>
              )}
            </div>

            <div className="price-breakdown">
              <div className="price-row">
                <span>Bundle Discount</span>
                <span className="discount">
                  -{selectedSize === 3 ? "10%" : "15%"}
                </span>
              </div>
              <div className="price-row total">
                <span>Total Price</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>

            <button
              className="btn-primary w-full"
              disabled={selectedItems.length < selectedSize}
              onClick={handleAddCombo}
            >
              Add Combo to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComboBuilder;
