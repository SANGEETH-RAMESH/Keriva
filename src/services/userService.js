
import apiClient from '../api/apiClient';

export const signUp = async (data) => apiClient.post('/auth/signup', data);

export const login = async (data) => apiClient.post('/auth/login', data);

export const forgotPassword = async (email) => apiClient.post('/auth/forgot-password', { email });

export const resetPassword = async (data) => apiClient.post('/auth/reset-password',  data );