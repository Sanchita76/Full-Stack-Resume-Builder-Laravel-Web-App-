import React ,{useEffect,useRef,useState} from "react";
import {useNavigate,useParams} from 'react-router-dom';
import DashboardLayout from "../../components/layouts/DashboardLayout";
import {
  LuArrowLeft,
  LuCircleAlert,
  LuDownload,
  LuPalette,
  LuSave,
  LuTrash2,
} from "react-icons/lu";
import Cookies from "js-cookie";
import html2canvas from "html2canvas";
import {jsPDF} from "jspdf";
import TitleInput from "../../components/Inputs/TitleInput";
import toast from "react-hot-toast";
import {useReactToPrint} from "react-to-print";
import axiosInstance from "../../utils/axiosInstance";
import {API_PATHS} from"../../utils/apiPaths";
import StepProgress from "../../components/StepProgress";
import ContactinfoForm from "./Forms/ContactinfoForm";
import ProfileInfoForm from "./Forms/ProfileInfoForm";
import WorkExperienceForm from "./Forms/WorkExperienceForm";
import EducationDetailsForm from "./Forms/EducationDetailsForm";
import SkillsInfoForm from "./Forms/SkillsInfoForm";
import ProjectsDetailFrom from "./Forms/ProjectsDetailFrom";
import CertificationInfoFrom from "./Forms/CertificationInfoFrom";
import AdditionalInfoFrom from "./Forms/AdditionalInfoFrom";
import RenderResume from "../../components/ResumeTemplates/RenderResume";
import ThemeSelector from "./ThemeSelector";
import Modal from "../../components/Modal";
import {
  captureElementAsImage,
  // captureElementAsCanvas,
  dataUrltoFile,
  fixTailwindColors,
} from "../../utils/helper";

// import ResumePreview from "../../components/ResumePreview/ResumePreview";
// import ThemeSelector from "../../components/ThemeSelector/ThemeSelector";
// import PreviewModal from "../../components/modals/PreviewModal";

const EditResume = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const resumeRef = useRef(null);
  const resumeDownloadRef = useRef(null);

  const [baseWidth,setBaseWidth]=useState(800);

  const [openThemeSelector,setOpenThemeSelector]=useState(false);

  const [openPreviewModal,setOpenPreviewModal]=useState(false);

  const [currentPage,setCurrentPage]=useState("profile-info");//profile-info
  const [progress,setProgress]=useState(0);
  const [resumeData,setResumeData]=useState({
    title:"",
    thumbnailLink:"",
    profileInfo:{
      profileImg:null,
      profilePreviewUrl:"",
      fullName:"",
      designation:"",
      summary:"",
    },
    template:{
      theme:"",
      colorPalette:"",
    },
    contactInfo:{
      email:"",
      phone:"",
      location:"",
      linkedin:"",
      github:"",
      website:"",
    },
    workExperience:[
      {
        company:"",
        role:"",
        startDate:"",//e.g: "2022-01"
        endDate:"",//e.g : "2023-12"
        description:"",
      },
    ],
    education:[
      {
        degree:"",
        institution:"",
        startDate:"",
        endDate:"",
      },
    ],
    skills:[
      {
        name:"",
        progress:0,
      },
    ],
    projects:[
      {
        title:"",
        description:"",
        github:"",
        liveDemo:"",
      },
    ],
    certifications:[
      {
        title:"",
        issuer:"",
        year:"",
      },
    ],
    languages:[
      {
        name:"",
        progress:0,
      },
    ],
    interests:[""],
  });
  const [errorMsg,setErrorMsg]=useState("");
  const [isLoading,setIsLoading]=useState(false);


  //Validate Inputs
  const validateAndNext=(e)=>{
    const errors=[];

    switch(currentPage){
      case "profile-info":
        const {fullName,designation,summary}=resumeData.profileInfo;
        if(!fullName.trim()) errors.push("Full Name is required");
        if(!designation.trim()) errors.push("Designation is requirde");
        if(!summary.trim()) errors.push("Summary is required");
        break;

        case "contact-info":
          const {email,phone}=resumeData.contactInfo;
          if (!/^[a-zA-Z][a-zA-Z0-9._%+-]{5,}@(gmail\.com|codeclouds\.co\.in|rcciit\.org\.in)$/.test(email.trim())) {
              errors.push("Valid email is required");
          }
          // const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]{5,}@(gmail\.com|codeclouds\.co\.in|rcciit\.org\.in)$/;
          //   if (!emailRegex.test(email.trim())) {errors.push("Valid email is required");}

          if(!phone.trim() || !/^\d{10}$/.test(phone))
            errors.push("Valid 10 digit Phone number is required");
          break;

        case "work-experience":
          resumeData.workExperience.forEach(
            ({company,role,startDate,endDate},index)=>{
              if(!company.trim())
                errors.push(`Company name is required in Work Experience ${index + 1}`);
              if(!role.trim())
                errors.push(`Role is required in Work Experience ${index + 1}`);
              if(!startDate || !endDate)
                errors.push(`Start and End dates are required in Work Experience ${index + 1}`);
            }
          );
          break;

        case "education-info":
          resumeData.education.forEach(
            ({degree,institution,startDate,endDate},index)=>{
              if(!degree.trim())
                errors.push(`Degree is required in Education ${index + 1}`);
              if(!institution.trim())
                errors.push(`Institution is required in Education ${index + 1}`);
              if(!startDate || !endDate)
                errors.push(`Start and End dates are required in Education ${index + 1}`);
            }
          );
          break;

        case "skills":
          resumeData.skills.forEach(({name,progress},index)=>{
            if(!name.trim())
              errors.push(`Skill name is required in Skills ${index + 1}`);
            if(progress < 1 || progress > 100)
              errors.push(`Valid progress (1-100) is required in Skills ${index + 1}`);
          });
          break;

        case "projects":
          resumeData.projects.forEach(({title,description},index)=>{
            if(!title.trim())
              errors.push(`Project title is required in Projects ${index + 1}`);
            if(!description.trim())
              errors.push(`Project description is required in Projects ${index + 1}`);
          });
          break;

        case "certifications"://exempt year in code
          resumeData.certifications.forEach(({title,issuer,year},index)=>{
            if(!title.trim())
              errors.push(`Certification title is required in Certifications ${index + 1}`);
            if(!issuer.trim())
              errors.push(`Issuer is required in Certifications ${index + 1}`);
            if(!year.trim())
              errors.push(`Year is required in Certifications ${index + 1}`);
          });
          break;

        case "additionalInfo":
          if(
            resumeData.languages.length ===0 ||
            !resumeData.languages[0].name?.trim()
          ) {
            errors.push("At least one language with a name is required in Additional Information");
          }

          if(
            resumeData.interests.length ===0 ||
            !resumeData.interests[0].name?.trim()
          ){
            errors.push("At least one interest is required in Additional Information");
          }
          break;

        default:
          break;
    }
    if(errors.length >0){
      setErrorMsg(errors.join(","));
      return;
    }
    //Move to next step
    setErrorMsg("");
    goToNextStep();
  }

  //Function to navigate to the next page
  const goToNextStep=()=>{
    const pages=[
      "profile-info",
      "contact-info",
      "work-experience",
      "education-info",
      "skills",
      "projects",
      "certifications",
      "additionalInfo",
    ];

    if(currentPage==="additionalInfo")setOpenPreviewModal(true);

    const currentIndex=pages.indexOf(currentPage);
    if(currentIndex !==-1 && currentIndex <pages.length-1){
      const nextIndex =currentIndex+1;
      setCurrentPage(pages[nextIndex]);

      //Set progress percent
      const percent =Math.round((nextIndex/(pages.length-1))*100);
      setProgress(percent);
      window.scrollTo({top:0,behavior:"smooth"});
    }
  };

  //Function to navigate to the previous page
  const goBack =()=>{
    const pages=[
      "profile-info",
      "contact-info",
      "work-experience",
      "education-info",
      "skills",
      "projects",
      "certifications",
      "additionalInfo",
    ];

    if(currentPage==="profile-info") navigate("/dashboard");

    const currentIndex=pages.indexOf(currentPage);
    if(currentIndex >0){
      const prevIndex=currentIndex -1;
      setCurrentPage(pages[prevIndex]);

      //Update progress
      const percent=Math.round((prevIndex/(pages.length-1))*100);
      setProgress(percent);
      window.scrollTo({top:0,behavior:"smooth"});
    }
  };

  const renderForm=()=>{
    switch(currentPage){
      case 'profile-info':
        return (
          <ProfileInfoForm
          profileData={resumeData?.profileInfo}
          updateSection={(key,value)=>{
            updateSection("profileInfo",key,value);
          }}
          onNext={validateAndNext}
          />
        );

        case "contact-info":
          return (
            <ContactinfoForm
            contactInfo={resumeData?.contactInfo}
            updateSection={(key,value)=>{
              updateSection("contactInfo",key,value);
            }}
            />
          );

          case "work-experience":
            return (
              <WorkExperienceForm
              workExperience={resumeData?.workExperience}
              updateArrayItem={(index,key,value)=>{
                updateArrayItem("workExperience",index,key,value);
              }}
              addArrayItem={(newItem)=>addArrayItem("workExperience",newItem)}
              removeArrayItem={(index)=>
                removeArrayItem("workExperience",index)
              }
              />
            );

            case "education-info":
              return (
                <EducationDetailsForm
                educationInfo={resumeData?.education}
                updateArrayItem={(index,key,value)=>{
                  updateArrayItem("education",index,key,value);
                }}
                addArrayItem={(newItem)=>addArrayItem("education",newItem)}
                removeArrayItem={(index)=>removeArrayItem("education",index)}
                />

              );

              case "skills":
                return (
                  <SkillsInfoForm
                      skillsInfo={resumeData?.skills}
                      updateArrayItem={(index,key,value)=>{
                        updateArrayItem("skills",index,key,value);
                      }}
                      addArrayItem={(newItem)=>addArrayItem("skills",newItem)}
                      removeArrayItem={(index)=>removeArrayItem("skills",index)}
                      />
                );

                case "projects":
                  return (
                    <ProjectsDetailFrom
                      projectInfo={resumeData?.projects}
                      updateArrayItem={(index,key,value)=>{
                        updateArrayItem("projects",index,key,value);
                      }}
                      addArrayItem={(newItem)=>addArrayItem("projects",newItem)}
                      removeArrayItem={(index)=>removeArrayItem("projects",index)}
                      />
                  );

                  case "certifications":
                    return (
                      <CertificationInfoFrom
                         certifications={resumeData?.certifications}
                         updateArrayItem={(index,key,value)=>{
                          updateArrayItem("certifications",index,key,value);
                         }}
                         addArrayItem={(newItem)=>addArrayItem("certifications",newItem)}
                         removeArrayItem={(index)=>
                          removeArrayItem("certifications",index)
                         }
                    />
                        );

                        case "additionalInfo":
                          return (
                            <AdditionalInfoFrom
                            languages={resumeData.languages}
                            interests={resumeData.interests}
                            updateArrayItem={(section, index, key, value) =>
                            updateArrayItem(section, index, key, value)
                          }
                         addArrayItem={(section, newItem) => addArrayItem(section, newItem)}
                         removeArrayItem={(section, index) => removeArrayItem(section, index)}
                              />
                          );



        default:
          return null;
    }
  };

  //Update simple nested object(like profileInfo,contactInfo,etc..)
  const updateSection =(section,key,value)=>{
    setResumeData((prev)=>({
      ...prev,
      [section]:{
        ...prev[section],
        [key]:value,
      },
    }));
  };

  //Update array item (like workExperience[0],skills[1],etc.)
  const updateArrayItem=(section,index,key,value)=>{
    setResumeData((prev)=>{
      const updatedArray=[...prev[section]];

      if(key===null){
        updatedArray[index]=value;//for simple strings like in 'interests'
      }else{
        updatedArray[index]={
          ...updatedArray[index],
          [key]:value,
        };
      }

      return {
        ...prev,
        [section]:updatedArray,
      };
    });
  };

  //Add item to array
  const addArrayItem=(section,newItem)=>{
    setResumeData((prev)=>({
      ...prev,
      [section]:[...prev[section],newItem],
    }));
  };

  //Remove item from array
  const removeArrayItem=(section,index)=>{
    setResumeData((prev)=>{
      const updatedArray=[...prev[section]];
      updatedArray.splice(index,1);
      return{
        ...prev,
        [section]:updatedArray,
      };
    });
  };

  //Fetch resume info by ID
  const fetchResumeDetailsById=async()=>{
    try{
      const response=await axiosInstance.get(
        API_PATHS.RESUME.GET_BY_ID(resumeId)
      );

      if(response.data && response.data.profileInfo){
        const resumeInfo=response.data;

        setResumeData((prevState)=>({
          ...prevState,
          title:resumeInfo?.title || "Untitled",
          template: resumeInfo?.template || prevState?.template,
          profileInfo: resumeInfo?.profileInfo || prevState?.profileInfo,
          contactInfo: resumeInfo?.contactInfo || prevState?.contactInfo,
          workExperience:
          resumeInfo?.workExperience || prevState?.workExperience,
          education:resumeInfo?.education || prevState?.education,
          skills:resumeInfo?.skills || prevState?.skills,
          projects:resumeInfo?.projects || prevState?.projects,
          certifications:
          resumeInfo?.certifications || prevState?.certifications,
          languages:resumeInfo?.languages || prevState?.languages,
          interests:resumeInfo?.interests || prevState?.interests,
        }));
      }
    }catch(error){
      console.error("Error fetching resumes:",error);
      }
    };
  //upload thumbnail and resume profile img
  const uploadResumeImages=async()=>{
    try{
      setIsLoading(true);

      fixTailwindColors(resumeRef.current);
      const imageDataUrl=await captureElementAsImage(resumeRef.current);

      //Convert base64 to File
      const thumbnailFile=dataUrltoFile(
        imageDataUrl,
        `resume-${resumeId}.png`
      );

      const profileImageFile=resumeData?.profileInfo?.profileImg || null;
      
      const formData=new FormData();
      if(profileImageFile) formData.append("profileImage",profileImageFile);
      if(thumbnailFile) formData.append("thumbnail",thumbnailFile);

      const uploadResponse=await axiosInstance.put(
        API_PATHS.RESUME.UPLOAD_IMAGES(resumeId),
        formData,
        {headers:{"Content-Type":"multipart/form-data"}}
      );

      const {thumbnailLink,profilePreviewUrl}=uploadResponse.data;

      console.log("RESUME_DATA__",resumeData);

      //Call the second API to update other resume data
      await updateResumeDetails(thumbnailLink,profilePreviewUrl);

      toast.success("Resume updated successfully");
      navigate("/dashboard");
    }catch(error){
      console.error("Error uploading images:",error);
      toast.error("Failed to upload images! Please try again.");
    }finally{
      setIsLoading(false);
    }
  };
 
  const updateResumeDetails=async(thumbnailLink,profilePreviewUrl)=>{
    try{
      setIsLoading(true);

      const response=await axiosInstance.put(
        API_PATHS.RESUME.UPDATE(resumeId),
        {
          ...resumeData,
          thumbnail: thumbnailLink || "",
          profileInfo: {
            ...resumeData.profileInfo,
            profilePreviewUrl: profilePreviewUrl || "",
          },
        }
      );
    }catch(err){
      console.error("Error capturing image:",err);
    }finally{
      setIsLoading(false);
    }
  };

  //Delete Resume
  const handleDeleteResume=async()=>{
    try{
      setIsLoading(true);
      const response=await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeId));
      toast.success("Resume deleted successfully");
      navigate("/dashboard");
    }catch(err){
      console.error("Error deleting resume:",err);
      toast.error("Failed to delete resume! Please try again.");
    }finally{
      setIsLoading(false);
    }
  };

  //download resume
  // const reactToPrintFn=useReactToPrint({contentRef: resumeDownloadRef});
  // const reactToPrintFn = useReactToPrint({
  //   contentRef: resumeDownloadRef,
  //   onAfterPrint: () => {
  //     toast.success('PDF downloaded successfully!');
  //   },
  //   onPrintError: (error) => {
  //     toast.error('Error downloading PDF: ' + error.message);
  //   }
  // });

  //Function to update baseWidth based on the resume container size
  const updateBaseWidth=()=>{
    if(resumeRef.current){
      setBaseWidth(resumeRef.current.offsetWidth);
    }
  };

   // Download Resume as PDF (portrait A4, one-page, high quality)
//     const handleDownload = async () => {
//   try {
//     if (!resumeData) {
//       toast.error("Please wait — resume still loading!");
//       return;
//     }
//     const el = resumeDownloadRef.current;
//     if (!el) {
//       toast.error("Resume not ready for download!");
//       return;
//     }

//     // 1) Convert Tailwind OKLCH colors BEFORE capture
//     try {
//       fixTailwindColors(el);
//     } catch (e) {
//       console.warn("fixTailwindColors warning:", e);
//     }

//     // 2) Ensure render + paint
//     await new Promise((r) => requestAnimationFrame(r));
//     await new Promise((r) => setTimeout(r, 250));

//     // 3) Capture canvas (helper waits for fonts/images)
//     const desiredScale = 2; // high quality; adjust to 3 if desired and safe
//     const canvas = await captureElementAsCanvas(el, { scale: desiredScale });

//     if (!canvas || !canvas.width || !canvas.height) {
//       throw new Error("Invalid canvas dimensions");
//     }

//     // 4) Convert canvas to JPEG (robust for jsPDF)
//     const imgData = canvas.toDataURL("image/jpeg", 0.95);

//     // 5) Create jsPDF A4 portrait in mm
//     const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
//     const pdfWidth = pdf.internal.pageSize.getWidth();  // 210
//     const pdfHeight = pdf.internal.pageSize.getHeight(); // 297

//     // 6) Compute image size in mm to match PDF width and preserve aspect ratio
//     let imgWidthMm = pdfWidth;
//     let imgHeightMm = (canvas.height * imgWidthMm) / canvas.width;

//     if (!isFinite(imgHeightMm) || imgHeightMm <= 0) {
//       throw new Error("Invalid image dimensions for PDF");
//     }
//     if (imgHeightMm > pdfHeight) {
//       const scale = pdfHeight / imgHeightMm;
//       imgWidthMm *= scale;
//       imgHeightMm *= scale;
//     }

//     const x = (pdfWidth - imgWidthMm) / 2;
//     const y = (pdfHeight - imgHeightMm) / 2;

//     // 7) Add image and save
//     pdf.addImage(imgData, "JPEG", x, y, imgWidthMm, imgHeightMm);
//     pdf.save("resume.pdf");

//     toast.success("Resume downloaded successfully!");
//   } catch (error) {
//     console.error("handleDownload error:", error);
//     toast.error("Error downloading resume!");
//   }
// };




const handleDownload = async () => {
  try {
    if (!resumeData) {
      toast.error("Please wait — resume still loading!");
      return;
    }
    const el = resumeDownloadRef.current;
    if (!el) {
      toast.error("Resume not ready for download!");
      return;
    }

    // 1) Convert Tailwind OKLCH colors BEFORE capture
    try {
      fixTailwindColors(el);
      

      // Give the browser time to repaint with inline rgb() styles
      await new Promise((r) => setTimeout(r, 700));
    } catch (e) {
      console.warn("fixTailwindColors warning:", e);
    }

    // 2) Ensure render + paint
    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => setTimeout(r, 250));

    // ✅ 3) Capture as crisp PNG (NO canvas needed manually)
    const imgData = await captureElementAsImage(el);
    if (!imgData) throw new Error("Failed to capture image");

    // 4) Create PDF
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pdfWidth = pdf.internal.pageSize.getWidth();  // 210
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297

    // ✅ 5) Load image to get natural width/height
    const img = new Image();
    img.src = imgData;
    await new Promise((resolve) => (img.onload = resolve));

    // ✅ 6) Auto-scale perfect fit
    let imgWidthMm = pdfWidth;
    let imgHeightMm = (img.naturalHeight * imgWidthMm) / img.naturalWidth;

    if (imgHeightMm > pdfHeight) {
      const scale = pdfHeight / imgHeightMm;
      imgWidthMm *= scale;
      imgHeightMm *= scale;
    }

    const x = (pdfWidth - imgWidthMm) / 2;
    const y = (pdfHeight - imgHeightMm) / 2;

    // ✅ 7) Add to PDF (PNG direct, no compression loss)
    pdf.addImage(imgData, "PNG", x, y, imgWidthMm, imgHeightMm);
    pdf.save("resume.pdf");

    toast.success("Resume downloaded successfully!");
  } catch (error) {
    console.error("handleDownload error:", error);
    toast.error("Error downloading resume!");
  }
};




  useEffect(()=>{
    updateBaseWidth();
    window.addEventListener("resize",updateBaseWidth);

    if(resumeId){
      fetchResumeDetailsById();
    }

    return ()=>{
      window.removeEventListener("resize",updateBaseWidth);
    };
  },[]);
  console.log("Current Template Loaded:", resumeData?.template?.theme);
  console.log("Full resumeData:", resumeData);
    
  return ( <DashboardLayout>
      <div className ="container mx-auto">
        <div className="flex items-center justify-between gap-5 bg-white rounded-lg border border-purple-100 py-3 px-4 mb-4">
          <TitleInput 
          title={resumeData.title}
          setTitle={(value)=>
            setResumeData((prevState)=>({
              ...prevState,
              title:value,
            }))
          }  
          /> 

          <div className="flex items-center gap-4">
            <button 
            className="btn-small-light"
            onClick={()=> setOpenThemeSelector(true)}
            >
              <LuPalette className="text-[16px]" />
              <span className="hidden md:block">Change Theme</span>
            </button>

            <button className="btn-small-light" onClick={handleDeleteResume}>
              <LuTrash2 className="text-[16px]" />
              <span className="hidden md:block">Delete</span>
            </button>

            <button className="btn-small-light" onClick={handleDownload}>
  <LuDownload className="text-[16px]" />
  <span className="hidden md:block">Download</span>
</button>


        <button
            className="btn-small-light"
            onClick={()=>setOpenPreviewModal(true)}
            >
              <LuDownload className="text-[16px]" />
              <span className="hidden md:block">Preview & Download</span>
        </button>
          </div>
        </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white rounded-lg border border-purple-100 overflow-hidden">

                <StepProgress  progress={progress}/>

                {renderForm()}

                <div className="mx-5">
                  {errorMsg && (
                    <div className="flex items-center gap-2 text-[11px] font-medium text-amber-600 bg-amber-100 px-2 py-0.5 my-1 rounded">
                      <LuCircleAlert className="text-md" />{errorMsg}
                    </div>
                  )}

                  <div className="flex items-end justify-end gap-3 mt-3 mb-5">
                    <button
                    className="btn-small light"
                    onClick={goBack}
                    disabled={isLoading}
                    >
                      <LuArrowLeft className="text-[16px]"/>
                      Back 
                    </button>
                    <button 
                    className="btn-small-light"
                    onClick={uploadResumeImages}
                    disabled={isLoading}
                    >
                      <LuSave className="text-[16px]"/>
                      {isLoading ? "Updating..." : "Save & Exit"}
                    </button>
                    <button
                    className="btn-small"
                    // onClick={validateAndNext}
                    onClick={() => {
                      if (currentPage === "additionalInfo") {
                        setOpenPreviewModal(true);
                      } else {
                          validateAndNext();
                      }
                     }}
                    disabled={isLoading}
                    >
                      {currentPage==="additionalInfo" && (
                        <LuDownload className="text-[16px]"/>
                      )}

                      {currentPage==="additionalInfo"
                      ?"Preview & Download"
                    :"Next"}
                    {currentPage !== "additionalInfo" && (
                      <LuArrowLeft className="text-[16px] rotate-180" />
                    )}
                    </button>
                  </div>
                </div>
              </div>
              <div ref={resumeRef} className="h-[100vh]">
                
                {/*Resume Template*/}
                 {/* <RenderResume
                      templateId={resumeData?.template?.theme || ""}
                      resumeData={resumeData}
                      colorPalette={resumeData?.template?.colorPalette || []}
                      containerWidth={baseWidth}
                /> */}
                <RenderResume
  templateId={resumeData?.template?.theme || "01"}
  resumeData={resumeData}
  colorPalette={resumeData?.template?.colorPalette || []}
  containerWidth={baseWidth}
/>

              </div>
          </div> 
        </div>

        <Modal 
          isOpen={openThemeSelector}
          onClose={()=> setOpenThemeSelector(false)}
          title="Change Resume Theme"
        >

          <div className="w-[90vw] h-[80vh]">
          <ThemeSelector
            selectedTheme={resumeData?.template}
            setSelectedTheme={(value)=>{
              setResumeData((prevState)=>({
                ...prevState,
                template:value || prevState.template,
              }));
            }}
            resumeData={null}
            onClose={()=>setOpenThemeSelector(false)}
          />
        </div>
      </Modal>

      <Modal 
          isOpen={openPreviewModal}
          onClose={()=> setOpenPreviewModal(false)}
          title={resumeData.title}
          showActionBtn
          actionBtnText="Download"
          actionBtnIcon={<LuDownload className="text-[16px]" />}
          // onActionClick={() => reactToPrintFn()}
          onActionClick={() => handleDownload()}
      >
          {/* <div ref={resumeDownloadRef} className="w-[98vw] h-[90vh]"> */}
      
          <div className="w-[98vw] h-[90vh]">

            <RenderResume
                templateId={resumeData?.template?.theme || ""}
                resumeData={resumeData}
                colorPalette={resumeData?.template?.colorPalette || []}
            />
          </div>

          
      </Modal>

{/* Hidden but fully rendered off-screen for accurate measuring & capture */}
<div
  ref={resumeDownloadRef}
  style={{
    position: "absolute",
    left: "-9999px",        // off-screen but rendered
    top: 0,
    width: "794px",         // design width you chose
    minHeight: "1122px",    // ≈ 297mm @96dpi
    background: "#fff",
    pointerEvents: "none",
    opacity: 1,             // visible to layout engine (not to user because off-screen)
    overflow: "hidden",
    zIndex: -9999,
  }}
>
  <RenderResume
    templateId={resumeData?.template?.theme || ""}
    resumeData={resumeData}
    colorPalette={resumeData?.template?.colorPalette || []}
    containerWidth={794}
  />
</div>



    </DashboardLayout>
  );
};

export default EditResume;
