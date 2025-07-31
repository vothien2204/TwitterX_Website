import axios from 'axios';

const useUpdateUser = () => {

    const updateUser = async (userId, userData) => {
        try {
            const response = await axios.put(`/api/user/${userId}`, userData);
            return response.data.data;
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Failed to update user');
        } 
    };

    return { updateUser};
};

export default useUpdateUser;
