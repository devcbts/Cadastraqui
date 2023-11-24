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


      // Filtra os announcements associados ao assistente social em questão
      const activeAnnouncements = openAnnouncements.filter(announcement =>
        announcement.socialAssistant === assistantId
      );
      setActiveAnnouncements(activeAnnouncements);
      console.log(response)
    }
    fetchAnnouncements()
  }, [])

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
        <div className="container-editais">
        {activeAnnouncements ? activeAnnouncements.map((announcement) => {
            return (<EditalAssistente logo={uspLogo} announcement={announcement} />)
          }) : <div className="container-editais">

          <LoadingEdital/>
          <LoadingEdital/>
          <LoadingEdital/>

         </div>}
         
        </div>
      </div>
    </div>
  );
}
