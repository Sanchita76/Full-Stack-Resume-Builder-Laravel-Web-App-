// import React from 'react'
// import {UserContext} from "../../context/userContext";
// import {useNavigate} from 'react-router-dom';
// import { useContext } from 'react';
// import UserAvatar from './UserAvatar';


// const ProfileInfoCard=()=>{
//     const {user,clearUser}=useContext(UserContext);
//     const navigate=useNavigate();

//     const handleLogout=()=>{
//         localStorage.clear();
//         clearUser();
//         navigate('/');
//     };

//     return (
//         user && (
//             <div className="flex items-center pr-4">
//                 {/* <img
//                     src={user.profileImageUrl}
//                     alt=""
//                     className="w-11 h-11 bg-gray-300 rounded-full mr-3"
//             /> */}
//             {/* <img
//   src={
//     user.profileImageUrl?.startsWith("http")
//       ? user.profileImageUrl.replace("http://localhost:8000", "https://resume-builder-ujy5.onrender.com")
//       : `https://resume-builder-ujy5.onrender.com${user.profileImageUrl}`
//   }
//   alt="Profile"
//   className="w-11 h-11 bg-gray-300 rounded-full mr-3"
// /> */}
// <img
//   src={
//     user.profileImageUrl?.startsWith("http")
//       ? user.profileImageUrl.replace("http://localhost:8000", "http://localhost:8000")
//       : `http://localhost:8000${user.profileImageUrl}`
//   }
//   alt="Profile"
//   className="w-11 h-11 bg-gray-300 rounded-full mr-3"
// />

//             <div>
//                 <div className="text-[15px] font-bold leading-3 pr-4">
//                     {user.name || ""}
//                 </div>
//                 <button
//                     className="text-purple-500 text-sm font-semibold cursor-pointer hover:underline pr-4"
//                     onClick={handleLogout}
//                 >
//                     Logout
//                 </button>
//             </div>
//         </div>
//     )
//   );
// };

// export default ProfileInfoCard;







import React from 'react'
import { UserContext } from "../../context/userContext";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import UserAvatar from "../UserAvatar";

const ProfileInfoCard = () => {
    const { user, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate('/');
    };

    return (
        user && (
            <div className="flex items-center pr-4">
                {/* ✅ NEW: Use UserAvatar component - shows image if exists, initials if not */}
                <div className="mr-3">
                    <UserAvatar user={user} size="lg" />
                </div>

                <div>
                    <div className="text-[15px] font-bold leading-3 pr-4">
                        {user.name || ""}
                    </div>
                    <button
                        className="text-purple-500 text-sm font-semibold cursor-pointer hover:underline pr-4"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        )
    );
};

export default ProfileInfoCard;