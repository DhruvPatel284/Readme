// import { useState } from "react";
// import { Appbar } from "../components/Appbar"
// import { BlogCard } from "../components/BlogCard"
// import { BlogSkeleton } from "../components/BlogSkeleton";
// import { useBlogs } from "../hooks";

// export const Blogs = () => {
//     const { loading, blogs } = useBlogs();
//     const [ searchTerm , setSearchTerm] = useState("");
//     const [suggestion , setSuggestion ] = useState(blogs);
    
//     const handleSearch = () =>{
//         setSearchTerm(searchTerm);
//         const results = suggestion.filter((blog) =>
//             blog.title.toLowerCase().includes(searchTerm?.toLowerCase()||"")
//         );
//         setSuggestion(results);
//     }
    
//     if (loading) {
//         return <div>
//             <Appbar /> 
//             <div  className="flex justify-center">
//                 <div>
//                     <BlogSkeleton />
//                     <BlogSkeleton />
//                     <BlogSkeleton />
//                     <BlogSkeleton />
//                     <BlogSkeleton />
//                 </div>
//             </div>
//         </div>
//     }
    
    

//     return <div>
//         <Appbar />
       
//         <input type="text" value={searchTerm} onChange={handleSearch} />
//         {!searchTerm&&
//             <div  className="flex justify-center">
//             <div>
//                 {blogs.map(blog => <BlogCard
//                     id={blog.id}
//                     authorName={blog.author.name || "Anonymous"}
//                     title={blog.title}
//                     content={blog.content}
//                     publishedDate={"2nd Feb 2024"}
//                 />)}
//             </div>
//         </div>}

//         {searchTerm&&
//             <div  className="flex justify-center">
//             <div>
//                 {suggestion.map(blog => <BlogCard
//                     id={blog.id}
//                     authorName={blog.author.name || "Anonymous"}
//                     title={blog.title}
//                     content={blog.content}
//                     publishedDate={"2nd Feb 2024"}
//                 />)}
//             </div>
//         </div>}


//     </div>
// }

import { useState, useEffect } from "react";
import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks";
import { Blog } from "../hooks/index";

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
        return (
            <div>
                <Appbar />
                <div className="flex justify-center">
                    <div>
                        <BlogSkeleton />
                        <BlogSkeleton />
                        <BlogSkeleton />
                        <BlogSkeleton />
                        <BlogSkeleton />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Appbar />
            <div className="flex justify-center my-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="border rounded py-2 px-4"
                    placeholder="Search blogs..."
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
                            publishedDate={"2nd Feb 2024"}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
