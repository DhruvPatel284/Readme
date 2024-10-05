// import { Appbar } from "../components/Appbar"
// import axios from "axios";
// import { BACKEND_URL } from "../config";
// import { useNavigate } from "react-router-dom";
// import { ChangeEvent, useState } from "react";

// export const Publish = () => {
//     const [title, setTitle] = useState("");
//     const [description, setDescription] = useState("");
//     const navigate = useNavigate();

//     return <div>
//         <Appbar />
//         <div className="flex justify-center w-full pt-8"> 
//             <div className="max-w-screen-lg w-full">
//                 <input onChange={(e) => {
//                     setTitle(e.target.value)
//                 }} type="text" className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Title" />

//                 <TextEditor onChange={(e) => {
//                     setDescription(e.target.value)
//                 }} />
//                 <button onClick={async () => {
//                     const response = await axios.post(`${BACKEND_URL}/api/v1/blog`, {
//                         title,
//                         content: description
//                     }, {
//                         headers: {
//                             Authorization: localStorage.getItem("token")
//                         }
//                     });
//                     navigate(`/blog/${response.data.id}`)
//                 }} type="submit" className="mt-4 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
//                     Publish post
//                 </button>
//             </div>
//         </div>
//     </div>
// }


// function TextEditor({ onChange }: {onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void}) {
//     return <div className="mt-2">
//         <div className="w-full mb-4 ">
//             <div className="flex items-center justify-between border">
//             <div className="my-2 bg-white rounded-b-lg w-full">
//                 <label className="sr-only">Publish post</label>
//                 <textarea onChange={onChange} id="editor" rows={8} className="focus:outline-none block w-full px-0 text-sm text-gray-800 bg-white border-0 pl-2" placeholder="Write an article..." required />
//             </div>
//         </div>
//        </div>
//     </div>
    
// }


import { Appbar } from "../components/Appbar";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { ChangeEvent, useState } from "react";
import { debounce } from 'lodash';

export const Publish = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    return (
        <div>
            <Appbar />
            <div className="flex justify-center w-full pt-8">
                <div className="max-w-screen-lg w-full">
                    <input
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Title"
                    />

                    <TextEditor onChange={(e) => setDescription(e.target.value)} />

                    <button
                        onClick={async () => {
                            const response = await axios.post(
                                `${BACKEND_URL}/api/v1/blog`,
                                {
                                    title,
                                    content: description,
                                },
                                {
                                    headers: {
                                        Authorization: localStorage.getItem("token"),
                                    },
                                }
                            );
                            navigate(`/blog/${response.data.id}`);
                        }}
                        type="submit"
                        className="mt-4 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
                    >
                        Publish post
                    </button>
                </div>
            </div>
        </div>
    );
};

function TextEditor({
    onChange,
}: {
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}) {
    const [text, setText] = useState("");
    const [suggestion, setSuggestion] = useState("");

    // Debounce the API call to avoid too many requests
    const handleTextChange = debounce(async (e: ChangeEvent<HTMLTextAreaElement>) => {
        const inputText = e.target.value;
        setText(inputText);
        onChange(e);
        
        // Only call API after typing more than 10 characters
        if (inputText.length > 10) {
            try {
                const response = await axios.post(
                    'https://api-inference.huggingface.co/models/gpt2',
                    {
                        inputs: inputText,  // inputText should be a string
                        parameters: {
                            max_new_tokens: 100,  // Limit the output tokens
                        },
                    },
                    {
                        headers: {
                            Authorization: `Bearer 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`,  // Replace with your access token
                            'Content-Type': 'application/json',
                        },
                    }
                );
                
                
                
                const generatedText = response.data[0].generated_text;
                setSuggestion(generatedText);
            } catch (error) {
                //@ts-ignore
                console.error("Error fetching AI suggestion:", error?.response.data);
            }
        }
    }, 500); // Debounce delay of 500ms

    return (
        <div className="mt-2">
            <div className="w-full mb-4">
                <div className="flex items-center justify-between border">
                    <div className="my-2 bg-white rounded-b-lg w-full">
                        <label className="sr-only">Publish post</label>
                        <textarea
                            onChange={handleTextChange}
                            id="editor"
                            rows={8}
                            className="focus:outline-none block w-full px-0 text-sm text-gray-800 bg-white border-0 pl-2"
                            placeholder="Write an article..."
                            required
                        />
                    </div>
                </div>
                {/* AI Suggestion Display */}
                {suggestion && (
                    <div className="mt-2 p-2 bg-gray-50 border border-gray-300 rounded">
                        <strong>AI Suggestion:</strong> {suggestion}
                    </div>
                )}
            </div>
        </div>
    );
}
