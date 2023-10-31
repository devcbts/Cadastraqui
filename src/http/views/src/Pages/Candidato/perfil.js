import React, { useEffect, useState } from "react";
import "./perfil.css";
import NavBar from "../../Components/navBar";
import { useAppState } from "../../AppGlobal";
import NavBarCandidato from "../../Components/navBarCandidato";
import photoProfile from "../../Assets/profile-padrao.jpg";
import { UilPen } from "@iconscout/react-unicons";
import { UilLock } from "@iconscout/react-unicons";
import { api } from "../../services/axios";
import { useNavigate } from "react-router";

export default function PerfilCandidato() {
  const { isShown } = useAppState()
  const [profilePhoto, setProfilePhoto] = useState(null)
  const navigate = useNavigate()

  const [userInfo, setUserInfo] = useState()

  async function getProfilePhoto() {
    const token = localStorage.getItem("token")

    try {
      const profilePhoto = await api.get('/candidates/profilePicture', {
        headers: {
          'authorization': `Bearer ${token}`,
        }
      })
      console.log(profilePhoto)
      setProfilePhoto(profilePhoto.data.url)
    } catch (err) {
      if (err.response.status === 401) {
        navigate('/login')
      }
    }
  }

  useEffect(() => {
    async function getUserInfo() {
      const token = localStorage.getItem("token")
      const user_role = localStorage.getItem("role")
      if (user_role === 'CANDIDATE') {
        try {
          const user_info = await api.get('/candidates/basic-info', {
            headers: {
              'authorization': `Bearer ${token}`,
            }
          })
          setUserInfo(user_info.data.candidate)
        } catch (err) {
          if (err.response.status === 401) {
            try {
              const newToken = await api.patch('/token/refresh')
              localStorage.setItem("token", newToken)
            } catch (err) {
              console.log(err)
            }
          }
        }
      } else if (user_role === 'RESPONSIBLE') {
        const user_info = await api.get('/responsibles', {
          headers: {
            'authorization': `Bearer ${token}`,
          }
        })
        setUserInfo(user_info.data.responsible)
      }
    }
    getProfilePhoto()
    getUserInfo()
  }, [])


  async function handleImageUpload(event) {
    const file = event.target.files[0]
    console.log(file)

    if (file) {
      const token = localStorage.getItem("token")

      try {
        const formData = new FormData();
        formData.append('file', file);
        await api.post('/candidates/profilePicture', formData, {
          headers: {
            'authorization': `Bearer ${token}`,
          }
        })
        getProfilePhoto()
      } catch (err) {
        alert('Erro ao atualizar foto de perfil.')
        console.log(err)
      }
    }}



    return (
      <div className="container">
        <div className="section-nav">
          <NavBarCandidato user={userInfo}></NavBarCandidato>
        </div>

        <div className="container-contas">
          <div className="upper-contas status-title">
            <h1>{userInfo ? userInfo.name : "User Name"}</h1>
          </div>
          <div className="user-photo">
            <div className="profile-photo">
              <div className="bg-image">
                <img id="profile-photo" className="photo-profile-img" alt="imagem-do-usuario" src={profilePhoto !== null ? profilePhoto : photoProfile} />
              </div>
              <label className="profile-label" for="photo">Editar Foto</label>
              <input type="file" name="profile-photo" id="photo" accept="image/png, image/jpeg, image/jpg, image/pdf" onChange={handleImageUpload}></input>
            </div>
            <div className="side-photo"></div>
          </div>
          <div className="novos-colaboradores profile-candidate">
            <div className="solicitacoes personal-info">
              <div className="upper-info">
                <h2>Informações pessoais</h2>
              </div>
              <a href="#">
                <UilPen size="20" color="#1F4B73"></UilPen>
              </a>
            </div>
            <a href="#" className="btn-alterar">
              <UilLock size="20" color="white"></UilLock>
              Alterar senha
            </a>
          </div>
        </div>
      </div>
    );
  }
