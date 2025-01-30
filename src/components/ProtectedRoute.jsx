import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUsers } from '../api/apiUsers';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
    const [authChecked, setAuthChecked] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await apiUsers.verifyToken();
                console.log(response);
                if (response.status === 'success') {
                    Cookies.set('refreshToken', response.token);
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    navigate('/');
                }
            } catch (error) {
                console.log(error);
                setIsAuthenticated(false);
                navigate('/');
            }

            setAuthChecked(true);
        };

        if (!authChecked) {
            checkAuth();
        }
    }, [authChecked, navigate]);

    if (!authChecked) {
        return null;
    }

    return isAuthenticated ? children : null;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};
export default ProtectedRoute;
