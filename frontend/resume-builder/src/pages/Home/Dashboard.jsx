import React ,{useEffect,useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import axiosInstance from '../../utils/axiosInstance';
import {API_PATHS} from '../../utils/apiPaths';
import DashboardLayout from "../../components/layouts/DashboardLayout";
import {LuCirclePlus,LuHouse} from "react-icons/lu";
import moment from "moment";
import ResumeSummaryCard from "../../components/Cards/ResumeSummaryCard";
import CreateResumeForm from "./CreateResumeForm";
import Modal from "../../components/Modal";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";

const Dashboard = () => {
  const {user} = useContext(UserContext);
  const navigate=useNavigate();
  const location = useLocation(); // ✅ detect when route changes (after navigation back)
  const [openCreateModal,setOpenCreateModal]=useState(false);
  const [allResumes,setAllResumes]=useState(null);

  // const fetchAllResumes=async()=>{
  //   try{
  //     const response=await axiosInstance.get(API_PATHS.RESUME.GET_ALL);
  //     setAllResumes(response.data);
  //   }catch(error){
  //     console.error("error fetching resumes:",error);
  //   }
  // };
  const fetchAllResumes = async () => {
  try {
    // ✅ Use correct endpoint based on user role
    let response;
    
    if (user?.role === 'admin') {
      // Admin viewing their own resumes
      response = await axiosInstance.get(
        API_PATHS.ADMIN.GET_USER_RESUMES(user._id)
      );
      // Response structure is different for admin endpoint
      setAllResumes(response.data.resumes); // ✅ Note: response.data.resumes
    } else {
      // Regular user
      response = await axiosInstance.get(API_PATHS.RESUME.GET_ALL);
      setAllResumes(response.data); // ✅ Note: response.data directly
    }
  } catch (error) {
    console.error("error fetching resumes:", error);
  }
};
 
  // ✅ Refetch whenever we open dashboard OR location changes
  useEffect(()=>{
    fetchAllResumes();
  },[location]);

  return (<DashboardLayout>
    {/* 👇 ADD THIS BLOCK HERE */}
    {/* <div className="px-4 md:px-6 lg:px-10 pt-6">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-xl font-semibold">
          Welcome, {user?.name}
        </h1>

        {user?.role === 'admin' && (
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
            Admin
          </span>
        )}
      </div>
    </div> */}
    {/* 🔥 Welcome Header */}
<div className="px-4 md:px-6 lg:px-10 pt-8">
  <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                  rounded-2xl p-6 shadow-lg text-white relative overflow-hidden">

    {/* Soft Glow Effect */}
    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

    <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">

      {/* Left Side */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ fontFamily: "Bahnschrift, sans-serif", letterSpacing: "0.5px" }}>
          Welcome Back ! {user?.name} 👋
        </h1>
        <p className="text-sm md:text-base text-white/80 mt-1" style={{ fontFamily: "Bahnschrift, sans-serif", fontWeight: 400 }}>
          Ready to build something amazing today?
        </p>
      </div>

      {/* Role Badge */}
      {/* {user?.role === 'admin' && (
        <span className="bg-white/20 backdrop-blur-md 
                         border border-white/30
                         px-4 py-2 rounded-full 
                         text-sm font-semibold tracking-wide">
          ✨ Admin Access
        </span>
      )}
    </div>
  </div>
</div> */}

{/* ✅ RIGHT SIDE: Role Badge + Back to Home Button */}
            <div className="flex items-center gap-3">
              {/* Role Badge (if admin) */}
              {user?.role === 'admin' && (
                <span className="bg-white/20 backdrop-blur-md 
                                 border border-white/30
                                 px-4 py-2 rounded-full 
                                 text-sm font-semibold tracking-wide">
                  ✨ Admin Access
                </span>
              )}

              {/* ✅ NEW: Back to Home Button */}
              <button
                onClick={() => navigate("/")}
                className="bg-violet-600 hover:bg-violet-700 
                           px-4 py-2 rounded-lg 
                           text-sm font-semibold 
                           flex items-center gap-2 
                           transition-all shadow-md"
              >
                <LuHouse className="text-lg" />
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>



    {/* Resume Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 
                    gap-4 sm:gap-6 md:gap-7 pt-2 pb-6 px-4 md:px-6 lg:px-10">
      <div
      className="flex flex-col gap-5 items-center justify-center 
                   bg-white rounded-2xl border border-purple-100 hover:border-purple-300 
                   hover:bg-purple-50/30 cursor-pointer shadow-sm hover:shadow-md 
                   transition-all duration-200 h-64 sm:h-72"
      onClick={()=> setOpenCreateModal(true)}
      >
        <div className="w-12 h-12 flex items-center justify-center bg-purple-200/20 rounded-2xl">
            <LuCirclePlus className="text-xl text-purple-500"/>
        </div>

        <h3 className="font-medium text-gray-800 text-center">Add New Resume</h3>
      </div>
      {allResumes?.map((resume)=>(
        <ResumeSummaryCard
        key={resume?._id}
        imgUrl={resume?.thumbnailLink || null}
        // title={resume.title}
        title={
    <span className="text-base sm:text-lg font-bold text-orange-700 font-trebuchet">
      {resume.title}
    </span>
  }
        //created at
        createdAt={
      resume?.createdAt
        ? moment(resume.createdAt).format("Do MMM YYYY")
        : ""
    }
    //updated at
        lastUpdated={
          resume?.updatedAt
             ? moment(resume.updatedAt).format("Do MMM YYYY")
             :""
          }
          onSelect={()=>navigate(`/resume/${resume?._id}`)}
          />
        ))}
    </div>

    <Modal
        isOpen={openCreateModal}
        onClose={()=>{
          setOpenCreateModal(false)
        }}
        hideHeader
        >
          <div>
            <CreateResumeForm
              onSuccess={() => {
              setOpenCreateModal(false); // close modal
              fetchAllResumes();         // refresh the resume list
//               useEffect(() => {
//   fetchAllResumes();
// }, [openCreateModal === false]);
             }}
        />

          </div>
        </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;
