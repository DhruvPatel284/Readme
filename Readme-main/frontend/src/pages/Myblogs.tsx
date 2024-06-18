import { useState } from "react";
import { Appbar } from "../components/Appbar"
import { BlogCard } from "../components/BlogCard"
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useUserBlogs } from '../hooks';
import { BACKEND_URL } from "../config";
import axios from "axios";

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
                <BlogCard
                  id={blog.id}
                  authorName={blog.author.name || "Anonymous"}
                  title={blog.title}
                  content={blog.content}
                  publishedDate={"2nd Feb 2024"}
                />
                <button
                  className="h-[10px] text-red-500 font-semibold py-2 px-4 rounded  transition duration-300 ease-in-out transform hover:-translate-y-1 mt-2"
                  onClick={() => deleteHandler(blog.id)}
                >
                   Delete 
                </button>
              </div>
            ))}
            </div>
        </div>
    </div>
}

export default Myblogs