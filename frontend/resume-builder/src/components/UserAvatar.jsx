import React from 'react';

const UserAvatar = ({ user, size = 'md' }) => {
  // ✅ Get initials from name
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // ✅ Fix the image URL
  const getImageUrl = (url) => {
    if (!url) return null;
    
    // If it's already a full URL, fix localhost if needed
    if (url.startsWith('http')) {
      return url.replace('http://localhost:8000', 'http://localhost:8000');
    }
    
    // If it's a relative path, prepend base URL
    return `http://localhost:8000${url}`;
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-11 h-11 text-lg',
    xl: 'w-16 h-16 text-2xl',
  };

  const initials = getInitials(user?.name);
  const imageUrl = getImageUrl(user?.profileImageUrl);

  return (
    <>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={user?.name || 'Profile'}
          className={`${sizeClasses[size]} rounded-full object-cover bg-gray-300`}
          onError={(e) => {
            // ✅ If image fails to load, hide it and show initials
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      
      {/* ✅ Initials fallback (shown if no image OR image fails to load) */}
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-yellow-400`}
        style={{ 
          backgroundColor: '#800000', // Maroon
          display: imageUrl ? 'none' : 'flex' // Hidden if image exists
        }}
      >
        {initials}
      </div>
    </>
  );
};

export default UserAvatar;