import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api.jsx';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const handleChange = async (e) => {
    const value = e.target.value;

    setQuery(value);

    if (!value.trim()) {
      setSuggestions([]);
      
      return;
    }

    try {
      const res = await API.get(`/products/products/?search=${value}`);

      const data = res.data.results || res.data;

      setSuggestions(data);
    }
    
    catch (err) {
      console.error('Search error:', err);
    }
  }

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
          onChange={handleChange}
          placeholder='Search...'
          className='w-full px-1 py-2 focus:outline-none text-sm bg-transparent'
        />
      </div>

      {suggestions.length > 0 && (
        <ul
          className='absolute left-0 w-full mt-1 max-h-80 overflow-hidden z-50'
          style={{
            background: 'transparent',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE 10+
          }}
        >
          {suggestions.map((item) => (
            <li
              key={item.id}
              onClick={() => handleNavigate(item)}
              className='px-2 py-1 cursor-pointer hover:text-gray-500 text-xs uppercase transition'
              style={{
                textTransform: 'uppercase',
              }}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
