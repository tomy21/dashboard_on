import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineRefresh } from 'react-icons/md';
import { ScaleLoader } from 'react-spinners';
import { apiUsers } from '../api/apiUsers';
import Cookies from 'js-cookie';

export default function Login() {
    const [captcha, setCaptcha] = useState('');
    const [textCaptcha, setTextCaptcha] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [valid, setValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const navigate = useNavigate();

    const refreshString = () => {
        const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';

        // Gabungkan semua karakter yang ingin dimasukkan dalam captcha
        const allCharacters = upperCaseLetters + lowerCaseLetters + numbers;

        // Membuat captcha dengan memastikan ada huruf besar, huruf kecil, dan angka
        const randomCaptcha = () => {
            const captchaLength = 6; // panjang CAPTCHA yang diinginkan
            let captcha = '';

            // Memastikan ada karakter dari setiap jenis
            captcha +=
                upperCaseLetters[
                    Math.floor(Math.random() * upperCaseLetters.length)
                ];
            captcha +=
                lowerCaseLetters[
                    Math.floor(Math.random() * lowerCaseLetters.length)
                ];
            captcha += numbers[Math.floor(Math.random() * numbers.length)];

            // Menambahkan karakter acak sisanya
            for (let i = 3; i < captchaLength; i++) {
                captcha +=
                    allCharacters[
                        Math.floor(Math.random() * allCharacters.length)
                    ];
            }

            // Acak urutan captcha
            captcha = captcha
                .split('')
                .sort(() => 0.5 - Math.random())
                .join('');

            return captcha;
        };

        const newCaptcha = randomCaptcha();
        setCaptcha(newCaptcha);
    };

    useEffect(() => {
        refreshString();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (textCaptcha === captcha) {
            setLoading(true);
            setValid(true);
            try {
                const response = await apiUsers.login(email, password);
                const token = response.token;
                Cookies.set('refreshToken', token);
                navigate('/dashboard');
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setLoading(false);
            }
        } else {
            setValid(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-r from-white via-slate-100 to-gray-100 p-6">
            <div className="container w-full md:w-[80%] max-w-4xl h-full bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Left Section */}
                    <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-amber-600 to-amber-300 text-white p-6">
                        <div className="flex flex-col items-center text-center">
                            <img
                                src={'/logo.png'}
                                className="w-10 h-10 mb-2"
                                alt={'SkyParking'}
                            />
                            <h1 className="text-2xl font-normal">
                                Dashboard Overnight
                            </h1>
                        </div>
                        <img
                            src={'/images1.png'}
                            className="w-48 h-48 md:w-64 md:h-64 mb-4"
                            alt={'SkyParking'}
                        />
                    </div>

                    {/* Right Section */}
                    <div className="p-8">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            Welcome Back!
                        </h1>
                        <p className="text-sm text-gray-500 mb-6">
                            Please login to your account
                        </p>

                        <form onSubmit={handleSubmit}>
                            {/* Email Input */}
                            <div className="mb-4">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email Or Username
                                </label>
                                <input
                                    type="text"
                                    value={email}
                                    name="email"
                                    id="email"
                                    autoComplete="current-email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Enter your email"
                                />
                            </div>

                            {/* Password Input */}
                            <div className="mb-4">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    name="password"
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="*************"
                                />
                            </div>

                            {/* Captcha Section */}
                            <div className="flex items-center space-x-4 mb-4">
                                <div
                                    className={`w-1/2 text-center text-lg font-semibold py-2 rounded-md shadow-sm ${
                                        valid
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-200 text-gray-700'
                                    }`}
                                >
                                    {captcha}
                                </div>
                                <button
                                    type="button"
                                    className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 shadow-md"
                                    onClick={refreshString}
                                >
                                    <MdOutlineRefresh size={24} />
                                </button>
                            </div>

                            <div className="mb-6">
                                <input
                                    type="text"
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
                                        valid
                                            ? 'border-green-500'
                                            : 'border-red-500'
                                    }`}
                                    placeholder="Enter Captcha"
                                    value={textCaptcha}
                                    onChange={(e) =>
                                        setTextCaptcha(e.target.value)
                                    }
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full py-2 px-4 text-white bg-indigo-600 hover:bg-indigo-500 rounded-md shadow-md text-sm font-medium transition-all duration-200"
                            >
                                {loading ? 'Loading...' : 'Login'}
                            </button>
                        </form>

                        {errorMessage && (
                            <p className="mt-4 text-sm text-red-500">
                                {errorMessage}
                            </p>
                        )}

                        {loading && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                <div className="bg-white p-5 rounded-md shadow-lg">
                                    <ScaleLoader
                                        size={150}
                                        color={'#333'}
                                        loading={true}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
