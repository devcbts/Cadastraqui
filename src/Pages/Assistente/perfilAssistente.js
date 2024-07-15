import React, { useEffect, useState } from "react";
import "./perfilAssistente.css";
import NavBar from "../../Components/navBar";
import { useAppState } from "../../AppGlobal";
import NavBarAssistente from "../../Components/navBarAssistente";
import photoProfile from "../../Assets/profile-padrao.jpg";
import { UilPen } from "@iconscout/react-unicons";
import { UilLock } from "@iconscout/react-unicons";
import { api } from "../../services/axios";
import { useNavigate } from "react-router";
import { formatCPF } from "../../utils/format-cpf";
import { formatTelephone } from "../../utils/format-telephone";
import ChangePassword from "../../Components/ChangePassword/ChangePassword";
import socialAssistantService from "../../services/socialAssistant/socialAssistantService";
import EditProfile from "../../Components/EditProfile";
import assistantProfileValidation from "./Profile/validations/assistant-profile-validation";
import Swal from "sweetalert2";

export default function PerfilAssistente() {
  const { isShown } = useAppState();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState();

  async function handleImageUpload(event) {
    const file = event.target.files[0];
    ;

    if (file) {
      const token = localStorage.getItem("token");

      try {
        const formData = new FormData();
        formData.append("file", file);
        await api.post("/profilePicture", formData, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        getProfilePhoto();
      } catch (err) {
        alert("Erro ao atualizar foto de perfil.");
        ;
      }

    }
  }

  async function getProfilePhoto() {
    const token = localStorage.getItem("token");

    try {
      const profilePhoto = await api.get("/profilePicture", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      ;
      setProfilePhoto(profilePhoto.data.url);
      localStorage.setItem("profilePhoto", JSON.stringify(profilePhoto.data.url));

    } catch (err) {
      if (err.response.status === 401) {
        navigate("/login");
      }
    }
  }

  useEffect(() => {
    async function getUserInfo() {
      const token = localStorage.getItem("token");
      const user_role = localStorage.getItem("role");
      if (user_role === "ASSISTANT") {
        try {
          const user_info = await api.get("/assistant/basic-info", {
            headers: {
              authorization: `Bearer ${token}`,
            },
          });
          setUserInfo(user_info.data.assistant);
          localStorage.setItem("assistant", JSON.stringify(user_info.data.assistant))
        } catch (err) {
          if (err.response?.status === 401) {
            try {
              const newToken = await api.patch("/token/refresh");
              localStorage.setItem("token", newToken);
            } catch (err) {
              ;
            }
          }
        }
      }
    }



    getProfilePhoto();
    getUserInfo();
  }, []);
  const [isEditing, setIsEditing] = useState(false)
  const handleEditProfile = async (updatedInfo) => {
    try {

      await socialAssistantService.updateProfile(updatedInfo)
      Swal.fire({
        title: "Informações atualizadas",
        icon: "success",
        text: "Informações atualizadas com sucesso"
      })
      setUserInfo(updatedInfo)
      setIsEditing(false)
    } catch (err) {
      Swal.fire({
        title: "Erro",
        icon: "error",
        text: err.response.data.message
      })
    }
  }
  return (
    <div className="container">
      <div className="section-nav">
        <NavBarAssistente user={userInfo}></NavBarAssistente>
      </div>

      <div className="container-contas">
        <div className="upper-contas status-title">
          <h1>{userInfo ? userInfo.name : "User Name"}</h1>
        </div>
        <div className="user-photo">
          <div className="profile-photo">
            <div className="bg-image">
              <img
                id="profile-photo"
                src={profilePhoto !== null ? profilePhoto : photoProfile}
              ></img>
            </div>
            <label className="profile-label" for="photo">
              Editar Foto
            </label>
            <input
              type="file"
              name="profile-photo"
              id="photo"
              accept="image/png, image/jpeg, image/jpg, image/pdf"
              onChange={handleImageUpload}
            ></input>
          </div>
        </div>
        <div className="novos-colaboradores profile-candidate">
          {(!isEditing && userInfo) ?
            <div className="solicitacoes personal-info">
              <div className="upper-info">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <h2>Informações pessoais</h2>
                  <a href="#" onClick={() => setIsEditing(true)}>
                    <UilPen size="20" color="#1F4B73"></UilPen>
                  </a>
                </div>
                <div className="info-item">
                  <h3>Nome:</h3>
                  <h3>{userInfo ? userInfo.name : "User Name"}</h3>
                </div>
                <div className="info-item">
                  <h3>Telefone:</h3>
                  <h3>{userInfo ? formatTelephone(userInfo.phone) : ""}</h3>
                </div>
                <div className="info-item">
                  <h3>CPF:</h3>
                  <h3>{userInfo ? formatCPF(userInfo.CPF) : ""}</h3>
                </div>
                <div className="info-item">
                  <h3>CRESS:</h3>
                  <h3>{userInfo ? userInfo.CRESS : ""}</h3>
                </div>
                <div className="info-item">
                  <h3>Senha:</h3>
                  <h3>********</h3>
                </div>

              </div>

            </div>
            : isEditing && <EditProfile
              data={userInfo}
              onClose={() => setIsEditing(false)}
              onEdit={handleEditProfile}
              validation={assistantProfileValidation}
              customFields={[
                { label: "CRESS", name: "CRESS" },
                { label: "CPF", name: "CPF", mask: formatCPF },
                { label: "Telefone", name: "phone", mask: formatTelephone }
              ]}
            />

            /* <div className="solicitacoes personal-info">
              <div className="upper-info">
                <h2>Informações pessoais</h2>
                <div className="info-item">
                  <h3>Nome:</h3>
                  <div className="skeleton-text skeleton-loading"></div>
                </div>
                <div className="info-item">
                  <h3>Telefone:</h3>

                  <div className="skeleton-text skeleton-loading"></div>
                </div>
                <div className="info-item">
                  <h3>CPF:</h3>

                  <div className="skeleton-text skeleton-loading"></div>
                </div>
                <div className="info-item">
                  <h3>CRESS:</h3>

                  <div className="skeleton-text skeleton-loading"></div>
                </div>
                <div className="info-item">
                  <h3>Senha:</h3>

                  <div className="skeleton-text skeleton-loading"></div>
                </div>
                <div className="info-item">
                </div>

              </div>

            </div> */}

          <ChangePassword />
        </div>
      </div>
    </div>
  );
}
