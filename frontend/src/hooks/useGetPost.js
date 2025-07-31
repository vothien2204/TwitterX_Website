import { useState, useEffect } from 'react';
import axios from 'axios';
export const useGetPost = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPosts = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get('/api/post/');
            setPosts(response.data.data);

        } catch (err) {
            setError(err.response.data.message);
            setPosts([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const refreshPosts = () => {
        fetchPosts();
    };

    return { posts, isLoading, error, refreshPosts };
};
