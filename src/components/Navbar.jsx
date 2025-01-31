import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CiLogout } from 'react-icons/ci';
import Loading from './Loading';
import Cookies from 'js-cookie';
import { apiAuth, apiUsers } from '../api/apiUsers';
import { jwtDecode } from 'jwt-decode';
import { LuFileCheck2, LuLayoutDashboard, LuUsers } from 'react-icons/lu';
import { HiMenu, HiX } from 'react-icons/hi';

export default function Navbar() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        {
            title: 'Dashboard',
            path: '/dashboard',
            icon: <LuLayoutDashboard />,
        },
        {
            title: 'Transaction',
            path: '/dashboard/transaction',
            icon: <LuFileCheck2 />,
        },
        {
            title: 'Users',
            path: '/dashboard/users',
            icon: <LuUsers />,
        },
    ];

    useEffect(() => {
        const fetchToken = async () => {
            const response = await apiUsers.verifyToken();

            if (!response.token) {
                navigate('/');
            } else {
                const decodedToken = jwtDecode(response.token);
                // setIdUser(decodedToken.Id);
                setEmail(decodedToken.email);
                setName(decodedToken.sub);
            }
        };
        fetchToken();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            setLoading(true);
            await apiAuth.logout();
            Cookies.remove('refreshToken');
            navigate('/');
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="bg-white">
            <div className="navbar mx-auto flex justify-between items-center py-3 px-5 md:px-10">
                {/* Logo & Brand */}
                <div className="flex items-end gap-3">
                    <img
                        src="/logo.png"
                        width={50}
                        height={50}
                        alt="Logo Sky"
                    />
                </div>

                {/* Desktop Menu */}
                <ul className="hidden md:flex flex-row gap-4">
                    {menuItems.map((list) => (
                        <li
                            key={list.title}
                            className={`py-2 px-3 rounded-md ${
                                location.pathname === list.path
                                    ? 'bg-gradient-to-br from-amber-500 to-amber-400 border-gradient-to-br text-white'
                                    : 'hover:bg-gradient-to-br from-amber-500 to-amber-400 border-gradient-to-br hover:text-white'
                            }`}
                        >
                            <Link
                                to={list.path}
                                className="flex items-center gap-2"
                            >
                                {list.icon}
                                {list.title}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-2xl"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <HiX /> : <HiMenu />}
                </button>

                {/* Profile Section */}
                <div className="hidden md:flex items-center gap-3">
                    <div className="text-right">
                        <h1 className="text-sm font-semibold">{name}</h1>
                        <h1 className="text-xs text-gray-400">{email}</h1>
                    </div>

                    <div className="dropdown dropdown-end">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost btn-circle avatar"
                        >
                            <div className="w-10 rounded-full">
                                <img
                                    src="/logo.png"
                                    alt="Profile"
                                    width={40}
                                    height={40}
                                />
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content mt-3 z-20 p-2 shadow bg-white rounded-box w-52"
                        >
                            <li>
                                <Link
                                    onClick={handleLogout}
                                    className="flex items-center gap-2"
                                >
                                    Logout <CiLogout />
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white shadow-md p-3">
                    <ul className="flex flex-col gap-2">
                        {menuItems.map((list) => (
                            <li
                                key={list.title}
                                className={`py-2 px-3 rounded-md ${
                                    location.pathname === list.path
                                        ? 'bg-gray-100'
                                        : 'hover:bg-gray-100'
                                }`}
                            >
                                <Link
                                    to={list.path}
                                    className="flex items-center gap-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {list.icon}
                                    {list.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
