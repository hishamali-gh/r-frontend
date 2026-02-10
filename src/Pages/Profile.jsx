import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";
import NavBar from "../Components/NavBar.jsx";
import Footer from "../Components/Footer.jsx";
import { toast } from "react-toastify";

export default function Profile() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [itemToCancel, setItemToCancel] = useState(null);

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);

    if (!loggedIn) return;

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser?.id) return;

    fetch(`http://localhost:3001/user/${storedUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setCart(data.cart || []);
        setOrders(data.orders || []);
        localStorage.setItem("user", JSON.stringify(data));
      })
      .catch((err) => console.error("Failed to fetch user data:", err));
  }, []);

  const cancelItem = async () => {
    if (!user || !orderToCancel || !itemToCancel) return;

    const updatedOrders = orders
      .map((order) =>
        order.date === orderToCancel.date
          ? {
            ...order,
            items: order.items.filter(
              (i) =>
                !(
                  i.id === itemToCancel.id &&
                  i.size === itemToCancel.size &&
                  i.category === itemToCancel.category
                )
            ),
          }
          : order
      )
      .filter((order) => order.items.length > 0);

    const updatedUser = { ...user, orders: updatedOrders };

    try {
      const res = await fetch(`http://localhost:3001/user/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (res.ok) {
        setOrders(updatedOrders);
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setConfirmOpen(false);
        toast.info("Item canceled successfully!");
      }
    } catch (err) {
      console.error("Failed to cancel item:", err);
      toast.error("Failed to cancel item.");
    }
  };

  const updatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError("*Please fill all fields.");
      return;
    }
    if (currentPassword !== user.password) {
      setPasswordError("*Current password is incorrect.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError("*New passwords do not match.");
      return;
    }

    const updatedUser = { ...user, password: newPassword };

    try {
      const res = await fetch(`http://localhost:3001/user/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (res.ok) {
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setPasswordModalOpen(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setPasswordError("");
        toast.info("Password updated successfully!");
      }
    } catch (err) {
      console.error("Failed to update password:", err);
      setPasswordError("Failed to update password.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", false);
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!isLoggedIn || !user) {
    return (
      <p
        className="text-center mt-20 text-gray-600"
        style={{ fontFamily: "SUSE Mono" }}
      >
        You are not logged in.
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

        <div className="text-center mb-8">
          <p
            className="text-xl text-gray-800 mb-1"
            style={{ fontFamily: "SUSE Mono" }}
          >
            Name: {user.name || "Guest"}
          </p>
          <p
            className="text-lg text-gray-800"
            style={{ fontFamily: "SUSE Mono" }}
          >
            Email: {user.email || "Not logged in"}
          </p>
        </div>

        <button
          onClick={() => setPasswordModalOpen(true)}
          className="text-gray-500 py-2 px-4 mb-12 font-semibold border-b border-gray-500 hover:text-white hover:bg-black transition-colors duration-300 text-[0.7rem]"
          style={{ fontFamily: "SUSE Mono" }}
        >
          EDIT PASSWORD
        </button>

        <section className="w-full max-w-7xl mt-10 mb-16 pb-5">
          <h3
            className="text-3xl mb-8 text-gray-900 text-center"
            style={{ fontFamily: "Playfair Display" }}
          >
            My Orders
          </h3>

          {orders.length === 0 ? (
            <p
              className="text-gray-700 text-center"
              style={{ fontFamily: "SUSE Mono" }}
            >
              No orders yet.
            </p>
          ) : (
            <div className="grid gap-8">
              {orders.map((order, index) => (
                <div key={index} className="bg-white">
                  <p
                    className="text-gray-800 mb-4 text-sm"
                    style={{ fontFamily: "SUSE Mono" }}
                  >
                    Order Date:{" "}
                    <strong>
                      {new Date(order.date).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </strong>
                  </p>


                  <div className="divide-y divide-gray-200">
                    {order.items.map((item) => (
                      <div
                        key={item.id + item.size}
                        className="flex justify-between items-center py-3"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover"
                          />
                          <div>
                            <p
                              className="text-gray-900 pb-2 font-semibold"
                              style={{ fontFamily: "SUSE Mono" }}
                            >
                              {item.name}
                            </p>
                            <p
                              className="text-gray-600 text-sm"
                              style={{ fontFamily: "SUSE Mono" }}
                            >
                              Size: {item.size}
                            </p>
                            <p
                              className="text-gray-900 text-sm mt-1"
                              style={{ fontFamily: "SUSE Mono" }}
                            >
                              ₹{item.price}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col pb-1 items-end gap-2">
                          <p
                            className={`text-sm font-semibold ${item.status === "Delivered"
                                ? "text-green-500"
                                : item.status === "Canceled"
                                  ? "text-red-500"
                                  : "text-yellow-500"
                              }`}
                            style={{ fontFamily: "SUSE Mono" }}
                          >
                            {item.status || "Processing"}
                          </p>

                          <button
                            onClick={() => {
                              setOrderToCancel(order);
                              setItemToCancel(item);
                              setConfirmOpen(true);
                            }}
                            className="text-sm text-red-600 hover:text-red-800 pt-6 cursor-pointer transition"
                            style={{ fontFamily: "SUSE Mono" }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Cart & Wishlist Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-7xl text-center">
          <Link to="/cart" className="w-full">
            <button
              className="w-full text-gray-900 py-2 font-semibold border-b border-gray-800 hover:text-white hover:bg-black hover:cursor-pointer transition-colors duration-300 text-base"
              style={{ fontFamily: "SUSE Mono" }}
            >
              CART {cart.length}
            </button>
          </Link>

          <Link to="/wishlist" className="w-full">
            <button
              className="w-full text-gray-900 py-2 font-semibold border-b border-gray-800 hover:text-white hover:bg-black hover:cursor-pointer transition-colors duration-300 text-base"
              style={{ fontFamily: "SUSE Mono" }}
            >
              WISHLIST
            </button>
          </Link>
        </div>

        <button
          className="w-full mt-6 text-gray-900 py-2 font-semibold border-b border-gray-800 hover:text-white hover:bg-red-500 hover:border-red-500 hover:cursor-pointer transition-colors duration-300 text-base"
          style={{ fontFamily: "SUSE Mono" }}
          onClick={handleLogout}
        >
          LOG OUT
        </button>
      </header>

      {/* Cancel Confirmation Modal */}
      {confirmOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40"></div>
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-md p-8 shadow border border-gray-200">
              <h2
                className="text-2xl mb-4 text-gray-900 text-center"
                style={{ fontFamily: "Playfair Display" }}
              >
                Confirm Cancellation
              </h2>
              <p
                className="text-gray-700 mb-8 text-center text-sm"
                style={{ fontFamily: "SUSE Mono" }}
              >
                Are you sure you want to cancel{" "}
                <strong>{itemToCancel?.name}</strong> from your order?
              </p>
              <div className="flex justify-center gap-6">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="px-6 py-2 border-b border-gray-800 text-gray-900 font-semibold cursor-pointer hover:text-white hover:bg-black transition-colors duration-300 text-sm"
                  style={{ fontFamily: "SUSE Mono" }}
                >
                  NO
                </button>
                <button
                  onClick={cancelItem}
                  className="px-6 py-2 border-b border-gray-800 text-gray-900 font-semibold cursor-pointer hover:text-white hover:bg-red-500 hover:border-red-500 transition-colors duration-300 text-sm"
                  style={{ fontFamily: "SUSE Mono" }}
                >
                  YES, CANCEL
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Password Modal */}
      {passwordModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40"></div>
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-md p-8 shadow border border-gray-200">
              <h2
                className="text-2xl mb-4 text-gray-900 text-center"
                style={{ fontFamily: "Playfair Display" }}
              >
                Change Password
              </h2>
              <div className="flex flex-col pt-5 gap-4">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 border-b border-gray-300 text-gray-900 focus:outline-none focus:border-black"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border-b border-gray-300 text-gray-900 focus:outline-none focus:border-black"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border-b border-gray-300 text-gray-900 focus:outline-none focus:border-black"
                />
                {passwordError && (
                  <p
                    className="text-red-600 text-sm text-center"
                    style={{ fontFamily: "SUSE Mono" }}
                  >
                    {passwordError}
                  </p>
                )}
              </div>
              <div className="flex justify-center gap-6 mt-6">
                <button
                  onClick={() => {
                    setPasswordModalOpen(false);
                    setPasswordError("");
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmNewPassword("");
                  }}
                  className="px-6 py-2 border-b border-gray-800 text-gray-900 cursor-pointer font-semibold hover:text-white hover:bg-black transition-colors duration-300 text-sm"
                  style={{ fontFamily: "SUSE Mono" }}
                >
                  CANCEL
                </button>
                <button
                  onClick={updatePassword}
                  className="px-6 py-2 border-b border-gray-800 text-gray-900 cursor-pointer font-semibold hover:text-white hover:bg-red-500 hover:border-red-500 transition-colors duration-300 text-sm"
                  style={{ fontFamily: "SUSE Mono" }}
                >
                  UPDATE
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}
