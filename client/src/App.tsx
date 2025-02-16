import { Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import About from "./components/About";
import Blog from "./components/Blog";
import CreateBlog from "./components/CreateBlog";
import EditBlog from "./components/EditBlog";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
function App() {
  return (
    <Routes>
      {/* Public page routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<Blog />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/about" element={<About />} />
          <Route path="/create-blog" element={<CreateBlog />} />
          <Route path="/edit-blog/:id" element={<EditBlog />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App