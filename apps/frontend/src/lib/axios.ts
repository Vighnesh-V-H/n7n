import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access - please login')
    }
    return Promise.reject(error)
  }
)
