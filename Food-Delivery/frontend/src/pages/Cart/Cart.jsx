import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url
  } = useContext(StoreContext);

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const navigate = useNavigate();

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    if (promoCode.trim()) {
      setPromoApplied(true);
      // Handle promo code logic here
    }
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
    } else if (newQuantity > cartItems[itemId]) {
      addToCart(itemId);
    } else {
      // Decrease quantity
      const newCartItems = { ...cartItems };
      newCartItems[itemId] = newQuantity;
      setCartItems(newCartItems);
    }
  };

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 2;
  const total = subtotal + deliveryFee;

  return (
    <div className="modern-cart">
      <div className="cart-header">
        <h1 className="cart-title">🛒 Shopping Cart</h1>
        <p className="cart-subtitle">
          {Object.values(cartItems).reduce((sum, qty) => sum + qty, 0)} items in your cart
        </p>
      </div>

      {Object.values(cartItems).every(qty => qty === 0) ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some delicious food to get started!</p>
          <button onClick={() => navigate('/')} className="continue-shopping-btn">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-section">
            <div className="cart-items-header">
              <div className="header-item">Product</div>
              <div className="header-item">Name</div>
              <div className="header-item">Price</div>
              <div className="header-item">Quantity</div>
              <div className="header-item">Total</div>
              <div className="header-item">Remove</div>
            </div>

            <div className="cart-items-list">
              {food_list.map((item, index) => {
                if (cartItems[item._id] > 0) {
                  return (
                    <div key={item._id} className="cart-item">
                      <div className="item-image">
                        <img src={url + "/images/" + item.image} alt={item.name} />
                      </div>
                      <div className="item-details">
                        <h3 className="item-name">{item.name}</h3>
                        <p className="item-description">Fresh and delicious</p>
                      </div>
                      <div className="item-price">${item.price}</div>
                      <div className="item-quantity">
                        <div className="quantity-controls">
                          <button 
                            onClick={() => handleQuantityChange(item._id, cartItems[item._id] - 1)}
                            className="quantity-btn decrease"
                          >
                            −
                          </button>
                          <span className="quantity-value">{cartItems[item._id]}</span>
                          <button 
                            onClick={() => handleQuantityChange(item._id, cartItems[item._id] + 1)}
                            className="quantity-btn increase"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="item-total">
                        ${(item.price * cartItems[item._id]).toFixed(2)}
                      </div>
                      <div className="item-remove">
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="remove-btn"
                          aria-label="Remove item"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>

          <div className="cart-sidebar">
            <div className="cart-summary">
              <h2 className="summary-title">Order Summary</h2>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              
              <div className="summary-row discount-row">
                <span>Discount</span>
                <span className="discount-amount">
                  {promoApplied ? "-$5.00" : "$0.00"}
                </span>
              </div>
              
              <div className="summary-row total-row">
                <span>Total</span>
                <span className="total-amount">
                  ${(total - (promoApplied ? 5 : 0)).toFixed(2)}
                </span>
              </div>

              <button 
                onClick={() => navigate('/order')}
                className="checkout-btn"
              >
                Proceed to Checkout
              </button>
            </div>

            <div className="promo-section">
              <h3 className="promo-title">Have a promo code?</h3>
              <form onSubmit={handlePromoSubmit} className="promo-form">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="promo-input"
                />
                <button type="submit" className="promo-btn">
                  Apply
                </button>
              </form>
              {promoApplied && (
                <p className="promo-success">✅ Promo code applied successfully!</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
