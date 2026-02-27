import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../Components/NavBar.jsx";
import Footer from "../Components/Footer.jsx";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import API from "../api.jsx";
import { AuthContext } from "../Components/AuthContext.jsx";

export default function Kids() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  const { user, loading } = useContext(AuthContext);

  const navigate = useNavigate();

  // Fetch Kids Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get("/products/products/", {
          params: { category: "KIDS" },
        });

        setProducts(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setPageLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch Wishlist only if logged in
  useEffect(() => {
    if (!user) {
      setWishlist([]);
      return;
    }

    const fetchWishlist = async () => {
      try {
        const res = await API.get("/wishlist/wishlist/");
        setWishlist(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (product) => {
    if (!user) return;

    const existingItem = wishlist.find(
      (item) => item.product === product.id
    );

    try {
      if (existingItem) {
        await API.delete(`/wishlist/wishlist/${existingItem.id}/`);
        setWishlist((prev) =>
          prev.filter((item) => item.id !== existingItem.id)
        );
      } else {
        const res = await API.post("/wishlist/wishlist/", {
          product: product.id,
        });
        setWishlist((prev) => [...prev, res.data]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Wait for both auth + products
  if (loading || pageLoading) {
    return <p className="text-center mt-12">Loading...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />

      <header className="max-w-7xl mx-auto px-6 py-8 pt-28">
        <h1
          className="text-6xl mb-12 text-gray-900 text-center"
          style={{ fontFamily: "Playfair Display" }}
        >
          KID'S COLLECTION
        </h1>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const isInWishlist = wishlist.some(
              (item) => item.product === product.id
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
                    src={product.images[0]?.url}
                    alt={product.name}
                    className="w-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-2 flex items-center justify-between">
                  <div>
                    <h2 className="text-xs uppercase">
                      {product.name}
                    </h2>
                    <p className="text-xs text-gray-800">
                      ₹ {product.price}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleWishlist(product)}
                    disabled={!user}
                    className={`text-lg ${
                      isInWishlist
                        ? "text-red-600"
                        : user
                        ? "text-gray-400 hover:text-red-600"
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