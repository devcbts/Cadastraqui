import React, { useEffect, useState } from "react";
import "./home.css";
import NavBar from "../../Components/navBar";
import { useAppState } from "../../AppGlobal";
import NavBarAssistente from "../../Components/navBarAssistente";
import EditalAssistente from "../../Components/editalAssistente";
import { useAuth } from "../../context/auth";
import { api } from "../../services/axios";

export default function HomeAssistente() {
  const { isShown } = useAppState();
  const { user } = useAuth();
  console.log(user)
  const [announcements, setAnnouncements] = useState()
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
      const response = await api.get('/assistant/teste/', {
        headers: {
          'authorization': `Bearer ${token}`,
        }
      })
      // Pega todos os editais e armazena em um estado
      setAnnouncements(response.data.announcement)
      // Pega apenas os editais ainda abertos e armazena em um estado

      const openAnnouncements = response.data.announcement.filter(announcement => new Date(announcement.announcementDate) >= new Date());
      setOpenAnnouncements(openAnnouncements)
      // Pega os editais já fechados e armazena em um estado

      const closeAnnouncements = response.data.announcement.filter(announcement => new Date(announcement.announcementDate) < new Date());
      setCloseAnnouncements(closeAnnouncements)


      // Filtra os announcements associados ao assistente social em questão
      const activeAnnouncements = openAnnouncements.filter(announcement =>
        announcement.socialAssistant == assistantId
      );
      setActiveAnnouncements(activeAnnouncements);
      console.log(response.data.announcement)
    }
    fetchAnnouncements()
  }, [])

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
          {activeAnnouncements ? activeAnnouncements.map((announcement) => {
            return (<EditalAssistente announcement={announcement} />)
          }) : ""}
        </div>

        <div className="upper-contas status-title">
          <h1>Editais abertos</h1>
        </div>

        <div className="container-editais">
          {openAnnouncements ? openAnnouncements.map((announcement) => {
            return (<EditalAssistente announcement={announcement} />)
          }) : ""}
        </div>

        <div className="upper-contas status-title">
          <h1>Editais anteriores</h1>
        </div>

        <div className="container-editais">
          {closeAnnouncements ? closeAnnouncements.map((announcement) => {
            return (<EditalAssistente announcement={announcement} />)
          }) : ""}
        </div>
      </div>
    </div>
  );
}
