import axios from "axios";

const API = axios.create({
  baseURL: "https://love-backend-1agq.onrender.com",
});

export const createForm = (data) => API.post("/form", data);

export const addField = (formId, data) =>
  API.post(`/forms/${formId}/fields`, data);

export const publishForm = (formId) =>
  API.put(`/form/${formId}/publish`);

export const getPublicForm = (formId) =>
  API.get(`/form/${formId}`);

export const submitForm = (formId, data) =>
  API.post(`/form/${formId}/submit`, data);

export const getFormStats = (formId) =>
  API.get(`/form/${formId}/stats`);

export const getResponses = (formId) =>
  API.get(`/form/${formId}/responses`);
