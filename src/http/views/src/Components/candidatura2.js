import React, { useEffect } from "react";
import { useState } from "react";
import universityLogo from "../Assets/usp-logo.png";
import { UilPlusSquare } from "@iconscout/react-unicons";
import { UilEllipsisH } from "@iconscout/react-unicons";
import "./candidatura.css";
import { api } from "../services/axios";
import { useAuth } from "../context/auth";
import { Link } from "react-router-dom";
import uspLogo from "../Assets/usp-logo.png";


export default function Candidatura2() {
  const { user } = useAuth();
  const [enrolled, setEnrolled] = useState(false)
  const [applicationStatus, setApplicationStatus] = useState()

  /*async function handleEnrollClick() {
    const token = localStorage.getItem("token")


    const response = await api.post(`/assistant/${props.announcement_id}/${props.id}`, {}, {
      headers: {
        'authorization': `Bearer ${token}`,
      },
    });

    console.log(response.status)
    setEnrolled(true)
  }*/

  


  return (
    <div className="card-candidatura">
      <div className="candidato-assistente">
        <h3>Geovana</h3>
        <div className="application-info">
          <img src={uspLogo}/>
          <h2 className="application-name">UNESP 2024.1</h2>
        </div>
        <h2 className="waiting">Situação:  <span>Lista de Espera</span></h2>
      </div>
      {/*<div className="candidatura-btn">
        <Link to={`/assistente/cadastrados/geral/${props.announcement_id}/${props.id}`}>
        <UilEllipsisH size="30" color="#7b7b7b" className="icon"></UilEllipsisH>
        </Link>

        <a href="">Extrair PDF</a>
        {!enrolled && !props.assistente ?
          <div onClick={handleEnrollClick}>

            <UilPlusSquare
              size="30"
              color="#7b7b7b"
              className="icon"
            ></UilPlusSquare>
          </div>
          : ""}
        </div>*/}
    </div>
  );
}
