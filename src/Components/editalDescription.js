import { useEffect, useState } from "react";
import React from "react";
import universityLogo from "../Assets/usp-logo.png";
import "./editalDescription.css";
import { useParams } from "react-router";
import { api } from "../services/axios";

export default function EditalInscricao() {
  const params = useParams()
    ;

  const [announcementInfo, setAnnouncementInfo] = useState()

  useEffect(() => {
    async function fetchAnnouncements() {
      const token = localStorage.getItem("token")
      try {
        const response = await api.get(`/candidates/anouncements/${params.announcement_id}`, {
          headers: {
            'authorization': `Bearer ${token}`,
          }
        })
        // Pega todos os editais e armazena em um estado
        setAnnouncementInfo(response.data.announcements)

      } catch (err) {

      }
    }
    fetchAnnouncements()
  }, [])

  return (
    <div className="container-inscricao">
      <div className="school-logo">
        <img src={universityLogo}></img>
      </div>
      <div className="descricao-edital">
        <h1>{announcementInfo ? announcementInfo.announcementName : ''}</h1>
        <h4>
          {announcementInfo ? announcementInfo.description : ''}
        </h4>
      </div>
      <div className="info-inscricao">
        <h2>Vagas: {announcementInfo ? announcementInfo.offeredVacancies : ''}</h2>
        <h2>Escolaridade: Ensino Superior</h2>
        <h2>Turno: Tarde</h2>
      </div>
    </div>
  );
}
