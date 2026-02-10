import { useEffect, useState } from "react";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Cart() {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const loggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));

    setIsLoggedIn(loggedIn);

    if (loggedInUser && loggedIn) {
      setUser(loggedInUser);
      setCartItems(loggedInUser.cart || []);
    } else {
      setUser(null);
      setCartItems([]);
    }
  }, []);

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-xl text-gray-500">
        You have to sign in first
      </div>
    );
  }

  const updateCart = async (updatedCart) => {
    if (!user) return;

    try {
      const res = await fetch(`http://localhost:3001/user/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: updatedCart }),
      });
      if (res.ok) {
        const updatedUser = { ...user, cart: updatedCart };
        setUser(updatedUser);
        setCartItems(updatedCart);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.info("Cart updated!");
      }
    } catch (err) {
      console.error("Failed to update cart:", err);
      toast.error("Failed to update cart!");
    }
  };

  const removeItem = (itemId, size, category) => {
    const updatedCart = cartItems.filter(
      (item) =>
        !(item.id === itemId && item.size === size && item.category === category)
    );
    updateCart(updatedCart);
    toast.info("Item removed from cart!");
  };

  const changeQuantity = (itemId, size, category, delta) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === itemId && item.size === size && item.category === category) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: newQty > 1 ? newQty : 1 };
      }
      return item;
    });
    updateCart(updatedCart);
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = 99;
  const total = subtotal + shipping;

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateShipping = () => {
    const newErrors = {};
    if (!shippingDetails.name.trim()) newErrors.name = "*Name is required!";
    if (!shippingDetails.address.trim())
      newErrors.address = "*Address is required!";
    if (!shippingDetails.city.trim()) newErrors.city = "*City is required!";

    if (!shippingDetails.postalCode.trim())
      newErrors.postalCode = "*Postal code is required!";
    else if (!/^\d{5,6}$/.test(shippingDetails.postalCode))
      newErrors.postalCode = "*Postal code must be 5 or 6 digits!";

    if (!shippingDetails.phone.trim())
      newErrors.phone = "*Phone number is required!";
    else if (!/^\d{10}$/.test(shippingDetails.phone))
      newErrors.phone = "*Phone number must be 10 digits!";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async () => {
    if (!validateShipping()) {
      toast.warning("Please fill in all required shipping details!");
      return;
    }
    if (!user) {
      toast.error("User not found!");
      return;
    }

    try {
      // ✅ Each item gets its own status field
      const orderItems = cartItems.map((item) => ({
        ...item,
        status: "OTW", // individual status
      }));

      const newOrder = {
        items: orderItems,
        shippingDetails,
        date: new Date().toISOString(),
      };

      const updatedUser = {
        ...user,
        cart: [],
        orders: user.orders ? [...user.orders, newOrder] : [newOrder],
      };

      const res = await fetch(`http://localhost:3001/user/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (res.ok) {
        setUser(updatedUser);
        setCartItems([]);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setCheckoutOpen(false);
        setShippingDetails({ name: "", address: "", city: "", postalCode: "", phone: "" });
        setErrors({});
        toast.success("Order placed successfully!");
      } else {
        toast.error("Failed to place order!");
      }
    } catch (err) {
      console.error("Failed to place order:", err);
      toast.error("Something went wrong while placing the order!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />

      <main className="flex-grow max-w-7xl mx-auto px-6 pt-36 pb-12 w-full">
        <h1
          className="text-6xl mb-16 text-gray-900 text-center"
          style={{ fontFamily: "Playfair Display" }}
        >
          SHOPPING CART
        </h1>

        {cartItems.length > 0 ? (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-6 pr-6 border-r border-gray-300">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.size}-${item.category}`}
                  className="relative flex flex-col md:flex-row items-center justify-between border-b pb-4"
                  style={{ fontFamily: "SUSE Mono" }}
                >
                  <button
                    className="absolute top-2 right-2 text-red-500 hover:text-red-600 cursor-pointer text-lg font-bold z-10"
                    disabled={!isLoggedIn}
                    onClick={() => removeItem(item.id, item.size, item.category)}
                  >
                    ×
                  </button>

                  <div className="flex items-center gap-4 cursor-pointer">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div>
                      <h2 className="text-base font-semibold text-gray-900 uppercase cursor-pointer">
                        {item.name}
                      </h2>
                      <p className="text-gray-600 text-sm uppercase">
                        Size: {item.size}
                      </p>
                      <p className="text-gray-600 text-sm uppercase">
                        Category: {item.category}
                      </p>
                      {item.type && (
                        <p className="text-gray-600 text-sm uppercase">
                          Type: {item.type}
                        </p>
                      )}
                      <p className="text-gray-800 font-semibold mt-1">
                        ₹{item.price}
                      </p>
                    </div>
                  </div>

                  <div className="absolute bottom-2 right-2 flex items-center gap-3">
                    <button
                      className="text-gray-900 py-2 font-semibold border-b border-gray-800 hover:bg-black hover:text-white transition duration-300 cursor-pointer px-3 rounded text-base"
                      disabled={!isLoggedIn}
                      onClick={() =>
                        changeQuantity(item.id, item.size, item.category, -1)
                      }
                    >
                      -
                    </button>
                    <span className="text-base font-medium">{item.quantity}</span>
                    <button
                      className="text-gray-900 py-2 font-semibold border-b border-gray-800 hover:bg-black hover:text-white transition duration-300 cursor-pointer px-3 rounded text-base"
                      disabled={!isLoggedIn}
                      onClick={() =>
                        changeQuantity(item.id, item.size, item.category, 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="w-full md:w-1/3 flex flex-col pl-8 pr-5 py-5 bg-white"
              style={{ fontFamily: "SUSE Mono" }}
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                Order Summary
              </h2>
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Shipping</span>
                <span>₹{shipping}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 border-t pt-3 mt-3">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <button
                className="w-full mt-6 text-gray-900 py-2 font-semibold border-b border-gray-800 hover:bg-black hover:text-white transition-colors duration-300 cursor-pointer text-base"
                disabled={!isLoggedIn}
                onClick={() => setCheckoutOpen(true)}
              >
                Proceed to Checkout
              </button>

              {!isLoggedIn && (
                <p className="text-red-500 text-xs mt-2">
                  *Log in to your account first
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-2xl font-bold text-gray-600 mb-6 uppercase">
              (*￣3￣)╭ <br />
              <span style={{ fontFamily: "SUSE Mono" }}>YOUR CART IS EMPTY</span>
            </p>
            <Link
              to="/"
              className="w-full max-w-xs text-gray-900 mt-20 py-2 font-semibold border-b border-gray-800 hover:text-white hover:bg-black transition-colors duration-300 uppercase cursor-pointer"
              style={{ fontFamily: "SUSE Mono" }}
            >
              HOME
            </Link>
          </div>
        )}

        {/* Checkout Modal */}
        {checkoutOpen && (
          <>
            <div className="fixed inset-0 bg-black/40 z-40"></div>
            <div className="fixed inset-0 flex justify-center items-start pt-20 z-50">
              <div className="bg-white w-full max-w-lg p-6 rounded shadow-lg relative">
                <button
                  className="absolute top-4 right-4 cursor-pointer text-gray-600 hover:text-gray-900 text-xl transition"
                  onClick={() => setCheckoutOpen(false)}
                >
                  ✕
                </button>

                <h2
                  className="text-2xl mb-6 text-gray-800"
                  style={{ fontFamily: "Playfair Display" }}
                >
                  Shipping Details
                </h2>

                <div className="space-y-4" style={{ fontFamily: "SUSE Mono" }}>
                  <input
                    name="name"
                    value={shippingDetails.name}
                    onChange={handleShippingChange}
                    placeholder="Name"
                    className="w-full px-0 py-2 text-gray-800 placeholder-gray-400 focus:outline-none border-b border-gray-400 focus:border-gray-800 transition"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}

                  <input
                    name="address"
                    value={shippingDetails.address}
                    onChange={handleShippingChange}
                    placeholder="Address"
                    className="w-full px-0 py-2 text-gray-800 placeholder-gray-400 focus:outline-none border-b border-gray-400 focus:border-gray-800 transition"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                  )}

                  <input
                    name="city"
                    value={shippingDetails.city}
                    onChange={handleShippingChange}
                    placeholder="City"
                    className="w-full px-0 py-2 text-gray-800 placeholder-gray-400 focus:outline-none border-b border-gray-400 focus:border-gray-800 transition"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                  )}

                  <input
                    name="postalCode"
                    value={shippingDetails.postalCode}
                    onChange={handleShippingChange}
                    placeholder="Postal Code"
                    className="w-full px-0 py-2 text-gray-800 placeholder-gray-400 focus:outline-none border-b border-gray-400 focus:border-gray-800 transition"
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.postalCode}
                    </p>
                  )}

                  <input
                    name="phone"
                    value={shippingDetails.phone}
                    onChange={handleShippingChange}
                    placeholder="Phone Number"
                    className="w-full px-0 py-2 text-gray-800 placeholder-gray-400 focus:outline-none border-b border-gray-400 focus:border-gray-800 transition"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}

                  <button
                    onClick={handleCheckout}
                    className="w-full text-gray-900 py-2 mt-4 font-semibold border-b border-gray-800 hover:text-white hover:bg-black transition-colors duration-300"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
