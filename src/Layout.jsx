import React from 'react';
import Navbar from './components/Navbar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <div className="flex flex-col h-screen ">
            <header className="bg-white shadow-md px-6">
                <Navbar />
            </header>
            <main className="flex-1 overflow-auto px-6">
                <Outlet />
            </main>
            <footer className="bg-white shadow-md px-6 py-4">
                <p className="text-sm text-gray-600">
                    &copy; 2024 PT Sky Parking Utama. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
