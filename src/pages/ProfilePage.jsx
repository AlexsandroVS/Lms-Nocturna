// src/pages/ProfilePage.jsx
import { useAuth } from "../context/AuthContext";
import AdminProfile from "../admin/Aprofile/AdminProfile";
import UserProfile from "../components/profile/UserProfile";

const ProfilePage = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <div>Por favor, inicia sesión</div>;
  }

  return currentUser.role === "admin" ? <AdminProfile /> : <UserProfile />;
};

export default ProfilePage;
