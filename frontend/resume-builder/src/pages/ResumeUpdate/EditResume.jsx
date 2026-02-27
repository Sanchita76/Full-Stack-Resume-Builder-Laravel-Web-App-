import React, { useEffect, useRef, useState, useContext } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from "../../context/userContext"; // ✅ IMPORT USER CONTEXT
import DashboardLayout from "../../components/layouts/DashboardLayout";
import {
  LuArrowLeft,
  LuCircleAlert,
  LuDownload,
  LuPalette,
  LuSave,
  LuTrash2,
  LuHouse,
  LuFile,
  LuShield,
} from "react-icons/lu";
import { jsPDF } from "jspdf";
import TitleInput from "../../components/Inputs/TitleInput";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
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
  dataUrltoFile,
  fixTailwindColors,
} from "../../utils/helper";

const EditResume = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext); // ✅ GET CURRENT USER

  const resumeRef = useRef(null);
  const resumeDownloadRef = useRef(null);

  const [baseWidth, setBaseWidth] = useState(800);
  const [openThemeSelector, setOpenThemeSelector] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("profile-info");
  const [progress, setProgress] = useState(0);
  
  // ✅ NEW: Track if admin is editing someone else's resume
  const [isAdminEditing, setIsAdminEditing] = useState(false);
  const [resumeOwnerId, setResumeOwnerId] = useState(null);

  const [resumeData, setResumeData] = useState({
    title: "",
    thumbnailLink: "",
    profileInfo: {
      profileImg: null,
      profilePreviewUrl: "",
      fullName: "",
      designation: "",
      summary: "",
    },
    template: {
      theme: "",
      colorPalette: "",
    },
    contactInfo: {
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
    },
    workExperience: [
      {
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    education: [
      {
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
      },
    ],
    skills: [
      {
        name: "",
        progress: 0,
      },
    ],
    projects: [
      {
        title: "",
        description: "",
        github: "",
        liveDemo: "",
      },
    ],
    certifications: [
      {
        title: "",
        issuer: "",
        year: "",
      },
    ],
    languages: [
      {
        name: "",
        progress: 0,
      },
    ],
    interests: [""],
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ✅ SMART API PATH SELECTOR - with better logging
const getApiPath = (operation) => {
  console.log('🔍 getApiPath called:', {
    operation,
    isAdminEditing,
    userRole: user?.role,
    userId: user?._id,
    resumeOwnerId
  });

  if (isAdminEditing) {
    // Admin editing user's resume - use admin endpoints
    console.log('✅ Using ADMIN endpoint for:', operation);
    switch (operation) {
      case 'GET':
        return API_PATHS.ADMIN.GET_RESUME(resumeId);
      case 'UPDATE':
        return API_PATHS.ADMIN.UPDATE_RESUME(resumeId);
      case 'DELETE':
        return API_PATHS.ADMIN.DELETE_RESUME(resumeId);
      case 'UPLOAD_IMAGES':
        return API_PATHS.ADMIN.UPLOAD_RESUME_IMAGES(resumeId);
      default:
        return null;
    }
  } else {
    // User editing own resume - use regular endpoints
    console.log('ℹ️ Using USER endpoint for:', operation);
    switch (operation) {
      case 'GET':
        return API_PATHS.RESUME.GET_BY_ID(resumeId);
      case 'UPDATE':
        return API_PATHS.RESUME.UPDATE(resumeId);
      case 'DELETE':
        return API_PATHS.RESUME.DELETE(resumeId);
      case 'UPLOAD_IMAGES':
        return API_PATHS.RESUME.UPLOAD_IMAGES(resumeId);
      default:
        return null;
    }
  }
};

  //Validate Inputs
  const validateAndNext = (e) => {
    const errors = [];

    switch (currentPage) {
      case "profile-info":
        const { fullName, designation, summary } = resumeData.profileInfo;
        if (!fullName.trim()) errors.push("Full Name is required");
        if (!designation.trim()) errors.push("Designation is required");
        if (!summary.trim()) errors.push("Summary is required");
        break;

      case "contact-info":
        const { email, phone } = resumeData.contactInfo;
        if (!/^[a-zA-Z][a-zA-Z0-9._%+-]{5,}@(gmail\.com|codeclouds\.co\.in|rcciit\.org\.in)$/.test(email.trim())) {
          errors.push("Valid email is required");
        }

        if (!phone.trim() || !/^\d{10}$/.test(phone))
          errors.push("Valid 10 digit Phone number is required");
        break;

      case "work-experience":
        resumeData.workExperience.forEach(
          ({ company, role, startDate, endDate }, index) => {
            if (!company.trim())
              errors.push(`Company name is required in Work Experience ${index + 1}`);
            if (!role.trim())
              errors.push(`Role is required in Work Experience ${index + 1}`);
            if (!startDate || !endDate)
              errors.push(`Start and End dates are required in Work Experience ${index + 1}`);
          }
        );
        break;

      case "education-info":
        resumeData.education.forEach(
          ({ degree, institution, startDate, endDate }, index) => {
            if (!degree.trim())
              errors.push(`Degree is required in Education ${index + 1}`);
            if (!institution.trim())
              errors.push(`Institution is required in Education ${index + 1}`);
            if (!startDate || !endDate)
              errors.push(`Start and End dates are required in Education ${index + 1}`);
          }
        );
        break;

      case "skills":
        resumeData.skills.forEach(({ name, progress }, index) => {
          if (!name.trim())
            errors.push(`Skill name is required in Skills ${index + 1}`);
          if (progress < 1 || progress > 100)
            errors.push(`Valid progress (1-100) is required in Skills ${index + 1}`);
        });
        break;

      case "projects":
        resumeData.projects.forEach(({ title, description }, index) => {
          if (!title.trim())
            errors.push(`Project title is required in Projects ${index + 1}`);
          if (!description.trim())
            errors.push(`Project description is required in Projects ${index + 1}`);
        });
        break;

      case "certifications":
        resumeData.certifications.forEach(({ title, issuer, year }, index) => {
          if (!title.trim())
            errors.push(`Certification title is required in Certifications ${index + 1}`);
          if (!issuer.trim())
            errors.push(`Issuer is required in Certifications ${index + 1}`);
          if (!year.trim())
            errors.push(`Year is required in Certifications ${index + 1}`);
        });
        break;

      case "additionalInfo":
        if (
          resumeData.languages.length === 0 ||
          !resumeData.languages[0].name?.trim()
        ) {
          errors.push("At least one language with a name is required in Additional Information");
        }

        if (
          resumeData.interests.length === 0 ||
          !resumeData.interests[0]?.trim()
        ) {
          errors.push("At least one interest is required in Additional Information");
        }
        break;

      default:
        break;
    }
    if (errors.length > 0) {
      setErrorMsg(errors.join(", "));
      return;
    }
    //Move to next step
    setErrorMsg("");
    goToNextStep();
  }

  //Function to navigate to the next page
  const goToNextStep = () => {
    const pages = [
      "profile-info",
      "contact-info",
      "work-experience",
      "education-info",
      "skills",
      "projects",
      "certifications",
      "additionalInfo",
    ];

    if (currentPage === "additionalInfo") setOpenPreviewModal(true);

    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex !== -1 && currentIndex < pages.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentPage(pages[nextIndex]);

      //Set progress percent
      const percent = Math.round((nextIndex / (pages.length - 1)) * 100);
      setProgress(percent);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  //Function to navigate to the previous page
  const goBack = () => {
    const pages = [
      "profile-info",
      "contact-info",
      "work-experience",
      "education-info",
      "skills",
      "projects",
      "certifications",
      "additionalInfo",
    ];

    if (currentPage === "profile-info") {
      // ✅ Navigate back based on admin status
      if (isAdminEditing) {
        navigate(`/admin/users/${resumeOwnerId}/resumes`);
      } else {
        navigate("/dashboard");
      }
      return;
    }

    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentPage(pages[prevIndex]);

      //Update progress
      const percent = Math.round((prevIndex / (pages.length - 1)) * 100);
      setProgress(percent);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderForm = () => {
    switch (currentPage) {
      case 'profile-info':
        return (
          <ProfileInfoForm
            profileData={resumeData?.profileInfo}
            updateSection={(key, value) => {
              updateSection("profileInfo", key, value);
            }}
            onNext={validateAndNext}
          />
        );

      case "contact-info":
        return (
          <ContactinfoForm
            contactInfo={resumeData?.contactInfo}
            updateSection={(key, value) => {
              updateSection("contactInfo", key, value);
            }}
          />
        );

      case "work-experience":
        return (
          <WorkExperienceForm
            workExperience={resumeData?.workExperience}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("workExperience", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("workExperience", newItem)}
            removeArrayItem={(index) =>
              removeArrayItem("workExperience", index)
            }
          />
        );

      case "education-info":
        return (
          <EducationDetailsForm
            educationInfo={resumeData?.education}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("education", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("education", newItem)}
            removeArrayItem={(index) => removeArrayItem("education", index)}
          />

        );

      case "skills":
        return (
          <SkillsInfoForm
            skillsInfo={resumeData?.skills}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("skills", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("skills", newItem)}
            removeArrayItem={(index) => removeArrayItem("skills", index)}
          />
        );

      case "projects":
        return (
          <ProjectsDetailFrom
            projectInfo={resumeData?.projects}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("projects", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("projects", newItem)}
            removeArrayItem={(index) => removeArrayItem("projects", index)}
          />
        );

      case "certifications":
        return (
          <CertificationInfoFrom
            certifications={resumeData?.certifications}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("certifications", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("certifications", newItem)}
            removeArrayItem={(index) =>
              removeArrayItem("certifications", index)
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
  const updateSection = (section, key, value) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  //Update array item (like workExperience[0],skills[1],etc.)
  const updateArrayItem = (section, index, key, value) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]];

      if (key === null) {
        updatedArray[index] = value;//for simple strings like in 'interests'
      } else {
        updatedArray[index] = {
          ...updatedArray[index],
          [key]: value,
        };
      }

      return {
        ...prev,
        [section]: updatedArray,
      };
    });
  };

  //Add item to array
  const addArrayItem = (section, newItem) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: [...prev[section], newItem],
    }));
  };

  //Remove item from array
  const removeArrayItem = (section, index) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]];
      updatedArray.splice(index, 1);
      return {
        ...prev,
        [section]: updatedArray,
      };
    });
  };

  // ✅ FIXED: Fetch resume with admin/user detection
const fetchResumeDetailsById = async () => {
  try {
    // ✅ TRY ADMIN ENDPOINT FIRST if user is admin
    let apiPath;
    let response;
    
    if (user && user.role === 'admin') {
      // Admin - try admin endpoint first
      apiPath = API_PATHS.ADMIN.GET_RESUME(resumeId);
      console.log('🔍 Admin fetching resume from:', apiPath);
      
      try {
        response = await axiosInstance.get(apiPath);
      } catch (adminError) {
        // If admin endpoint fails, try user endpoint (own resume)
        console.log('⚠️ Admin endpoint failed, trying user endpoint');
        apiPath = API_PATHS.RESUME.GET_BY_ID(resumeId);
        response = await axiosInstance.get(apiPath);
      }
    } else {
      // Regular user - use user endpoint
      apiPath = API_PATHS.RESUME.GET_BY_ID(resumeId);
      response = await axiosInstance.get(apiPath);
    }

    if (response.data && response.data.profileInfo) {
      const resumeInfo = response.data;

      // ✅ Store resume owner ID
      setResumeOwnerId(resumeInfo.userId);

      // ✅ Detect if admin is editing someone else's resume
      if (user && user.role === 'admin') {
        const adminId = String(user._id);
        const ownerId = String(resumeInfo.userId);
        
        console.log('🔍 Comparing IDs:', { adminId, ownerId });
        
        if (adminId !== ownerId) {
          console.log('✅ Admin editing another user\'s resume');
          setIsAdminEditing(true);
        } else {
          console.log('ℹ️ Admin editing own resume');
          setIsAdminEditing(false);
        }
      }

      setResumeData((prevState) => ({
        ...prevState,
        title: resumeInfo?.title || "Untitled",
        template: resumeInfo?.template || prevState?.template,
        profileInfo: resumeInfo?.profileInfo || prevState?.profileInfo,
        contactInfo: resumeInfo?.contactInfo || prevState?.contactInfo,
        workExperience:
          resumeInfo?.workExperience || prevState?.workExperience,
        education: resumeInfo?.education || prevState?.education,
        skills: resumeInfo?.skills || prevState?.skills,
        projects: resumeInfo?.projects || prevState?.projects,
        certifications:
          resumeInfo?.certifications || prevState?.certifications,
        languages: resumeInfo?.languages || prevState?.languages,
        interests: resumeInfo?.interests || prevState?.interests,
      }));
    }
  } catch (error) {
    console.error("❌ Error fetching resume:", error);
    toast.error("Failed to fetch resume");
  }
};

  // ✅ FIXED: Upload with correct endpoint
  const uploadResumeImages = async () => {  //good but fixing for image upload
    try {
      setIsLoading(true);

    console.log('🎬 Starting upload process...');
    console.log('📸 Ref exists:', !!resumeRef.current);

      fixTailwindColors(resumeRef.current);
      const imageDataUrl = await captureElementAsImage(resumeRef.current);

    console.log('📷 Captured image:', imageDataUrl ? 'SUCCESS' : 'FAILED');
    console.log('📏 Image size:', imageDataUrl?.length || 0);


      //Convert base64 to File
      const thumbnailFile = dataUrltoFile(
        imageDataUrl,
        `resume-${resumeId}.png`
      );


      console.log('📄 Thumbnail file created:', {
      exists: !!thumbnailFile,
      size: thumbnailFile?.size || 0,
      type: thumbnailFile?.type || 'none'
    });


      const profileImageFile = resumeData?.profileInfo?.profileImg || null;


      console.log('👤 Profile image:', {
      exists: !!profileImageFile,
      size: profileImageFile?.size || 0
    });

      const formData = new FormData();
      if (profileImageFile) formData.append("profileImage", profileImageFile);
      if (thumbnailFile) formData.append("thumbnail", thumbnailFile);


      console.log('📦 FormData entries:');
    for (let pair of formData.entries()) {
      console.log(`  ${pair[0]}:`, pair[1]);
    }

      // ✅ Use correct endpoint based on admin status
      const apiPath = getApiPath('UPLOAD_IMAGES');
      console.log('🔗 Uploading to:', apiPath);

      // const uploadResponse = await axiosInstance.put(
      //   apiPath,
      //   formData,
      //   // { headers: { "Content-Type": "multipart/form-data" } }
      // );
      const uploadResponse = await axiosInstance.post(  // ✅ CHANGE PUT TO POST
  apiPath,
  formData
);


      console.log('✅ Upload response:', uploadResponse.data);


      const { thumbnailLink, profilePreviewUrl } = uploadResponse.data;

      // ✅ CLEAR THE FILE OBJECT AFTER UPLOAD
    setResumeData((prev) => ({
      ...prev,
      profileInfo: {
        ...prev.profileInfo,
        profileImg: null, // ✅ Clear file object
        profilePreviewUrl: profilePreviewUrl || prev.profileInfo.profilePreviewUrl,
      },
    }));

      //Call the second API to update other resume data
      await updateResumeDetails(thumbnailLink, profilePreviewUrl);

      toast.success("Resume updated successfully");
      
      // ✅ Navigate back based on admin status
      if (isAdminEditing) {
        navigate(`/admin/users/${resumeOwnerId}/resumes`);
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images! Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


//   const uploadResumeImages = async () => {     adding debugging logs for img upload
//   try {
//     setIsLoading(true);

//     fixTailwindColors(resumeRef.current);
//     const imageDataUrl = await captureElementAsImage(resumeRef.current);

//     const thumbnailFile = dataUrltoFile(
//       imageDataUrl,
//       `resume-${resumeId}.png`
//     );

//     const profileImageFile = resumeData?.profileInfo?.profileImg || null;

//     const formData = new FormData();
//     if (profileImageFile) formData.append("profileImage", profileImageFile);
//     if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

//     const apiPath = getApiPath('UPLOAD_IMAGES');

//     const uploadResponse = await axiosInstance.put(
//       apiPath,
//       formData,
//       { headers: { "Content-Type": "multipart/form-data" } }
//     );

//     const { thumbnailLink, profilePreviewUrl } = uploadResponse.data;

//     // ✅ CRITICAL FIX: Update state with server URLs BEFORE calling updateResumeDetails
//     setResumeData((prev) => ({
//       ...prev,
//       thumbnailLink: thumbnailLink || prev.thumbnailLink, // ✅ Save thumbnail URL
//       profileInfo: {
//         ...prev.profileInfo,
//         profileImg: null, // ✅ Clear file object
//         profilePreviewUrl: profilePreviewUrl || prev.profileInfo.profilePreviewUrl, // ✅ Save server URL
//       },
//     }));

//     // ✅ Call update with the NEW URLs
//     await updateResumeDetails(thumbnailLink, profilePreviewUrl);

//     toast.success("Resume updated successfully");
    
//     if (isAdminEditing) {
//       navigate(`/admin/users/${resumeOwnerId}/resumes`);
//     } else {
//       navigate("/dashboard");
//     }
//   } catch (error) {
//     console.error("Error uploading images:", error);
//     toast.error("Failed to upload images! Please try again.");
//   } finally {
//     setIsLoading(false);
//   }
// };



// const uploadResumeImages = async () => {
//   try {
    
//     setIsLoading(true);

//     fixTailwindColors(resumeRef.current);
//     const imageDataUrl = await captureElementAsImage(resumeRef.current);

//     const thumbnailFile = dataUrltoFile(
//       imageDataUrl,
//       `resume-${resumeId}.png`
//     );

//     const profileImageFile = resumeData?.profileInfo?.profileImg || null;

//     // ✅ DEBUG: Check what we're uploading
//     console.log('📤 Upload check:', {
//       hasProfileFile: !!profileImageFile,
//       hasThumbnail: !!thumbnailFile,
//       currentPreviewUrl: resumeData.profileInfo.profilePreviewUrl
//     });

//     const formData = new FormData();
//     if (profileImageFile) formData.append("profileImage", profileImageFile);
//     if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

//     const apiPath = getApiPath('UPLOAD_IMAGES');

//     const uploadResponse = await axiosInstance.put(
//       apiPath,
//       formData,
//       { headers: { "Content-Type": "multipart/form-data" } }
//     );

//     const { thumbnailLink, profilePreviewUrl } = uploadResponse.data;

//     // ✅ DEBUG: Check what backend returned
//     console.log('📥 Backend returned:', {
//       thumbnailLink,
//       profilePreviewUrl,
//       isServerUrl: profilePreviewUrl?.startsWith('http://localhost:8000')
//     });

//     // ✅ CRITICAL FIX: Update state with server URLs BEFORE calling updateResumeDetails
//     setResumeData((prev) => ({
//       ...prev,
//       thumbnailLink: thumbnailLink || prev.thumbnailLink,
//       profileInfo: {
//         ...prev.profileInfo,
//         profileImg: null, // Clear file object
//         profilePreviewUrl: profilePreviewUrl || prev.profileInfo.profilePreviewUrl,
//       },
//     }));

//     // ✅ Call update with the NEW URLs
//     await updateResumeDetails(thumbnailLink, profilePreviewUrl);

//     toast.success("Resume updated successfully");
    
//     if (isAdminEditing) {
//       navigate(`/admin/users/${resumeOwnerId}/resumes`);
//     } else {
//       navigate("/dashboard");
//     }
//   } catch (error) {
//     console.error("❌ Error uploading images:", error);
//     toast.error("Failed to upload images! Please try again.");
//   } finally {
//     setIsLoading(false);
//   }
// };




  // ✅ FIXED: Update with correct endpoint
  const updateResumeDetails = async (thumbnailLink, profilePreviewUrl) => {   //good but fixing upload image
    try {
      setIsLoading(true);

      // ✅ Use correct endpoint based on admin status
      const apiPath = getApiPath('UPDATE');

      const response = await axiosInstance.put(
        apiPath,
        {
          ...resumeData,
          thumbnailLink: thumbnailLink || "",
          profileInfo: {
            ...resumeData.profileInfo,
            profilePreviewUrl: profilePreviewUrl || "",
          },
        }
      );
    } catch (err) {
      console.error("Error updating resume:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };



//   const updateResumeDetails = async (thumbnailLink, profilePreviewUrl) => {    fixing for image upload semi-final
//   try {
//     setIsLoading(true);

//     const apiPath = getApiPath('UPDATE');

//     const response = await axiosInstance.put(
//       apiPath,
//       {
//         ...resumeData,
//         thumbnail: thumbnailLink || resumeData.thumbnailLink || "", // ✅ Both field names
//         thumbnailLink: thumbnailLink || resumeData.thumbnailLink || "",
//         profileInfo: {
//           ...resumeData.profileInfo,
//           profileImg: null, // ✅ Don't send File object to server
//           profilePreviewUrl: profilePreviewUrl || resumeData.profileInfo.profilePreviewUrl || "",
//         },
//       }
//     );

//     console.log('✅ Resume updated:', response.data);
//   } catch (err) {
//     console.error("❌ Error updating resume:", err);
//     throw err;
//   } finally {
//     setIsLoading(false);
//   }
// };




// const updateResumeDetails = async (thumbnailLink, profilePreviewUrl) => {
//   try {
//     setIsLoading(true);

//     const apiPath = getApiPath('UPDATE');

//     // ✅ DON'T send profilePreviewUrl at all in this call!
//     // The upload-images endpoint already saved it to the database
//     const cleanProfileInfo = { ...resumeData.profileInfo };
//     delete cleanProfileInfo.profileImg; // Remove file object
//     delete cleanProfileInfo.profilePreviewUrl; // Remove blob URL

//     const response = await axiosInstance.put(
//       apiPath,
//       {
//         ...resumeData,
//         thumbnailLink: thumbnailLink || resumeData.thumbnailLink || "",
//         profileInfo: cleanProfileInfo,
//       }
//     );

//     console.log('✅ Resume updated:', response.data);
//   } catch (err) {
//     console.error("❌ Error updating resume:", err);
//     throw err;
//   } finally {
//     setIsLoading(false);
//   }
// };




  // ✅ FIXED: Delete with correct endpoint
  const handleDeleteResume = async () => {
    try {
      setIsLoading(true);
      
      // ✅ Use correct endpoint based on admin status
      const apiPath = getApiPath('DELETE');
      
      const response = await axiosInstance.delete(apiPath);
      toast.success("Resume deleted successfully");
      
      // ✅ Navigate back based on admin status
      if (isAdminEditing) {
        navigate(`/admin/users/${resumeOwnerId}/resumes`);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error deleting resume:", err);
      toast.error("Failed to delete resume! Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  //Function to update baseWidth based on the resume container size
  const updateBaseWidth = () => {
    if (resumeRef.current) {
      setBaseWidth(resumeRef.current.offsetWidth);
    }
  };

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

  useEffect(() => {
    updateBaseWidth();
    window.addEventListener("resize", updateBaseWidth);

    if (resumeId) {
      fetchResumeDetailsById();
    }

    return () => {
      window.removeEventListener("resize", updateBaseWidth);
    };
  }, [resumeId]);

  console.log("Current Template Loaded:", resumeData?.template?.theme);
  console.log("Full resumeData:", resumeData);
  console.log("Is Admin Editing:", isAdminEditing); // ✅ Debug log

  return (
    <DashboardLayout>
      <div className="container mx-auto">


        {/* ✅ NEW: Navigation Header */}
  <div className="flex items-center justify-between bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-lg p-4 mb-4 text-white shadow-lg">
    <div className="flex items-center gap-3">
      {/* ✅ Back to Home */}
      <button
        onClick={() => navigate("/")}
        className="bg-white/20 backdrop-blur-md border border-white/30
                   hover:bg-white/30 px-3 py-2 rounded-lg text-sm font-semibold
                   flex items-center gap-2 transition-all"
      >
        <LuHouse className="text-lg" />
        <span className="hidden md:inline">Back to Home</span>
      </button>

      {/* ✅ View All Resumes */}
      <button
        onClick={() => {
          if (isAdminEditing) {
            navigate(`/admin/users/${resumeOwnerId}/resumes`);
          } else {
            navigate("/dashboard");
          }
        }}
        className="bg-white/20 backdrop-blur-md border border-white/30
                   hover:bg-white/30 px-3 py-2 rounded-lg text-sm font-semibold
                   flex items-center gap-2 transition-all"
      >
        <LuFile className="text-lg" />
        <span className="hidden md:inline">View All Resumes</span>
      </button>

      {/* ✅ Admin Dashboard (only show if admin) */}
      {user?.role === "admin" && (
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="bg-white/20 backdrop-blur-md border border-white/30
                     hover:bg-white/30 px-3 py-2 rounded-lg text-sm font-semibold
                     flex items-center gap-2 transition-all"
        >
          <LuShield className="text-lg" />
          <span className="hidden md:inline">Admin Dashboard</span>
        </button>
      )}
    </div>

    <div className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
      {isAdminEditing ? "Admin Editing" : "Editing Resume"}
    </div>
  </div>

    {/* ✅ EXISTING: Title Input Section */}

        <div className="flex items-center justify-between gap-5 bg-white rounded-lg border border-purple-100 py-3 px-4 mb-4">
          <TitleInput
            title={resumeData.title}
            setTitle={(value) =>
              setResumeData((prevState) => ({
                ...prevState,
                title: value,
              }))
            }
          />

          <div className="flex items-center gap-4">
            <button
              className="btn-small-light"
              onClick={() => setOpenThemeSelector(true)}
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
              onClick={() => setOpenPreviewModal(true)}
            >
              <LuDownload className="text-[16px]" />
              <span className="hidden md:block">Preview & Download</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-lg border border-purple-100 overflow-hidden">

            <StepProgress progress={progress} />

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
                  <LuArrowLeft className="text-[16px]" />
                  Back
                </button>
                <button
                  className="btn-small-light"
                  onClick={uploadResumeImages}
                  disabled={isLoading}
                >
                  <LuSave className="text-[16px]" />
                  {isLoading ? "Updating..." : "Save & Exit"}
                </button>
                <button
                  className="btn-small"
                  onClick={() => {
                    if (currentPage === "additionalInfo") {
                      setOpenPreviewModal(true);
                    } else {
                      validateAndNext();
                    }
                  }}
                  disabled={isLoading}
                >
                  {currentPage === "additionalInfo" && (
                    <LuDownload className="text-[16px]" />
                  )}

                  {currentPage === "additionalInfo"
                    ? "Preview & Download"
                    : "Next"}
                  {currentPage !== "additionalInfo" && (
                    <LuArrowLeft className="text-[16px] rotate-180" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div ref={resumeRef} className="h-[100vh]">

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
        onClose={() => setOpenThemeSelector(false)}
        title="Change Resume Theme"
      >

        <div className="w-[90vw] h-[80vh]">
          <ThemeSelector
            selectedTheme={resumeData?.template}
            setSelectedTheme={(value) => {
              setResumeData((prevState) => ({
                ...prevState,
                template: value || prevState.template,
              }));
            }}
            resumeData={null}
            onClose={() => setOpenThemeSelector(false)}
          />
        </div>
      </Modal>

      <Modal
        isOpen={openPreviewModal}
        onClose={() => setOpenPreviewModal(false)}
        title={resumeData.title}
        showActionBtn
        actionBtnText="Download"
        actionBtnIcon={<LuDownload className="text-[16px]" />}
        onActionClick={() => handleDownload()}
      >
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
