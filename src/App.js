import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense, useEffect } from 'react';
import Loading from './components/Loading';

const Login = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Transaction = React.lazy(() => import('./pages/Transaction'));
const Users = React.lazy(() => import('./pages/Users'));
const ProtectedRoute = React.lazy(() => import('./components/ProtectedRoute'));
const Layout = React.lazy(() => import('./Layout'));

function App() {
    useEffect(() => {
        const closeConsoleWarning = () => {
            console.log(
                '%cSTOP!',
                'color: red; font-size: 40px; font-weight: bold;'
            );
            console.log(
                '%cThis is a browser feature intended for developers.',
                'font-size: 18px;'
            );
            console.log(
                '%cIf someone told you to copy-paste something here, it is a scam.',
                'font-size: 18px;'
            );
        };

        window.addEventListener('contextmenu', closeConsoleWarning);
        window.addEventListener('keydown', (e) => {
            if (e.key === 'F12') {
                closeConsoleWarning();
                e.preventDefault();
            }
        });

        return () => {
            window.removeEventListener('contextmenu', closeConsoleWarning);
            window.removeEventListener('keydown', closeConsoleWarning);
        };
    }, []);
    return (
        <Router>
            <Suspense fallback={<Loading />}>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route
                        path="/dashboard/*"
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="" element={<Dashboard />} />
                        <Route path="transaction" element={<Transaction />} />
                        <Route path="users" element={<Users />} />
                    </Route>
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;
