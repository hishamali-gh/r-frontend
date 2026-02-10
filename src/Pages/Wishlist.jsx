import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from '../Components/NavBar.jsx';

export default function Wishlist() {
    const [user, setUser] = useState(null);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    // Load user and wishlist on mount
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const loggedIn = JSON.parse(localStorage.getItem('isLoggedIn'));

        setIsLoggedIn(loggedIn);

        if (storedUser && loggedIn) {
            setUser(storedUser);
            setWishlistItems(storedUser.wishlist || []);
        } else {
            setUser(null);
            setWishlistItems([]);
        }
    }, []);

    if (!user) {
        return (
            <div className="h-screen flex items-center justify-center text-xl text-gray-500">
               You have to sign in first
            </div>
        );
    }

    const removeFromWishlist = async (item) => {
        if (!user) return alert("Please login first!");

        const updatedWishlist = wishlistItems.filter(
            (i) => !(i.id === item.id && i.category === item.category)
        );

        try {
            const res = await fetch(`http://localhost:3001/user/${user.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ wishlist: updatedWishlist }),
            });

            if (res.ok) {
                const updatedUser = { ...user, wishlist: updatedWishlist };
                setUser(updatedUser);
                setWishlistItems(updatedWishlist);
                localStorage.setItem("user", JSON.stringify(updatedUser));
            }
        } catch (err) {
            console.error("Failed to remove item:", err);
        }
    };

    const goToProduct = (item) => {
        if (!item.category) {
            alert("Product category not found!");
            return;
        }
        navigate(`/${item.category}/${item.id}`);
    };

    if (!isLoggedIn) {
        return (
            <p className="text-center mt-20 text-gray-600" style={{ fontFamily: "SUSE Mono" }}>
                You are not logged in.
            </p>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-white relative">
            <NavBar />

            <main className="flex-grow flex flex-col items-center pt-28 px-4">
                <h2 className="text-6xl text-gray-900 mb-12 text-center z-10" style={{ fontFamily: 'Playfair Display' }}>
                    YOUR WISHLIST
                </h2>

                <div className="w-full max-w-7xl z-10 space-y-6">
                    {wishlistItems.length > 0 ? (
                        wishlistItems.map((item) => (
                            <div
                                key={`${item.id}-${item.category}`}
                                className="bg-white relative flex flex-col p-4 border-b border-gray-200"
                                style={{ minHeight: '140px', fontFamily: 'SUSE Mono' }}
                            >
                                <div className="flex">
                                    <img
                                        src={item.images?.[0] || item.image}
                                        alt={item.name}
                                        className="w-24 h-32 object-cover flex-shrink-0 cursor-pointer"
                                        onClick={() => goToProduct(item)}
                                    />

                                    <div className="flex-1 ml-4 relative flex flex-col">
                                        <div className="absolute top-0 right-0">
                                            <button
                                                onClick={() => removeFromWishlist(item)}
                                                className="text-red-600 text-base font-bold hover:text-red-800 transition duration-300 cursor-pointer"
                                            >
                                                ×
                                            </button>
                                        </div>

                                        <h3 className="text-base font-semibold text-gray-800 uppercase cursor-pointer" onClick={() => goToProduct(item)}>
                                            {item.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm uppercase mt-1 cursor-pointer">
                                            ₹ {item.price}
                                        </p>

                                        <div className="flex-1"></div>

                                        <button
                                            onClick={() => goToProduct(item)}
                                            className="text-gray-900 py-1 font-semibold border-b border-gray-800 hover:text-white hover:bg-black hover:cursor-pointer transition-colors duration-300 text-base self-start mt-2"
                                            style={{ fontFamily: 'SUSE Mono' }}
                                        >
                                            View Product
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <p className="text-2xl font-bold text-gray-600 mb-6 uppercase">
                                (*￣3￣)╭ <br /> <span style={{ fontFamily: "SUSE Mono" }}>YOUR WISHLIST IS EMPTY</span>
                            </p>
                            <Link
                                to='/'
                                className="w-full max-w-xs text-gray-900 mt-20 py-2 font-semibold border-b border-gray-800 hover:text-white hover:bg-black transition-colors duration-300 uppercase cursor-pointer"
                                style={{ fontFamily: 'SUSE Mono' }}
                            >
                                HOME
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
