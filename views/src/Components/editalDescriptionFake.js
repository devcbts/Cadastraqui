import { useEffect, useState } from "react";
import React from "react";
import universityLogo from "../Assets/usp-logo.png";
import "./editalDescription.css";
import { useParams } from "react-router";
import { api } from "../services/axios";

export default function EditalInscricaoFake() {
  //const params = useParams()
  //console.log(params);

  //const [announcementInfo, setAnnouncementInfo] = useState()

  /*useEffect(() => {
    async function fetchAnnouncements() {
      const token = localStorage.getItem("token")
      try{
        const response = await api.get(`/candidates/anouncements/${params.announcement_id}`, {
          headers: {
            'authorization': `Bearer ${token}`,
          }})
        // Pega todos os editais e armazena em um estado
        setAnnouncementInfo(response.data.announcements)  
        console.log(response.data.announcements)
      } catch(err) {
        console.log(err)  
      } 
    }
    fetchAnnouncements()
  },[])*/

  return (
    <div className="container-inscricao">
      <div className="school-logo">
        <img src={universityLogo}></img>
      </div>
      <div className="descricao-edital">
        <h1>USP 2024.1{/*announcementInfo ? announcementInfo.announcementName : ''*/}</h1>
        A Universidade de São Paulo tem o prazer de anunciar o edital para o processo seletivo do curso de Medicina no primeiro semestre de 2024. Com uma tradição de excelência acadêmica e inovação na área da saúde, o curso de Medicina da USP é reconhecido nacional e internacionalmente.


  
        <h4>
          {/*announcementInfo ? announcementInfo.description : ''*/}
        </h4>
      </div>
      <div className="info-inscricao">
        <h2>Vagas: Medicina{/*announcementInfo ? announcementInfo.offeredVacancies : ''*/}</h2>
        <h2>Escolaridade: Ensino Superior</h2>
        <h2>Turno: Tarde</h2>
      </div>
    </div>
  );
}
