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
        setCart(response.data.items || []);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        toast.error("Failed to load cart.");
      }
    };

    fetchCart();
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
