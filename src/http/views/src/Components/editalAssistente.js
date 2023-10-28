import React, { useEffect, useRef, useState } from "react";
import Card from "react-bootstrap/Card";
import "./editalAssistente.css";
import uspLogo from "../Assets/usp-logo.png";
import { UilArrowRight } from "@iconscout/react-unicons";

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
        <h2>USP 2023.1</h2>
        <a href="/estatisticas">Saiba mais</a>
      </div>
    </>
  );
}
