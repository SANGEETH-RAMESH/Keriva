import axios from "axios";
import createApiClient from "../api/apiClient";

const adminApi = createApiClient();

export const adminLogin = async (data) =>
  axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/login`, data);

export const getContact = async (search = "") => adminApi.get(`/admin/contact?search=${search}`);

export const getJourneySubmissions = async (search) => adminApi.get(`/admin/journey?search=${search}`);

export const addExperiences = async (data) => adminApi.post('/admin/experience', data, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

export const getContactInfo = async () => await adminApi.get('/admin/contact-info');

export const updateContactInfo = async (data) => await adminApi.put('/admin/update-contact', data);

export const updateContactStatus = async (id, status) => await adminApi.patch(`/admin/contact/${id}/status`, { status });

export const deleteContact = async (id) => await adminApi.delete(`/admin/contact/${id}`);

export const createAbout = async (data) => await adminApi.post('/admin/add-about', data);

export const getAboutById = async (id) => await adminApi.get(`/admin/about/${id}`);

export const updateAbout = async (id, data) => await adminApi.put(`/admin/about/${id}`, data);

export const deleteAbout = async (id) => await adminApi.delete(`/admin/about/${id}`);

export const getAllAbout = async (search ="") => await adminApi.get(`/admin/about?search=${search}`);

export const getAllExperiences = async (search ="") => await adminApi.get(`/admin/experience?search=${search}`);

export const updateExperience = async (id, formData) => await adminApi.put(`/admin/experience/${id}`, formData, {
  headers: {
    "Content-Type": "multipart/form-data"
  }
});

export const deleteExperience = (id) => adminApi.delete(`/admin/experience/${id}`);

export const addExplore = async (data) => await adminApi.post('/admin/explore-kerala', data, {
  headers: {
    "Content-Type": "multipart/form-data"
  }
});

export const getExploreKerala = async () => await adminApi.get('/admin/explore-kerala');

export const getExploreKeralaById = async (id, section) => await adminApi.get(`/admin/explore-kerala/${id}/${section}`);

export const updateExploreKerala = async (id, data) => await adminApi.put(`/admin/explore-kerala/${id}`, data);

export const deleteExploreKerala = async (id) => await adminApi.delete(`/admin/explore-kerala/${id}`);

export const addJournal = async (data) => await adminApi.post('/admin/add-journal', data, {
  headers: {
    "Content-Type": "multipart/form-data"
  }
});

export const getJournal = async () => await adminApi.get('/admin/journal');

export const updateJournal = async (id) => await adminApi.patch(`/admin/journal/${id}`);

export const updateJournalStatus = async (id, status) => await adminApi.patch(`/admin/journal/${id}/status`, { status });

export const addLanding = (data) => adminApi.post('/admin/add-landing', data, {
  headers: {
    "Content-Type": "multipart/form-data"
  }
});

export const getLanding = () => adminApi.get('/admin/landing');

export const getLandingById = (id) => adminApi.get(`/admin/landing/${id}`);

export const editLanding = (id, data) => adminApi.patch(`/admin/landing/${id}`, data, {
  headers: {
    "Content-Type": "multipart/form-data"
  }
});

export const searchExperiences = (query) =>
  adminApi.get(`/admin/experiences/search?q=${encodeURIComponent(query)}`);

export const createReview = (data) => adminApi.post('/admin/review',data);

export const getReviews = () => adminApi.get('/admin/review');

export const getReviewById = (id) => adminApi.get(`/admin/review/${id}`);

export const updateReview = (id,data) => adminApi.patch(`/admin/review/${id}`,data);