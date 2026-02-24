import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [user, setUser] = useState(null);
  const [totalOrders, setTotalOrders] = useState(0);

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      const response=await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { token } }
      );
      if(response.data.success){
        toast.success("item Added to Cart")
      }else{
        toast.error("Something went wrong")
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      const response= await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { token } }
      );
      if(response.data.success){
        toast.success("item Removed from Cart")
      }else{
        toast.error("Something went wrong")
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    console.log("=== Fetching food list ===");
    try {
      const response = await axios.get(url + "/api/food/list");
      console.log("Food list response:", response.data);
      if (response.data.success) {
        console.log("✅ Food list fetched successfully:", response.data.data.length, "items");
        setFoodList(response.data.data);
      } else {
        console.log("❌ Error fetching food list:", response.data.message);
        alert("Error! Products are not fetching..");
      }
    } catch (error) {
      console.log("❌ Network error fetching food list:", error);
      alert("Network error! Please check if the backend is running.");
    }
  };

  const loadCardData = async (token) => {
    const response = await axios.post(
      url + "/api/cart/get",
      {},
      { headers: { token } }
    );
    setCartItems(response.data.cartData);
  };

  const fetchUserData = async (token) => {
    try {
      const response = await axios.post(url + "/api/user/profile", {}, {
        headers: { token }
      });
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
  };

  const fetchTotalOrders = async (token) => {
    try {
      const response = await axios.post(url + "/api/order/userorders", {}, {
        headers: { token }
      });
      if (response.data.success && response.data.orders) {
        setTotalOrders(response.data.orders.length);
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCardData(localStorage.getItem("token"));
        await fetchUserData(localStorage.getItem("token"));
        await fetchTotalOrders(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  // Fetch user data when token changes
  useEffect(() => {
    if (token) {
      fetchUserData(token);
      fetchTotalOrders(token);
    } else {
      setUser(null);
      setTotalOrders(0);
    }
  }, [token]);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    user,
    totalOrders,
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;
