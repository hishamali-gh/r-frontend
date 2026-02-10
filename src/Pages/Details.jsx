import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../Components/NavBar.jsx";
import Footer from "../Components/Footer.jsx";
import { toast } from "react-toastify";
import { PiShoppingCartSimpleFill, PiShoppingCartSimple } from "react-icons/pi";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";

export default function Details() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isInCart, setIsInCart] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
    setIsLoggedIn(loggedIn);
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);

    fetch("http://localhost:3001/products")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p) => p.id === id);
        if (!found) throw new Error("Product not found");
        setProduct(found);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const toggleWishlist = async () => {
    if (!isLoggedIn) return toast.warning("Please log in first!");
    if (!user || !product) return;

    const inWishlist = user.wishlist?.some((p) => p.id === product.id);
    const updatedWishlist = inWishlist
      ? user.wishlist.filter((p) => p.id !== product.id)
      : [...(user.wishlist || []), product];

    try {
      const res = await fetch(`http://localhost:3001/user/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wishlist: updatedWishlist }),
      });
      if (res.ok) {
        const updatedUser = { ...user, wishlist: updatedWishlist };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        if (inWishlist) {
          toast.info("Removed from wishlist!");
        } else {
          console.log('toast pushed')
          toast.success("Added to wishlist!");
        }
      } else {
        toast.error("Something went wrong while updating wishlist!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while updating wishlist!");
    }
  };

  const toggleCart = async () => {
    if (!isLoggedIn) return toast.warning("Please log in first!");
    if (!selectedSize) return toast.error("Please select a size first!");
    if (!user || !product) return;

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      image: product.images[0],
      category: product.category,
      type: product.type,
      quantity: 1,
    };

    const exists = user.cart?.some(
      (item) => item.id === product.id && item.size === selectedSize
    );

    const updatedCart = exists
      ? user.cart.filter(
          (item) => !(item.id === product.id && item.size === selectedSize)
        )
      : [...(user.cart || []), cartItem];

    try {
      const res = await fetch(`http://localhost:3001/user/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: updatedCart }),
      });
      if (res.ok) {
        const updatedUser = { ...user, cart: updatedCart };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsInCart(!exists);

        if (exists) {
          toast.info("Removed from cart!");
        } else {
          toast.success("Added to cart!");
        }
      } else {
        toast.error("Something went wrong while updating cart!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while updating cart!");
    }
  };

  useEffect(() => {
    if (user && product && selectedSize) {
      const exists = user.cart?.some(
        (item) => item.id === product.id && item.size === selectedSize
      );
      setIsInCart(exists);
    }
  }, [user, product, selectedSize]);

  if (!product) return <p className="text-center mt-20">Loading...</p>;

  const isInWishlist = user?.wishlist?.some((p) => p.id === product.id);
  const sizes = ["XS", "S", "M", "L", "XL"];

  return (
    <div className="min-h-screen flex flex-col relative bg-white">
      <NavBar />

      <main className="flex-grow max-w-7xl mx-auto px-6 pb-12 flex flex-col md:flex-row gap-6 pt-28">
        <div className="flex-1">
          <img
            src={product.images[0]}
            alt={product.name || "Product Image"}
            className="w-full object-contain"
          />
        </div>

        <div className="flex-1 flex flex-col justify-start space-y-4">
          <h2
            className="text-gray-900 uppercase text-xl"
            style={{ fontFamily: "SUSE Mono", fontWeight: "bold" }}
          >
            {product.name}
          </h2>

          <p
            className="text-gray-800 text-lg"
            style={{ fontFamily: "SUSE Mono" }}
          >
            {product.description || "No description available."}
          </p>

          <div className="flex space-x-2 mt-2">
            {sizes.map((size) => (
              <span
                key={size}
                onClick={() => {
                  setSelectedSize((prev) => (prev === size ? null : size));
                  setSizeError(false);
                }}
                className={`px-3 py-1 border text-gray-800 cursor-pointer transition ${
                  selectedSize === size
                    ? "bg-gray-800 text-white border-gray-800"
                    : "border-gray-400 hover:bg-gray-200"
                }`}
                style={{ fontFamily: "SUSE Mono", fontSize: "0.875rem" }}
              >
                {size}
              </span>
            ))}
          </div>

          <p
            className="text-gray-900 text-xl font-semibold mt-2"
            style={{ fontFamily: "SUSE Mono" }}
          >
            ₹ {product.price}
          </p>

          <button
            onClick={toggleWishlist}
            disabled={!isLoggedIn}
            className={`w-48 py-2 font-semibold border-b border-gray-800 text-base flex items-center justify-center gap-2 cursor-pointer transition-colors duration-300 ${
              isInWishlist
                ? "bg-red-600 text-white border-b-0 hover:bg-red-700"
                : "text-gray-900 hover:bg-red-600 hover:text-white hover:border-b-0"
            } ${!isLoggedIn ? "opacity-50 cursor-not-allowed" : ""}`}
            style={{ fontFamily: "SUSE Mono" }}
          >
            {isInWishlist ? <><MdFavorite /> In Wishlist</> : <><MdFavoriteBorder /> Add to Wishlist</>}
          </button>

          <button
            onClick={toggleCart}
            disabled={!isLoggedIn}
            className={`w-48 py-2 font-semibold border-b border-gray-800 text-base flex items-center justify-center gap-2 cursor-pointer transition-colors duration-300 ${
              isInCart
                ? "bg-black text-white border-b-0 hover:bg-gray-700"
                : "text-gray-900 hover:bg-black hover:text-white hover:border-b-0"
            } ${!isLoggedIn ? "opacity-50 cursor-not-allowed" : ""}`}
            style={{ fontFamily: "SUSE Mono" }}
          >
            {isInCart ? <><PiShoppingCartSimpleFill /> In Cart</> : <><PiShoppingCartSimple /> Add to Cart</>}
          </button>

          {!isLoggedIn && (
            <p
              className="text-red-500 text-xs mt-1"
              style={{ fontFamily: "SUSE Mono" }}
            >
              *Please log in first
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
