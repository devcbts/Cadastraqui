import React, { useEffect, useState } from "react";
import "./home.css";
import NavBar from "../../Components/navBar";
import { useAppState } from "../../AppGlobal";
import NavBarAssistente from "../../Components/navBarAssistente";
import EditalAssistente from "../../Components/editalAssistente";
import { useAuth } from "../../context/auth";
import { api } from "../../services/axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import uspLogo from "../../Assets/usp-logo.png";
import unifeiLogo from "../../Assets/logo-unifei.png";
import LoadingEdital from "../../Components/Loading/LoadingEdital";
export default function HomeAssistente() {
  const { isShown } = useAppState();
  const [announcements, setAnnouncements] = useState();
  const [openAnnouncements, setOpenAnnouncements] = useState();
  const [closeAnnouncements, setCloseAnnouncements] = useState();
  const [activeAnnouncements, setActiveAnnouncements] = useState();
  const [assistant, setAssistant] = useState();

  const navigate = useNavigate()
  const [profilePhoto, setProfilePhoto] = useState(null)
  useEffect(() => {
    async function getProfilePhotoEntity() {
      const token = localStorage.getItem("token");

      try {
        const profilePhoto = await api.get(`/entities/profilePicture/${openAnnouncements[0].entity.user_id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        console.log(profilePhoto);
        setProfilePhoto(profilePhoto.data.url);

      } catch (err) {

      }
    }
    getProfilePhotoEntity()
  }, [openAnnouncements])
  useEffect(() => {
    async function getAssistantInfo() {
      const token = localStorage.getItem("token");

      try {
        const response = await api.get("/assistant/basic-info", {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data)
        setAssistant(response.data.assistant);
      } catch (err) {
        console.log(err)
      }
    }
    getAssistantInfo();

    async function refreshAccessToken() {
      try {
        const refreshToken = Cookies.get('refreshToken')

        const response = await api.patch(`/refresh?refreshToken=${refreshToken}`)

        const { newToken, newRefreshToken } = response.data
        localStorage.setItem('token', newToken)
        Cookies.set('refreshToken', newRefreshToken, {
          expires: 7,
          sameSite: true,
          path: '/',
        })
      } catch (err) {
        console.log(err)
        navigate('/login')
      }
    }
    const intervalId = setInterval(refreshAccessToken, 480000) // Chama a função refresh token a cada 


  }, []);
  
    async function fetchAnnouncements() {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get("/assistant/announcement/", {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        // Pega todos os editais e armazena em um estado
        setAnnouncements(response.data.announcement);
        // Pega apenas os editais ainda abertos e armazena em um estado
        const openAnnouncements = response.data.announcement.filter(
          (announcement) => new Date(announcement.announcementDate) >= new Date()
        );
        setOpenAnnouncements(openAnnouncements);
        // Pega os editais já fechados e armazena em um estado

        const closeAnnouncements = response.data.announcement.filter(
          (announcement) => new Date(announcement.announcementDate) < new Date()
        );
        setCloseAnnouncements(closeAnnouncements);

        // Filtra os announcements associados ao assistente social em questão
        const activeAnnouncements = openAnnouncements.filter(
          (announcement) =>
            announcement.socialAssistant.some(
              (assistantObj) => assistantObj.id === assistant?.id
            )
        );
        console.log(activeAnnouncements)
        setActiveAnnouncements(activeAnnouncements);
        console.log(response);
      } catch (err) {
        console.log(err);
      }

    }
    useEffect(() => {
      fetchAnnouncements();

    },[assistant])

  return (
    <div className="container">
      <div className="section-nav">
        <NavBarAssistente></NavBarAssistente>
      </div>

      <div className="container-contas">
        <div className="upper-contas status-title">
          <h1>Editais com atuação</h1>
        </div>

        <div className="container-editais">
          {activeAnnouncements && profilePhoto
            ? activeAnnouncements?.map((announcement) => {
              return <EditalAssistente logo={profilePhoto} announcement={announcement} />;
            })
            : <div className="container-editais">

             <LoadingEdital/>
             <LoadingEdital/>
             <LoadingEdital/>

            </div>}
        </div>

      </div>
    </div >
  );
}
