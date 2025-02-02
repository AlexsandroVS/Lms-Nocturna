/* eslint-disable react/prop-types */
import InputField from "./InputField";
import StatusMessage from "./StatusMessage";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  status,
  isSubmitting,
  handleLogin,
}) {
  return (
    <form className="space-y-8" onSubmit={handleLogin}>
      <StatusMessage status={status} />
      <InputField
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isSubmitting}
        icon={faEnvelope}
      />
      <InputField
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isSubmitting}
        icon={faLock}
      />
      <button
        type="submit"
        className="w-full bg-[#d62828] text-white py-3 rounded-xl hover:bg-[#b32424] transition-colors"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
      </button>
    </form>
  );
}

export default LoginForm;
