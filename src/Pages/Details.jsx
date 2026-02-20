import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../Components/NavBar.jsx";
import Footer from "../Components/Footer.jsx";
import { toast } from "react-toastify";
import { PiShoppingCartSimpleFill, PiShoppingCartSimple } from "react-icons/pi";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import API from "../api.jsx";

export default function Details() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);

  const token = localStorage.getItem("access");
  const isLoggedIn = !!token;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`products/products/${id}/`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchWishlist = async () => {
      try {
        const res = await API.get("/wishlist/");
        setWishlist(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchCart = async () => {
      try {
        const res = await API.get("/cart/");
        setCartItems(res.data.items || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchWishlist();
    fetchCart();
  }, [isLoggedIn]);

  const isInWishlist = wishlist.some(
    (item) => item.product === product?.id
  );

  const toggleWishlist = async () => {
    if (!isLoggedIn) {
      toast.warning("Please log in first!");
      return;
    }

    try {
      if (isInWishlist) {
        const item = wishlist.find(
          (w) => w.product === product.id
        );
        await API.delete(`/wishlist/${item.id}/`);
        setWishlist((prev) =>
          prev.filter((w) => w.id !== item.id)
        );
        toast.info("Removed from wishlist!");
      } else {
        const res = await API.post("/wishlist/", {
          product: product.id,
        });
        setWishlist((prev) => [...prev, res.data]);
        toast.success("Added to wishlist!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Wishlist action failed");
    }
  };

  const isInCart = cartItems.some(
    (item) =>
      item.product === product?.id &&
      item.size === selectedSize
  );

  const toggleCart = async () => {
    if (!isLoggedIn) {
      toast.warning("Please log in first!");
      return;
    }

    if (!selectedSize) {
      toast.error("Please select a size first!");
      return;
    }

    try {
      if (isInCart) {
        const item = cartItems.find(
          (c) =>
            c.product === product.id &&
            c.size === selectedSize
        );
        await API.delete(`/cart/${item.id}/`);
        setCartItems((prev) =>
          prev.filter((c) => c.id !== item.id)
        );
        toast.info("Removed from cart!");
      } else {
        const res = await API.post("/cart/", {
          product: product.id,
          size: selectedSize,
          quantity: 1,
        });
        setCartItems((prev) => [...prev, res.data]);
        toast.success("Added to cart!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Cart action failed");
    }
  };

  if (!product)
    return <p className="text-center mt-20">Loading...</p>;

  const sizes = ["XS", "S", "M", "L", "XL"];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />

      <main className="flex-grow max-w-7xl mx-auto px-6 pb-12 flex flex-col md:flex-row gap-6 pt-28">
        {/* Product Image */}
        <div className="flex-1">
          <img
            src={product.images[0]?.url}
            alt={product.name}
            className="w-full object-contain"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col space-y-4">
          <h2
            className="text-gray-900 uppercase text-xl font-bold"
            style={{ fontFamily: "SUSE Mono" }}
          >
            {product.name}
          </h2>

          <p
            className="text-gray-800 text-lg"
            style={{ fontFamily: "SUSE Mono" }}
          >
            {product.description || "No description available."}
          </p>

          {/* Sizes */}
          <div className="flex space-x-2 mt-2">
            {sizes.map((size) => (
              <span
                key={size}
                onClick={() =>
                  setSelectedSize(
                    selectedSize === size ? null : size
                  )
                }
                className={`px-3 py-1 border cursor-pointer transition ${
                  selectedSize === size
                    ? "bg-gray-800 text-white"
                    : "border-gray-400 hover:bg-gray-200"
                }`}
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

          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            disabled={!isLoggedIn}
            className={`w-48 py-2 font-semibold border-b border-gray-800 flex items-center justify-center gap-2 transition ${
              isInWishlist
                ? "bg-red-600 text-white"
                : "hover:bg-red-600 hover:text-white"
            } ${!isLoggedIn && "opacity-50 cursor-not-allowed"}`}
          >
            {isInWishlist ? (
              <>
                <MdFavorite /> In Wishlist
              </>
            ) : (
              <>
                <MdFavoriteBorder /> Add to Wishlist
              </>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={toggleCart}
            disabled={!isLoggedIn}
            className={`w-48 py-2 font-semibold border-b border-gray-800 flex items-center justify-center gap-2 transition ${
              isInCart
                ? "bg-black text-white"
                : "hover:bg-black hover:text-white"
            } ${!isLoggedIn && "opacity-50 cursor-not-allowed"}`}
          >
            {isInCart ? (
              <>
                <PiShoppingCartSimpleFill /> In Cart
              </>
            ) : (
              <>
                <PiShoppingCartSimple /> Add to Cart
              </>
            )}
          </button>

          {!isLoggedIn && (
            <p className="text-red-500 text-xs">
              *Please log in first
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
