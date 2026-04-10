import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api.jsx';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await API.get(`/products/products/?search=${debouncedQuery}`);
        const data = res.data.results || res.data;

        const activeSuggestions = data.filter((item) => item.is_active === true);
        setSuggestions(activeSuggestions);
      } catch (err) {
        console.error('Search error:', err);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  function handleNavigate(item) {
    setQuery('');
    setSuggestions([]);
    navigate(`/${item.category}/${item.id}`);
  }

  return (
    <div className='pt-5 relative w-full max-w-md'>
      <div className='flex items-center border-b border-gray-400 focus-within:border-black transition'>
        <input
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='SEARCH...'
          className='w-full px-1 py-2 focus:outline-none text-sm bg-transparent uppercase'
        />
      </div>

      {suggestions.length > 0 && (
        <ul
          className='absolute left-0 w-full mt-1 max-h-80 overflow-y-auto z-50'
          style={{
            background: 'transparent',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {suggestions.map((item) => (
            <li
              key={item.id}
              onClick={() => handleNavigate(item)}
              className='px-2 py-1 cursor-pointer hover:text-gray-500 text-xs uppercase transition-colors duration-200'
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
