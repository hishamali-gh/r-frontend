import { Link } from "react-router-dom";
import "../index.css";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import Sidebar from "../Components/Sidebar";
import { useEffect, useState } from "react";
import API from '../api.jsx';

export default function Home() {
  const [menProducts, setMenProducts] = useState([]);
  const [womenProducts, setWomenProducts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get("products/products/");
        setMenProducts(data.filter(p => p.category === "MEN").slice(0, 7));
        setWomenProducts(data.filter(p => p.category === "WOMEN").slice(0, 7));
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <style>
        {`
          html, body, .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
          html::-webkit-scrollbar, body::-webkit-scrollbar, .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}
      </style>

      <NavBar toggle={() => setMenuOpen(!menuOpen)} menuOpen={menuOpen} />

      <div className={`fixed top-12 left-0 h-[calc(100vh-4rem)] w-64 bg-white/50 backdrop-blur-md border-r border-gray-300/40 z-40 transform transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Sidebar />
      </div>

      <div className={`transition-all pt-1 duration-300 flex-grow ${menuOpen ? "ml-64" : "ml-0"}`}>
        <main className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 pt-32">
          
          <section className="pb-36">
            <img 
              src="https://static.zara.net/assets/public/4d70/4bac/a2a944839320/8f94ab005430/image-landscape-fill-cc5cf47c-f3e3-4a6f-a845-6ba6cc446bdc-default_0/image-landscape-fill-cc5cf47c-f3e3-4a6f-a845-6ba6cc446bdc-default_0.jpg?ts=1775474287637&w=1920" 
              className="w-full h-auto object-cover" alt="Hero"
            />
          </section>

          <section className="pb-36">
            <div className="flex gap-6 overflow-x-auto scrollbar-hide">
              {menProducts.map((p) => (
                <Link key={p.id} to={`/products/${p.id}`} className="flex-shrink-0">
                  <img src={p.images?.[0]?.url} className="w-64 md:w-80 h-[450px] object-cover" alt={p.name} />
                </Link>
              ))}
              <div className="w-6 flex-shrink-0" />
            </div>
          </section>

          <section className="pb-36 grid grid-cols-2 gap-6 lg:gap-10">
            <img src="https://static.zara.net/assets/public/779e/efd9/6b05420b9228/b72425909b8d/03920171710-a5/03920171710-a5.jpg?ts=1775552278166&w=743" className="w-full aspect-[3/4] object-cover" alt="Feature 1" />
            <img src="https://static.zara.net/assets/public/bd92/9cf9/f0504466b097/8adf508168c8/03920171710-p/03920171710-p.jpg?ts=1775552278236&w=743" className="w-full aspect-[3/4] object-cover" alt="Feature 2" />
          </section>

          <section className="pb-10">
            <div className="flex gap-6 overflow-x-auto scrollbar-hide">
              {womenProducts.map((p) => (
                <Link key={p.id} to={`/products/${p.id}`} className="flex-shrink-0">
                  <img src={p.images?.[0]?.url} className="w-64 md:w-80 h-[450px] object-cover" alt={p.name} />
                </Link>
              ))}
              <div className="w-6 flex-shrink-0" />
            </div>
          </section>
        </main>
      </div>

      <div className="">
        <Footer />
      </div>
    </div>
  );
}
