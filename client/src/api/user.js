import api from "../config/api"

export const login=async (values)=>{
    try {
        const response = await api.post("/users/login", values);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const signup = async (values) => {
  try {
    const response = await api.post("/users/register", values);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
export const logout = async () => {
  try {
    const response = await api.get("/users/logout");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
export const currentuser = async () => {
  try {
    const response = await api.get(`/users/`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized access - User not logged in.");
      return null;
    }
    console.error(error);
    throw error;
  }
};