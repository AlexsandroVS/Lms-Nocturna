/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import defaultAvatar from "../../../public/img/admin-avatar.jpg";

const SERVER_URL = "http://localhost:5000";

const Avatar = ({ user, size = "md", className = "" }) => {
  const [avatarUrl, setAvatarUrl] = useState(defaultAvatar);

  // Tamaños predefinidos
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-lg",
    lg: "w-16 h-16 text-xl",
    xl: "w-32 h-32 text-4xl"
  };

  useEffect(() => {
    if (user?.avatar) {
      const url = user.avatar.startsWith("http") 
        ? user.avatar 
        : `${SERVER_URL}${user.avatar}`;
      setAvatarUrl(url);
    } else {
      setAvatarUrl(defaultAvatar);
    }
  }, [user]);

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {user?.avatar ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="rounded-full object-cover w-full h-full border-2 border-white shadow-sm"
          onError={() => setAvatarUrl(defaultAvatar)}
        />
      ) : (
        <div className="rounded-full bg-primary flex items-center justify-center text-white w-full h-full border-2 border-white shadow-sm">
          {user?.name?.charAt(0) || "U"}
        </div>
      )}
    </div>
  );
};

export default Avatar;