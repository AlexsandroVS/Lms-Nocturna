// src/pages/ProfilePage.jsx
import { useAuth } from "../context/AuthContext";
import UserProfile from "../components/profile/UserProfile";

const ProfilePage = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <div>Por favor, inicia sesión</div>;
  }

  return <UserProfile />;
};

export default ProfilePage;
