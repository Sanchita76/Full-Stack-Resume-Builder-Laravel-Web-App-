import React ,{useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import {API_PATHS} from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';

const CreateResumeForm = ({onSuccess, preSelectedTemplateId, targetUserId}) => {
  const [title,setTitle]=useState("");
  const [error,setError]=useState(null);
  const [loading, setLoading] = useState(false);


  const navigate=useNavigate();

  //handle Create Resume
  const handleCreateResume=async(e)=>{
    e.preventDefault();
    console.log("Form submitted"); // 👈 Add this

    if(!title){
      setError("Resume Title is required");
      return;
    }
    
    console.log("Creating resume with title:", title); // 👈 Add this
    setError("");

    //Create Resume API Call
     setLoading(true);
    try{

      let response;

      // ✅ If targetUserId is provided, admin is creating for that user
      if (targetUserId) {
        response = await axiosInstance.post(
          API_PATHS.ADMIN.CREATE_USER_RESUME(targetUserId),
          {
            title,
            template: {
              theme: preSelectedTemplateId || "01",
              colorPalette: [],
            },
          }
        );
      } else {
        // Regular user creating their own resume
        response = await axiosInstance.post(API_PATHS.RESUME.CREATE, {
          title,
          template: {
            theme: preSelectedTemplateId || "01",
            colorPalette: [],
          },
        });
      }
      console.log("Creating resume with template:", preSelectedTemplateId);

      // const response = await axiosInstance.post(API_PATHS.RESUME.CREATE,
      //   {
      //    title,
      //   template: {
      //     theme: preSelectedTemplateId || "01",
      //     // colorPalette: "",
      //     colorPalette: [], // ✅ Always an array
      //   },
      // });

        console.log("Response:", response.data); // 👈 Add this    
        
  //       // ✅ Fix: Access newResume._id instead of data._id
  //     const createdResume = response.data?.newResume;
  //     if (createdResume && createdResume._id) {
  //       if (onSuccess) onSuccess(); // ✅ close modal + refresh list
  //       // setTimeout(() => {
  //       //   navigate(`/resume/${createdResume._id}`); // ✅ navigate after modal closes
  //       // }, 200);
  //     } else {
  //       setError("Unexpected response format from server.");
  //     }


  //   }catch(error){
  //     console.error("Error creating resume:", error); // 👈 Add this
  //     if(error.response && error.response.data.message){
  //       setError(error.response.data.message);
  //     }else{
  //       setError("Something went wrong. Please try again later.");
  //     }
  //   }
  //   finally {//New
  //   setLoading(false);
  // }
  // };
  const createdResume = response.data?.newResume;
      if (createdResume && createdResume._id) {
        if (onSuccess) onSuccess(createdResume);
      } else {
        setError("Unexpected response format from server.");
      }
    } catch (error) {
      console.error("Error creating resume:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-[90vw] md:w-[70vh] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black">Create New Resume</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-3">
        Give your resume a title to get started.You can edit all details later.
      </p>

      <form onSubmit={handleCreateResume}>
        <Input
          value={title}
          onChange={({target})=>setTitle(target.value)}
          label="Resume Title"
          placeholder="Eg:Mehuli Biswas-Resume"
          type="text"
        />
        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {/* Create Resume */}{loading ? "Creating..." : "Create Resume"}
        </button>
      </form>
    </div>
  )
}

export default CreateResumeForm;
