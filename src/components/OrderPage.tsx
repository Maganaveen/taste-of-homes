import React, { useState } from "react";
import "./OrderPage.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface MenuItem {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Butter Chicken",
    category: "Main Dishes",
    description: "Creamy, spiced tomato curry with tender chicken.",
    price: 250,
    image: "butterchick.jpg",
  },
  {
    id: 2,
    name: "Paneer Tikka",
    category: "Appetizers",
    description: "Grilled paneer marinated in aromatic spices.",
    price: 180,
    image: "pantik.jpg",
  },
  {
    id: 3,
    name: "Gulab Jamun",
    category: "Desserts",
    description: "Sweet, syrup-soaked milk balls.",
    price: 90,
    image: "gulab.jpg",
  },
  {
    id: 4,
    name: "Masala Chai",
    category: "Beverages",
    description: "Traditional Indian spiced tea.",
    price: 40,
    image: "masalachai.jpg",
  },
  {
    id: 5,
    name: "Chicken Biryani",
    category: "Main Dishes",
    description: "Fragrant basmati rice cooked with spicy marinated chicken.",
    price: 220,
    image: "biryani.jpg",
  },
  {
    id: 6,
    name: "Samosa",
    category: "Appetizers",
    description: "Deep-fried pastry filled with spicy potatoes and peas.",
    price: 50,
    image: "samosa.jpg",
  },
  {
    id: 7,
    name: "Rasmalai",
    category: "Desserts",
    description: "Soft paneer balls soaked in flavored milk.",
    price: 100,
    image: "rasmalai.jpg",
  },
  {
    id: 8,
    name: "Lassi",
    category: "Beverages",
    description: "Cool yogurt-based drink, sweet or salted.",
    price: 60,
    image: "lassi.jpg",
  },
  {
    id: 9,
    name: "Palak Paneer",
    category: "Main Dishes",
    description: "Cottage cheese cubes in a creamy spinach gravy.",
    price: 200,
    image: "palakpaneer.jpg",
  },
  {
    id: 10,
    name: "Onion Pakoda",
    category: "Appetizers",
    description: "Crispy onion fritters made with gram flour.",
    price: 70,
    image: "pakoda.jpg",
  },
  {
    id: 11,
    name: "Kheer",
    category: "Desserts",
    description: "Rice pudding flavored with cardamom and saffron.",
    price: 80,
    image: "kheer.jpg",
  },
  {
    id: 12,
    name: "Filter Coffee",
    category: "Beverages",
    description: "Strong South Indian brewed coffee with frothy milk.",
    price: 45,
    image: "filtercoffee.jpg",
  }
];


const OrderPage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const openOrderModal = (item: MenuItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setOrderPlaced(false);
    setName("");
    setAddress("");
    setPhone("");
    setPaymentMethod("Cash on Delivery");
  };

  const closeOrderModal = () => {
    setSelectedItem(null);
  };

  const getDiscount = (qty: number, price: number) => {
    return qty >= 3 ? 0.1 * qty * price : 0;
  };

const handlePlaceOrder = async () => {
  const token = localStorage.getItem("token");
  console.log("Token before sending:", token);
  

  if (!selectedItem) {
    alert("Please select an item to order.");
    return;
  }

  const totalAmount = quantity * selectedItem.price - discount;

  try {
    console.log("Token being sent:", token);

    const response = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        itemId: selectedItem.id,
        itemName: selectedItem.name,
        quantity,
        price: selectedItem.price,
        total: totalAmount,
        discount,
        paymentMethod,
        phone,
        address,
      }),
    });

    const data = await response.json();

    if (response.ok) {
       toast.success(" Order placed successfully!");
      // Optionally reset form or close modal here
    } else {
toast.error(` ${data.message || "Order failed"}`);  
  }
  } catch (error) {
    console.error("Order placement failed:", error);
 toast.error(" Something went wrong while placing the order.");
  }
};




  const itemTotal = selectedItem ? selectedItem.price * quantity : 0;
  const discount = selectedItem ? getDiscount(quantity, selectedItem.price) : 0;
  const finalTotal = itemTotal - discount;

  return (
    <div className="order-page">
      <h2>Select an Item to Order</h2>

      <div className="menu-grid">
        {menuItems.map((item) => (
          <div key={item.id} className="menu-card">
            <img src={item.image} alt={item.name} className="menu-img" />
            <h3>{item.name}</h3>
            <p className="menu-desc">{item.description}</p>
            <div className="menu-footer">
              <span className="menu-price">₹{item.price}</span>
              <button
                className="add-to-cart-btn"
                onClick={() => openOrderModal(item)}
              >
                Order
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="modal-overlay" onClick={closeOrderModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Order Details</h2>
            <img
              src={selectedItem.image}
              alt={selectedItem.name}
              className="modal-img"
            />
            <p>
              <strong>{selectedItem.name}</strong> - {selectedItem.category}
            </p>
            <p>{selectedItem.description}</p>

            <div className="quantity-section">
              <label>Quantity:</label>
              <input
                type="number"
                value={quantity}
                min={1}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>

            <div className="pricing-section">
              <p>Item Price: ₹{selectedItem.price}</p>
              {discount > 0 && (
                <p>Discount: ₹{discount.toFixed(2)} (10% per item)</p>
              )}
              <p>
                <strong>Total: ₹{finalTotal.toFixed(2)}</strong>
              </p>
            </div>

            <form className="order-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <textarea
                placeholder="Delivery Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <div className="payment-method">
                <label>
                  <strong>Payment Method:</strong>
                </label>
                <div className="payment-options">
                  <label>
                    <input
                      type="radio"
                      value="Cash on Delivery"
                      checked={paymentMethod === "Cash on Delivery"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    Cash on Delivery
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="UPI"
                      checked={paymentMethod === "UPI"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    UPI
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="Card"
                      checked={paymentMethod === "Card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    Credit/Debit Card
                  </label>
                </div>
              </div>

              <button type="button" onClick={handlePlaceOrder}>
                Confirm Order
              </button>
            </form>

            {orderPlaced && (
              <div className="order-confirmation">
                ✅ Your order for <strong>{quantity}</strong> x{" "}
                <strong>{selectedItem.name}</strong> has been placed! <br />
                Total Paid: ₹{finalTotal.toFixed(2)} via {paymentMethod}.
              </div>
            )}

            {paymentMethod === "UPI" && (
              <div className="upi-qr-section">
                <p>
                  <strong>Scan the UPI QR to Pay:</strong>
                </p>
                <img
                  src="/upi_qr.png"
                  alt="UPI QR Code"
                  className="upi-qr-img"
                />
              </div>
            )}

            {paymentMethod === "Card" && (
              <div className="card-details">
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  className="card-input"
                />
                <input
                  type="text"
                  placeholder="Card Number"
                  className="card-input"
                  maxLength={16}
                />
                <div className="card-inline">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="card-input half"
                    maxLength={5}
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="card-input half"
                    maxLength={3}
                  />
                </div>
              </div>
            )}

            <button className="close-modal-btn" onClick={closeOrderModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
