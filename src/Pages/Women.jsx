import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../Components/NavBar.jsx';
import Footer from '../Components/Footer.jsx';
import { ToastContainer, toast } from 'react-toastify';
import { MdFavorite } from 'react-icons/md';
import API from '../api.jsx';

export default function Women() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('View All');
  const [sortOrder, setSortOrder] = useState('default');
  const [isSortHovered, setIsSortHovered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = { category: 'WOMEN' };

        if (sortOrder === 'price inc') params.ordering = 'price';
        if (sortOrder === 'price dec') params.ordering = '-price';

        const response = await API.get('/products/products/', { params });

        setProducts(response.data);

        // Stable sorted types
        const uniqueTypes = [
          ...new Set(response.data.map((p) => p.product_type)),
        ].sort();

        setTypes(uniqueTypes);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, [sortOrder]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchWishlist = async () => {
      try {
        const res = await API.get('/wishlist/wishlist/');
        setWishlist(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchWishlist();
  }, [isLoggedIn]);

  const toggleWishlist = async (product) => {
    if (!isLoggedIn) {
      toast.warn('Please log in to use the wishlist!', { autoClose: 2000 });
      return;
    }

    const existingItem = wishlist.find(
      (item) => item.product === product.id
    );

    try {
      if (existingItem) {
        await API.delete(`/wishlist/wishlist/${existingItem.id}/`);
        setWishlist((prev) =>
          prev.filter((item) => item.id !== existingItem.id)
        );
        toast.success('Removed from wishlist', { autoClose: 2000 });
      } else {
        const res = await API.post('/wishlist/wishlist/', {
          product: product.id,
        });
        setWishlist((prev) => [...prev, res.data]);
        toast.success('Added to wishlist', { autoClose: 2000 });
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong.');
    }
  };

  if (loading) return <p className='text-center mt-12'>Loading...</p>;

  const displayedProducts =
    selectedType === 'View All'
      ? products
      : products.filter((p) => p.product_type === selectedType);

  return (
    <div className='min-h-screen flex flex-col bg-white'>
      <NavBar />
      <ToastContainer position='top-center' theme='dark' />

      {/* Header */}
      <header className='max-w-7xl mx-auto px-6 py-8 pt-28'>
        <h1
          className='text-6xl mb-12 text-gray-900 text-center'
          style={{ fontFamily: 'Playfair Display' }}
        >
          WOMEN'S COLLECTION
        </h1>
      </header>

      {/* Filters + Sort (shifted slightly right) */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="w-full flex flex-wrap items-center gap-6 pl-10">
          <button
            onClick={() => setSelectedType('View All')}
            className={`text-xs uppercase ${
              selectedType === 'View All'
                ? 'text-black font-semibold'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            View All
          </button>

          {types.map((type, i) => (
            <button
              key={i}
              onClick={() => setSelectedType(type)}
              className={`text-xs uppercase ${
                selectedType === type
                  ? 'text-black font-semibold'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              {type}
            </button>
          ))}

          {/* Smooth sort crossfade */}
          <button
            className="relative uppercase text-xs font-bold w-24 text-center"
            onMouseEnter={() => setIsSortHovered(true)}
            onMouseLeave={() => setIsSortHovered(false)}
            onClick={() =>
              setSortOrder(
                sortOrder === 'default'
                  ? 'price inc'
                  : sortOrder === 'price inc'
                  ? 'price dec'
                  : 'default'
              )
            }
          >
            <span
              className={`transition-opacity duration-300 ${
                isSortHovered ? 'opacity-0' : 'opacity-100'
              }`}
            >
              Sort
            </span>

            <span
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                isSortHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {sortOrder === 'price inc'
                ? 'Price inc'
                : sortOrder === 'price dec'
                ? 'Price dec'
                : 'Default'}
            </span>
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <main className='flex-grow max-w-7xl mx-auto px-6 pb-12'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {displayedProducts.map((product) => {
            const isInWishlist = wishlist.some(
              (item) => item.product === product.id
            );

            return (
              <div key={product.id} className='bg-white'>

                {/* Image hover isolated */}
                <div
                  className='overflow-hidden cursor-pointer group'
                  onClick={() => navigate(`/women/${product.id}`)}
                >
                  <img
                    src={product.images[0]?.url}
                    alt={product.name}
                    className='w-full object-contain transition-transform duration-500 group-hover:scale-105'
                  />
                </div>

                <div className='p-2 flex items-start justify-between gap-2'>
                  <div className="flex-1 min-w-0">
                    <h2 className='text-xs uppercase truncate'>
                      {product.name}
                    </h2>
                    <p className='text-xs text-gray-800 mt-1'>
                      ₹ {product.price}
                    </p>
                  </div>

                  {/* Smooth single-icon wishlist */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className='inline-flex items-start justify-center pt-1 flex-shrink-0 group'
                  >
                    <MdFavorite
                      className={`
                        w-4 h-4 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                        transform
                        ${isInWishlist
                          ? 'text-red-600 scale-100 opacity-100'
                          : 'text-gray-300 scale-95 opacity-70 group-hover:text-red-600 group-hover:scale-110 group-hover:opacity-100'}
                      `}
                    />
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