import useSWR from 'swr';
import { useEffect, useState } from "react"
import axios from "axios";
import { BACKEND_URL } from "../config";


export interface Blog {
    content: string;
    title: string;
    id: number;
    publishedDate: Date;
    author: {
        name: string;
    };
}

export const useBlog = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<Blog>();

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                setBlog(response.data.blog);
                setLoading(false);
            })
    }, [id])

    return {
        loading,
        blog
    }

}

const fetcher = (url: string) => axios.get(url, {
    headers: {
      Authorization: localStorage.getItem("token")
    }
  }).then(response => response.data);
  
export const useBlogs = () => {
const { data, error } = useSWR(`${BACKEND_URL}/api/v1/blog/bulk`, fetcher, {
    revalidateOnFocus: false,  
    dedupingInterval: 60000,   
});

return {
    loading: !data && !error,  
    blogs: data?.blogs || [],  
    error                      
};
};
export const useUserBlogs = () => {
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

    return {
        loading,
        blogs
    }

}