import React, { useState, useEffect } from "react";
import { fetchUserOrders, getApiErrorMessage } from "../services/api";

export default function OrdersPage({ currentUser, isAuthenticated, toggleLogin, navigateTo }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all" | "present" | "past"

  useEffect(() => {
    const loadOrders = async () => {
      if (!isAuthenticated || !currentUser) {
        setLoading(false);
        return;
      }

      try {
        setError("");
        const data = await fetchUserOrders(currentUser.id);
        setOrders(data || []);
      } catch (err) {
        setError(getApiErrorMessage(err, "Failed to load order history."));
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [currentUser, isAuthenticated]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "status-pending";
      case "confirmed":
        return "status-confirmed";
      case "delivered":
        return "status-delivered";
      case "cancelled":
        return "status-cancelled";
      default:
        return "status-unknown";
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "⏳ Pending Cart";
      case "confirmed":
        return "🔥 Baking & Preparing";
      case "delivered":
        return "✅ Delivered";
      case "cancelled":
        return "❌ Cancelled";
      default:
        return status || "Unknown";
    }
  };

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="orders-empty-container">
        <span className="orders-empty-emoji">🔒</span>
        <h2>Access Denied</h2>
        <p>Please log in to view your order history.</p>
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
        <p>Loading your order dashboard...</p>
      </div>
    );
  }

  // Separate Present / Active Orders from Past Orders
  const presentOrders = orders.filter(
    (o) => o.order_status?.toLowerCase() === "confirmed" || o.order_status?.toLowerCase() === "pending"
  );
  const pastOrders = orders.filter(
    (o) => o.order_status?.toLowerCase() === "delivered" || o.order_status?.toLowerCase() === "cancelled"
  );

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="orders-page-container">
      {/* Header Banner */}
      <div className="orders-header-section">
        <h1>Your Orders Dashboard</h1>
        <p>Track live active kitchen orders and browse your past order history.</p>

        {/* Quick Navigation / Indication Chips */}
        {orders.length > 0 && (
          <div className="orders-nav-chips">
            <button
              type="button"
              className={`chip-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              📋 All Orders ({orders.length})
            </button>

            <button
              type="button"
              className={`chip-btn present-chip ${activeTab === "present" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("present");
                scrollToSection("present-orders-section");
              }}
            >
              <span className="live-dot"></span>
              🔥 Active Orders ({presentOrders.length})
            </button>

            <button
              type="button"
              className={`chip-btn past-chip ${activeTab === "past" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("past");
                scrollToSection("past-orders-section");
              }}
            >
              📜 Past History ({pastOrders.length})
            </button>
          </div>
        )}
      </div>

      {error && <div className="orders-error-banner">{error}</div>}

      {orders.length === 0 ? (
        <div className="orders-empty-container">
          <span className="orders-empty-emoji">🍕</span>
          <h2>No Orders Found</h2>
          <p>You haven't placed any orders with Pizza Point yet!</p>
          <button className="login-btn mt-4" onClick={() => navigateTo("menu")}>
            Order Your First Pizza
          </button>
        </div>
      ) : (
        <div className="orders-sections-wrapper">
          {/* ==========================================
              SECTION 1: PRESENT / ACTIVE ORDERS
             ========================================== */}
          {(activeTab === "all" || activeTab === "present") && (
            <section id="present-orders-section" className="orders-section active-orders-block">
              <div className="section-title-bar active-title-bar">
                <div className="title-left">
                  <span className="live-pulse-badge">LIVE</span>
                  <h2>Active & Present Orders</h2>
                </div>
                <span className="count-pill">{presentOrders.length} active</span>
              </div>

              {presentOrders.length === 0 ? (
                <div className="empty-section-card">
                  <p>✨ No active orders currently in the oven. Craving a hot pie?</p>
                  <button className="login-btn" onClick={() => navigateTo("menu")}>
                    Order Fresh Pizza
                  </button>
                </div>
              ) : (
                <div className="orders-grid">
                  {presentOrders.map((order) => {
                    const items = order.order_items || [];
                    return (
                      <div key={order.order_id} className="order-card active-order-card">
                        <div className="order-card-header">
                          <div className="order-metadata">
                            <span className="order-id-tag">Order #{order.order_id}</span>
                            <span className="order-time">{formatDate(order.created_at)}</span>
                          </div>
                          <span className={`status-badge-pill ${getStatusClass(order.order_status)}`}>
                            {getStatusLabel(order.order_status)}
                          </span>
                        </div>

                        {/* Visual Progress Steps Tracker */}
                        <div className="order-tracker">
                          <div className="tracker-step completed">
                            <div className="step-circle">✓</div>
                            <span>Placed</span>
                          </div>
                          <div className="tracker-line completed"></div>
                          <div className="tracker-step active">
                            <div className="step-circle baking-pulse">🔥</div>
                            <span>Baking</span>
                          </div>
                          <div className="tracker-line"></div>
                          <div className="tracker-step">
                            <div className="step-circle">🛵</div>
                            <span>Delivery</span>
                          </div>
                        </div>

                        <div className="order-card-body">
                          <h4 className="items-heading">Items Being Prepared</h4>
                          <div className="items-list">
                            {items.map((oi) => {
                              const itemDetail = oi.item || {};
                              return (
                                <div key={oi.order_item_id} className="order-item-row">
                                  <span className="item-name">🍕 {itemDetail.name || "Specialty Pizza"}</span>
                                  <span className="item-qty">x{oi.quantity}</span>
                                  <span className="item-price">${parseFloat(oi.total_price).toFixed(2)}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="order-card-footer">
                          <div>
                            <span className="footer-lbl">Total Amount</span>
                            <div className="footer-price">${parseFloat(order.total_price).toFixed(2)}</div>
                          </div>
                          <div className="estimated-time">
                            ⏱ Est. Delivery: <strong>20-25 mins</strong>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* ==========================================
              SECTION 2: PAST ORDER HISTORY
             ========================================== */}
          {(activeTab === "all" || activeTab === "past") && (
            <section id="past-orders-section" className="orders-section past-orders-block">
              <div className="section-title-bar past-title-bar">
                <div className="title-left">
                  <span className="history-icon">📜</span>
                  <h2>Past Order History</h2>
                </div>
                <span className="count-pill past-count">{pastOrders.length} completed</span>
              </div>

              {pastOrders.length === 0 ? (
                <div className="empty-section-card">
                  <p>No past order history yet. Completed orders will appear here.</p>
                </div>
              ) : (
                <div className="orders-grid">
                  {pastOrders.map((order) => {
                    const items = order.order_items || [];
                    return (
                      <div key={order.order_id} className="order-card past-order-card">
                        <div className="order-card-header">
                          <div className="order-metadata">
                            <span className="order-id-tag muted">Order #{order.order_id}</span>
                            <span className="order-time">{formatDate(order.created_at)}</span>
                          </div>
                          <span className={`status-badge-pill ${getStatusClass(order.order_status)}`}>
                            {getStatusLabel(order.order_status)}
                          </span>
                        </div>

                        <div className="order-card-body">
                          <h4 className="items-heading muted">Order Details</h4>
                          <div className="items-list">
                            {items.map((oi) => {
                              const itemDetail = oi.item || {};
                              return (
                                <div key={oi.order_item_id} className="order-item-row">
                                  <span className="item-name">🍕 {itemDetail.name || "Specialty Pizza"}</span>
                                  <span className="item-qty">x{oi.quantity}</span>
                                  <span className="item-price">${parseFloat(oi.total_price).toFixed(2)}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="order-card-footer">
                          <div>
                            <span className="footer-lbl">Total Paid</span>
                            <div className="footer-price">${parseFloat(order.total_price).toFixed(2)}</div>
                          </div>
                          <button
                            className="reorder-btn"
                            type="button"
                            onClick={() => navigateTo("menu")}
                          >
                            🔄 Reorder Items
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
