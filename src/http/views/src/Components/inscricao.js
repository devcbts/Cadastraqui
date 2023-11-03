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

export default function Inscricao(props) {
  const { user } = useAuth();
  const [enrolled, setEnrolled] = useState(false)



  return (
    <div className="item">
      <h2>Renan</h2>
      <UilElipsisDoubleVAlt
        size="30"
        color="#7b7b7b"
        className="icon"
      ></UilElipsisDoubleVAlt>
      <img src={uspLogo} alt="Icon" />
      <h2>USP 2024.2</h2>
      <UilElipsisDoubleVAlt
        size="30"
        color="#7b7b7b"
        className="icon"
      ></UilElipsisDoubleVAlt>
      <h2>Situação: Lista de espera</h2>
      <UilElipsisDoubleVAlt
        size="30"
        color="#7b7b7b"
        className="icon"
      ></UilElipsisDoubleVAlt>

      <Link to={`/candidato/solicitacoes/${props.id}`}>
        <UilSearch
          size="45"
          color="#7b7b7b"
          className="icon"
        ></UilSearch>
      </Link>
    </div>
  );
}
