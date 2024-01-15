import React from "react";
import "./editais.css";
import NavBar from "../../Components/navBar";
import { UilBell } from "@iconscout/react-unicons";
import { useAppState } from "../../AppGlobal";
import NavBarAssistente from "../../Components/navBarAssistente";
import { useState, useEffect } from "react";
import { api } from "../../services/axios";
import EditalAssistente from "../../Components/editalAssistente";
import uspLogo from "../../Assets/usp-logo.png";
import LoadingEdital from "../../Components/Loading/LoadingEdital";

export default function EditaisAssistente() {
  const { isShown } = useAppState();
  const [openAnnouncements, setOpenAnnouncements] = useState()
  const [closeAnnouncements, setCloseAnnouncements] = useState()
  const [activeAnnouncements, setActiveAnnouncements] = useState()
  const [assistantId, setAssistantId] = useState()

  useEffect(() => {

    async function getAssistantInfo() {
      const token = localStorage.getItem("token")
      const response = await api.get('/assistant/basic-info', {
        headers: {
          'authorization': `Bearer ${token}`,
        }
      })
      setAssistantId(response.data.assistant.id)
    }
    getAssistantInfo()

    async function fetchAnnouncements() {
      const token = localStorage.getItem("token")
      const response = await api.get('/assistant/announcement/', {
        headers: {
          'authorization': `Bearer ${token}`,
        }
      })
      // Pega todos os editais e armazena em um estado
      // Pega apenas os editais ainda abertos e armazena em um estado

      const openAnnouncements = response.data.announcement.filter(announcement => new Date(announcement.announcementDate) >= new Date());
      setOpenAnnouncements(openAnnouncements)
      // Pega os editais já fechados e armazena em um estado

      const closeAnnouncements = response.data.announcement.filter(announcement => new Date(announcement.announcementDate) < new Date());
      setCloseAnnouncements(closeAnnouncements)


      
      console.log(response)
    }
    fetchAnnouncements()
  }, [])


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
  return (
    <div className="container">
      <div className="section-nav">
        <NavBarAssistente> </NavBarAssistente>
      </div>
      <div className={`editais ${isShown ? "hidden-menu" : ""}`}>
        <div className="upper">
          <h1>Editais</h1>
          <div className="search-ring">
            <div style={{ minHeight: "0vh" }}></div>
            <div class="right search">
              <form>
                <input type="search" placeholder="Search..." />
              </form>
            </div>
          </div>
        </div>
        <h1>Editais Abertos</h1>
        <div className="container-editais">

          {openAnnouncements && profilePhoto ? openAnnouncements.map((announcement) => {
            return (<EditalAssistente logo={profilePhoto} announcement={announcement} />)
          }) : <div className="container-editais">

            <LoadingEdital />
            <LoadingEdital />
            <LoadingEdital />

          </div>}

        </div>
          <h1>Editais Encerrados</h1>
        <div className="container-editais">
          {closeAnnouncements && profilePhoto ? closeAnnouncements.map((announcement) => {
            return (<EditalAssistente logo={profilePhoto} announcement={announcement} />)
          }) : <div className="container-editais">

            <LoadingEdital />
            <LoadingEdital />
            <LoadingEdital />

          </div>}

        </div>
      </div>
    </div>
  );
}
