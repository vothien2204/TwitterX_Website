import axios from "axios";
import { useState } from "react";

const useDeletePost = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const deletePost = async (postId) => {
        setIsLoading(true);
        setError(null);

        try {
            await axios.delete(`/api/post/${postId}`);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete post');
            return false;
        } finally {
            setIsLoading(false);
        }
    }

    return { deletePost, isLoading, error };
}

export default useDeletePost;
