import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaYoutube, FaTwitter, FaInstagram } from "react-icons/fa";
import { FaConciergeBell, FaShoppingCart, FaSignOutAlt, FaListAlt } from "react-icons/fa"; // ✅ Add these icons

import "./HomePage.css";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [showCartModal, setShowCartModal] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Example: load cart from localStorage (or replace this with context)
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
  const savedCart = localStorage.getItem("cart");
  const token = localStorage.getItem("token");

  if (savedCart) {
    const parsedCart = JSON.parse(savedCart);
    setCart(parsedCart);

    // Example API call to save cart count
    fetch("/api/cart/count", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: token, // or user ID from JWT/context
        count: parsedCart.length,
      }),
    });
  }
}, []);


  const openCartModal = () => setShowCartModal(true);
  const closeCartModal = () => setShowCartModal(false);

  return (
    <div className="home-container">
      <nav className="navbar" style={{ height: "80px" }}>
        <div className="nav-brand">
          <div className="image-box">
            <img src="/taste1.png" alt="Taste of Home" />
          </div>
        </div>
      <div className="nav-links">
  <button className="nav-link" onClick={() => navigate("/menu")}>
    <FaListAlt style={{ marginRight: "5px" }} />
    Menu
  </button>

  <button className="nav-link" onClick={openCartModal}>
    <FaShoppingCart style={{ marginRight: "5px" }} />
    Cart ({cart.length})
  </button>

  <button
    className="nav-link"
    onClick={() => navigate("/order", { state: { cart } })}
  >
    <FaConciergeBell style={{ marginRight: "5px" }} />
    Place Order
  </button>

  <button className="nav-link" onClick={handleLogout}>
    <FaSignOutAlt style={{ marginRight: "5px" }} />
    Logout
  </button>
</div>

      </nav>

      <main className="main-content">
        <section className="welcome-section">
          <h1>Welcome to Taste of Home</h1>
          <p>Discover authentic homemade dishes from around the world</p>
        </section>

        <section className="featured-categories">
          <h2>Popular Categories</h2>
          <div className="category-grid">
            <div className="category-card">
              <img src="/maindish.jpg" alt="Main Dishes" />
              <div className="category-info">
                <h3>Main Dishes</h3>
                <p>
                  Dive into delicious main courses crafted with traditional
                  spices and homestyle recipes. Enjoy flavorful biryani, creamy
                  butter chicken, masala dosa, and more — the heart of every
                  meal.
                </p>
              </div>
            </div>

            <div className="category-card">
              <img src="/appetizers.jpg" alt="Appetizers" />
              <div className="category-info">
                <h3>Appetizers</h3>
                <p>
                  Crispy, spicy, and mouthwatering — our appetizers include
                  golden samosas, crunchy pakoras, and spicy paneer tikka that
                  are perfect to get your taste buds tingling before the main
                  course.
                </p>
              </div>
            </div>

            <div className="category-card">
              <img src="/dessert.jpg" alt="Desserts" />
              <div className="category-info">
                <h3>Desserts</h3>
                <p>
                  End your meal on a sweet note with our range of classic Indian
                  desserts. Choose from gulab jamun, rasmalai, kheer, and other
                  indulgent treats made just like at home.
                </p>
              </div>
            </div>

            <div className="category-card">
              <img src="/beverages.jpg" alt="Beverages" />
              <div className="category-info">
                <h3>Beverages</h3>
                <p>
                  Quench your thirst with flavorful drinks like masala chai,
                  mango lassi, badam milk, and fresh lemon soda. Every sip
                  brings refreshing memories of homemade care.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="featured-categoreies">
          <h2>Traditional & Modern Foods</h2>
          <div className="category-grid">
            <div
              className="category-card"
              onClick={() => navigate("/foods/traditional")}
            >
              <img src="/traditional.jpg" alt="Traditional Food" />
              <h3>Traditional Food</h3>
              <p>
                Authentic recipes passed down for generations – soulful and
                regional delights.
              </p>
            </div>
            <div
              className="category-card"
              onClick={() => navigate("/foods/modern")}
            >
              <img src="/modern.jpg" alt="Modern Food" />
              <h3>Modern Food</h3>
              <p>
                Trendy fusion dishes with a twist – creative, flavorful, and
                Instagram-worthy.
              </p>
            </div>
          </div>
        </section>
        <section className="featured-categoreies">
          <div className="category-grid" style={{ marginTop: "2rem" }}>
            <div
              className="category-card"
              onClick={() => navigate("/foods/veg")}
            >
              <img src="/veg.jpg" alt="Vegetarian" />
              <h3>Vegetarian</h3>
              <p>
                Wholesome and flavorful dishes crafted without meat or seafood.
              </p>
            </div>

            <div
              className="category-card"
              onClick={() => navigate("/foods/nonveg")}
            >
              <img src="/nonveg.jpg" alt="Non-Vegetarian" />
              <h3>Non-Vegetarian</h3>
              <p>
                Savory and spicy meat-based meals from various regional
                cuisines.
              </p>
            </div>
          </div>
        </section>
        <section className="about-us">
          <h2>About Us</h2>
          <p>
            Welcome to Taste of Home, where we bring you the essence of Indian
            cuisine right to your doorstep. Our mission is to provide you with
            authentic, homemade dishes that capture the flavors and traditions
            of India in every bite.
          </p>
        </section>
      </main>

      {/* Cart Modal */}
      {showCartModal && (
        <div className="modal-overlay" onClick={closeCartModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Your Cart</h2>
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <ul className="cart-list">
                {cart.map((item) => (
                  <li key={item.id} className="cart-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        marginBottom: "8px",
                      }}
                    />
                    <div>
                      <strong>{item.name}</strong>
                      <br />₹{item.price}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <button className="close-modal-btn" onClick={closeCartModal}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          {/* Contact and Map */}
          <div className="footer-contact">
            <h4>Contact Us</h4>
            <p>No. 123, Beach Road, Cuddalore, Tamil Nadu, India</p>
            <p>Phone: +91 98765 43210</p>

            <div className="footer-map">
              <iframe
                title="Cuddalore Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.1860133808916!2d79.74804817452006!3d11.74315988851562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5537cf1801db1f%3A0x19a37b6dbcc77567!2sCuddalore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1719222593336!5m2!1sen!2sin"
                width="100%"
                height="150"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Social Media */}
          <div className="footer-social">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube className="social-icon" />
                <span>YouTube</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter className="social-icon" />
                <span>Twitter</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="social-icon" />
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>

        <p className="footer-copy">
          &copy; 2025 Taste of Home. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
