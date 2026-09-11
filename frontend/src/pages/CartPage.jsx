import React, { useState, useEffect } from "react";
import { fetchUserCart, updateCartItem, removeCartItem, checkoutOrder, getApiErrorMessage } from "../services/api";

export default function CartPage({ currentUser, isAuthenticated, toggleLogin, onCartUpdated, navigateTo }) {
  const [cart, setCart] = useState(null); // The pending order object
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState(null);

  const loadCart = async () => {
    if (!isAuthenticated || !currentUser) {
      setLoading(false);
      return;
    }

    try {
      setError("");
      const carts = await fetchUserCart(currentUser.id);
      // Look for the first pending order
      if (carts && carts.length > 0) {
        setCart(carts[0]);
      } else {
        setCart(null);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load cart."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [currentUser, isAuthenticated]);

  const handleUpdateQuantity = async (orderItemId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(orderItemId);
      return;
    }

    setUpdatingItemId(orderItemId);
    try {
      await updateCartItem(currentUser.id, orderItemId, newQty);
      await loadCart();
      if (onCartUpdated) onCartUpdated();
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to update item quantity."));
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (orderItemId) => {
    setUpdatingItemId(orderItemId);
    try {
      await removeCartItem(currentUser.id, orderItemId);
      await loadCart();
      if (onCartUpdated) onCartUpdated();
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to remove item."));
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleCheckout = async () => {
    if (!cart) return;

    setLoading(true);
    try {
      const response = await checkoutOrder(currentUser.id, cart.order_id);
      setConfirmedOrderId(response.order_id || cart.order_id);
      setCheckoutSuccess(true);
      setCart(null);
      if (onCartUpdated) onCartUpdated();
    } catch (err) {
      setError(getApiErrorMessage(err, "Checkout failed."));
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="cart-empty-container">
        <span className="cart-empty-emoji">🔒</span>
        <h2>Access Denied</h2>
        <p>Please log in to view your shopping cart.</p>
        <button className="login-btn mt-4" onClick={toggleLogin}>
          Log In Now
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="menu-loading">
        <div className="spinner"></div>
        <p>Retrieving your cart items...</p>
      </div>
    );
  }

  if (checkoutSuccess) {
    return (
      <div className="checkout-success-container">
        <span className="success-badge-emoji">🎉</span>
        <h2>Order Confirmed!</h2>
        <p className="order-number-info">Order Reference: #{confirmedOrderId}</p>
        <p>Thank you for your purchase! Our chef is preparing your pizza now.</p>
        <div className="checkout-success-actions">
          <button className="login-btn" onClick={() => navigateTo("orders")}>
            Track Order History
          </button>
          <button className="secondary-btn" onClick={() => navigateTo("menu")}>
            Browse More Pizza
          </button>
        </div>
      </div>
    );
  }

  const items = cart?.order_items || [];
  const hasItems = items.length > 0;

  return (
    <div className="cart-page-container">
      <div className="cart-header-section">
        <h1>Your Shopping Cart</h1>
        <p>Review your selection and checkout to place your order.</p>
      </div>

      {error && <div className="cart-error-banner">{error}</div>}

      {!hasItems ? (
        <div className="cart-empty-container">
          <span className="cart-empty-emoji">🛒</span>
          <h2>Your Cart is Empty</h2>
          <p>You haven't added any delicious pizzas to your cart yet.</p>
          <button className="login-btn mt-4" onClick={() => navigateTo("menu")}>
            Explore Our Menu
          </button>
        </div>
      ) : (
        <div className="cart-content-grid">
          <div className="cart-items-list">
            {items.map((oi) => {
              const itemDetail = oi.item || {};
              const isUpdating = updatingItemId === oi.order_item_id;

              return (
                <div key={oi.order_item_id} className="cart-item-card">
                  <div className="cart-item-info">
                    <span className="cart-item-emoji">🍕</span>
                    <div>
                      <h3>{itemDetail.name || "Specialty Pizza"}</h3>
                      <p className="cart-item-desc">{itemDetail.description}</p>
                    </div>
                  </div>

                  <div className="cart-item-pricing">
                    <div className="cart-item-unit-price">
                      ${parseFloat(itemDetail.price || 0).toFixed(2)} each
                    </div>
                    
                    <div className="quantity-selector">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(oi.order_item_id, oi.quantity - 1)}
                        disabled={isUpdating}
                      >
                        -
                      </button>
                      <span className="qty-number">{oi.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(oi.order_item_id, oi.quantity + 1)}
                        disabled={isUpdating}
                      >
                        +
                      </button>
                    </div>

                    <div className="cart-item-total-price">
                      ${parseFloat(oi.total_price).toFixed(2)}
                    </div>

                    <button
                      className="cart-remove-btn"
                      type="button"
                      onClick={() => handleRemoveItem(oi.order_item_id)}
                      disabled={isUpdating}
                      title="Remove Item"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary-card">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Items Total</span>
              <span>${parseFloat(cart.total_price).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span className="free-badge">FREE</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total-row">
              <span>Total Amount</span>
              <span>${parseFloat(cart.total_price).toFixed(2)}</span>
            </div>

            <button className="checkout-submit-btn" onClick={handleCheckout}>
              Confirm and Pay
            </button>
            <p className="secure-checkout-note">🔒 Secured brick-oven transaction</p>
          </div>
        </div>
      )}
    </div>
  );
}
