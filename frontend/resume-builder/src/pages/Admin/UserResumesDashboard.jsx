import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuCirclePlus, LuArrowLeft ,LuHouse} from "react-icons/lu";
import moment from "moment";
import ResumeSummaryCard from "../../components/Cards/ResumeSummaryCard";
import CreateResumeForm from "../Home/CreateResumeForm";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";

const UserResumesDashboard = () => {
  const { userId } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [targetUser, setTargetUser] = useState(null);
  const [allResumes, setAllResumes] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      toast.error("Access denied");
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const fetchUserResumes = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.ADMIN.GET_USER_RESUMES(userId)
      );

      setTargetUser(response.data.user);
      setAllResumes(response.data.resumes);
    } catch (error) {
      console.error("Error fetching user resumes:", error);
      toast.error("Failed to fetch resumes");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserResumes();
    }
  }, [userId]);

  return (
    <DashboardLayout>
      <div className="px-4 md:px-6 lg:px-10 pt-8">
        {/* Header with Back Button */}
        {/* ✅ UPDATED Header */}
        {/* <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-2xl p-6 shadow-lg text-white relative overflow-hidden mb-6">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-3 text-sm"
          >
            <LuArrowLeft />
            Back to Admin Dashboard
          </button>

          <h1 className="text-2xl md:text-3xl font-bold">
            Managing: {targetUser?.name}'s Resumes
          </h1>
          <p className="text-sm text-white/80 mt-1">
            {targetUser?.email} | Role: {targetUser?.role}
          </p>
        </div>
      </div> */}

      <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-2xl p-6 shadow-lg text-white relative overflow-hidden mb-6">
          <div className="flex items-center justify-between mb-4">
            {/* ✅ Left: Back to Admin Dashboard Button */}
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-md"
            >
              <LuArrowLeft />
              Back to Admin Dashboard
            </button>

            {/* ✅ Right: Go Back to Home Page Button */}
            <button
              onClick={() => navigate("/")}
              className="bg-white/20 backdrop-blur-md border border-white/30
                         hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-semibold
                         flex items-center gap-2 transition-all"
            >
              <LuHouse className="text-lg" />
              Go Back to Home Page
            </button>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold">
            Managing: {targetUser?.name}'s Resumes
          </h1>
          <p className="text-sm text-white/80 mt-1">
            Email ID : {targetUser?.email || "Loading..."} |{" "}
            <span className="font-semibold bg-white/20 px-2 py-0.5 rounded ml-1">
              {/* {targetUser?.role || "N/A"} */}
               {/* ✅ FIX: Get role from backend response */}
              Role: {targetUser?.role ? targetUser.role.toUpperCase() : "USER"}
            </span>
          </p>
        </div>
      </div>

      {/* Resume Grid (Same as User Dashboard) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-7 pt-2 pb-6 px-4 md:px-6 lg:px-10">
        <div
          className="flex flex-col gap-5 items-center justify-center bg-white rounded-2xl border border-teal-100 hover:border-teal-300 hover:bg-teal-50/30 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 h-64 sm:h-72"
          onClick={() => setOpenCreateModal(true)}
        >
          <div className="w-12 h-12 flex items-center justify-center bg-teal-200/20 rounded-2xl">
            <LuCirclePlus className="text-xl text-teal-500" />
          </div>
          <h3 className="font-medium text-gray-800 text-center">
            Add New Resume
          </h3>
        </div>

        {allResumes?.map((resume) => (
          <ResumeSummaryCard
            key={resume._id}
            imgUrl={resume.thumbnailLink || null}
            title={
              <span className="text-base sm:text-lg font-bold text-orange-700">
                {resume.title}
              </span>
            }
            createdAt={
              resume.createdAt
                ? moment(resume.createdAt).format("Do MMM YYYY")
                : ""
            }
            lastUpdated={
              resume.updatedAt
                ? moment(resume.updatedAt).format("Do MMM YYYY")
                : ""
            }
            onSelect={() => navigate(`/resume/${resume._id}`)}
          />
        ))}
      </div>

      <Modal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        hideHeader
      >
        <CreateResumeForm
          onSuccess={() => {
            setOpenCreateModal(false);
            fetchUserResumes();
          }}
          // ✅ ADD THIS LINE - Pass the user ID we're managing
    targetUserId={userId}    // to resolve problem of resume creating for user going to adminn dashbaord
        />
      </Modal>
    </DashboardLayout>
  );
};

export default UserResumesDashboard;