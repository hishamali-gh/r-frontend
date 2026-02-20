import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from '../api.jsx'
import '../index.css';

export default function Login() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        setErrorMessage('')

        if (!identifier.trim() || !password.trim()) {
            setErrorMessage('All fields are required');
            return;
        }

        try {
            const res = await API.post('acc/login/', {
                identifier,
                password
            })

            const { user, access, refresh } = res.data

            localStorage.setItem("access", access);
            localStorage.setItem("refresh", refresh);
            localStorage.setItem("user", JSON.stringify(user));

            if (user.is_superuser) {
                navigate('/admin');
            } else {
                navigate('/');
            }
        }

        catch (err) {
            const backendMessage = err.response?.data?.non_field_errors?.[0];

            setErrorMessage(backendMessage);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white relative px-4 overflow-hidden">
            <h1
                className="absolute top-0 left-0 text-gray-900 opacity-5 select-none pointer-events-none"
                style={{
                    fontFamily: 'Playwrite DE SAS, cursive',
                    fontSize: '60rem',
                    lineHeight: '1',
                    transform: 'translate(-10%, -10%)'
                }}
            >
                willow
            </h1>

            <h2 className="text-6xl mb-12 text-gray-900 text-center z-10" style={{ fontFamily: 'Playfair Display' }}>
                LOGIN
            </h2>

            <form className="w-full max-w-md space-y-6 z-10" onSubmit={handleLogin} style={{ fontFamily: 'SUSE Mono' }}>
                <div className="relative">
                    <input
                        type="text"
                        value={identifier}
                        placeholder="Username or Email"
                        className="w-full px-0 py-2 text-gray-800 placeholder-gray-400 focus:outline-none border-b border-gray-400 focus:border-gray-800 transition"
                        onChange={(e) => {
                            setIdentifier(e.target.value);
                            setErrorMessage('')
                        }}
                    />
                </div>

                <div className="relative">
                    <input
                        type="password"
                        value={password}
                        placeholder="Password"
                        className="w-full px-0 py-2 text-gray-800 placeholder-gray-400 focus:outline-none border-b border-gray-400 focus:border-gray-800 transition"
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setErrorMessage('')
                        }}
                    />

                    {errorMessage && <p className='text-red-500 text-xs mt-1'>{errorMessage}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full text-gray-900 py-2 mt-4 font-semibold border-b border-gray-800 
                               hover:text-white hover:bg-black hover:cursor-pointer transition-colors duration-300"
                >
                    Log In
                </button>

                <p className="mt-6 text-center text-gray-600">
                    Don't have an account?{" "}
                    <Link
                        to='/signup'
                        className="underline px-1 hover:text-white hover:bg-black hover:cursor-pointer transition-colors duration-300"
                    >
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    );
}
