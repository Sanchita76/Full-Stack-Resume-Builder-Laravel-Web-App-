import React, { useState, useEffect } from "react";
import Input from "../../components/Inputs/Input";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { LuSave } from "react-icons/lu";

const EditUserModal = ({ user, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profileImageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "", // Don't pre-fill password
        profileImageUrl: user.profileImageUrl || "",
      });
    }
  }, [user]);

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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
      };

      // Only include password if it's not empty
      if (formData.password.trim()) {
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        }
        payload.password = formData.password;
      }

      if (formData.profileImageUrl) {
        payload.profileImageUrl = formData.profileImageUrl;
      }

      await axiosInstance.put(
        API_PATHS.ADMIN.UPDATE_USER(user._id),
        payload
      );

      toast.success("User updated successfully");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error updating user:", err);
      setError(
        err.response?.data?.message || "Failed to update user"
      );
      toast.error("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="w-[90vw] md:w-[500px] p-7">
      <h3 className="text-lg font-semibold text-gray-800 mb-1">Edit User</h3>
      <p className="text-sm text-gray-600 mb-6">
        Update user information. Leave password blank to keep unchanged.
      </p>

      <form onSubmit={handleSubmit}>
        {/* User ID (Read-only) */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">User ID</label>
          <div className="mt-2 px-4 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-600">
            {user._id}
          </div>
        </div>

        {/* Name */}
        <Input
          label="Name"
          type="text"
          placeholder="John Doe"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

        {/* Email */}
        <Input
          label="Email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />

        {/* Password */}
        <Input
          label="Password (Leave blank to keep unchanged)"
          type="password"
          placeholder="Enter new password"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
        />

        {/* Role (Read-only) */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">Role</label>
          <div className="mt-2 px-4 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-600">
            {user.role}
            <span className="text-xs text-gray-500 ml-2">(Cannot be changed)</span>
          </div>
        </div>

        {/* Created At (Read-only) */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">Created At</label>
          <div className="mt-2 px-4 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-600">
            {new Date(user.createdAt).toLocaleString()}
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <div className="flex items-center gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
            disabled={loading}
          >
            <LuSave className="text-lg" />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserModal;