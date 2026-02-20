import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../Components/NavBar.jsx';
import Footer from '../Components/Footer.jsx';
import { ToastContainer, toast } from 'react-toastify';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import API from '../api.jsx';

export default function Men() {
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
        const params = { category: 'MEN' };

        if (sortOrder === 'price inc') params.ordering = 'price';
        if (sortOrder === 'price dec') params.ordering = '-price';

        const response = await API.get('/products/products/', { params });

        setProducts(response.data);

        const uniqueTypes = [
          ...new Set(response.data.map((p) => p.product_type)),
        ];

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

  // 🔥 Normalize product ID safely
  const getProductId = (item) => {
    if (typeof item.product === 'object') return item.product.id;
    return item.product;
  };

  const toggleWishlist = async (product) => {
    if (!isLoggedIn) {
      toast.warn('Please log in to use the wishlist!', { autoClose: 2000 });
      return;
    }

    const existingItem = wishlist.find(
      (item) => getProductId(item) === product.id
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

  const getSortLabel = () => {
    if (sortOrder === 'price inc') return 'Price ↑';
    if (sortOrder === 'price dec') return 'Price ↓';
    return 'Default';
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

      <header className='max-w-7xl mx-auto px-6 py-8 pt-28'>
        <h1
          className='text-6xl mb-12 text-gray-900 text-center'
          style={{ fontFamily: 'Playfair Display' }}
        >
          MEN'S COLLECTION
        </h1>
      </header>

      <div className='flex flex-wrap justify-center gap-4 mt-8 mb-12'>
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

        <button
          className='uppercase text-xs font-bold transition-all duration-200'
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
          {isSortHovered ? getSortLabel() : 'Sort'}
        </button>
      </div>

      <main className='flex-grow max-w-7xl mx-auto px-6 pb-12'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {displayedProducts.map((product) => {
            const isInWishlist = wishlist.some(
              (item) => getProductId(item) === product.id
            );

            return (
              <div key={product.id} className='bg-white group'>
                <div
                  className='overflow-hidden cursor-pointer'
                  onClick={() => navigate(`/men/${product.id}`)}
                >
                  <img
                    src={product.images[0]?.url}
                    alt={product.name}
                    className='w-full object-contain group-hover:scale-105 transition-transform duration-500'
                  />
                </div>

                <div className='p-2 flex items-center justify-between'>
                  <div>
                    <h2 className='text-xs uppercase'>
                      {product.name}
                    </h2>
                    <p className='text-xs text-gray-800'>
                      ₹ {product.price}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`text-lg ${
                      isInWishlist
                        ? 'text-red-600'
                        : 'text-gray-400 hover:text-red-600'
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
