// import React, { useState, useRef, useEffect } from "react";
// import Slider from "react-slick";
// import { useNavigate } from "react-router-dom";
// import { LuArrowRight } from "react-icons/lu";
// import Modal from "./Modal";
// import CreateResumeForm from "../pages/Home/CreateResumeForm.jsx";
// import { resumeTemplates, DUMMY_RESUME_DATA, themeColorPalette } from "../utils/data";
// import RenderResume from "./ResumeTemplates/RenderResume";

// const TemplateCarousel = ({ onTemplateSelect }) => {
//   const navigate = useNavigate();
//   const [openModal, setOpenModal] = useState(false);
//   const [selectedTemplateId, setSelectedTemplateId] = useState(null);
//   const [containerWidth, setContainerWidth] = useState(260);
//   const ref = useRef(null);

//   // measure width for responsive scale of RenderResume
//   useEffect(() => {
//     if (ref.current) setContainerWidth(ref.current.offsetWidth);
//   }, []);

//   const openCreateModal = (templateId) => {
//     setSelectedTemplateId(templateId);
//     setOpenModal(true);
//   };

//   const settings = {
//     infinite: true,
//     speed: 2500,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 1,
//     cssEase: "linear",
//     pauseOnHover: true,
//     arrows: false,
//     responsive: [
//       { breakpoint: 1024, settings: { slidesToShow: 2 } },
//       { breakpoint: 768, settings: { slidesToShow: 1 } },
//     ],
//   };

//   return (
//     <div className="w-full py-10 bg-gray-50">
//       <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">
//         {/* Explore Resume Templates */}Pick one of many world-class templates<br/> and build your resume in minutes!
//       </h2>


// <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3" ref={ref}>
//   {resumeTemplates.map((template) => (
//     <div key={template.id} className="relative group rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-white">
      
//       {/* Auto-scaled live preview */}
//       <div className="relative flex items-center justify-center bg-white overflow-hidden h-[300px] md:h-[420px]">
//         <div
//           className="relative rounded-xl shadow-sm transition-transform duration-300 ease-in-out group-hover:scale-[1.02] w-full"
//           style={{
//             transformOrigin: "center left",
//             // transform: "scale(0.982567)",
//             transform: "scale(0.4)", 
//           }}
//         >
//           <RenderResume
//             templateId={template.id}
//             resumeData={DUMMY_RESUME_DATA}
//             containerWidth={800} 
//             colorPalette={themeColorPalette.themeOne[0]}
//           />
//         </div>
//       </div>

//       {/* Hover overlay */}
//       <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
//         <button
//           onClick={() => openCreateModal(template.id)}
//           className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 transition-all duration-200"
//         >
//           Try Template
//           <LuArrowRight className="text-[18px]" />
//         </button>
//       </div>
//     </div>
//   ))}
// </div>

//       {/* Modal for entering title */}
//       <Modal isOpen={openModal} onClose={() => setOpenModal(false)} hideHeader>
//   {openModal && (
//     <CreateResumeForm
//       key={selectedTemplateId} // 🔑 ensures correct id per modal
//       preSelectedTemplateId={selectedTemplateId}
//       onSuccess={(createdResume) => {
//         setOpenModal(false);
//         if (createdResume?._id) {
//           navigate(`/resume/${createdResume._id}`);
//         }
//       }}
//     />
//   )}
// </Modal>

//     </div>
//   );
// };

// export default TemplateCarousel;





























import React, { useState, useRef, useEffect, useContext } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { LuArrowRight } from "react-icons/lu";
import Modal from "./Modal";
import CreateResumeForm from "../pages/Home/CreateResumeForm.jsx";
import Login from "../pages/Auth/Login";
import SignUp from "../pages/Auth/SignUp";
import { resumeTemplates, DUMMY_RESUME_DATA, themeColorPalette } from "../utils/data";
import RenderResume from "./ResumeTemplates/RenderResume";
import { UserContext } from "../context/userContext";

const TemplateCarousel = ({ onTemplateSelect }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext); // ✅ Get user from context
  
  const [openModal, setOpenModal] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false); // ✅ NEW
  const [currentPage, setCurrentPage] = useState("login"); // ✅ NEW
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [containerWidth, setContainerWidth] = useState(260);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) setContainerWidth(ref.current.offsetWidth);
  }, []);

  const openCreateModal = (templateId) => {
    // ✅ Check if user is logged in
    if (!user) {
      // Not logged in - show auth modal
      setSelectedTemplateId(templateId);
      setOpenAuthModal(true);
      return;
    }

    // Logged in - show create resume form
    setSelectedTemplateId(templateId);
    setOpenModal(true);
  };

  const settings = {
    infinite: true,
    speed: 2500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1,
    cssEase: "linear",
    pauseOnHover: true,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="w-full py-10 bg-gray-50">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">
        Pick one of many world-class templates<br/> and build your resume in minutes!
      </h2>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3" ref={ref}>
        {resumeTemplates.map((template) => (
          <div key={template.id} className="relative group rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-white">
            
            <div className="relative flex items-center justify-center bg-white overflow-hidden h-[300px] md:h-[420px]">
              <div
                className="relative rounded-xl shadow-sm transition-transform duration-300 ease-in-out group-hover:scale-[1.02] w-full"
                style={{
                  transformOrigin: "center left",
                  transform: "scale(0.4)", 
                }}
              >
                <RenderResume
                  templateId={template.id}
                  resumeData={DUMMY_RESUME_DATA}
                  containerWidth={800} 
                  colorPalette={themeColorPalette.themeOne[0]}
                />
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
              <button
                onClick={() => openCreateModal(template.id)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 transition-all duration-200"
              >
                Try Template
                <LuArrowRight className="text-[18px]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Modal for Login/Signup (if not logged in) */}
      <Modal 
        isOpen={openAuthModal} 
        onClose={() => setOpenAuthModal(false)}
        title={currentPage === "login" ? "Login" : "Sign Up"}
      >
        {currentPage === "login" ? (
          <Login 
            onSwitchToSignUp={() => setCurrentPage("signup")}
            onLoginSuccess={() => {
              setOpenAuthModal(false);
              setOpenModal(true); // ✅ After login, show create resume form
            }}
          />
        ) : (
          <SignUp 
            onSwitchToLogin={() => setCurrentPage("login")}
            onSignUpSuccess={() => {
              setOpenAuthModal(false);
              setOpenModal(true); // ✅ After signup, show create resume form
            }}
          />
        )}
      </Modal>

      {/* ✅ Modal for entering resume title (if logged in) */}
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)} hideHeader>
        {openModal && (
          <CreateResumeForm
            key={selectedTemplateId}
            preSelectedTemplateId={selectedTemplateId}
            onSuccess={(createdResume) => {
              setOpenModal(false);
              if (createdResume?._id) {
                navigate(`/resume/${createdResume._id}`);
              }
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default TemplateCarousel;


