import React, { useState } from "react";
import BBScroll from "../components/pizza/BBScroll";

const featuredItems = [
  {
    name: "Signature Margherita",
    description: "Wood-fired crust, mozzarella, basil, and house tomato sauce.",
    price: "$14.99",
    badge: "Best Seller"
  },
  {
    name: "Pepperoni Blaze",
    description: "Spicy pepperoni, smoked mozzarella, and a roasted garlic finish.",
    price: "$17.49",
    badge: "Chef Pick"
  },
  {
    name: "Garden Delight",
    description: "Roasted vegetables, pesto drizzle, and creamy burrata on a thin crust.",
    price: "$16.29",
    badge: "Fresh Choice"
  }
];

const perks = [
  { title: "Freshly Baked", text: "Every pizza is baked to order in our stone oven." },
  { title: "Fast Delivery", text: "Hot meals arrive in under 35 minutes across the city." },
  { title: "Premium Ingredients", text: "Locally sourced produce and imported cheeses." }
];

export default function HomePage({ 
  toggleLogin, 
  toggleSignUp, 
  isAuthenticated, 
  currentUser, 
  onLogout, 
  navigateTo, 
  cartCount 
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const profileMenuItems = [
    { label: "My Orders", action: () => navigateTo("orders") },
    { label: "Pizza Menu", action: () => navigateTo("menu") },
    { label: "About Us", action: () => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }) }
  ];

  return (
    <div className="commercial-page">
      <header className="hero-section">
        <nav className="top-nav">
          <div className="brand-group">
            <span className="brand-mark">🍕</span>
            <div>
              <h2>Pizza Point</h2>
              <p>Premium pizza, delivered with style</p>
            </div>
          </div>
          <div className="nav-actions">
            <button className="nav-link-btn" onClick={() => navigateTo("home")}>Home</button>
            <button className="nav-link-btn" onClick={() => navigateTo("menu")}>Menu</button>
            
            {isAuthenticated && (
              <button className="nav-link-btn" onClick={() => navigateTo("orders")}>Orders</button>
            )}

            <button 
              className="cart-nav-btn" 
              onClick={() => navigateTo("cart")}
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
                <button className="profile-trigger" type="button" onClick={() => setMenuOpen((prev) => !prev)}>
                  {currentUser?.name || "Account"}
                </button>
                {menuOpen && (
                  <div className="profile-menu">
                    {profileMenuItems.map((item) => (
                      <button
                        key={item.label}
                        className="profile-menu-btn"
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          item.action();
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                    <button
                      className="profile-menu-btn logout-btn"
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        if (onLogout) onLogout();
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

        <BBScroll />

        <div className="hero-content">
          <div className="hero-copy">
            <span className="eyebrow">Artisanal Pizzeria</span>
            <h1>Craving fresh, hot pizza? We deliver in minutes.</h1>
            <p>Every pie is handcrafted with fermented sourdough, organic tomatoes, and authentic mozzarella.</p>
            <div className="hero-actions">
              <button onClick={() => navigateTo("menu")} className="login-btn">Explore Menu</button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="perks-section">
          {perks.map((perk, idx) => (
            <div key={idx} className="perk-card">
              <h3>{perk.title}</h3>
              <p>{perk.text}</p>
            </div>
          ))}
        </section>

        <section id="menu" className="menu-section">
          <div className="section-heading">
            <h2>Featured Pizzas</h2>
          </div>
          <div className="menu-grid">
            {featuredItems.map((item, idx) => (
              <div key={idx} className="menu-card">
                <span className="menu-badge">{item.badge}</span>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="menu-footer">
                  <span style={{ fontWeight: 700, fontSize: "1.2rem" }}>{item.price}</span>
                  <button className="login-btn" onClick={() => navigateTo("menu")}>Order Now</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="story-section">
          <div>
            <h2>About Pizza Point</h2>
            <p>Founded in 2024, Pizza Point combines old-world Italian brick-oven craftsmanship with modern speed and convenience. Order online and enjoy oven-hot perfection delivered to your doorstep.</p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© 2026 Pizza Point App. All rights reserved.</p>
      </footer>
    </div>
  );
}
