import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../Components/NavBar.jsx";
import Footer from "../Components/Footer.jsx";
import { toast } from "react-toastify";
import { PiShoppingCartSimpleFill, PiShoppingCartSimple } from "react-icons/pi";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import API from "../api.jsx";
import { AuthContext } from "../Components/AuthContext.jsx";

export default function Details() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`products/products/${id}/`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
      } finally {
        setPageLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!user) {
      setWishlist([]);
      setCartItems([]);
      return;
    }

    const fetchData = async () => {
      try {
        const [wishlistRes, cartRes] = await Promise.all([
          API.get("wishlist/wishlist/"),
          API.get("cart/cart/"),
        ]);

        setWishlist(wishlistRes.data);
        setCartItems(cartRes.data.items || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [user]);

  const variants = product?.variants || [];

  const selectedVariant = variants.find(
    (v) => v.size.value === selectedSize
  );

  const getDisplayPrice = () => {
    if (selectedVariant) {
      return selectedVariant.price || product.price;
    }

    const available = variants.filter((v) => v.stock > 0);

    if (!available.length) return product.price;

    return Math.min(
      ...available.map((v) => v.price || product.price)
    );
  };

  const isInWishlist = wishlist.some(
    (item) => item.product === product?.id
  );

  const toggleWishlist = async () => {
    if (!user) {
      toast.warning("Please log in first!");
      return;
    }

    try {
      if (isInWishlist) {
        const item = wishlist.find(
          (w) => w.product === product.id
        );

        await API.delete(`wishlist/wishlist/${item.id}/`);

        setWishlist((prev) =>
          prev.filter((w) => w.id !== item.id)
        );

        toast.info("Removed from wishlist!");
      } else {
        const res = await API.post("wishlist/wishlist/", {
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
    if (!user) {
      toast.warning("Please log in first!");
      return;
    }

    if (!selectedSize) {
      toast.error("Please select a size first!");
      return;
    }

    if (!selectedVariant || selectedVariant.stock === 0) {
      toast.error("Selected size is out of stock");
      return;
    }

    try {
      if (isInCart) {
        const item = cartItems.find(
          (c) =>
            c.product === product.id &&
            c.size === selectedSize
        );

        await API.delete(`cart/cart/${item.id}/`);

        setCartItems((prev) =>
          prev.filter((c) => c.id !== item.id)
        );

        toast.info("Removed from cart!");
      } else {
        const res = await API.post("cart/cart/", {
          product: product.id,
          size: selectedVariant.size.value,
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

  if (loading || pageLoading || !product) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />

      <main className="flex-grow max-w-7xl mx-auto px-6 pb-12 flex flex-col md:flex-row gap-6 pt-28">
        <div className="flex-1">
          <img
            src={product.images[0]?.url}
            alt={product.name}
            className="w-full object-contain"
          />
        </div>

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

          {/* ✅ Dynamic Sizes */}
          <div className="flex space-x-2 mt-2">
            {variants.map((v) => {
              const isOutOfStock = v.stock === 0;

              return (
                <span
                  key={v.id}
                  onClick={() => {
                    if (isOutOfStock) return;
                    setSelectedSize(
                      selectedSize === v.size.value
                        ? null
                        : v.size.value
                    );
                  }}
                  className={`px-3 py-1 border transition ${
                    isOutOfStock
                      ? "border-gray-200 text-gray-300 cursor-not-allowed"
                      : selectedSize === v.size.value
                      ? "bg-gray-800 text-white cursor-pointer"
                      : "border-gray-400 hover:bg-gray-200 cursor-pointer"
                  }`}
                >
                  {v.size.value}
                </span>
              );
            })}
          </div>

          {/* ✅ Dynamic Price */}
          <p
            className="text-gray-900 text-xl font-semibold mt-2"
            style={{ fontFamily: "SUSE Mono" }}
          >
            ₹ {Number(getDisplayPrice()).toFixed(2)}
          </p>

          <button
            onClick={toggleWishlist}
            disabled={!user}
            className={`w-48 py-2 font-semibold border-b border-gray-800 flex items-center justify-center gap-2 transition ${
              isInWishlist
                ? "bg-red-600 text-white"
                : "hover:bg-red-600 hover:text-white"
            } ${!user && "opacity-50 cursor-not-allowed"}`}
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

          <button
            onClick={toggleCart}
            disabled={!user}
            className={`w-48 py-2 font-semibold border-b border-gray-800 flex items-center justify-center gap-2 transition ${
              isInCart
                ? "bg-black text-white"
                : "hover:bg-black hover:text-white"
            } ${!user && "opacity-50 cursor-not-allowed"}`}
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

          {!user && (
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
