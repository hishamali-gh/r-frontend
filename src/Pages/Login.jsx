import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import '../index.css';

export default function Login() {
    const [users, setUsers] = useState([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [blockedError, setBlockedError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3001/user`)
            .then(res => setUsers(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();

        setEmailError(false);
        setPasswordError(false);
        setBlockedError(false);

        let valid = true;

        if (!email.includes('@') || email.trim().length === 0) {
            setEmailError(true);
            valid = false;
        }

        if (password.trim().length < 6) {
            setPasswordError(true);
            valid = false;
        }

        if (!valid) return;

        const existingUser = users.find(u => u.email === email);

        if (!existingUser || existingUser.password !== password) {
            setPasswordError(true);
            return;
        }

        if (existingUser.isBlock === true) {
            setBlockedError(true);
            return;
        }

        localStorage.setItem('user', JSON.stringify(existingUser));
        localStorage.setItem('isLoggedIn', true);

        if (existingUser.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/');
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
                        type="email"
                        value={email}
                        placeholder="Email"
                        className="w-full px-0 py-2 text-gray-800 placeholder-gray-400 focus:outline-none border-b border-gray-400 focus:border-gray-800 transition"
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError(false);
                            setBlockedError(false);
                        }}
                    />
                    {emailError && <p className='text-red-500 text-xs mt-1'>*Your email input is invalid!</p>}
                </div>

                <div className="relative">
                    <input
                        type="password"
                        value={password}
                        placeholder="Password"
                        className="w-full px-0 py-2 text-gray-800 placeholder-gray-400 focus:outline-none border-b border-gray-400 focus:border-gray-800 transition"
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordError(false);
                        }}
                    />
                    {passwordError && <p className='text-red-500 text-xs mt-1'>*Invalid email or password!</p>}
                </div>

                {blockedError && (
                    <p className='text-red-600 text-sm text-center -mt-2'>
                        *This account is blocked. Please contact the administrator.
                    </p>
                )}

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
