import { createSlice } from "@reduxjs/toolkit";

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blog: [],
  },
  reducers: {
    setBlog: (state, action) => {
      state.blog = action.payload;
    },
  },
});

export const {
  setBlog
} = blogSlice.actions;
export default blogSlice.reducer;
