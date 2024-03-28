import { useNavigate } from "react-router-dom";
import { api } from "../services/axios";
import "./logout.css";
import { UilSignout } from "@iconscout/react-unicons";

export default function Logout() {
  const navigate = useNavigate(); // Adicionando o hook useNavigate
  const token = localStorage.getItem("token");

  const performLogout = async () => {
    try {
      await api.post(
        "/logout",
        {},
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      // Após o logout, redirecionar para a página de login
      navigate("/login");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
      {/* Você pode usar o evento onClick ou uma lógica similar para chamar performLogout */}
      <button className="btn-logout" onClick={performLogout}>
        <UilSignout color="white"></UilSignout>
        Sair
      </button>
    </div>
  );
}
