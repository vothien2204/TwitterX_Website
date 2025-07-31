import { useState } from 'react';
import axios from 'axios';

export const useAddComment = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const addComment = async (postId, text) => {
        setIsLoading(true);
        setError(null);

        try {
            const userId = JSON.parse(localStorage.getItem('userIns'));
            console.log("userId", userId.id);
            console.log("postId", postId);
            console.log("text", text);
            const response = await axios.post('/api/comment/', {
                userId: userId.id,
                postId,
                text
            });
            return response.data.comment;
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding comment');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { addComment, isLoading, error };
};

export const useDeleteComment = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteComment = async (commentId) => {
        setIsLoading(true);
        setError(null);

        try {
            await axios.delete(`/api/comment/${commentId}`);
            return true;
        } catch (err) {
            setError(err.response.data.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { deleteComment, isLoading, error };
};
