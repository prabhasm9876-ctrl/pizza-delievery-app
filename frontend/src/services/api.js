import axios from 'axios';

const getApiBaseUrl = () => {
  const configuredUrl = process.env.REACT_APP_API_BASE_URL;
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '');
  }

  return '/api/v1';
};

const API = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Authorization header with JWT token if present
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getApiErrorMessage = (error, fallback) => {
  const detail = error.response?.data?.detail;

  if (typeof detail === 'string') {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => item.msg || item.message)
      .filter(Boolean)
      .join(', ') || fallback;
  }

  return fallback;
};

export const fetchCurrentUser = async () => {
  const response = await API.get('/auth/me');
  return response.data;
};

export const loginUser = async (credentials) => {
  const params = new URLSearchParams();
  params.append('username', credentials.email);
  params.append('password', credentials.password);

  const response = await API.post('/auth/login', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
};

export const signupUser = async (userData) => {
  const response = await API.post('/auth/signup', userData);
  return response.data;
};

export const fetchProducts = async () => {
  const response = await API.get('/products');
  return response.data;
};

export const fetchUserCart = async (userId) => {
  const response = await API.get(`/cart/users/${userId}`);
  return response.data;
};

export const addToCart = async (userId, restaurantId, items) => {
  const response = await API.post(`/cart/users/${userId}/add`, {
    restaurant_id: restaurantId,
    items: items // list of { item_id, quantity }
  });
  return response.data;
};

export const updateCartItem = async (userId, orderItemId, quantity) => {
  const response = await API.put(`/cart/users/${userId}/items/${orderItemId}`, null, {
    params: { quantity }
  });
  return response.data;
};

export const removeCartItem = async (userId, orderItemId) => {
  const response = await API.delete(`/cart/users/${userId}/items/${orderItemId}`);
  return response.data;
};

export const checkoutOrder = async (userId, orderId) => {
  const response = await API.post(`/cart/users/${userId}/checkout/${orderId}`);
  return response.data;
};

export const fetchUserOrders = async (userId) => {
  const response = await API.get(`/cart/users/${userId}/all`);
  return response.data;
};

export default API;
