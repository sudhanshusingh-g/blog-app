import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserType{
  name:string;
  email:string;
  image:string;
}


// Define the type for the auth state
interface AuthState {
  token: string | null;
  user:UserType | null;
}
const storedToken = localStorage.getItem("token");
// Initial state with type
const initialState: AuthState = {
  token: storedToken || null,
  user:null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        token: string;
        user:UserType;
      }>
    ) => {
      state.token = action.payload.token;
      localStorage.setItem("token",action.payload.token);
      state.user=action.payload.user;
    },
    logout: (state) => {
      state.token = null;
      localStorage.removeItem("token");
      state.user=null;
    },
  },
});

// Export actions and reducer
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
