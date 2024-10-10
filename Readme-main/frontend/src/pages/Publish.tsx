import { Appbar } from "../components/Appbar";
import axios from "axios";
import { BACKEND_URL, RAG_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";

export const Publish = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    return (
        <div className={`min-h-screen transition-colors duration-300 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800`}>
            <Appbar />
            <div className="flex flex-col items-center w-full pt-8"> 
                <div className={"text-3xl md:text-5xl font-extrabold leading-tight md:leading-snug text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600"}>
                    Write Blog
                </div>
                <div className="max-w-screen-lg mt-10 w-full bg-black shadow-md rounded-lg p-6"> {/* Added background and padding */}
                    <input 
                        onChange={(e) => setTitle(e.target.value)} 
                        type="text" 
                        className="focus:outline-none rounded-lg p-2 block w-full  px-3 text-md font-semibold text-black font-bold text-xl md:text-xl bg-purple-500 border-0 placeholder:text-slate-700   mb-4" 
                        placeholder="Title" 
                    />

                    <TextEditor onChange={(e) => setDescription(e.target.value)} />

                    <button 
                        onClick={async () => {
                            try {
                                const response = await axios.post(`${BACKEND_URL}/api/v1/blog`, {
                                    title,
                                    content: description
                                }, {
                                    headers: {
                                        Authorization: localStorage.getItem("token")
                                    }
                                });

                                await axios.post(`${RAG_URL}`, {
                                    title,
                                    content: description
                                });

                                toast.success("Blog Published Successfully!");
                                navigate(`/blog/${response.data.id}`);
                            } catch (error) {
                                toast.error("Error publishing blog!");
                            }
                        }} 
                        type="submit" 
                        className="mt-4 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-black bg-gradient-to-r from-purple-600 to-blue-800 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-700">
                        Publish Post
                    </button>
                </div>
            </div>
        </div>
    );
}

function TextEditor({ onChange }: { onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void }) {
    return (
        <div className="mt-2">
            <div className="w-full mb-4">
                <div className="flex items-center justify-between rounded-lg">
                    <div className="   w-full">
                        <textarea 
                            onChange={onChange} 
                            id="editor" 
                            rows={8} 
                            className="focus:outline-none rounded-lg p-2 block w-full  px-3 text-md font-semibold text-black bg-purple-500 border-0 placeholder:text-slate-700" 
                            placeholder="Write an article..." 
                            required 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}