
import { Link } from "react-router-dom";


interface BlogCardProps {
    id: number;
    authorName: string;
    title: string;
    content: string;
    publishedDate: string;
}
export const BlogCard = ({
    id,
    authorName,
    title,
    content,
    publishedDate
}:BlogCardProps) => {
    return <Link to={`/blog/${id}`}>
    <div className="p-4 border-b border-slate-300  mt-1 pb-4 w-screen max-w-screen-md cursor-pointer" > 
           <div className="flex items-center">
                <Avatar name = {authorName} /> 
                <div className="font-extralight pl-2 text-sm
                 flex justify-center flex-col ">{authorName}</div>
                <div className="flex  pl-2 justify-center flex-col">
                    <Circle/>
                </div>
                <div className="pl-2 font-thin  text-sm justify-center flex-col">
                   {publishedDate}
                </div>
           </div>
           <div className="text-xl font-semibold pt-2">
              {title}
           </div>
           <div className="text-md font-thin">
               {content.slice(0,200) + "..."}
           </div>
           <div className=" text-slate-500 text-sm font-thin pt-4">
               { `${Math.ceil(content.length/100)} minute(s) 
               read` }
           </div>
    </div>
    </Link>
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
