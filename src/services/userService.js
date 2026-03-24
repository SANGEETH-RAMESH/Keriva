
// import apiClient from '../api/apiClient';

import axios from "axios";




export const signUp = async (data) => axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, data);

export const login = async (data) => axios.post('/auth/login', data);

export const forgotPassword = async (email) => axios.post('/auth/forgot-password', { email });

export const resetPassword = async (data) => axios.post('/auth/reset-password',  data );

export const createTravel  = async (data) => axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/journey`,data);

export const sendContact = async (data) => axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/contact`,data);

export const getAdminContactInfo = async () => axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/contact-info`)

export const getAbout = async () => axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/about`);

export const getExploreKerala = async () => axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/explore-kerala`);

export const getExperience = async () => axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/experiences`);

export const getJournal = async () => axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/journal`);

export const getLanding = async () => axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/landing`);