import { useState, useEffect } from 'react';
import axios from 'axios';

export const useGetComment = (postId) => {
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchComments = async () => {
        if (!postId) return;
        
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(`/api/comment/${postId}`);
            setComments(response.data.data);

        } catch (err) {
            setError(err.response.data.message);
            setComments([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const refreshComments = () => {
        fetchComments();
    };

    return { comments, isLoading, error, refreshComments };
};
