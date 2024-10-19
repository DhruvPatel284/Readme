'use client'

import { ChangeEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { BACKEND_URL } from "../config"
import axios from "axios"
import { SignupInput } from "@dhruv156328/medium-common"
import { Toaster, toast } from "react-hot-toast"
import { motion } from "framer-motion"
import { LockIcon, MailIcon, UserIcon } from "lucide-react"

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate()
  const [postInputs, setPostInputs] = useState<SignupInput>({
    name: "",
    username: "",
    password: "",
  })

  async function sendRequest() {
    try {
      toast.loading("Authentication in progress")
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
        postInputs
      )
      if (!response) {
        toast.error("Error while logging in!")
      }
      toast.dismiss()
      toast.success("Logged In!")
      const jwt = response.data
      localStorage.setItem("token", jwt)
      navigate("/blogs")
    } catch (e) {
      toast.dismiss()
      toast.error("Error while logging in!")
    }
  }
  async function LoginAsGuest() {
    try {
      
      toast.loading("Authentication in progress")
      const response = await axios.post( `${BACKEND_URL}/api/v1/user/signin`, {
          username: "kunj@gmail.com",
          password: "123456",
        }
      );
      if (!response) {
        toast.error("Error while logging in!")
      }
      toast.dismiss()
      toast.success("Logged In!")
      const jwt = response.data
      localStorage.setItem("token", jwt)
      navigate("/blogs")
    } catch (e) {
      toast.dismiss()
      toast.error("Error while logging in!")
    }
  }
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-700 to-indigo-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 m-4"
      >
        <div className="text-center">
          <h1 className="text-4xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-2">
            {type === "signin" ? "Welcome Back" : "Join Us Today"}
          </h1>
          <p className="text-sm text-gray-600 mb-8">
            {type === "signin"
              ? "Don't have an account?"
              : "Already have an account?"}
            <Link
              className="ml-1 font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              to={type === "signin" ? "/signup" : "/signin"}
            >
              {type === "signin" ? "Sign up" : "Sign in"}
            </Link>
          </p>
        </div>
        <div className="space-y-6">
          {type === "signup" && (
            <LabelledInput
              label="Name"
              placeholder="John Doe"
              icon={<UserIcon className="h-5 w-5 text-gray-400" />}
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
            placeholder="john@example.com"
            icon={<MailIcon className="h-5 w-5 text-gray-400" />}
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
            icon={<LockIcon className="h-5 w-5 text-gray-400" />}
            onChange={(e) =>
              setPostInputs({
                ...postInputs,
                password: e.target.value,
              })
            }
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={sendRequest}
            className="w-full text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-3 transition-all duration-300 ease-in-out"
          >
            {type === "signup" ? "Create Account" : "Sign In"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={LoginAsGuest}
            className="w-full text-indigo-600 bg-white border-2 border-indigo-600 hover:bg-indigo-50 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-3 transition-all duration-300 ease-in-out mt-4"
          >
            Login as Guest
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

interface LabelledInputType {
  label: string
  placeholder: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  type?: string
  icon?: React.ReactNode
}

function LabelledInput({ label, placeholder, onChange, type, icon }: LabelledInputType) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          onChange={onChange}
          type={type || "text"}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 p-2.5 transition-all duration-300 ease-in-out"
          placeholder={placeholder}
          required
        />
      </div>
    </div>
  )
}