import { Link } from "react-router-dom";
import "../index.css";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import { useEffect, useState } from "react";

export default function Home() {
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3001/products");
        const data = await response.json();

        const latest = data
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 7);

        setNewArrivals(latest);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar className="fixed" />

      <section className="py-16 mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <h3
            className="text-3xl text-gray-800 mb-6 text-center uppercase tracking-wide"
            style={{ fontFamily: "Playfair Display" }}
          >
            New Arrivals
          </h3>

          <div className="flex gap-6 overflow-x-auto scrollbar-hide py-4">
            {newArrivals.map((product) => (
              <Link
                key={product._id || product.id}
                to={`/products/${product._id || product.id}`}
                className="flex-shrink-0 w-80 hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={product.images}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <header>
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center">
          <div className="flex-1 mt-10 mb-22 md:mt-0">
            <img
              src="https://static.zara.net/assets/public/6e2b/b20f/7d534a25bbb9/1ac8b24b9d1d/image-web-f0860561-5d53-4ea9-8d9f-f8056b65fe78-default/image-web-f0860561-5d53-4ea9-8d9f-f8056b65fe78-default.jpg?ts=1753711361952&w=1634"
              alt="Fashion Banner"
            />
          </div>
          <div className="flex-1 mt-10 mb-22 md:mt-0">
            <img
              src="https://static.zara.net/assets/public/c16b/55ea/d96f49e8bce1/e8cb842f029e/08946839612-a2/08946839612-a2.jpg?ts=1759743706257&w=1663"
              alt="Fashion Banner"
            />
          </div>
          <div className="flex-1 mt-10 md:mt-0">
            <img
              src="https://static.zara.net/assets/public/ec46/47d2/68804bd1bcc4/5927b3fb2369/aw25-north-man-jackets-subhome-xmedia-40-puffer-landscape_0/poster/poster.jpg?ts=1759436504232"
              alt="Fashion Banner"
            />
          </div>
          <div className="flex-1 mt-10 md:mt-0">
            <img
              src="https://static.zara.net/assets/public/4680/36fe/ed7744e08659/21b19d75fda4/08833062505-1-p/08833062505-1-p.jpg?ts=1759489048055&w=1753"
              alt="Fashion Banner"
            />
          </div>
        </div>
      </header>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h3
            className="text-3xl text-center text-gray-800 mb-10 uppercase"
            style={{ fontFamily: "Playfair Display" }}
          >
            Shop by Category
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              {
                link: "/men",
                img: "https://static.zara.net/assets/public/0adb/fa31/b6e54d87b5eb/5b36638e6524/04024159807-p/04024159807-p.jpg?ts=1751011686714&amp;w=710",
                label: "MEN",
              },
              {
                link: "/women",
                img: "https://static.zara.net/assets/public/fade/d164/e3134f179992/f91e510d3dea/08851450050-p/08851450050-p.jpg?ts=1756997867718&amp;w=710",
                label: "WOMEN",
              },
              {
                link: "/kids",
                img: "https://static.zara.net/assets/public/e1cd/ba96/8b904cb58a4c/ba578985d43f/01473587712500-p/01473587712500-p.jpg?ts=1758192089017&amp;w=710",
                label: "KIDS",
              },
            ].map((cat) => (
              <Link key={cat.label} to={cat.link} className="relative group overflow-hidden cursor-pointer">
                <img
                  src={cat.img}
                  alt={`${cat.label} Fashion`}
                  className="w-full object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-105"
                />
                <h4 className="absolute bottom-4 left-4 text-xl font-bold text-white">
                  {cat.label}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
