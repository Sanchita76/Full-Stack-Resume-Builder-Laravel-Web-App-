import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
// import { LuAlertTriangle, LuTrash2 } from "react-icons/lu";
import { LuTriangleAlert, LuTrash2 } from "react-icons/lu";

const DeleteUserModal = ({ user, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete(API_PATHS.ADMIN.DELETE_USER(user._id));
      toast.success("User deleted successfully");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="w-[90vw] md:w-[400px] p-7">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <LuTriangleAlert className="text-3xl text-red-600" />
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Delete User?
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete <strong>{user.name}</strong>?
          <br />
          <span className="text-red-600 font-medium">
            This will also delete all {user.resumeCount || 0} resume(s).
          </span>
          <br />
          This action cannot be undone.
        </p>

        <div className="flex items-center gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center justify-center gap-2"
            disabled={loading}
          >
            <LuTrash2 />
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;