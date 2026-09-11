import React from "react";

const scrollItems = [
  {
    icon: "🍕",
    title: "Handcrafted Pizza",
    tagline: "72hr Fermented Sourdough",
    gradient: "linear-gradient(135deg, #ff9a9e, #fecfef)",
  },
  {
    icon: "⚡",
    title: "Fast Delivery Under 30 Mins",
    tagline: "Piping Hot Guarantee",
    gradient: "linear-gradient(135deg, #f6d365, #fda085)",
  },
  {
    icon: "🧀",
    title: "100% Real Cheese",
    tagline: "Imported Mozzarella",
    gradient: "linear-gradient(135deg, #a1c4fd, #c2e9fb)",
  },
  {
    icon: "🔥",
    title: "Wood-Fired Crust",
    tagline: "800°F Brick Oven",
    gradient: "linear-gradient(135deg, #ff0844, #ffb199)",
  },
  {
    icon: "🌿",
    title: "Fresh Local Ingredients",
    tagline: "Farm-to-Table Daily",
    gradient: "linear-gradient(135deg, #84fab0, #8fd3f4)",
  },
];

export default function BBScroll() {
  // Duplicate array twice to ensure seamless infinite looping animation
  const doubleItems = [...scrollItems, ...scrollItems, ...scrollItems];

  return (
    <div className="bb-scroll-container">
      <div className="bb-scroll-track">
        {doubleItems.map((item, index) => (
          <div key={index} className="bb-scroll-card">
            <div className="bb-scroll-icon-wrap" style={{ background: item.gradient }}>
              <span className="bb-scroll-icon">{item.icon}</span>
            </div>
            <div className="bb-scroll-text">
              <h4 className="bb-scroll-title">{item.title}</h4>
              <span className="bb-scroll-tagline">{item.tagline}</span>
            </div>
            <div className="bb-scroll-sparkle">✦</div>
          </div>
        ))}
      </div>
    </div>
  );
}
