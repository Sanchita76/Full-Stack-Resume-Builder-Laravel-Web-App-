// import React, { useState } from "react";
// import Slider from "react-slick";
// import { useNavigate } from "react-router-dom";
// import { LuArrowRight } from "react-icons/lu";
// import Modal from "./Modal";
// import CreateResumeForm from "../pages/Home/CreateResumeForm";
// import { resumeTemplates } from "../utils/data";

// const TemplateCarousel = ({ onTemplateSelect }) => {
//   const navigate = useNavigate();
//   const [openModal, setOpenModal] = useState(false);
//   const [selectedTemplateId, setSelectedTemplateId] = useState(null);

//   const openCreateModal = (templateId) => {
//     setSelectedTemplateId(templateId);
//     setOpenModal(true);
//   };

//   // Carousel settings
//   const settings = {
//     infinite: true,
//     speed: 3000,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 1000,
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
//         Explore Resume Templates
//       </h2>

//       <div className="max-w-6xl mx-auto px-6">
//         <Slider {...settings}>
//           {resumeTemplates.map((template, index) => (
//             <div key={index} className="px-3">
//               <div className="relative group overflow-hidden rounded-2xl shadow-lg border border-gray-200">
//                 <img
//                   src={template.thumbnailImg}
//                   alt={`Template ${template.id}`}
//                   className="w-full h-72 object-cover transform group-hover:scale-105 transition-all duration-500"
//                 />

//                 {/* Overlay button */}
//                 <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                   <button
//                     onClick={() => openCreateModal(template.id)}
//                     className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 transition-all duration-200"
//                   >
//                     Try Template
//                     <LuArrowRight className="text-[18px]" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </Slider>
//       </div>

//       {/* Modal for creating resume */}
//       <Modal
//         isOpen={openModal}
//         onClose={() => setOpenModal(false)}
//         hideHeader
//       >
//         <CreateResumeForm
//           onSuccess={async (createdResume) => {
//             setOpenModal(false);
//             if (createdResume?._id) {
//               // ✅ Notify parent (optional)
//               if (onTemplateSelect) onTemplateSelect(selectedTemplateId);
//               // ✅ Navigate to EditResume page
//               navigate(`/resume/${createdResume._id}`);
//             }
//           }}
//           preSelectedTemplateId={selectedTemplateId}
//         />
//       </Modal>
//     </div>
//   );
// };

// export default TemplateCarousel;

import React, { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { LuArrowRight } from "react-icons/lu";
import Modal from "./Modal";
import CreateResumeForm from "../pages/Home/CreateResumeForm.jsx";
import { resumeTemplates, DUMMY_RESUME_DATA, themeColorPalette } from "../utils/data";
import RenderResume from "./ResumeTemplates/RenderResume";

const TemplateCarousel = ({ onTemplateSelect }) => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [containerWidth, setContainerWidth] = useState(260);
  const ref = useRef(null);

  // measure width for responsive scale of RenderResume
  useEffect(() => {
    if (ref.current) setContainerWidth(ref.current.offsetWidth);
  }, []);

  const openCreateModal = (templateId) => {
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
        {/* Explore Resume Templates */}Pick one of many world-class templates<br/> and build your resume in minutes!
      </h2>

      {/* <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <Slider {...settings}>
          {resumeTemplates.map((template) => (
            <div key={template.id} className="px-3">
              <div className="relative group rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-white">
                // {/* ✅ live scaled preview */}
                 {/* <div className="h-72 flex items-center justify-center bg-white overflow-hidden"> */}
  {/* <div className="transform scale-[0.9.5] origin-top rounded-xl shadow-sm">
    <RenderResume
      templateId={template.id}
      resumeData={DUMMY_RESUME_DATA}
      containerWidth={800} // keep consistent base width for accurate scaling
      colorPalette={themeColorPalette.themeOne[0]}
    />
  </div>
</div> */}
{/* <div className="relative flex items-center justify-center bg-white overflow-hidden h-[420px]">
  <div
    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 origin-top transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"
    style={{
      transform: "translate(-50%, -50%) scale(0.33)", // Adjust this scale value
      transformOrigin: "top center",
    }}
  >
    className="md:[transform:translate(-50%,-50%)_scale(0.33)] sm:[transform:translate(-50%,-50%)_scale(0.42)]"
    <RenderResume
      templateId={template.id}
      resumeData={DUMMY_RESUME_DATA}
      containerWidth={800}
      colorPalette={themeColorPalette.themeOne[0]}
    />
  </div>
</div>


                {/* Hover overlay with fade */}
                {/* <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
                  <button
                    onClick={() => openCreateModal(template.id)}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 transition-all duration-200"
                  >
                    Try Template
                    <LuArrowRight className="text-[18px]" />
                  </button> */}
                {/* </div>
              </div>
            </div>
          ))}
        </Slider> */}
      {/* </div> */} 




      {/* <div className="max-w-6xl mx-auto px-6" ref={ref}>
  <Slider {...settings}>
    {resumeTemplates.map((template) => (
      <div key={template.id} className="px-3 w-full">
        <div className="relative group rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-white"> */}
          
          {/* ✅ Auto-scaled live preview */}
          {/* <div className="relative flex items-center justify-center bg-white overflow-hidden h-[420px]">
            <div
              className="relative rounded-xl shadow-sm transition-transform duration-300 ease-in-out group-hover:scale-[1.02]"
              style={{
                width: "800px", // base resume width
                transformOrigin: "top right",
                // ✅ auto scale: container (420) / actual height (~1122px @ A4)
                transform: "scale(0.7)", // tuned to fit full resume height
              }}
            >
              <RenderResume
                templateId={template.id}
                resumeData={DUMMY_RESUME_DATA}
                containerWidth={800}//800
                colorPalette={themeColorPalette.themeOne[0]}
              />
            </div>
          </div> */}

          {/* ✅ Hover overlay */}
          {/* <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
            <button
              onClick={() => openCreateModal(template.id)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 transition-all duration-200"
            >
              Try Template
              <LuArrowRight className="text-[18px]" />
            </button>
          </div>
        </div>
      </div>
    ))}
  </Slider>
</div> */}



<div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3" ref={ref}>
  {resumeTemplates.map((template) => (
    <div key={template.id} className="relative group rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-white">
      
      {/* Auto-scaled live preview */}
      <div className="relative flex items-center justify-center bg-white overflow-hidden h-[300px] md:h-[420px]">
        <div
          className="relative rounded-xl shadow-sm transition-transform duration-300 ease-in-out group-hover:scale-[1.02] w-full"
          style={{
            transformOrigin: "center left",
            // transform: "scale(0.982567)",
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

      {/* Hover overlay */}
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



      {/* Modal for entering title */}
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)} hideHeader>
  {openModal && (
    <CreateResumeForm
      key={selectedTemplateId} // 🔑 ensures correct id per modal
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


