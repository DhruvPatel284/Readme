
import { useEffect, useState } from "react";
import { Appbar } from "../components/Appbar"
import { BlogCard } from "../components/BlogCard"
import { BlogSkeleton } from "../components/BlogSkeleton";
import { Blog, useBlogs } from "../hooks";

export const Blogs = () => {
    const { loading, blogs } = useBlogs();
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestion, setSuggestion] = useState<Blog[]>([]);
    useEffect(() => {
        if (!searchTerm) {
            setSuggestion(blogs);
        } else {
            const results = blogs.filter((blog) =>
                blog.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSuggestion(results);
        }
    }, [searchTerm, blogs]);
    const handleSearchChange = (event:any) => {
        setSearchTerm(event.target.value);
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
    <div className="flex justify-center my-4 mt-5">
        <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border rounded py-2 px-4"
            placeholder="Find your blog..."
        />
    </div>
    <div className="flex justify-center">
        <div>
            {(searchTerm ? suggestion : blogs).map((blog) => (
                <BlogCard
                    key={blog.id}
                    id={blog.id}
                    authorName={blog.author.name || "Anonymous"}
                    title={blog.title}
                    content={blog.content}
                    publishedDate={blog.publishedDate}
                />
            ))}
        </div>
    </div>
</div>
}
