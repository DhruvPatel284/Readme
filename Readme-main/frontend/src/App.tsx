import { BrowserRouter, Route, Routes, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { Signup } from './pages/Signup'
import { Signin } from './pages/Signin'
import { Blog } from './pages/Blog'
import { Blogs } from './pages/Blogs'
import { Publish } from './pages/Publish'
import Homepage from './pages/HomePage'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Chatbot } from './components/ChatBot'
import MyBlogs from './pages/Myblogs'
import GyaniAIButton from './components/ui/GyaniAIButton'
import { Appbar } from './components/Appbar'
import { BlogProvider } from './context/theme'
import axios from 'axios'
import { BACKEND_URL } from './config'
interface Blog {
  content: string;
  title: string;
  id: number;
  publishedDate: Date;
  author: {
      name: string;
  };
  authorId:string;
}
function App() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const location = useLocation()
  const [searchParams] = useSearchParams();
  const [ blogs , setBlogs ] = useState<Blog[]>([]);
  const [ loading , setLoadings ] = useState<boolean>(true);


  const AppbarPaths = ['/signin' , '/signup']
  const hideChatbotPaths = ['/', '/publish' , '/signin' , '/signup']

  const setLoading = (flag : boolean) => {
    setLoadings(flag);
  }
  
  const getLoading = () => {
    setLoading(loading);
    return loading;
  }
  const getBlogs = useCallback(() => {
    axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setBlogs(response.data.blogs);
      });
      return blogs;
  }, [loading]);

  
  useEffect(() => {

    const chatOpenParam = searchParams.get('isChatOpen');
    if (chatOpenParam === 'true') {
      setIsChatOpen(true);
    }
    
  }, [searchParams]);
  return (
    <BlogProvider value={{ blogs , getBlogs , setLoading , getLoading , loading }}>
      
      {!AppbarPaths.includes(location.pathname) && (
        <div
        className={`backdrop-blur-sm bg-black/40 border-b border-white/5 z-20 ${
          location.pathname == "/" ? 'relative' : ''
          }`}
        >
          <Appbar />
        </div>
      )}
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800' : 'bg-gradient-to-br from-orange-100 via-rose-100 to-purple-100'
    }`}>
      {/* Render your AppBar or other components here */}
      
      <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/publish" element={<Publish />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/myblogs" element={<MyBlogs />} />
      </Routes>

      {/* Conditionally render the chatbot */}
      {!hideChatbotPaths.includes(location.pathname) && (
        <Chatbot isOpen={isChatOpen} setIsOpen={setIsChatOpen} isDarkMode={isDarkMode} />
      )}

      {!isChatOpen && !hideChatbotPaths.includes(location.pathname) && (
        <GyaniAIButton setIsChatOpen={setIsChatOpen} isDarkMode={isDarkMode} />
      )}
      
    </div>
    </BlogProvider>
  )
}

export default App