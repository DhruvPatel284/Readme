import { useState } from "react";
import { Appbar } from "../components/Appbar"
import { BlogCard } from "../components/BlogCard"
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useUserBlogs } from '../hooks';
import { BACKEND_URL } from "../config";
import axios from "axios";
import { Link } from "react-router-dom";

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
    const { loading, blogs } = useUserBlogs();
    const [deleted, setDeleted] = useState<number[]>([]);
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
          setDeleted((prev) => [...prev, id]); // Add the deleted blog ID to the state
        } catch (error) {
          console.error('Error deleting blog:', error);
          alert('Error deleting blog');
        }
      };

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
                              className="h-[10px]  font-semibold md:py-2 md:px-4 rounded  transition duration-300 ease-in-out transform hover:-translate-y-1 mt-2"
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
                        <div className=" text-slate-500 text-sm font-thin pt-4">
                            { `${Math.ceil(blog.content.length/100)} minute(s) 
                            read` }
                        </div>
                  </div>
                {/* <BlogCard
                  id={blog.id}
                  authorName={blog.author.name || "Anonymous"}
                  title={blog.title}
                  content={blog.content}
                  publishedDate={"2nd Feb 2024"}
                /> */}
                {/* <button
                  className="h-[10px]  font-semibold md:py-2 md:px-4 rounded  transition duration-300 ease-in-out transform hover:-translate-y-1 mt-2"
                  onClick={() => deleteHandler(blog.id)}
                >
                   Delete 
                </button> */}
              </div>
            ))}
            </div>
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