import api from "../config/api"

const handleError = (error) => {
  if (error.response) {
    // Server responded with an error status (e.g., 401, 400)
    return {
      success: false,
      message: error.response.data.message || "Invalid credentials.",
    };
  } else if (error.request) {
    // No response received (e.g., network issue)
    return {
      success: false,
      message: "No response from server. Please check your connection.",
    };
  } else {
    // Other unexpected errors
    return {
      success: false,
      message: error.message || "Something went wrong.",
    };
  }
};

export const login=async (values)=>{
    try {
        const response = await api.post("/users/login", values);
        return response.data;
    } catch (error) {
      return handleError(error);
    }
}
//register
export const signup = async (values) => {
  try {
    const response = await api.post("/users/register", values);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};
export const logout = async () => {
  try {
    const response = await api.get("/users/logout");
    return response.data;
  } catch (error) {
    return handleError(error);
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
    return handleError(error);
  }
};