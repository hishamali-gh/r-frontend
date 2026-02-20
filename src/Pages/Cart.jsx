import { useEffect, useState } from "react";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api.jsx";
import "react-toastify/dist/ReactToastify.css";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
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
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const res = await API.get("cart/cart/");
      setCartItems(res.data || []);
      setIsLoggedIn(true);
    } catch (err) {
      setIsLoggedIn(false);
      setCartItems([]);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await API.delete(`cart/cart/${itemId}/`);
      toast.info("Item removed from cart!");
      fetchCartItems();
    } catch (err) {
      toast.error("Failed to remove item!");
    }
  };

  const changeQuantity = async (itemId, delta) => {
    try {
      const item = cartItems.find((i) => i.id === itemId);
      const newQuantity = item.quantity + delta;

      if (newQuantity < 1) return;

      await API.patch(`cart/cart/${itemId}/`, {
        quantity: newQuantity,
      });

      fetchCartItems();
    } catch (err) {
      toast.error("Failed to update quantity!");
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
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
    if (!shippingDetails.phone.trim())
      newErrors.phone = "*Phone number is required!";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async () => {
    if (!validateShipping()) {
      toast.warning("Fill all required fields!");
      return;
    }

    try {
      await API.post("/orders/", {
        shipping_details: shippingDetails,
      });

      toast.success("Order placed successfully!");
      fetchCartItems();
      setCheckoutOpen(false);
      setShippingDetails({
        name: "",
        address: "",
        city: "",
        postalCode: "",
        phone: "",
      });
    } catch (err) {
      toast.error("Checkout failed!");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="h-screen flex items-center justify-center text-xl text-gray-500">
        You have to sign in first
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />

      <main className="flex-grow max-w-7xl mx-auto px-6 pt-36 pb-12 w-full">
        <h1 className="text-6xl mb-16 text-center">SHOPPING CART</h1>

        {cartItems.length > 0 ? (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Items */}
            <div className="flex-1 space-y-6 pr-6 border-r border-gray-300">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="relative flex flex-col md:flex-row items-center justify-between border-b pb-4"
                >
                  <button
                    className="absolute top-2 right-2 text-red-500 text-lg"
                    onClick={() => removeItem(item.id)}
                  >
                    ×
                  </button>

                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div>
                      <h2 className="font-semibold uppercase">
                        {item.product.name}
                      </h2>
                      <p className="text-sm uppercase">
                        Size: {item.size}
                      </p>
                      <p className="font-semibold">
                        ₹{item.product.price}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => changeQuantity(item.id, -1)}
                      className="px-3 border"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => changeQuantity(item.id, 1)}
                      className="px-3 border"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full md:w-1/3 pl-8 pr-5 py-5">
              <h2 className="text-xl font-semibold mb-4">
                Order Summary
              </h2>

              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>₹{shipping}</span>
              </div>

              <div className="flex justify-between font-semibold border-t pt-3 mt-3">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <button
                className="w-full mt-6 border py-2"
                onClick={() => setCheckoutOpen(true)}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-24">
            <p className="text-2xl font-bold uppercase">
              YOUR CART IS EMPTY
            </p>
            <Link to="/" className="mt-10 border px-6 py-2 uppercase">
              Home
            </Link>
          </div>
        )}

        {checkoutOpen && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-start pt-20">
            <div className="bg-white w-full max-w-lg p-6 rounded shadow-lg">
              <h2 className="text-2xl mb-6">Shipping Details</h2>

              <div className="space-y-4">
                {["name", "address", "city", "postalCode", "phone"].map(
                  (field) => (
                    <div key={field}>
                      <input
                        name={field}
                        value={shippingDetails[field]}
                        onChange={handleShippingChange}
                        placeholder={field}
                        className="w-full border-b py-2"
                      />
                      {errors[field] && (
                        <p className="text-red-500 text-xs">
                          {errors[field]}
                        </p>
                      )}
                    </div>
                  )
                )}

                <button
                  onClick={handleCheckout}
                  className="w-full border py-2 mt-4"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
