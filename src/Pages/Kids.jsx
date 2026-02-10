import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../Components/NavBar.jsx";
import Footer from "../Components/Footer.jsx";

export default function Kids() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = JSON.parse(localStorage.getItem('isLoggedIn'))

    setIsLoggedIn(loggedIn)
  }, [])

  useEffect(() => {
    fetch("http://localhost:3001/kids")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data)
        setLoading(false)
      }
    )
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) setUser(loggedInUser);
  }, []);

  const toggleWishlist = async (product) => {
    if (!user) return;

    const isInWishlist = user.wishlist?.some(
      (p) => p.id === product.id && p.category === "kids"
    );

    const updatedWishlist = isInWishlist
      ? user.wishlist.filter(
          (p) => !(p.id === product.id && p.category === "kids")
        )
      : [...(user.wishlist || []), { ...product, category: "kids" }];

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
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-12">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col relative bg-white">
      <NavBar />

      <header className="max-w-7xl mx-auto px-6 py-8 pt-28">
        <h1
          className="text-6xl mb-12 text-gray-900 text-center z-10"
          style={{ fontFamily: "Playfair Display" }}
        >
          KID'S COLLECTION
        </h1>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const isInWishlist = user?.wishlist?.some(
              (p) => p.id === product.id && p.category === "kids"
            );
            return (
              <div
                key={product.id}
                className="bg-white overflow-hidden group transition-all duration-300"
              >
                <div
                  className="overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/kids/${product.id}`)}
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
                      style={{ fontFamily: "SUSE Mono", fontWeight: "normal" }}
                    >
                      {product.name}
                    </h2>
                    <p
                      className="text-[9px] md:text-[10px] uppercase text-gray-800 cursor-pointer"
                      style={{ fontFamily: "SUSE Mono", fontWeight: "normal" }}
                    >
                      ₹ {product.price}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleWishlist(product)}
                    disabled={!isLoggedIn}
                    className={`transition text-[10px] md:text-[12px] cursor-pointer ${
                      isInWishlist
                        ? "text-green-600 hover:text-green-800"
                        : isLoggedIn
                        ? "text-red-600 hover:text-red-800"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isInWishlist ? "⩗" : "⋈"}
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
