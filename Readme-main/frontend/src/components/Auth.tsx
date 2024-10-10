import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { SignupInput } from "@dhruv156328/medium-common";
import toast from "react-hot-toast";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name: "",
        username: "",
        password: "",
    });

    async function sendRequest() {
        try {
            toast.loading("Auth in progress");
            const response = await axios.post(
                `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
                postInputs
            );
            if (!response) {
                toast.error("Error while logging in!");
            }
            toast.dismiss();
            toast.success("Logged In!");
            const jwt = response.data;
            localStorage.setItem("token", jwt);
            navigate("/blogs");
        } catch (e) {
            toast.dismiss();
            toast.error("Error while logging in!");
        }
    }

    return (
        <div className="h-screen flex justify-center items-center bg-purple-900"> {/* Purple gradient background */}
            <div className="max-w-md w-full bg-black shadow-md rounded-lg p-6">
                <div className="text-center">
                    <h1 className="text-3xl  font-extrabold leading-tight md:leading-snug text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-800 mb-2">
                        {type === "signin" ? "Login" : "Create an account"}
                    </h1>
                    <p className="text-sm text-slate-300">
                        {type === "signin"
                            ? "Don't have an account?"
                            : "Already have an account?"}
                        <Link
                            className="pl-2 underline text-blue-500 hover:text-blue-700"
                            to={type === "signin" ? "/signup" : "/signin"}
                        >
                            {type === "signin" ? "Sign up" : "Sign in"}
                        </Link>
                    </p>
                </div>
                <div className="pt-8 ">
                    {type === "signup" && (
                        <LabelledInput
                            label="Name"
                            placeholder="John Doe"
                            onChange={(e) =>
                                setPostInputs({
                                    ...postInputs,
                                    name: e.target.value,
                                })
                            }
                        />
                    )}
                    <LabelledInput
                        label="Email"
                        placeholder="john@gmail.com"
                        onChange={(e) =>
                            setPostInputs({
                                ...postInputs,
                                username: e.target.value,
                            })
                        }
                    />
                    <LabelledInput
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        onChange={(e) =>
                            setPostInputs({
                                ...postInputs,
                                password: e.target.value,
                            })
                        }
                    />
                    <button
                        onClick={sendRequest}
                        type="button"
                        className="mt-8 w-full text-white bg-gradient-to-r from-blue-400   to-purple-700 hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5"
                    >
                        {type === "signup" ? "Sign up" : "Sign in"}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

function LabelledInput({ label, placeholder, onChange, type }: LabelledInputType) {
    return (
        <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-400"> {label} </label>
            <input
                onChange={onChange}
                type={type || "text"}
                className="bg-gray-300 border border-gray-300 text-gray-900 text-sm md:text-md font-semibold rounded-lg 
                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder:text-gray-400 font-medium"
                placeholder={placeholder}
                required
            />
        </div>
    );
}