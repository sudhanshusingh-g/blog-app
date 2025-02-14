import axios,{InternalAxiosRequestConfig,AxiosHeaders,Method} from "axios";

const API_URL:string = import.meta.env.VITE_BACKEND_URL || "";
// Create an Axios instance with default configuration
const api=axios.create({
    baseURL:API_URL,
    headers:{
        "Content-Type":"application/json",
    }
})
// Add an interceptor to include the authorization token in requests
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    (config.headers as AxiosHeaders).set("Authorization" , `Bearer ${token}`);
  }
  return config;
});

// Type definition for API call function
interface ApiCallOptions {
  method: Method;
  url: string;
  data?: any;
}
// Generic API call function
export const apiCall = async <T,>({
  method,
  url,
  data,
}: ApiCallOptions): Promise<T> => {
  try {
    const response = await api({ method, url, data });
    return response.data;
  } catch (error:any) {
    throw error.response?.data || error.message;
  }
};

export default api;