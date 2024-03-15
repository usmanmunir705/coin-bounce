import { BrowserRouter, Routes , Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./Components/Navbar/navbar";
import Footer from "./Components/Footer/footer";
import Home from "./pages/Home/home";
import Crypto from "./pages/Crypto/Crypto.jsx";
import Blog from './pages/Blogs/Blog.jsx'
import BlogDetail from './pages/BlogDetails/BlogDetail.jsx'
import SubmitBlog from "./pages/Submit/SubmitBlog.jsx";
import BlogUpdate from "./pages/BlogUpdate/BlogUpdate.jsx"
import Login from "./pages/Login/Login.js";
import Signup from "./pages/Signup/Signup.jsx";
import Styles from "./App.module.css"
import Protected from "./Components/Protected/protected";
import useAutoLogin from "./Hooks/useAutoLogin";
import Error from "./pages/Error/error";
import Loader from "./Components/Loader/Loader.jsx";

function App() {

  const isAuth = useSelector((state) => state.user.auth);

  const loading = useAutoLogin();

  return loading ? (
    <Loader text="..." />
  ) : (
    <div className={Styles.container}>
    <BrowserRouter>
      <div className={Styles.layout}>
        <Navbar/>
          <Routes>
            <Route path="/" exact element={<div className={Styles.main}><Home /></div>}/>

            <Route path="/crypto" exact element={<div className={Styles.main}><Crypto/></div>}/>
            
            <Route path="/blogs" exact element={<Protected isAuth={isAuth}><div className={Styles.main}><Blog/></div></Protected>}/>

            <Route path="/blog/:id" exact element={<Protected isAuth={isAuth}><div className={Styles.main}><BlogDetail/></div></Protected>}/>

            <Route path="/blog/update/:id" exact element={<Protected isAuth={isAuth}><div className={Styles.main}><BlogUpdate/></div></Protected>}/>

            <Route path="/submit" exact element={<Protected isAuth={isAuth}><div className={Styles.main}><SubmitBlog/></div></Protected>}/>

            <Route path="/login" exact element={<div className={Styles.main}><Login/></div>}/>

            <Route path="/signup" exact element={<div className={Styles.main}><Signup/></div>}/>

            <Route path="*" exact element={<div className={Styles.main}><Error /></div>}/>

          </Routes>
        <Footer/>
      </div>
    </BrowserRouter>
    </div>
  );
}

export default App;
