import { createContext, useContext } from "react";

// Define the Blog interface

// Define the context type
interface BlogContextType {
  blogs: Blog[];
  loading : boolean;
  getBlogs: () => Blog[];
  setLoading: (value: boolean) => void; // Accept a boolean value
  getLoading: () => boolean;
}
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
// Create the context with default values
export const BlogContext = createContext<BlogContextType>({
  blogs: [],
  loading : true,
  getBlogs: () => [],
  setLoading: (value:boolean) => {},
  getLoading: () => true
});

export const BlogProvider = BlogContext.Provider;

export default function useContextedBlogs() {
  return useContext(BlogContext);
}