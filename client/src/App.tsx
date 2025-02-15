import { Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import BlogHomepage from "./components/BlogHomepage";
import About from "./components/About";
import Blog from "./components/Blog";
import CreateBlog from "./components/CreateBlog";
import EditBlog from "./components/EditBlog";
import Register from "./pages/Register";
import Login from "./pages/Login";
function App() {
  return (
      <Layout>
        <Routes>
          <Route path="/" element={<BlogHomepage />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/create-blog" element={<CreateBlog />} />
          <Route path="/edit-blog/:id" element={<EditBlog />} />
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </Layout>
  );
}

export default App