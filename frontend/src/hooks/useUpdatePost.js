import axios from "axios";

const useUpdatePost = () => {
    const updatePost = async (postId, postData) => {
        try {
            const response = await axios.put(`/api/post/${postId}`, postData);
            return response.data.data;
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Failed to update post');
        }
    }
    return { updatePost };
}

export default useUpdatePost;