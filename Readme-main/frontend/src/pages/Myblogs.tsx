import React, { useEffect, useState } from "react";
import { Appbar } from "../components/Appbar";
import { Blog } from '../hooks';
import { BACKEND_URL } from "../config";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Pencil, Trash2, Clock, ChevronRight, BookOpen } from "lucide-react";
import { BlogSkeletons } from "./Blogs";
import { jwtDecode } from "jwt-decode";
import useContextedBlogs from "../context/theme";

const formatDate = (date: string | Date): string => {
  const dateObj = (typeof date === "string") ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  };
  return dateObj.toLocaleDateString('en-GB', options);
};
interface CustomJwtPayload {
  id: string,
  name : string,
  username : string// Add other fields from your JWT payload if needed
}
const MyBlogs = () => {
  //const [loading, setLoading] = useState(true);
  const[ isloading , setISloading ] = useState(false);
  const { blogs , loading , setLoading  } = useContextedBlogs();
  const [blogForLocalState, setBlogs] = useState<Blog[]>([]);
  const [deleted, setDeleted] = useState<number[]>([]);
  const [editBlog, setEditBlog] = useState<Blog | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAdmin , setIsAdmin] = useState<boolean>(false);
  const [ userID , setUserID ] = useState<string>("");
  useEffect(() => {
    const fetchBlogs = async () => {
      const token = localStorage.getItem("token") || "";
      let backendCall;
  
      try {
        // Step 1: Decode the JWT token
        const decodedToken = jwtDecode<CustomJwtPayload>(token);
        setUserID(decodedToken.id);
        console.log(userID)
        // Step 2: Extract the username (email)
        const username = decodedToken.username || ""; // Assuming the token payload has a 'username' field
        // Step 3: Check if the email contains '@admin'
        if (username.includes("@admin")) {
          setIsAdmin(true);
          setBlogs(blogs);
          backendCall = `${BACKEND_URL}/api/v1/blog/bulk`;
        } else {
          // const FilteredAsUserBlog = blogs.filter( (blog) => 
          // {
          //   blog.authorId.toString() === userID.toString()
          //   console.log(userID.toString())
          // } );
          // setBlogs(FilteredAsUserBlog)
          setISloading(true);
          backendCall = `${BACKEND_URL}/api/v1/blog/userid`;
          // Step 4: Make the API call
            const response = await axios.get(backendCall, {
              headers: {
                Authorization: token
              }
            });
            setBlogs(response.data.blogs);
            setISloading(false);    
        }
        
        
        
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(!loading);
      }
    };
  
    fetchBlogs();
  }, []);
  

  const deleteHandler = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error('User not authenticated');
      
      await axios.post(`${BACKEND_URL}/api/v1/blog/blogDelete`, 
        { id }, 
        { headers: { Authorization: token } }
      );
      toast.success("Blog deleted successfully!");
      setLoading(!loading);
      setDeleted(prev => [...prev, id]);
    } catch (error) {
      toast.error("Failed to delete blog");
    }
  };

  const handleUpdate = async () => {
    if (!editBlog) return;
    
    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/blog/updateBlog`, 
        editBlog, 
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      
      toast.success("Blog updated successfully!");
      setBlogs(blogs.map(blog => blog.id === editBlog.id ? editBlog : blog));
      setEditBlog(null);
      setIsUpdating(false);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to update blog");
    }
  };

  const HeaderSection = () => (
    <div className="relative mb-16">
      <div className="absolute bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl transform -skew-y-6"></div>
      <div className="relative flex flex-col items-center">
        <div className="flex ">
          <h1 className="text-3xl md:text-5xl eading-tight md:leading-snug font-extrabold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400">
            My Blogs
          </h1>
        </div>
        <div className="h-1 w-[20%] bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full mt-4"></div>
      </div>
    </div>
  );

  if (isloading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-purple-900 to-violet-950">
        <div className="   max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <HeaderSection />
          <div className="grid gap-6 self-center">
            <BlogSkeletons isDarkMode={true} />
            <BlogSkeletons isDarkMode={true} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-purple-900 to-violet-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <HeaderSection />
        
        <div className="grid gap-6">
          {blogForLocalState
            .filter(blog => !deleted.includes(blog.id)  )
            .map(blog => ( 
              <div key={blog.id} 
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] border border-purple-500/20 hover:border-pink-500/30 shadow-lg hover:shadow-purple-500/10">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <Avatar name={blog.author.name} />
                      <div>
                        <h3 className="text-gray-200 font-medium">{blog.author.name}</h3>
                        <div className="flex items-center text-gray-400 text-sm">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDate(blog.publishedDate)}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setIsUpdating(true);
                          setEditBlog(blog);
                        }}
                        className="p-2 rounded-lg text-purple-300 hover:bg-purple-900/50 transition-colors"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteHandler(blog.id)}
                        className="p-2 rounded-lg text-red-300 hover:bg-red-900/50 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <Link to={`/blog/${blog.id}`}>
                    <h2 className="text-2xl font-bold mb-3 text-gray-100 hover:text-purple-300 transition-colors">
                      {blog.title}
                    </h2>
                    <p className="text-gray-400 mb-4 line-clamp-3">
                      {blog.content}
                    </p>
                    <div className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
                      Read more <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </Link>
                </div>
              </div>
            ))}
        </div>

        {isUpdating && editBlog && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl border border-purple-500/20">
              <h2 className="text-2xl font-bold mb-6 text-gray-100">Update Blog</h2>
              <input
                type="text"
                value={editBlog.title}
                onChange={(e) => setEditBlog({ ...editBlog, title: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 mb-4 text-gray-100 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                placeholder="Blog Title"
              />
              <textarea
                value={editBlog.content}
                onChange={(e) => setEditBlog({ ...editBlog, content: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 mb-6 h-48 text-gray-100 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                placeholder="Blog Content"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsUpdating(false)}
                  className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                >
                  Update Blog
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function Avatar({ name }: { name: string }) {
  return (
    <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold bg-gradient-to-br from-purple-500 to-pink-500 text-white">
      {name[0].toUpperCase()}
    </div>
  );
}

export default MyBlogs;