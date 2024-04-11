import React, { useEffect, useState } from "react";
import NavBar from "../../../Components/navBar";
import { useAppState } from "../../../AppGlobal";
import NavBarAssistente from "../../../Components/navBarAssistente";
import photoProfile from '../../../Assets/profile-padrao.jpg';
import { UilPen } from "@iconscout/react-unicons";
import { UilLock } from "@iconscout/react-unicons";
import { api } from "../../../services/axios";
import { useNavigate } from "react-router";
import "./perfil.css";
import { formatCNPJ } from "../../../utils/format-cnpj";
import ChangePassword from "../../../Components/ChangePassword/ChangePassword";
import EditProfile from "../../../Components/EditProfile";
import Swal from "sweetalert2";
import entityProfileValidation from "./validations/entity-profile-validation";
import entityService from "../../../services/entity/entityService";

export default function PerfilEntidade() {
  const { isShown } = useAppState();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState();

  async function handleImageUpload(event) {
    const file = event.target.files[0];
    console.log(file);

    if (file) {
      const token = localStorage.getItem("token");

      try {
        const formData = new FormData();
        formData.append("file", file);
        await api.post("/entities/profilePicture", formData, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        getProfilePhotoEntity();
      } catch (err) {
        alert("Erro ao atualizar foto de perfil.");
        console.log(err);
      }
    }
  }

  async function getProfilePhotoEntity() {
    const token = localStorage.getItem("token");

    try {
      const profilePhoto = await api.get("/entities/profilePicture", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      console.log(profilePhoto);
      setProfilePhoto(profilePhoto.data.url);
      localStorage.setItem(
        "profilePhoto",
        JSON.stringify(profilePhoto.data.url)
      );
    } catch (err) {
      if (err.response.status === 401) {
        navigate("/login");
      }
    }
  }

  useEffect(() => {
    async function getUserInfo() {
      const token = localStorage.getItem("token");

      try {
        const user_info = await api.get("/entities/", {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setUserInfo(user_info.data.entity);
      } catch (err) {
        if (err.response?.status === 401) {
          try {
            const newToken = await api.patch("/token/refresh");
            localStorage.setItem("token", newToken);
          } catch (err) {
            console.log(err);
          }
        }
      }
    }

    getProfilePhotoEntity();
    getUserInfo();
  }, []);
  const [isEditing, setIsEditing] = useState(false)
  const handleEditProfile = async (updatedInfo) => {
    try {

      await entityService.updateProfile(updatedInfo)
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
        <NavBar entity={userInfo}></NavBar>
      </div>

      <div className="container-contas">
        <div className="user-photo">
          <div className="profile-photo">
            <div className="bg-image">
              <label className="profile-label" for="photo">
                <img
                  id="profile-photo"
                  src={profilePhoto !== null ? profilePhoto : photoProfile}
                ></img>
              </label>
            </div>
            <input
              type="file"
              name="profile-photo"
              id="photo"
              accept="image/png, image/jpeg, image/jpg, image/pdf"
              onChange={handleImageUpload}
            ></input>
          </div>
          <div className="upper-contas status-title">
            <h1>{userInfo ? userInfo.name : "User Name"}</h1>
          </div>
        </div>
        <div className="novos-colaboradores profile-candidate">
          {(!isEditing && userInfo) ? (
            <div className="solicitacoes personal-info">
              <div className="upper-info">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <h2>Informações cadastrais</h2>
                  <a href="#" onClick={() => setIsEditing(true)}>
                    <UilPen size="20" color="#1F4B73"></UilPen>
                  </a>
                </div>
                <div className="info-item">
                  <h3>Razão Social:</h3>
                  <h3 className="info-text">
                    {userInfo ? userInfo.socialReason : ""}
                  </h3>
                </div>
                <div className="info-item">
                  <h3>Nome:</h3>
                  <h3 className="info-text">
                    {userInfo ? userInfo.name : "User Name"}
                  </h3>
                </div>

                <div className="info-item">
                  <h3>CNPJ:</h3>
                  <h3 className="info-text">{userInfo ? formatCNPJ(userInfo.CNPJ) : ""}</h3>
                </div>
                <div className="info-item">
                  <h3>CEP:</h3>
                  <h3 className="info-text">{userInfo ? (userInfo.CEP) : ""}</h3>
                </div>
                <div className="info-item">
                  <h3>Endereço:</h3>
                  <h3 className="info-text">
                    {userInfo ? `${userInfo.address}, Bairro ${userInfo.neighborhood}, Nº ${userInfo.addressNumber}. ${userInfo.city} - ${userInfo.UF} ` : ""}
                  </h3>
                </div>
                <div className="info-item">
                  <h3>Senha:</h3>
                  <h3 className="info-text">********</h3>
                </div>
              </div>

            </div>
          ) : isEditing &&
          <EditProfile data={userInfo} onEdit={handleEditProfile} onClose={() => setIsEditing(false)}
            validation={entityProfileValidation}
            customFields={[
              { label: "CNPJ", name: "CNPJ", mask: formatCNPJ },
              { label: "Razão Social", name: "socialReason" },
            ]}
          />}

          <ChangePassword />
        </div>
      </div>
    </div>
  );
}
