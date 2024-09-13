import axios from 'axios';

const api = axios.create({
  baseURL: 'https://iamsoumyadip.pythonanywhere.com/api/',
});

// Add a request interceptor to include the token in the headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getTasks = () => api.get('todos/');
export const createTask = (task) => api.post('/todos/', task);
export const updateTask = (id, task) => api.put(`/todos/${id}/`, task);
export const deleteTask = (id) => api.delete(`/todos/${id}/`);
export const userRegister = (user) => api.post('register/', user);


export const register = async (username, email, password) => {
  console.log(username, email, password)
  try {
    const response = await axios.post('https://iamsoumyadip.pythonanywhere.com/api/register/', {
      username,
      email,
      password
    });
    localStorage.setItem('token', response.data.key);
    return true;
  } catch (error) {
    return false;
  }
};


export const login = async (username, password) => {
  try {
    const response = await axios.post('https://iamsoumyadip.pythonanywhere.com/api-token-auth/', {
      username,
      password
    });
    localStorage.setItem('token', response.data.token);
    return true;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
};

export const passwordReset = async (email) => {
  try {
    const response = await axios.post('https://iamsoumyadip.pythonanywhere.com/api/password-reset/', 
      { email }, 
      {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    
    console.log(response);
    return true;
  } catch (error) {
    console.log(error.response.data);
    return false;
  }
};


export const logout = () => {
  localStorage.removeItem('token');
};


