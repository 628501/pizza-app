import { useState, useContext, createContext, useEffect } from "react";
import * as userService from "../Services/UserService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState(null);
    const [address, setAddress] = useState(null);
    const [Id, setId] = useState(null);
    const [Token, setToken] = useState(null);
    const [isAdmin, setIsAdmin] = useState(null);
    const navigate = useNavigate();

    
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser.name);
            setAddress(parsedUser.address);
            setEmail(parsedUser.emailId);
            setIsAdmin(parsedUser.admin)
        }
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            const parsedToken = JSON.parse(storedToken);
            setId(parsedToken.id);
            setToken(parsedToken.token);
        }
    }, []);
    
    const register = async (name, email, password, address, admin) => {
        try {
            await userService.register(name, email, password, address, admin);
            navigate('/login');
            toast.success('Registration successful');
        } catch (err) {
            toast.error(err.response.data.error);
        }
    };

    const login = async (email, password) => {
        try {
            const user = await userService.login(email, password);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user.name);
            setAddress(user.address);
            setEmail(user.emailId);
            toast.success('Login successful');
        } catch (err) {
            toast.error(err.response.data.error);
        }
    };

    const logout = async () => {
        await userService.logout();
        setUser(null);
        setAddress(null);
        localStorage.removeItem('user');
        toast.success('Logout successful');
    };

    const forgotPassword = async (email) => {
        try {
            const data = await userService.forgotPass(email); 
            localStorage.setItem('token', JSON.stringify(data));
            setId(data.id);
            setToken(data.token); 
            toast.success('Mail sent successfully');
            navigate('/');
        } catch (err) {
            toast.error(err.response.data.error);
        }
    }
    

    const ResetPassword = async (password) => {
        try {
            await userService.resetPass(Id, Token, password);
            toast.success('Password updated successfully');
            navigate('/login');
        } catch (err) {
            toast.error(err.response.data.error);
        }
    }
    

    return (
        <AuthContext.Provider value={{ register, login, logout, user, address, email, forgotPassword, ResetPassword , isAdmin}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
