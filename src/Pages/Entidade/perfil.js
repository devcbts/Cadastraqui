import React, { useEffect, useState } from "react";
import NavBar from "../../Components/navBar";
import { useAppState } from "../../AppGlobal";
import NavBarAssistente from "../../Components/navBarAssistente";
import photoProfile from "../../Assets/profile-padrao.jpg";
import { UilPen } from "@iconscout/react-unicons";
import { UilLock } from "@iconscout/react-unicons";
import { api } from "../../services/axios";
import { useNavigate } from "react-router";
import "./perfil.css";
import { formatCNPJ } from "../../utils/format-cnpj";

export default function PerfilAssistente() {
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
          {userInfo ? (
            <div className="solicitacoes personal-info">
              <div className="upper-info">
                <h2>Informações cadastrais</h2>
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
                  <h3 className="info-text">{userInfo ?  formatCNPJ(userInfo.CNPJ) : ""}</h3>
                </div>
                <div className="info-item">
                  <h3>CEP:</h3>
                  <h3 className="info-text">{userInfo ? (userInfo.CEP) : ""}</h3>
                </div>
                <div className="info-item">
                  <h3>Endereço:</h3>
                  <h3 className="info-text">
                    {userInfo ? userInfo.address : ""}
                  </h3>
                </div>
                <div className="info-item">
                  <h3>Senha:</h3>
                  <h3 className="info-text">********</h3>
                </div>
              </div>
              <a href="#">
                <UilPen size="20" color="#1F4B73"></UilPen>
              </a>
            </div>
          ) : (
            <div className="solicitacoes personal-info">
              <div className="upper-info">
                <h2>Informações cadastrais</h2>
                <div className="info-item">
                  <h3>Razão Social:</h3>

                  <div className="skeleton-text skeleton-loading"></div>
                </div>
                <div className="info-item">
                  <h3>Nome Fantasia:</h3>
                  <div className="skeleton-text skeleton-loading"></div>
                </div>
                <div className="info-item">
                  <h3>CNPJ:</h3>

                  <div className="skeleton-text skeleton-loading"></div>
                </div>
                <div className="info-item">
                  <h3>CEP:</h3>

                  <div className="skeleton-text skeleton-loading"></div>
                </div>
                <div className="info-item">
                  <h3>Endereço:</h3>

                  <div className="skeleton-text skeleton-loading"></div>
                </div>
                <div className="info-item">
                  <h3>Senha:</h3>

                  <div className="skeleton-text skeleton-loading"></div>
                </div>
                <div className="info-item"></div>
              </div>
              <a href="#">
                <UilPen size="20" color="#1F4B73"></UilPen>
              </a>
            </div>
          )}
          <a href="#" className="btn-alterar">
            <UilLock size="20" color="white"></UilLock>
            Alterar senha
          </a>
        </div>
      </div>
    </div>
  );
}
