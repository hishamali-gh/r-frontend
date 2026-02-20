import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";
import NavBar from "../Components/NavBar.jsx";
import Footer from "../Components/Footer.jsx";
import API from "../api.jsx";
import { toast } from "react-toastify";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      navigate("/login");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
      return;
    }

    setUser(storedUser);

    const fetchCart = async () => {
      try {
        const response = await API.get("cart/cart/");

        const data = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.items)
          ? response.data.items
          : [];

        setCart(data);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        toast.error("Failed to load cart.");
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await API.get("orders/my-orders/");
        setOrders(response.data || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast.error("Failed to load orders.");
      }
    };

    fetchCart();
    fetchOrders();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return (
      <p
        className="text-center mt-20 text-gray-600"
        style={{ fontFamily: "SUSE Mono" }}
      >
        Loading...
      </p>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative bg-white">
      <NavBar />

      <header className="flex-grow max-w-7xl mx-auto px-6 py-20 pt-28 flex flex-col items-center">
        <h2
          className="text-6xl mb-12 text-gray-900 text-center"
          style={{ fontFamily: "Playfair Display" }}
        >
          PROFILE
        </h2>

        <div className="text-center mb-12">
          <p
            className="text-xl text-gray-800 mb-1"
            style={{ fontFamily: "SUSE Mono" }}
          >
            Name: {user.name}
          </p>
          <p
            className="text-lg text-gray-800"
            style={{ fontFamily: "SUSE Mono" }}
          >
            Email: {user.email}
          </p>
        </div>

        {/* Cart & Wishlist Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-7xl text-center">
          <Link to="/cart" className="w-full">
            <button
              className="w-full text-gray-900 py-2 font-semibold border-b border-gray-800 hover:text-white hover:bg-black transition-colors duration-300 text-base"
              style={{ fontFamily: "SUSE Mono" }}
            >
              CART ({cart.length})
            </button>
          </Link>

          <Link to="/wishlist" className="w-full">
            <button
              className="w-full text-gray-900 py-2 font-semibold border-b border-gray-800 hover:text-white hover:bg-black transition-colors duration-300 text-base"
              style={{ fontFamily: "SUSE Mono" }}
            >
              WISHLIST
            </button>
          </Link>
        </div>

        {/* Orders Section */}
        <div className="w-full max-w-4xl mt-16">
          <h3
            className="text-2xl mb-6 text-gray-900"
            style={{ fontFamily: "Playfair Display" }}
          >
            MY ORDERS
          </h3>

          {orders.length === 0 ? (
            <p
              className="text-gray-600"
              style={{ fontFamily: "SUSE Mono" }}
            >
              You haven’t placed any orders yet.
            </p>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 p-6 mb-6 rounded-lg"
              >
                <p style={{ fontFamily: "SUSE Mono" }}>
                  <strong>Order ID:</strong> {order.id}
                </p>
                <p style={{ fontFamily: "SUSE Mono" }}>
                  <strong>Status:</strong> {order.status}
                </p>
                <p style={{ fontFamily: "SUSE Mono" }}>
                  <strong>Total:</strong> ₹{order.total_price}
                </p>

                <div className="mt-4">
                  {order.items.map((item) => (
                    <p
                      key={item.id}
                      className="text-sm text-gray-700"
                      style={{ fontFamily: "SUSE Mono" }}
                    >
                      Product ID: {item.product} | Quantity: {item.quantity} | ₹{item.price}
                    </p>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <button
          className="w-full mt-6 text-gray-900 py-2 font-semibold border-b border-gray-800 hover:text-white hover:bg-red-500 hover:border-red-500 transition-colors duration-300 text-base"
          style={{ fontFamily: "SUSE Mono" }}
          onClick={handleLogout}
        >
          LOG OUT
        </button>
      </header>

      <Footer />
    </div>
  );
}
