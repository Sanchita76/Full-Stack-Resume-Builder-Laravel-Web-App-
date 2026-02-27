// import React, { useState } from "react";
// import Input from "../../components/Inputs/Input";
// import axiosInstance from "../../utils/axiosInstance";
// import { API_PATHS } from "../../utils/apiPaths";
// import toast from "react-hot-toast";
// import { LuUserPlus, LuCopy, LuCheck } from "react-icons/lu";

// const CreateUserModal = ({ onClose, onSuccess }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "user",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [createdUser, setCreatedUser] = useState(null);
//   const [passwordCopied, setPasswordCopied] = useState(false);

//   const handleChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.name.trim()) {
//       setError("Name is required");
//       return;
//     }

//     if (!formData.email.trim()) {
//       setError("Email is required");
//       return;
//     }

//     if (!formData.password.trim() || formData.password.length < 6) {
//       setError("Password must be at least 6 characters");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await axiosInstance.post(
//         API_PATHS.ADMIN.CREATE_USER,
//         formData
//       );

//       setCreatedUser({
//         ...response.data.user,
//         tempPassword: response.data.tempPassword,
//       });

//       toast.success("User created successfully");
//     } catch (err) {
//       console.error("Error creating user:", err);
//       setError(err.response?.data?.message || "Failed to create user");
//       toast.error("Failed to create user");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const copyPassword = () => {
//     navigator.clipboard.writeText(createdUser.tempPassword);
//     setPasswordCopied(true);
//     setTimeout(() => setPasswordCopied(false), 2000);
//   };

//   const handleClose = () => {
//     if (createdUser) {
//       onSuccess();
//     }
//     onClose();
//   };

//   if (createdUser) {
//     return (
//       <div className="w-[90vw] md:w-[500px] p-7">
//         <h3 className="text-lg font-semibold text-green-600 mb-4">
//           ✅ User Created Successfully!
//         </h3>

//         <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
//           <p className="text-sm text-gray-700 mb-3">
//             <strong>Name:</strong> {createdUser.name}
//             <br />
//             <strong>Email:</strong> {createdUser.email}
//             <br />
//             <strong>Role:</strong> {createdUser.role}
//           </p>

//           <div className="bg-white border border-gray-300 rounded-lg p-3">
//             <p className="text-xs text-gray-600 mb-1">Temporary Password:</p>
//             <div className="flex items-center gap-2">
//               <code className="flex-1 px-3 py-2 bg-gray-100 rounded text-sm font-mono">
//                 {createdUser.tempPassword}
//               </code>
//               <button
//                 onClick={copyPassword}
//                 className="px-3 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 text-sm flex items-center gap-1"
//               >
//                 {passwordCopied ? <LuCheck /> : <LuCopy />}
//                 {passwordCopied ? "Copied!" : "Copy"}
//               </button>
//             </div>
//           </div>

//           <p className="text-xs text-amber-600 mt-3">
//             ⚠️ Save this password! It won't be shown again.
//           </p>
//         </div>

//         <button
//           onClick={handleClose}
//           className="w-full px-4 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700"
//         >
//           Close
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="w-[90vw] md:w-[500px] p-7">
//       <h3 className="text-lg font-semibold text-gray-800 mb-1">
//         Create New User
//       </h3>
//       <p className="text-sm text-gray-600 mb-6">
//         Create a user account (for customer support)
//       </p>

//       <form onSubmit={handleSubmit}>
//         <Input
//           label="Name"
//           type="text"
//           placeholder="John Doe"
//           value={formData.name}
//           onChange={(e) => handleChange("name", e.target.value)}
//         />

//         <Input
//           label="Email"
//           type="email"
//           placeholder="john@example.com"
//           value={formData.email}
//           onChange={(e) => handleChange("email", e.target.value)}
//         />

//         <Input
//           label="Password"
//           type="password"
//           placeholder="Min 6 characters"
//           value={formData.password}
//           onChange={(e) => handleChange("password", e.target.value)}
//         />

//         <div className="mb-4">
//           <label className="text-sm font-medium text-gray-700">Role</label>
//           <select
//             value={formData.role}
//             onChange={(e) => handleChange("role", e.target.value)}
//             className="w-full mt-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
//           >
//             <option value="user">User</option>
//             <option value="admin">Admin</option>
//           </select>
//         </div>

//         {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

//         <div className="flex items-center gap-3 mt-6">
//           <button
//             type="button"
//             onClick={onClose}
//             className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
//             disabled={loading}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center justify-center gap-2"
//             disabled={loading}
//           >
//             <LuUserPlus />
//             {loading ? "Creating..." : "Create User"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateUserModal;










import React, { useState } from "react";
import Input from "../../components/Inputs/Input";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import uploadImage from "../../utils/uploadImage";
import toast from "react-hot-toast";
import { LuUserPlus, LuCopy, LuCheck } from "react-icons/lu";

const CreateUserModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [profilePreview, setProfilePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdUser, setCreatedUser] = useState(null);
  const [passwordCopied, setPasswordCopied] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!formData.password.trim() || formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      let profileImageUrl = "";

      // ✅ Upload profile picture if provided
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.ADMIN.CREATE_USER, {
        ...formData,
        profileImageUrl, // ✅ Include profile image URL
      });

      setCreatedUser({
        ...response.data.user,
        tempPassword: response.data.tempPassword,
      });

      toast.success("User created successfully");
    } catch (err) {
      console.error("Error creating user:", err);
      setError(err.response?.data?.message || "Failed to create user");
      toast.error("Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(createdUser.tempPassword);
    setPasswordCopied(true);
    setTimeout(() => setPasswordCopied(false), 2000);
  };

  const handleClose = () => {
    if (createdUser) {
      onSuccess();
    }
    onClose();
  };

  if (createdUser) {
    return (
      <div className="w-[90vw] md:w-[500px] p-7">
        <h3 className="text-lg font-semibold text-green-600 mb-4">
          ✅ User Created Successfully!
        </h3>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          {/* ✅ Show profile picture if uploaded */}
          {createdUser.profileImageUrl && (
            <div className="flex justify-center mb-4">
              <img
                src={createdUser.profileImageUrl}
                alt={createdUser.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-green-300"
              />
            </div>
          )}

          <p className="text-sm text-gray-700 mb-3">
            <strong>Name:</strong> {createdUser.name}
            <br />
            <strong>Email:</strong> {createdUser.email}
            <br />
            <strong>Role:</strong> {createdUser.role}
          </p>

          <div className="bg-white border border-gray-300 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Temporary Password:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-gray-100 rounded text-sm font-mono">
                {createdUser.tempPassword}
              </code>
              <button
                onClick={copyPassword}
                className="px-3 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 text-sm flex items-center gap-1"
              >
                {passwordCopied ? <LuCheck /> : <LuCopy />}
                {passwordCopied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <p className="text-xs text-amber-600 mt-3">
            ⚠️ Save this password! It won't be shown again.
          </p>
        </div>

        <button
          onClick={handleClose}
          className="w-full px-4 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="w-[90vw] md:w-[500px] p-7">
      <h3 className="text-lg font-semibold text-gray-800 mb-1">
        Create New User
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Create a user account (for customer support)
      </p>

      <form onSubmit={handleSubmit}>
        {/* ✅ Profile Picture Upload */}
        <ProfilePhotoSelector
          image={profilePic}
          setImage={setProfilePic}
          preview={profilePreview}
          setPreview={setProfilePreview}
        />

        <Input
          label="Name"
          type="text"
          placeholder="John Doe"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <Input
          label="Email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Min 6 characters"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
        />

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">Role</label>
          <select
            value={formData.role}
            onChange={(e) => handleChange("role", e.target.value)}
            className="w-full mt-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="flex items-center gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center justify-center gap-2"
            disabled={loading}
          >
            <LuUserPlus />
            {loading ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserModal;
