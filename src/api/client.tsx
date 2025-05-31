// src/api/client.js
import axios from 'axios';

const client = axios.create({
  baseURL: 'https://ecommerce-backend-2-12tl.onrender.com/api',
  withCredentials: true,
  timeout: 10000, // 10 secondes timeout
});

// Intercepteur pour les requêtes
client.interceptors.request.use(config => {
  console.log('Envoi de la requête à', config.url);
  return config;
}, error => {
  return Promise.reject(error);
});

// Intercepteur pour les réponses
client.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response) {
    console.error('Erreur API:', error.response.status, error.response.data);
  } else if (error.request) {
    console.error('Pas de réponse du serveur');
  } else {
    console.error('Erreur de configuration', error.message);
  }
  return Promise.reject(error);
});

export default client;