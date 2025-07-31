import { useNavigate } from 'react-router-dom';


export const useLogout = () => {
    const navigate = useNavigate();

    const logout = async () => {
        try {
            localStorage.removeItem('userIns');
            navigate('/login');
        } catch (err) {
            console.log(err);
        }
    };

    return { logout };
};
