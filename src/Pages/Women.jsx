import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../Components/NavBar.jsx";
import Footer from "../Components/Footer.jsx";
import { ToastContainer, toast } from "react-toastify";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";

export default function Women() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("View All");
  const [sortOrder, setSortOrder] = useState("default");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Load login status
  useEffect(() => {
    const loggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
    setIsLoggedIn(loggedIn);
  }, []);

  // Fetch products
  useEffect(() => {
    fetch("http://localhost:3001/products")
      .then((res) => res.json())
      .then((data) => {
        const womenProducts = data.filter((p) => p.category === "women");
        setProducts(womenProducts);
        const uniqueTypes = Array.from(new Set(womenProducts.map((p) => p.type)));
        setTypes(uniqueTypes);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  // Load logged-in user
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  // Toggle wishlist with toast
  const toggleWishlist = async (product) => {
    if (!isLoggedIn) {
      toast.warn("Please log in to use the wishlist!", { autoClose: 2000 });
      return;
    }

    const isInWishlist = user?.wishlist?.some((p) => p.id === product.id);
    const updatedWishlist = isInWishlist
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

        toast.success(
          isInWishlist
            ? "Removed from wishlist 💔"
            : "Added to wishlist ❤️",
          { autoClose: 2000 }
        );
      } else {
        toast.error("Something went wrong. Try again!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update wishlist.");
    }
  };

  if (loading) return <p className="text-center mt-12">Loading...</p>;

  // Filter by selected type
  const displayedProducts =
    selectedType === "View All"
      ? products
      : products.filter((p) => p.type === selectedType);

  // Sort products
  const sortedProducts = [...displayedProducts].sort((a, b) => {
    switch (sortOrder) {
      case "price inc":
        return a.price - b.price;
      case "price dec":
        return b.price - a.price;
      default:
        return types.indexOf(a.type) - types.indexOf(b.type);
    }
  });

  const handleSortClick = () => {
    setSortOrder(
      sortOrder === "default"
        ? "price inc"
        : sortOrder === "price inc"
        ? "price dec"
        : "default"
    );
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-white">
      <NavBar />
      <ToastContainer position="top-center" theme="dark" />

      <header className="max-w-7xl mx-auto px-6 py-8 pt-28">
        <h1
          className="text-6xl mb-12 text-gray-900 text-center z-10"
          style={{ fontFamily: "Playfair Display" }}
        >
          WOMEN'S COLLECTION
        </h1>
      </header>

      <div className="flex flex-wrap justify-center gap-4 mt-16 mb-12 pl-5">
        <button
          onClick={() => setSelectedType("View All")}
          className={`text-xs uppercase cursor-pointer transition ${
            selectedType === "View All"
              ? "text-black font-semibold"
              : "text-gray-600 hover:text-black"
          }`}
          style={{ fontFamily: "SUSE Mono" }}
        >
          View All
        </button>

        {types.map((type, i) => (
          <button
            key={i}
            onClick={() => setSelectedType(type)}
            className={`text-xs uppercase cursor-pointer transition ${
              selectedType === type
                ? "text-black font-semibold"
                : "text-gray-600 hover:text-black"
            }`}
            style={{ fontFamily: "SUSE Mono" }}
          >
            {type}
          </button>
        ))}

        <button
          className="uppercase text-xs font-bold cursor-pointer pl-7 group relative w-[93px] h-[20px] flex items-center justify-center overflow-hidden"
          style={{ fontFamily: "SUSE Mono" }}
          onClick={handleSortClick}
        >
          <span className="absolute group-hover:opacity-0 transition-all duration-300 ease-in-out">
            Sort
          </span>
          <span className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
            {sortOrder}
          </span>
        </button>
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => {
            const isInWishlist = user?.wishlist?.some(
              (p) => p.id === product.id
            );
            return (
              <div
                key={product.id}
                className="bg-white overflow-hidden group transition-all duration-300"
              >
                <div
                  className="overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/women/${product.id}`)}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full object-contain transform transition-transform duration-500 ease-in-out group-hover:scale-105"
                  />
                </div>

                <div className="p-1 flex items-center justify-between">
                  <div className="text-left">
                    <h2
                      className="text-[9px] md:text-[10px] uppercase cursor-pointer"
                      style={{
                        fontFamily: "SUSE Mono",
                        fontWeight: "normal",
                      }}
                    >
                      {product.name}
                    </h2>
                    <p
                      className="text-[9px] md:text-[10px] uppercase text-gray-800 cursor-pointer"
                      style={{
                        fontFamily: "SUSE Mono",
                        fontWeight: "normal",
                      }}
                    >
                      ₹ {product.price}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleWishlist(product)}
                    disabled={!isLoggedIn}
                    className={`transition text-[10px] md:text-[12px] cursor-pointer ${
                      isLoggedIn
                        ? "text-red-600 hover:text-red-800"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isInWishlist ? <MdFavorite /> : <MdFavoriteBorder />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
