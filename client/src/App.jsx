import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About";
import EditBlog from "./pages/EditBlog";
import PostBlog from "./pages/PostBlog";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Protected from "./components/Protected";
import SingleBlog from "./pages/SingleBlog";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/:id"
        element={
          <Protected>
            <SingleBlog />
          </Protected>
        }
      />

      <Route
        path="/about"
        element={
          <Protected>
            <About />
          </Protected>
        }
      />
      <Route
        path="/edit"
        element={
          <Protected>
            <EditBlog />
          </Protected>
        }
      />
      <Route
        path="/create"
        element={
          <Protected>
            <PostBlog />
          </Protected>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App