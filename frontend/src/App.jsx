import React, { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import { fetchUserCart, fetchCurrentUser } from "./services/api";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Will hold { id, name, email, role }
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Auto-login on mount if token is stored
  useEffect(() => {
    const autoLogin = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const user = await fetchCurrentUser();
        if (user) {
          setCurrentUser({
            id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role,
          });
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Auto-login failed or token expired:", err);
        localStorage.removeItem("token");
      }
    };
    autoLogin();
  }, []);

  // Sync cart count
  const updateCartCount = async () => {
    if (!isAuthenticated || !currentUser) {
      setCartCount(0);
      return;
    }
    try {
      const carts = await fetchUserCart(currentUser.id);
      if (carts && carts.length > 0) {
        const pendingCart = carts[0];
        const totalItems = (pendingCart.order_items || []).reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        setCartCount(totalItems);
      } else {
        setCartCount(0);
      }
    } catch (err) {
      console.error("Error updating cart count:", err);
    }
  };

  useEffect(() => {
    updateCartCount();
  }, [currentUser, isAuthenticated]);

  const toggleLogin = () => {
    setShowLogin(true);
    setShowSignUp(false);
  };

  const toggleSignUp = () => {
    setShowSignUp(true);
    setShowLogin(false);
  };

  const handleAuthSuccess = (user) => {
    setShowLogin(false);
    setShowSignUp(false);
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCartCount(0);
    setCurrentPage("home");
    setShowLogin(false);
    setShowSignUp(false);
  };

  const closeAuth = () => {
    setShowLogin(false);
    setShowSignUp(false);
  };

  // Helper to render the active page
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <HomePage
            toggleLogin={toggleLogin}
            toggleSignUp={toggleSignUp}
            isAuthenticated={isAuthenticated}
            currentUser={currentUser}
            onLogout={handleLogout}
            navigateTo={setCurrentPage}
            cartCount={cartCount}
          />
        );
      case "menu":
        return (
          <MenuPage
            isAuthenticated={isAuthenticated}
            currentUser={currentUser}
            toggleLogin={toggleLogin}
            onCartUpdated={updateCartCount}
          />
        );
      case "cart":
        return (
          <CartPage
            currentUser={currentUser}
            isAuthenticated={isAuthenticated}
            toggleLogin={toggleLogin}
            onCartUpdated={updateCartCount}
            navigateTo={setCurrentPage}
          />
        );
      case "orders":
        return (
          <OrdersPage
            currentUser={currentUser}
            isAuthenticated={isAuthenticated}
            toggleLogin={toggleLogin}
            navigateTo={setCurrentPage}
          />
        );
      default:
        return (
          <HomePage
            toggleLogin={toggleLogin}
            toggleSignUp={toggleSignUp}
            isAuthenticated={isAuthenticated}
            currentUser={currentUser}
            onLogout={handleLogout}
            navigateTo={setCurrentPage}
            cartCount={cartCount}
          />
        );
    }
  };

  return (
    <>
      {showLogin || showSignUp ? (
        <div className="auth-fullscreen">
          {showLogin && (
            <LoginPage
              onSuccess={handleAuthSuccess}
              onCancel={closeAuth}
            />
          )}

          {showSignUp && (
            <SignUpPage
              onSuccess={(userData) => {
                // When signup succeeds, switch to login page so they can authenticate
                setShowSignUp(false);
                setShowLogin(true);
              }}
              onCancel={closeAuth}
            />
          )}
        </div>
      ) : currentPage === "home" ? (
        renderPage()
      ) : (
        <div className="app-container">
          <header className="subpage-header">
            <nav className="top-nav">
              <div 
                className="brand-group" 
                onClick={() => setCurrentPage("home")} 
                style={{ cursor: "pointer" }}
              >
                <span className="brand-mark">🍕</span>
                <div>
                  <h2>Pizza Point</h2>
                  <p>Premium pizza, delivered with style</p>
                </div>
              </div>
              <div className="nav-actions">
                <button className="nav-link-btn" onClick={() => setCurrentPage("home")}>
                  Home
                </button>
                <button className="nav-link-btn" onClick={() => setCurrentPage("menu")}>
                  Menu
                </button>
                {isAuthenticated && (
                  <button className="nav-link-btn" onClick={() => setCurrentPage("orders")}>
                    Orders
                  </button>
                )}
                
                <button 
                  className="cart-nav-btn" 
                  onClick={() => setCurrentPage("cart")}
                >
                  🛒 Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </button>

                {!isAuthenticated ? (
                  <>
                    <button className="login-btn" onClick={toggleLogin}>Login</button>
                    <button className="secondary-btn" onClick={toggleSignUp}>Sign Up</button>
                  </>
                ) : (
                  <div className="profile-menu-wrap">
                    <button 
                      className="profile-trigger" 
                      type="button" 
                      onClick={() => setMenuOpen((prev) => !prev)}
                    >
                      {currentUser?.name || "Account"}
                    </button>
                    {menuOpen && (
                      <div className="profile-menu">
                        <button 
                          className="profile-menu-btn" 
                          type="button" 
                          onClick={() => {
                            setCurrentPage("orders");
                            setMenuOpen(false);
                          }}
                        >
                          My Orders
                        </button>
                        <button 
                          className="profile-menu-btn logout-btn" 
                          type="button" 
                          onClick={() => {
                            setMenuOpen(false);
                            handleLogout();
                          }}
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </nav>
          </header>

          {renderPage()}

          <footer className="footer">
            <p>© 2026 Pizza Point App. All rights reserved.</p>
          </footer>
        </div>
      )}
    </>
  );
}
