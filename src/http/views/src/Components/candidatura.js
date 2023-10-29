import React from "react";
import { useState } from "react";
import universityLogo from "../Assets/usp-logo.png";
import { UilPlusSquare } from "@iconscout/react-unicons";
import { UilEllipsisH } from "@iconscout/react-unicons";
import "./candidatura.css";
import { api } from "../services/axios";
import { useAuth } from "../context/auth";


export default function Candidatura(props) {
  const { user } = useAuth();
  const [enrolled, setEnrolled] = useState(false)

  async function handleEnrollClick() {
    const token = localStorage.getItem("token")


    const response = await api.post(`/assistant/${props.announcement_id}/${props.id}`, {}, {
      headers: {
        'authorization': `Bearer ${token}`,
      },
    });

    console.log(response.status)
    setEnrolled(true)


  }

  return (
    <div className="card-candidatura">
      <div className="candidato-assistente">
        <h2>{props.name}</h2>
        <h3>Assistente social: {props.assistente}</h3>
      </div>
      <div className="candidatura-btn">
        <UilEllipsisH size="30" color="#7b7b7b" className="icon"></UilEllipsisH>

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
      </div>
    </div>
  );
}
