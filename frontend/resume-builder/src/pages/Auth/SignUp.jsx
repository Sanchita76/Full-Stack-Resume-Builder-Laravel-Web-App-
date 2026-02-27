import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import Input from "../../components/Inputs/Input";
import {validateEmail} from "../../utils/helper";
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import axiosInstance from '../../utils/axiosInstance';
import {API_PATHS} from '../../utils/apiPaths';
import {UserContext} from "../../context/userContext";
import { useContext } from 'react';
import uploadImage from '../../utils/uploadImage';

const SignUp = ({setCurrentPage}) => {
  const [profilePic,setProfilePic]=useState(null);
  const [fullName,setFullName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [role, setRole] = useState("user"); // ✅ ADD THIS LINE
  const [passkey, setPasskey] = useState(""); // ✅ NEW - Admin passkey field

  const[error,setError]=useState(null);

  const {updateUser}=useContext(UserContext);

  const navigate=useNavigate();

  //Handle SignUp Form Submit
  const handleSignUp=async(e)=>{
    e.preventDefault();

    let profileImageUrl="";

    if(!fullName){
      setError("Please enter full name.");
      return;
    }

    if(!validateEmail(email)){
      setError("Please enter a valid email address.");
      return;
    }

    if(!password){
      setError("Please enter the password");
      return;
    }

    // ✅ Validate admin passkey
    if (role === 'admin' && passkey !== 'CODECLOUDS') {
      setError("Invalid admin passkey. Please contact the administrator.");
      return;
    }

    setError("");

    //SignUp API Call
    try{
      //Upload image if present
      if(profilePic){
        const imgUploadRes=await uploadImage(profilePic);
        profileImageUrl=imgUploadRes.imageUrl || "";
      }


      const response=await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
        name:fullName,
        email,
        password,
        role, // ✅ ADD THIS LINE
        passkey: role === 'admin' ? passkey : undefined, // ✅ Only send if admin
        profileImageUrl,
      });

      const {token} =response.data;

      if(token){
        localStorage.setItem("token",token);
        updateUser(response.data);
      //   navigate("/dashboard");
      // }
      // ✅ Redirect based on role
        if (response.data.role === 'admin') {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    }catch(error){
      if(error.response && error.response.data.message){
        setError(error.response.data.message);
      }else{
        setError("Something went wrong. Please try again.");
      }
    }
  };


   return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black"> Create an Account</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-6">
        Join us today by entering your details below
      </p>

      <form onSubmit={handleSignUp} noValidate>

        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic}/>
           


        <div className="grid grid-cols-1 md:grid-cols-1 gap-2">


          {/* ✅ ADD THIS ROLE SELECT FIELD */}
          {/* <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="input-box px-4 py-2.5 rounded-lg border border-slate-300"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div> */}


          <div className="flex flex-col gap-2 w-full">
  <label className="text-sm font-medium text-slate-600">
    Role
  </label>

  <div className="relative">
    <select
      value={role}
      onChange={(e) => setRole(e.target.value)}
      className="w-full appearance-none bg-slate-50
                 px-4 py-3 pr-12
                 rounded-xl border border-slate-300
                 text-slate-700 text-sm
                 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                 hover:border-slate-400
                 transition-all duration-200 ease-in-out"
    >
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>

    {/* Custom Arrow */}
    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</div>



                  {/* ✅ END OF NEW SECTION */}

          {/* ✅ Admin Passkey Field - Only shown if admin is selected */}
          {role === 'admin' && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mb-2">
              <Input
                value={passkey}
                onChange={({target}) => setPasskey(target.value)}
                label="Admin Passkey"
                placeholder="Enter admin passkey"
                type="password"
              />
              <p className="text-xs text-amber-600 mt-1">
                ⚠️ Admin registration requires a valid passkey
              </p>
            </div>
          )}

          <Input 
          value={fullName}
          onChange={({target})=>setFullName(target.value)}
          label="Full Name"
          placeholder="Mehuli Biswas"
          type="text"
          />
          
          <Input
          value={email}
          onChange={({target})=>setEmail(target.value)}
          label="Email Address"
          placeholder="mehulibiswas16@gmail.com"
          type="text"
          />

          <Input 
          value={password}
          onChange={({target})=>setPassword(target.value)}
          label="Password"
          placeholder="Min 8 characters"
          type="password"
          />
        </div>

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
          
          <button type="submit" className="btn-primary">
            SIGN UP
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account?{" "}
            <button 
            type="button"
              className="font-medium text-blue-500 underline cursor-pointer"
              onClick={()=>{
                setCurrentPage("login");
            }}
            >
              Login
            </button>
          </p>
      </form>
    </div>
   )
}

export default SignUp;
