import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import API from '../api.jsx';
import '../index.css';

export default function SignUp() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async function (e) {
        e.preventDefault();

        setErrors({});

        let validationErrors = {};

        if (!username.trim()) {
            validationErrors.username = 'Username is required';
        }

        if (!name.trim()) {
            validationErrors.name = 'Name is required'
        }

        if (!email.includes('@') || email.trim().length === 0) {
            validationErrors.email = 'Enter a valid email'
        }

        if (password !== confirmPassword || password.length < 6) {
            validationErrors.password = 'Passwords must match and be at least 6 characters'
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);

            return;
        }

        try {
            const res = await API.post('acc/register/', {
                name: name,
                username: username,
                email: email,
                password: password,
                confirm_password: confirmPassword
            });
            console.log(res);

            localStorage.setItem('access', res.data.access);
            localStorage.setItem('refresh', res.data.refresh);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            setName('');
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');

            navigate('/');
        }
        
        catch (err) {
            if (err.response?.data) {
                const backendErrors = err.response.data;
                const formattedErrors = {};

                Object.keys(backendErrors).forEach((key) => {
                    formattedErrors[key] = backendErrors[key][0];
                });

                setErrors(formattedErrors);
            }
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
                        onChange={(e) => { setName(e.target.value); setErrors(prev => ({...prev, name: ''})); }}
                    />

                    {errors.name && <p className='text-red-500 text-xs mt-1'>{errors.name}</p>}
                </div>

                <div className="relative">
                    <input
                        type="text"
                        id="username"
                        value={username}
                        placeholder="Username"
                        className="w-full px-0 py-2 text-gray-800 placeholder-gray-400 focus:outline-none border-b border-gray-400 focus:border-gray-800 transition"
                        onChange={(e) => { setUsername(e.target.value); setErrors(prev => ({...prev, username: ''})) }}
                    />

                    {errors.username && <p className='text-red-500 text-xs mt-1'>{errors.username}</p>}
                </div>

                <div className="relative">
                    <input
                        type="email"
                        id="email"
                        value={email}
                        placeholder="Email"
                        className="w-full px-0 py-2 text-gray-800 placeholder-gray-400 focus:outline-none border-b border-gray-400 focus:border-gray-800 transition"
                        onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({...prev, email: ''})) }}
                    />

                    {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email}</p>}
                </div>

                <div className="relative">
                    <input
                        type="password"
                        id="password"
                        value={password}
                        placeholder="Password"
                        className="w-full px-0 py-2 text-gray-800 placeholder-gray-400 focus:outline-none border-b border-gray-400 focus:border-gray-800 transition"
                        onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({...prev, password: ''})); }}
                    />
                </div>

                <div className="relative">
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        placeholder="Confirm Password"
                        className="w-full px-0 py-2 text-gray-800 placeholder-gray-400 focus:outline-none border-b border-gray-400 focus:border-gray-800 transition"
                        onChange={(e) => { setConfirmPassword(e.target.value); setErrors(prev => ({...prev, password: ''})); }}
                    />

                    {errors.password && <p className='text-red-500 text-xs mt-1'>{errors.password}</p>}
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
