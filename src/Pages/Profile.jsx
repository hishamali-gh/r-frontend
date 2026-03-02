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

    const fetchUser = async () => {
      try {
        const storedUser = await API.get('acc/me/');
        setUser(storedUser.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        toast.error("Failed to load user profile.");
      }
    };

    const fetchCart = async () => {
      try {
        const response = await API.get("cart/cart/");
        // Handling both array and object responses for safety
        const data = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.items)
          ? response.data.items
          : [];
        setCart(data);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };

    const fetchOrders = async () => {
      try {
        // UPDATED: Now points to the root 'orders/' endpoint 
        // which your Django view filters for the logged-in user
        const response = await API.get("orders/");
        setOrders(response.data || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast.error("Failed to load orders.");
      }
    };

    fetchUser();
    fetchCart();
    fetchOrders();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  if (!user) {
    return (
      <p className="text-center mt-20 text-gray-600 font-mono">
        Loading...
      </p>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative bg-white">
      <NavBar />

      <header className="flex-grow max-w-7xl mx-auto px-6 py-20 pt-28 flex flex-col items-center w-full">
        <h2
          className="text-6xl mb-12 text-gray-900 text-center"
          style={{ fontFamily: "Playfair Display" }}
        >
          PROFILE
        </h2>

        {/* User Info Section */}
        <div className="text-center mb-12">
          <p className="text-xl text-gray-800 mb-1" style={{ fontFamily: "SUSE Mono" }}>
            Name: {user.name}
          </p>
          <p className="text-lg text-gray-800" style={{ fontFamily: "SUSE Mono" }}>
            Email: {user.email}
          </p>
        </div>

        {/* Action Buttons */}
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
            className="text-2xl mb-8 text-gray-900 font-semibold border-b border-gray-100 pb-2"
            style={{ fontFamily: "Playfair Display" }}
          >
            MY ORDERS
          </h3>

          {orders.length === 0 ? (
            <p className="text-gray-600 italic" style={{ fontFamily: "SUSE Mono" }}>
              You haven’t placed any orders yet.
            </p>
          ) : (
            <div className="space-y-8">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4" style={{ fontFamily: "SUSE Mono" }}>
                    <div>
                      <p className="text-sm text-gray-500 uppercase">Order ID</p>
                      <p className="font-bold text-lg">#{order.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 uppercase">Status</p>
                      <p className={`font-bold ${order.status === 'DELIVERED' ? 'text-green-600' : order.status === 'CANCELLED' ? 'text-red-600' : 'text-blue-600'}`}>
                        {order.status}
                      </p>
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="mt-4 space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center border-t border-gray-50 pt-3"
                        style={{ fontFamily: "SUSE Mono" }}
                      >
                        <div className="flex items-center gap-4">
                          {item.product_image && (
                             <img 
                               src={item.product_image} 
                               alt={item.product_name} 
                               className="w-12 h-14 object-cover rounded shadow-sm grayscale"
                             />
                          )}
                          <div>
                            <p className="text-gray-900 font-semibold text-sm uppercase">
                              {item.product_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-800 font-medium text-sm">
                          ₹{item.price}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <p className="text-xs text-gray-400 font-mono uppercase">
                      Placed on: {new Date(order.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-lg font-bold text-gray-900" style={{ fontFamily: "SUSE Mono" }}>
                      TOTAL: ₹{order.total_price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          className="w-full max-w-4xl mt-12 text-gray-900 py-3 font-semibold border-b border-gray-800 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all duration-300 text-base"
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