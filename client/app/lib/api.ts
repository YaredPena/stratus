import axios from 'axios';

export interface signupData {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
};

export interface loginData {
    email: string;
    password: string;
};

export interface apiResponse {
    email: string;
    password: string;
    message: string;
    error: string;
};

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export const signup = (data: signupData) => api.post<apiResponse>('/signup', data);
export const login = (data: loginData) => api.post<apiResponse>('/login', data);
export const logout = () => api.post('/logout');
export const recommend = (query: string) => api.post('/recommend', { query });