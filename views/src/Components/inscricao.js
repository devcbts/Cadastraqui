import React from "react";
import { useState } from "react";
import universityLogo from "../Assets/usp-logo.png";
import { UilPlusSquare } from "@iconscout/react-unicons";
import { UilEllipsisH } from "@iconscout/react-unicons";
import "./candidatura.css";
import { api } from "../services/axios";
import { useAuth } from "../context/auth";
import { Link } from "react-router-dom";
import './inscricao.css'
import uspLogo from "../Assets/usp-logo.png";
import { UilElipsisDoubleVAlt } from '@iconscout/react-unicons'
import { UilSearch } from '@iconscout/react-unicons'

const statusTranslations = {
  'Pending': 'Pendente',
  'Rejected': 'Reprovado',
  'Approved': 'Aprovado'
};

export default function Inscricao({application}) {
  const { user } = useAuth();
  const [enrolled, setEnrolled] = useState(false)
  function translateStatus(status) {
    return statusTranslations[status] || 'Status Desconhecido';
  }


  return (
    <div className="item">
      <h2>{application?.SocialAssistantName}</h2>
      <UilElipsisDoubleVAlt
        size="30"
        color="#7b7b7b"
        className="icon"
      ></UilElipsisDoubleVAlt>
      <img src={uspLogo} alt="Icon" />
      <h2>{application?.announcement?.announcementName}</h2>
      <UilElipsisDoubleVAlt
        size="30"
        color="#7b7b7b"
        className="icon"
      ></UilElipsisDoubleVAlt>
      <h2>Situação: {translateStatus(application?.status)}</h2>
      <UilElipsisDoubleVAlt
        size="30"
        color="#7b7b7b"
        className="icon"
      ></UilElipsisDoubleVAlt>

      <Link to={`/candidato/solicitacoes/${application?.id}`}>
        <UilSearch
          size="45"
          color="#7b7b7b"
          className="icon"
        ></UilSearch>
      </Link>
    </div>
  );
}
