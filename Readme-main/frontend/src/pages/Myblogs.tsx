import { useEffect, useState } from "react";
import { Appbar } from "../components/Appbar"
import { BlogCard } from "../components/BlogCard"
import { BlogSkeleton } from "../components/BlogSkeleton";
import { Blog, useUserBlogs } from '../hooks';
import { BACKEND_URL } from "../config";
import axios from "axios";
import { Link } from "react-router-dom";
import { updateBlogInput } from "@dhruv156328/medium-common";
import toast from "react-hot-toast";

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
  const [deleted, setDeleted] = useState<number[]>([]);
  const [editBlog, setEditBlog] = useState<Blog | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

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
          toast.success("Blog deleted successfully!")
          setDeleted((prev) => [...prev, id]); // Add the deleted blog ID to the state
        } catch (error) {
          console.error('Error deleting blog:', error);
          alert('Error deleting blog');
        }
      };
      const handleUpdate = async () => {
        if (editBlog) {
          try {
            console.log(editBlog)
            await axios.post(`${BACKEND_URL}/api/v1/blog/updateBlog`, editBlog, {
              headers: {
                  Authorization: localStorage.getItem("token")
              }
          });            
          
          toast.success("Blog updated successfully!")
          setBlogs(blogs.map<Blog>(blog => blog.id === editBlog.id ? editBlog : blog));
            setEditBlog(null);
            setIsUpdating(false);
          } catch (error) {
            console.error("Error updating flashcard:", error);
          }
        }
      }
      if (loading) {
        return <div>
            <Appbar /> 
            <div  className="flex justify-center">
                <div>
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                </div>
            </div>
        </div>
    }

    return <div>
        <Appbar />
        <div  className="flex flex-col  items-center  justify-center mt-5">
            <div className="text-2xl font-bold mt-1 mb-1">
                My Blogs
            </div>
            <div>
            {blogs
            .filter((blog) => !deleted.includes(blog.id)) // Filter out deleted blogs
            .map((blog) => (
              <div key={blog.id} className="mb-4 flex">
                
                  <div className="p-4 border-b border-slate-300  mt-1 pb-4 w-[400px] sm:w-screen sm:max-w-screen-md " > 
                        <div className="flex justify-between">
                          <div className="flex items-center">
                                <Avatar name = {blog.author.name} /> 
                                <div className="font-extralight pl-2 text-sm
                                flex justify-center flex-col ">{blog.author.name}</div>
                                <div className="flex  pl-2 justify-center flex-col">
                                    <Circle/>
                                </div>
                                <div className="pl-2 font-thin  text-sm justify-center flex-col">
                                  {formatDate(blog.publishedDate)}
                                </div>
                          </div>
                          <div>
                              <button
                              className="h-[10px] text-xl text-red-600 font-semibold md:py-2 md:px-4 rounded  transition duration-300 ease-in-out transform hover:-translate-y-1 mt-2"
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
                            {blog.content.slice(0,200) + "..."}
                        </div>
                        <div onClick={() => {
                          setIsUpdating(true);
                          setEditBlog(blog);
                        }} className="pt-4 font-semibold text-xl cursor-pointer text-blue-700 md:py-2  rounded  transition duration-300 ease-in-out transform hover:-translate-y-1">
                            Update
                        </div>
                  </div>
                
              </div>
            ))}
            </div>
            {isUpdating && editBlog && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4 sm:p-8">
        <div className="bg-green-500 p-4 sm:p-8 rounded-lg w-full sm:w-1/3 md:w-1/2 lg:w-1/3">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Update Flashcard</h2>
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
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
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
export function Circle(){
  return <div className="h-1 w-1  rounded-full bg-slate-300">

  </div>
}
export function Avatar({ name,size ="small" } : { name: string , size ?: "small" | "big"}){
  return <div className={`flex justify-center bg-gray-400 rounded-full dark:bg-gray-600 ${size === "small" ? "w-6 h-6" : "w-10 h-10"} ` }>
  <span className={`${size === "small" ? "text-xs" : "text-xl"} m-auto font-extralight text-white dark:text-gray-300 `}>{name[0]}</span>
</div>
}
export default Myblogs