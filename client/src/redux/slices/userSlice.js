import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: true,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = false;
    },
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setError: (state,action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setUser,setLoading,setError } = userSlice.actions;
export default userSlice.reducer;
