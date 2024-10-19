import { useEffect, useState } from "react";
import { Appbar } from "../components/Appbar"
import { Blog, useUserBlogs } from '../hooks';
import { BACKEND_URL } from "../config";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { BlogSkeletons } from "./Blogs";

interface BlogCardProps {
  id: number;
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
}

const formatDate = (date: string | Date): string => {
  const dateObj = (typeof date === "string") ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
  };
  return dateObj.toLocaleDateString('en-GB', options);
};


const Myblogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
      axios.get(`${BACKEND_URL}/api/v1/blog/userid`, {
          headers: {
              Authorization: localStorage.getItem("token")
          }
      })
          .then(response => {
              setBlogs(response.data.blogs);
              setLoading(false);
          })
  }, [])

    const [deleted, setDeleted] = useState<number[]>([]);
    const [editBlog, setEditBlog] = useState<Blog | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const deleteHandler = async (id: number) => {
        try {
          const token = localStorage.getItem("token"); // Get the token from local storage
          if (!token) {
            throw new Error('User not authenticated');
          }
          await axios.post(`${BACKEND_URL}/api/v1/blog/blogDelete`, 
            { id: id },
            {
              headers: {
                Authorization: `${token}`, // Include the auth token in the header
              }
            }
          );
          toast.success("Blog Deleted SucessFully!")
          setDeleted((prev) => [...prev, id]); // Add the deleted blog ID to the state
        } catch (error) {
          toast.error("error")
        }
      };
      const handleUpdate = async () => {
        if (editBlog) {
          try {
            await axios.post(`${BACKEND_URL}/api/v1/blog/updateBlog`, editBlog, {
              headers: {
                  Authorization: localStorage.getItem("token")
              }
          });          
          toast.success("Blog updated SucessFully!")
          setBlogs(blogs.map<Blog>(blog => blog.id === editBlog.id ? editBlog : blog));
            setEditBlog(null);
            setIsUpdating(false);
          } catch (error) {
            toast.error("Error while updating blog")
          }
        }
      }
      if (loading) {
        return <div className={`min-h-screen transition-colors duration-300 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800`}>
            <Appbar /> 
            <div  className="flex justify-center items-center flex-col">
              <div className={"text-3xl mt-4 md:text-5xl font-extrabold leading-tight md:leading-snug text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-600"}>
                  My Blogs
              </div>
                <div className="mt-4  space-y-3 w-[400px] md:w-[800px]">
                    <BlogSkeletons isDarkMode={true} />
                    <BlogSkeletons isDarkMode={true} />
                </div>
            </div>
        </div>
    }

    return <div className={`min-h-screen transition-colors duration-300 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800`}>
        <Appbar />
        <div  className="flex flex-col  items-center  justify-center mt-5 ">
            <div className={"text-3xl md:text-5xl font-extrabold leading-tight md:leading-snug text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-600"}>
                My Blogs
            </div>
            <div>
            {blogs
            .filter((blog) => !deleted.includes(blog.id)) // Filter out deleted blogs
            .map((blog) => (
              <div key={blog.id} className="rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl md:hover:scale-105 mb-4 mt-4 flex bg-gray-800 text-gray-100 ">
                
                <div className="p-4 mt-1 pb-4  sm:w-screen sm:max-w-screen-md">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <Avatar name={blog.author.name} isDarkMode={true} />
                      
                      <div className="pl-2 text-sm flex items-center">
                        <span>•</span>
                      </div>
                      <div className="pl-2 font-thin text-sm">
                        {formatDate(blog.publishedDate)}
                      </div>
                    </div>
                    <div>
                    <button
                    className="h-[30px] w-[90px]  md:text-md flex  justify-center items-center text-white font-semibold md:py-2 md:px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 mt-2 bg-gradient-to-r from-red-400 to-orange-700 shadow-md"
                    onClick={() => deleteHandler(blog.id)}
                  >
                    Delete
                  </button>
                    </div>
                  </div>

                  <Link to={`/blog/${blog.id}`}>
                    <div className="text-xl font-semibold hover:underline pt-2 cursor-pointer">
                      {blog.title}
                    </div>
                  </Link>

                  <div className="text-md font-thin">
                    {blog.content.slice(0, 200) + "..."}
                  </div>

                  <button
                    onClick={() => {
                      setIsUpdating(true);
                      setEditBlog(blog);
                    }}
                    className=" p-4 rounded-lg h-[30px] flex justify-center items-center mt-4 font-semibold md:text-md  text-white md:py-2  transition duration-300 ease-in-out transform hover:scale-105 bg-gradient-to-r from-purple-600 to-purple-800 shadow-md"
                  >
                    Update
                  </button>

                  
                </div>
                
              </div>
            ))}
            </div>
            {isUpdating && editBlog && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4 sm:p-8">
        <div className="bg-purple-500 p-4 sm:p-8 rounded-lg w-full sm:w-1/3 md:w-1/2 lg:w-1/3">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Update Blog</h2>
          <input
            type="text"
            value={editBlog.title}
            onChange={(e) => setEditBlog({ ...editBlog, title: e.target.value })}
            className="border p-2 mb-4 w-full rounded-md"
            placeholder="Question"
          />
          <textarea
            value={editBlog.content}
            onChange={(e) => setEditBlog({ ...editBlog, content: e.target.value })}
            className="border p-2 mb-4 w-full rounded-md"
            placeholder="Answer"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsUpdating(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Update
            </button>
          </div>
        </div>
      </div>
      
      )}
        </div>
    </div>
}



function Avatar({ name, isDarkMode }: { name: string; isDarkMode?: boolean }) {
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
      isDarkMode 
        ? 'border-purple-400 bg-purple-900 text-purple-100' 
        : 'border-indigo-400 bg-indigo-100 text-indigo-900'
    }`}>
      <span>{name[0].toUpperCase()}</span>
    </div>
  );
}

export default Myblogs