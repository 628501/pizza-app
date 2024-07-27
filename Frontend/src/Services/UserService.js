import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';



export const register = async (name, email, password, address, admin) => {
    await axios.post(`${API_URL}/register`, { name, email, password, address , admin});
};

export const login = async (email, password) => {
    try {
        const { data } = await axios.post(`${API_URL}/login`, { email, password });
         
        const { token, name, address, emailId, admin, id} = data;

        
        document.cookie = `token=${token}; max-age=${30 * 24 * 60 * 60}; path=/;`;
        return {name,address,emailId,admin,id};
        
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

export const logout = async () => {
    try {
        await axios.post(`${API_URL}/logout`);
        document.cookie = `token=; max-age=${30 * 24 * 60 * 60}; path=/;`;

        document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    } catch (error) {
        console.error('Error logging out:', error);
        throw error;
    }
};

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

export const getToken = () => {
    return getCookie('token');
};

export const forgotPass = async (email) => {
    try {
        const { data } = await axios.post(`${API_URL}/forgot-password`, { email });
        const { id, token } = data;
        return { id, token };
    } catch (error) {
        console.error('Failed to send mail:', error);
        throw error;
    }
};


export const resetPass = async (Id,Token,password) => {
    try {
        await axios.post(`${API_URL}/reset-password/${Id}/${Token}`, { password });   
    } catch (error) {
        console.error('Failed to send mail:', error);
        throw error;
    }
};

export const getAll = async searchTerm => {
    try {
       const { data } = await axios.get(`${API_URL}/getAll/` + (searchTerm ?? ''));  
       return data; 
    } catch (error) {
        console.error('Failed to get users:', error);
        throw error;
    }
};

export const toggleBlock = async userId => {
    try {
       const { data } = await axios.put(`${API_URL}/toggleBlock/` +  userId );  
       return data; 
    } catch (error) {
        console.error('Failed to get users:', error);
        throw error;
    }
};

export const getAllId = async userId => {
    try {
       const { data } = await axios.get(`${API_URL}/getById/` +  userId );  
       return data; 
    } catch (error) {
        console.error('Failed to get users:', error);
        throw error;
    }
};

export const updateUser = async (userData) => {
    try {
       const { data } = await axios.put(`${API_URL}/update`, userData );  
       return data; 
    } catch (error) {
        console.error('Failed to get users:', error);
        throw error;
    }
};


