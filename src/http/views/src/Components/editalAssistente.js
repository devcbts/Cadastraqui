import React, { useEffect, useRef, useState } from "react";
import Card from "react-bootstrap/Card";
import "./editalAssistente.css";
import uspLogo from "../Assets/usp-logo.png";
import { UilArrowRight } from "@iconscout/react-unicons";
import { Link } from "react-router-dom";

export default function EditalAssistente(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  console.log(props.announcement)

  const date = new Date(props.announcement.announcementDate);

  const day = date.getDate().toString().padStart(2, '0') 
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()

  const announcementDate = `${day}/${month}/${year}`;

  return (
    <>
      <div className="edital-card">
        <h3>Prazo: {`${props.announcement ? announcementDate : ""}`}</h3>
        <img src={uspLogo}></img>
        <h2>{props.announcement.announcementNumber}</h2>
        <Link to={`/assistente/cadastrados/${props.announcement.id}`}>
          Saiba mais
        </Link>
      </div>
    </>
  );
}
