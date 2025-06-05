import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faGraduationCap,
  faUser,
  faTimesCircle,
  faSpinner,
  faCalendarAlt,
  faCheckCircle,
  faUserShield,
  faChevronDown,
  faChevronUp,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import StatCard from "./StatCard";


export default function UserProfile() {
  const { currentUser, setCurrentUser, api, isAdmin, isTeacher, isStudent } =
    useAuth();
  const fileInputRef = useRef(null);
  const defaultAvatar = "/img/admin-avatar.jpg";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "",
    bio: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState(0);
  const [averageScore, setAverageScore] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    bio: true,
    stats: true,
    activity: true,
  });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "No registrado";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  // Toggle section visibility
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  // Carga de estadísticas
  useEffect(() => {
    if (!currentUser || !isStudent) return;

    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        // Obtener cursos inscritos
        const coursesRes = await api.get(
          `/enrollments/student/${currentUser.id}/courses`
        );
        setEnrolledCourses(coursesRes.data?.courses?.length || 0);

        // Obtener promedio general
        try {
          const avgRes = await api.get(`/averages/overall/${currentUser.id}`);
          const data = avgRes.data;
          setAverageScore(data?.courseAverage?.toFixed(1) || "N/A");
        } catch {
          setAverageScore("N/A");
        }
      } catch (e) {
        console.error("Error al obtener estadísticas:", e);
        setAverageScore("N/A");
        setEnrolledCourses(0);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [currentUser, api, isStudent]);

  // Inicializa el formulario con datos de usuario
  useEffect(() => {
    if (!currentUser) return;

    const avatarUrl = currentUser.avatar
      ? currentUser.avatar.startsWith("http")
        ? currentUser.avatar
        : `${api.defaults.baseURL.replace("/api", "")}${
            currentUser.avatar
          }?${new Date().getTime()}`
      : defaultAvatar;

    setFormData({
      name: currentUser.name || "",
      email: currentUser.email || "",
      avatar: avatarUrl,
      bio: currentUser.biografia || "",
    });
  }, [currentUser, api]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen debe ser menor a 5MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((p) => ({ ...p, avatar: reader.result }));
      setError("");
    };
    reader.readAsDataURL(file);
  };

  // En la función handleSave, modifica esta parte:
  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("biografia", formData.bio);
      if (imageFile) form.append("avatar", imageFile);

      const res = await api.put(`/users/${currentUser.id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Actualiza la URL de la imagen con un timestamp para evitar caché
      const newAvatarUrl = res.data.user.avatar
        ? `${res.data.user.avatar}?${new Date().getTime()}`
        : defaultAvatar;

      // Actualiza el estado con la nueva URL
      setFormData((prev) => ({
        ...prev,
        avatar: newAvatarUrl,
      }));

      setCurrentUser({
        ...currentUser,
        ...res.data.user,
        biografia: formData.bio,
        avatar: res.data.user.avatar,
      });

      setEditing(false);
      setImageFile(null);

      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error al guardar cambios.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const avatarUrl = currentUser.avatar
      ? currentUser.avatar.startsWith("http")
        ? currentUser.avatar
        : `${api.defaults.baseURL.replace("/api", "")}${currentUser.avatar}`
      : defaultAvatar;

    setFormData({
      name: currentUser.name || "",
      email: currentUser.email || "",
      avatar: avatarUrl,
      bio: currentUser.biografia || "",
    });
    setEditing(false);
    setImageFile(null);
    setError("");
  };

  // Determinar color según rol
  const getRoleColor = () => {
    if (isAdmin) return "bg-gradient-to-r from-red-500 to-red-700";
    if (isTeacher) return "bg-gradient-to-r from-purple-500 to-purple-700";
    return "bg-gradient-to-r from-purple-500 to-purple-700";
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 bg-white">
      {/* Sección superior */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Columna izquierda - Avatar e información básica */}
        <motion.div
          className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 lg:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col items-center space-y-4">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-purple-50 p-1 shadow-inner">
                <img
                  src={formData.avatar}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                  onError={(e) => {
                    e.target.src = defaultAvatar;
                  }}
                  key={formData.avatar} // Esto fuerza la recreación del componente cuando cambia la URL
                />
              </div>
              {editing && (
                <>
                  <motion.div
                    className="absolute inset-0 rounded-full flex items-center justify-center cursor-pointer"
                    onClick={() => fileInputRef.current.click()}
                    initial={{ opacity: 0 }}
                    whileHover={{
                      opacity: 1,
                      background: "rgba(104, 2, 193, 0.7)",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="bg-white p-3 rounded-full shadow-lg transform scale-110">
                      <FontAwesomeIcon
                        icon={faEdit}
                        className="text-purple-600 text-lg"
                      />
                    </div>
                  </motion.div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </>
              )}
            </div>

            {/* Información básica */}
            <div className="w-full space-y-3 text-center">
              {editing ? (
                <>
                  <motion.input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="text-xl font-bold w-full bg-slate-50 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-purple-300 text-center border border-slate-300"
                    placeholder="Tu nombre"
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="text-slate-600 w-full bg-slate-50 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-purple-300 text-center border border-slate-300"
                    placeholder="tu@email.com"
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </>
              ) : (
                <>
                  <h1 className="text-xl font-bold text-slate-800">
                    {formData.name}
                  </h1>
                  <p className="text-slate-500 text-sm">{formData.email}</p>
                </>
              )}
            </div>

            {/* Rol del usuario */}
            <div className="w-full text-center">
              <span
                className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold text-white ${getRoleColor()}`}
              >
                <FontAwesomeIcon icon={faUserShield} className="mr-2" />
                {isAdmin
                  ? "Administrador"
                  : isTeacher
                  ? "Profesor"
                  : "Estudiante"}
              </span>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-wrap justify-center gap-3 w-full pt-4">
              <motion.button
                onClick={editing ? handleSave : () => setEditing(true)}
                disabled={loading}
                className={`px-4 py-2 text-white font-medium rounded-lg transition-all flex items-center gap-2 ${
                  editing
                    ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    : "bg-gradient-to-r from-[#6802C1] to-[#8257a7] hover:from-[#7a1ad9] hover:to-[#9468c2]"
                } ${loading ? "opacity-80" : ""}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    {editing ? "Guardando..." : "Editar"}
                  </>
                ) : editing ? (
                  "Guardar"
                ) : (
                  <>
                    <FontAwesomeIcon icon={faEdit} /> Editar
                  </>
                )}
              </motion.button>
              {editing && (
                <motion.button
                  onClick={handleCancel}
                  className="px-4 py-2 text-slate-600 font-medium rounded-lg hover:bg-slate-100 transition-all border border-slate-300"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Cancelar
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Columna derecha - Contenido principal */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sección de estadísticas y actividad */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Tarjeta de rol */}
            <motion.div
              className="bg-white p-5 rounded-xl shadow-md border border-slate-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <FontAwesomeIcon
                    icon={faUserShield}
                    className="text-purple-600"
                  />
                </div>
                <h3 className="font-semibold text-slate-800">Tipo de cuenta</h3>
              </div>
              <p className="text-slate-600 font-medium">
                {isAdmin
                  ? "Administrador"
                  : isTeacher
                  ? "Profesor"
                  : "Estudiante"}
              </p>
            </motion.div>

            {/* Estadísticas solo para estudiantes */}
            {isStudent && (
              <>
                <StatCard
                  icon={faGraduationCap}
                  title="Cursos Inscritos"
                  value={
                    statsLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <FontAwesomeIcon icon={faSpinner} />
                      </motion.div>
                    ) : (
                      enrolledCourses
                    )
                  }
                  color="#B272FD"
                  loading={statsLoading}
                />

                <StatCard
                  icon={faUser}
                  title="Promedio General"
                  value={
                    statsLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <FontAwesomeIcon icon={faSpinner} />
                      </motion.div>
                    ) : averageScore === "N/A" ? (
                      "N/D"
                    ) : (
                      <span>
                        {averageScore}
                        <span className="text-xs text-slate-500">/10</span>
                      </span>
                    )
                  }
                  color="#B272FD"
                  loading={statsLoading}
                />
              </>
            )}
          </div>

          {/* Sección de biografía */}
          <motion.div
            className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div
              className="flex items-center justify-between p-4 cursor-pointer bg-slate-50"
              onClick={() => toggleSection("bio")}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Acerca de mí
                </h3>
              </div>
              <FontAwesomeIcon
                icon={expandedSections.bio ? faChevronUp : faChevronDown}
                className="text-slate-500"
              />
            </div>

            <AnimatePresence>
              {expandedSections.bio && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4"
                >
                  {editing ? (
                    <textarea
                      value={formData.bio}
                      name="bio"
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg text-sm outline-none transition-all border bg-white focus:ring-2 focus:ring-purple-200 border-purple-100"
                      placeholder="Cuéntanos sobre ti..."
                      rows={4}
                    />
                  ) : (
                    <div>
                      {formData.bio ? (
                        <p className="text-slate-700 whitespace-pre-line">
                          {formData.bio}
                        </p>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-slate-400 mb-3">
                            Aún no has añadido información sobre ti
                          </p>
                          <button
                            onClick={() => setEditing(true)}
                            className="text-purple-600 hover:text-purple-800 flex items-center justify-center gap-1"
                          >
                            <FontAwesomeIcon icon={faPlus} size="xs" />
                            <span>Añadir biografía</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Sección de actividad */}
          <motion.div
            className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div
              className="flex items-center justify-between p-4 cursor-pointer bg-slate-50"
              onClick={() => toggleSection("activity")}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Actividad
                </h3>
              </div>
              <FontAwesomeIcon
                icon={expandedSections.activity ? faChevronUp : faChevronDown}
                className="text-slate-500"
              />
            </div>

            <AnimatePresence>
              {expandedSections.activity && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="text-purple-600"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800">
                          Miembro desde
                        </h4>
                        <p className="text-sm text-slate-600">
                          {formatDate(currentUser?.RegistrationDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <FontAwesomeIcon
                          icon={
                            currentUser?.isActive
                              ? faCheckCircle
                              : faTimesCircle
                          }
                          className={
                            currentUser?.isActive
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800">
                          Estado de cuenta
                        </h4>
                        <p className="text-sm text-slate-600">
                          {currentUser?.isActive ? (
                            <span className="text-green-600 font-medium">
                              Activa
                            </span>
                          ) : (
                            <span className="text-red-600 font-medium">
                              Inactiva
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <motion.div
          className="bg-red-50 border border-red-200 rounded-lg p-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-red-700 font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faTimesCircle} />
            <span>{error}</span>
          </p>
        </motion.div>
      )}
    </div>
  );
}
