import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../index.css';
import SearchBar from "./SearchBar.jsx";
import { RxHamburgerMenu } from "react-icons/rx";

export default function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const loggedIn = JSON.parse(localStorage.getItem('isLoggedIn'));

        setIsLoggedIn(loggedIn)
    }, [])

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "auto";
    }, [menuOpen]);

    return (
        <>
            <nav className="fixed top-0 left-0 w-full px-8 py-3 flex justify-between items-cente bg-white z-30 border-b border-gray-300">
                <Link to="/">
                    <h1 className="text-2xl cursor-pointer" style={{ fontFamily: "Playwrite DE SAS, cursive" }}>
                        willow
                    </h1>
                </Link>
                <div className="flex items-center space-x-8" style={{ fontFamily: "SUSE Mono" }}>
                    <ul className="flex space-x-6 items-center">
                        <li>
                            {isLoggedIn ? (
                                <Link className="hover:text-gray-500 transition cursor-pointer" to='/profile'>
                                    PROFILE
                                </Link>
                            ) : (
                                <Link className="hover:text-gray-500 transition cursor-pointer" to='/login'>
                                    LOGIN
                                </Link>
                            )}
                        </li>
                        <li>
                            <Link className="hover:text-gray-500 transition cursor-pointer" to='/cart'>
                                CART
                            </Link>
                        </li>
                    </ul>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="hover:text-gray-500 transition text-xl cursor-pointer"
                    >
                        <RxHamburgerMenu />
                    </button>
                </div>
            </nav>

            <div
                className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setMenuOpen(false)}
            ></div>

            <div
                className={`fixed top-0 right-0 h-full w-64 bg-white/50 backdrop-blur-md border-l border-white/40 transform transition-transform duration-300 ease-in-out z-50 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
                style={{ fontFamily: "SUSE Mono" }}
            >
                <div className="p-6 flex flex-col space-y-6">
                    <button
                        onClick={() => setMenuOpen(false)}
                        className="self-end text-gray-600 hover:text-gray-500 hover:cursor-pointer text-xl transition"
                    >
                        ✕
                    </button>
                    <ul className="space-y-4 text-gray-800">
                        <li>
                            <Link className="hover:text-gray-500 transition cursor-pointer" to='/men'>
                                MEN
                            </Link>
                        </li>
                        <li>
                            <Link className="hover:text-gray-500 transition cursor-pointer" to='/women'>
                                WOMEN
                            </Link>
                        </li>
                        <li>
                            <Link className="hover:text-gray-500 transition cursor-pointer" to='/kids'>
                                KIDS
                            </Link>
                        </li>

                        <SearchBar />
                    </ul>
                </div>
            </div>
        </>
    );
}
