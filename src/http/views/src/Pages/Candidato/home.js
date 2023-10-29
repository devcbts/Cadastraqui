import React, { useEffect, useState } from "react";
import "./home.css";
import NavBar from "../../Components/navBar";
import { useAppState } from "../../AppGlobal";
import NavBarCandidato from "../../Components/navBarCandidato";
import Edital from "../../Components/edital";
import Candidatura from "../../Components/candidatura";
import { api } from "../../services/axios";

export default function HomeCandidato() {
  const { isShown } = useAppState();
  
  // Estados para os editais
  const [openAnnouncements, setOpenAnnouncements] = useState()
  
  // Estado para informações acerca do usuário logado
  const [userInfo, setUserInfo] = useState()

  useEffect(() => {
    async function fetchAnnouncements() {
      const token = localStorage.getItem("token")

      const response = await api.get('/candidates/anouncements', {
        headers: {
          'authorization': `Bearer ${token}`,
        }})
      // Pega todos os editais e armazena em um estado
      setOpenAnnouncements(response.data.announcements)   
    }

    async function getUserInfo() {
      const token = localStorage.getItem("token")
      const user_role = localStorage.getItem("role")
      if(user_role === 'CANDIDATE') {
        const user_info = await api.get('/candidates/basic-info', {
          headers: {
            'authorization': `Bearer ${token}`,
          }})
          setUserInfo(user_info.data.candidate)
      } else if(user_role === 'RESPONSIBLE') {
        const user_info = await api.get('/responsibles', {
          headers: {
            'authorization': `Bearer ${token}`,
          }})
          setUserInfo(user_info.data.responsible)
      }
    }
    getUserInfo()
    fetchAnnouncements()
  },[])

  return (
    <div className="container">
      <div className="section-nav">
        <NavBarCandidato user={userInfo}></NavBarCandidato>
      </div>

      <div className="container-contas">
        <div className="upper-contas status-title">
          <h1>Status</h1>
        </div>

        <div className="solicitacoes">
          <Candidatura></Candidatura>
          <Candidatura></Candidatura>
        </div>

        <div className="upper-contas status-title">
          <h1>Editais Abertos</h1>
          <div className="filters">
            <select>
              <option>-- Estado --</option>
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
              <option>Option 4</option>
              <option>Option 5</option>
            </select>

            <select>
              <option>-- Cidade --</option>
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
              <option>Option 4</option>
              <option>Option 5</option>
            </select>

            <select>
              <option>-- Ensino --</option>
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
              <option>Option 4</option>
              <option>Option 5</option>
            </select>
          </div>
        </div>

        <div className="container-editais">
          {openAnnouncements  && openAnnouncements.length > 0 ? openAnnouncements.map((announcement) => {
            return <Edital announcement={announcement} key={announcement.id}/>
          }) : <div className="without-announcement">Não há editais abertos no momento </div>}
        </div>
      </div>
    </div>
  );
}
