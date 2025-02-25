import {configureStore} from "@reduxjs/toolkit";

import blogReducer from "./slices/blogSlice";
import userReducer from "./slices/userSlice";

const store = configureStore({
  reducer: {
    blog: blogReducer,
    user: userReducer,
  },
});

export default store;