import { useNavigate } from 'react-router-dom';
import { Appbar } from '../components/Appbar';


export const Homepage = () => {
  const navigate = useNavigate();

  // Function to check if the user is signed in by looking for a JWT in localStorage
  const isUserSignedIn = () => {
    return localStorage.getItem('token') !== null;
  };

  const handleViewMoreClick = () => {
    navigate('/blogs');
  };

  const handleLoginClick = () => {
    navigate('/signin');
  };

  return (
    <div className="min-h-screen w-full bg-slate-300">
        <div className='shadow-md shadow-slate-600'>
          <Appbar />
        </div>
      {/* Main Content Container */}
      <div className="flex flex-col md:flex-row bg-slat-50">
        {/* Hero Section */}
        <section className="flex flex-col items-start text-left  py-20 md:w-[47%] px-8">
          <h1 className="text-3xl  font-bold mb-4 text-slate-700">Read-Me : Your Destination for Quality Content</h1>
          <p className="text-gray-600 mt-2 mb-8">
         ReadMe is committed to delivering high-quality content that captivates and educates. From  in-depth articles to quick reads, our blog is your one-stop destination for all  things    interesting and enlightening.
          </p>
          
          {isUserSignedIn() ? (
            <button
              className="bg-blue-600 text-white hover:bg-blue-700 font-bold rounded-full md:w-[30%] md:rounded px-6 py-2 "
              onClick={handleViewMoreClick}
            >
              View more
            </button>
          ) : (
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-full"
              onClick={handleLoginClick}
            >
              View more
            </button>
          )}
        </section>

        {/* Template Preview Section */}
        <section className="flex justify-center  items-center py-20  md:w-[57%]">
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-8">
            <img src="../images/home1.jpg" alt="Template 1" className="hover:scale-110   shadow-slate-400  transition-all shadow-xl shadow-slate-300  border-2  rounded-lg max-h-[200px] max-w-[300px]" />
            <img src="../images/home2.jpg" alt="Template 2" className="hover:scale-110  shadow-slate-400 transition-all shadow-xl shadow-slate-300  border-2 rounded-lg max-h-[200px] min-w-[300px]" />
            <img src="../images/home3.jpg" alt="Template 3" className="hover:scale-110  shadow-slate-400 transition-all shadow-xl shadow-slate-300 border-2 rounded-lg max-h-[200px] min-w-[300px]" />
            <img src="../images/home4.jpg" alt="Template 4" className="hover:scale-110    shadow-slate-400  transition-all shadow-xl  shadow-slate-300 rounded-lg  border-2 max-h-[200px] min-w-[300px] max-w-[300px] min-h-[200px]" />
          </div>
          {/* <div className='h-[200px]'>
            <img src="../images/bloghome.jpg" alt="" />
          </div> */}
        </section>
      </div>
    </div>
  );
}; 
export default Homepage;