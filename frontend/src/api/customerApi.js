import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';
const api = axios.create({ baseURL: BASE_URL });

export const getCustomers  = ()          => api.get('/customers');
export const getCustomer   = (id)        => api.get(`/customers/${id}`);
export const createCustomer = (data)     => api.post('/customers', data);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);
export const deleteCustomer = (id)        => api.delete(`/customers/${id}`);
export const bulkUpload     = (file)     => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/customers/bulk', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 300000  // 5 min timeout for large files
    });
};
