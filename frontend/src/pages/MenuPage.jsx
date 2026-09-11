import React, { useState, useEffect } from "react";
import { fetchProducts, addToCart, getApiErrorMessage } from "../services/api";

export default function MenuPage({ isAuthenticated, currentUser, toggleLogin, onCartUpdated }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantities, setQuantities] = useState({}); // key: item_id, value: quantity
  const [addingState, setAddingState] = useState({}); // key: item_id, value: boolean (loading state)
  const [message, setMessage] = useState({ text: "", type: "", itemId: null });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        // Initialize quantities
        const initialQtys = {};
        data.forEach((p) => {
          initialQtys[p.item_id] = 1;
        });
        setQuantities(initialQtys);
      } catch (err) {
        setError(getApiErrorMessage(err, "Failed to load products."));
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleQtyChange = (itemId, val) => {
    const qty = parseInt(val, 10);
    if (qty >= 1 && qty <= 20) {
      setQuantities((prev) => ({ ...prev, [itemId]: qty }));
    }
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated || !currentUser) {
      setMessage({
        text: "Please log in to add items to your cart.",
        type: "error",
        itemId: product.item_id,
      });
      setTimeout(() => toggleLogin(), 1500);
      return;
    }

    const qty = quantities[product.item_id] || 1;
    setAddingState((prev) => ({ ...prev, [product.item_id]: true }));
    setMessage({ text: "", type: "", itemId: null });

    try {
      await addToCart(currentUser.id, product.restaurant_id, [
        { item_id: product.item_id, quantity: qty },
      ]);
      setMessage({
        text: `Added ${qty}x ${product.name} to cart!`,
        type: "success",
        itemId: product.item_id,
      });
      if (onCartUpdated) onCartUpdated();
      // Reset quantity back to 1
      setQuantities((prev) => ({ ...prev, [product.item_id]: 1 }));
    } catch (err) {
      setMessage({
        text: getApiErrorMessage(err, "Failed to add item to cart."),
        type: "error",
        itemId: product.item_id,
      });
    } finally {
      setAddingState((prev) => ({ ...prev, [product.item_id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="menu-loading">
        <div className="spinner"></div>
        <p>Loading our artisanal menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-error-state">
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="menu-page-container">
      <div className="menu-hero-banner">
        <h1>Artisanal Pizza Menu</h1>
        <p>Hand-crafted sourdough pizzas baked in our 800°F stone oven.</p>
      </div>

      <div className="menu-display-section">
        <div className="menu-grid">
          {products.map((product) => {
            const isAdding = addingState[product.item_id];
            const qty = quantities[product.item_id] || 1;
            const itemMsg = message.itemId === product.item_id ? message : null;

            return (
              <div key={product.item_id} className="menu-card menu-interactive-card">
                <div className="menu-card-header">
                  <span className="pizza-emoji">🍕</span>
                  <h3>{product.name}</h3>
                </div>
                <p className="menu-card-desc">{product.description}</p>
                
                <div className="menu-card-controls">
                  <div className="price-tag">${parseFloat(product.price).toFixed(2)}</div>
                  
                  <div className="quantity-selector">
                    <button 
                      type="button" 
                      onClick={() => handleQtyChange(product.item_id, qty - 1)}
                      disabled={qty <= 1}
                    >
                      -
                    </button>
                    <span className="qty-number">{qty}</span>
                    <button 
                      type="button" 
                      onClick={() => handleQtyChange(product.item_id, qty + 1)}
                      disabled={qty >= 20}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="menu-card-actions">
                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                    disabled={isAdding}
                  >
                    {isAdding ? "Adding..." : "Add to Cart"}
                  </button>
                </div>

                {itemMsg && (
                  <div className={`item-action-message ${itemMsg.type}`}>
                    {itemMsg.text}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
