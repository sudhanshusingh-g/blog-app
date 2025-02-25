import { createSlice } from "@reduxjs/toolkit";

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blog: [],
    loading: true,
    error: false,
  },
  reducers: {
    setBlog: (state, action) => {
      state.blog = action.payload;
      state.error = false;
      state.loading = false;
    },
    setLoading: (state) => {
      state.error = false;
      state.loading = true;
      state.blog = [];
    },
    setError: (state) => {
      state.blog = [];
      state.loading = false;
      state.error = true;
    },
  },
});

export const {
  setBlog,setError,setLoading
} = blogSlice.actions;
export default blogSlice.reducer;
