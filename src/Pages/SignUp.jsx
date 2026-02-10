import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';

export default function SignUp() {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [passConfirm, setPassConfirm] = useState('');
    const [nameError, setNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passError, setPassError] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3001/user`)
            .then(res => setUsers(res.data))
            .catch(error => console.error(error));
    }, []);

    const handleSubmit = async function (e) {
        e.preventDefault();

        setNameError(false);
        setEmailError(false);
        setPassError(false);
        setEmailExists(false);

        let valid = true;

        if (name.trim().length === 0) {
            setNameError(true);
            valid = false;
        }
        if (!email.includes('@') || email.trim().length === 0) {
            setEmailError(true);
            valid = false;
        }
        if (pass !== passConfirm || pass.length < 6) {
            setPassError(true);
            valid = false;
        }

        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            setEmailExists(true);
            valid = false;
        }

        if (!valid) return;

        try {
            // Generate a new sequential id based on existing users
            const nextId = Math.max(...users.map(u => Number(u.id))) + 1;

            const user = {
                id: nextId.toString(),
                name: name,
                email: email,
                password: pass,
                role: "user",
                isBlock: false,
                cart: [],
                orders: [],
                wishlist: [],
                date: new Date() // Signup date
            };

            const res = await axios.post(`http://localhost:3001/user`, user);
            console.log(res);

            // Persist user and login state in localStorage
            localStorage.setItem('user', JSON.stringify(res.data));
            localStorage.setItem('isLoggedIn', true);

            // Reset form fields
            setName('');
            setEmail('');
            setPass('');
            setPassConfirm('');

            navigate('/');
        } catch (err) {
            console.log(err.name, ":", err.message);
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
                    transform: 'translate(-30%, -20%)'
                }}
            >
                willow
            </h1>

            <h2 className="text-6xl mb-12 text-gray-900 text-center z-10" style={{ fontFamily: 'Playfair Display' }}>
                SIGNUP
            </h2>

            <form className="w-full max-w-md space-y-6 z-10" onSubmit={handleSubmit} style={{ fontFamily: 'SUSE Mono' }}>
                <div className="relative">
                    <input
                        type="text"
                        id="name"
                        value={name}
                        placeholder="Full Name"
                        className="w-full px-0 py-2 text-gray-800 placeholder-gray-400 focus:outline-none border-b border-gray-400 focus:border-gray-800 transition"
                        onChange={(e) => { setName(e.target.value); setNameError(false); }}
                    />
                    {nameError && <p className='text-red-500 text-xs mt-1'>*Your name input is invalid!</p>}
                </div>

                <div className="relative">
                    <input
                        type="email"
                        id="email"
                        value={email}
                        placeholder="Email"
                        className="w-full px-0 py-2 text-gray-800 placeholder-gray-400 focus:outline-none border-b border-gray-400 focus:border-gray-800 transition"
                        onChange={(e) => { setEmail(e.target.value); setEmailError(false); setEmailExists(false); }}
                    />
                    {emailError && <p className='text-red-500 text-xs mt-1'>*Your email input is invalid!</p>}
                    {emailExists && <p className='text-xs mt-1'>*This email is already registered!</p>}
                </div>

                <div className="relative">
                    <input
                        type="password"
                        id="password"
                        value={pass}
                        placeholder="Password"
                        className="w-full px-0 py-2 text-gray-800 placeholder-gray-400 focus:outline-none border-b border-gray-400 focus:border-gray-800 transition"
                        onChange={(e) => { setPass(e.target.value); setPassError(false); }}
                    />
                </div>

                <div className="relative">
                    <input
                        type="password"
                        id="confirmPassword"
                        value={passConfirm}
                        placeholder="Confirm Password"
                        className="w-full px-0 py-2 text-gray-800 placeholder-gray-400 focus:outline-none border-b border-gray-400 focus:border-gray-800 transition"
                        onChange={(e) => { setPassConfirm(e.target.value); setPassError(false); }}
                    />
                    {passError && <p className='text-red-500 text-xs mt-1'>*Your password inputs are invalid!</p>}
                </div>

                <button
                    type="submit"
                    className="w-full text-gray-900 py-2 mt-4 font-semibold border-b border-gray-800 
                               hover:text-white hover:bg-black hover:cursor-pointer transition-colors duration-300"
                >
                    Register
                </button>

                <p className="mt-6 text-center text-gray-600">
                    Already have an account?{" "}
                    <Link
                        to='/login'
                        className="underline px-1 hover:text-white hover:bg-black hover:cursor-pointer transition-colors duration-300"
                    >
                        Log in
                    </Link>
                </p>
            </form>
        </div>
    );
}
