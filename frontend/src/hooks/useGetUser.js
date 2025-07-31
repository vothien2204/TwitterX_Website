import { useState, useEffect } from 'react';
import axios from 'axios';

export const useGetUser = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get('/api/user/');
            setUsers(response.data.data);

        } catch (err) {
            setError(err.response.data.message);
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const refreshUsers = () => {
        fetchUsers();
    };

    return { users, isLoading, error, refreshUsers };
};
