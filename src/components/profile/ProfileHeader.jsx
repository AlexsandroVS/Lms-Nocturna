/* eslint-disable react/prop-types */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const ProfileHeader = ({ user, onEdit, getAvatarUrl }) => {
  return (
    <div className="flex items-center space-x-6">
      <div className="relative">
        <img
          src={getAvatarUrl(user.avatar)}
          alt="Avatar"
          className="w-32 h-32 rounded-full object-cover"
        />
        <div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer hover:opacity-100 transition-opacity"
          onClick={onEdit}
        >
          <FontAwesomeIcon icon={faEdit} className="text-white text-2xl" />
        </div>
      </div>
      <div className="flex-1">
        <p className="text-2xl font-semibold">{user.name}</p>
        <p className="text-gray-600">{user.email}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
