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
import Redirect from "./components/Redirect";

function App() {
  return (
    <Routes>
      {/*  */}
      <Route path="/" element={<Home />} />
      <Route path="/blog/:id" element={<SingleBlog />} />
      {/* Protected Route */}
      <Route element={<Protected />}>
        <Route path="/about" element={<About />} />
        {/* <Route path="/edit/:id" element={<EditBlog />} /> */}
        <Route path="/create" element={<PostBlog />} />
      </Route>
      <Route element={<Redirect />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App