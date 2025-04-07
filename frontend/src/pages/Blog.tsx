import { Appbar } from "../components/Appbar";
import { FullBlog } from "../components/FullBlog";
import { useParams } from "react-router-dom";



export const Blog = () => {
  const { id } = useParams<{ id: string }>(); // Destructure and specify type
  

  return (
    <div>
        
        <FullBlog id={id!}/>
      
    </div>
  );
};