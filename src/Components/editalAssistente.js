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
  let announcementDate

  if (props.announcement) {
    const date = new Date(props.announcement.closeDate)

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    announcementDate = `${day}/${month}/${year}`
  }

  return (
    <>
      <div className="edital-card">
        <h3 style={{ fontSize: "18px" }}>Prazo: {`${props.announcement ? announcementDate : ""}`}</h3>
        <img className="logo-card" src={props.logo}></img>
        <h2>{props.announcement.announcementName}</h2>
        <Link to={`/assistente/cadastrados/${props.announcement.id}`}>
          Saiba mais
        </Link>
      </div>
    </>
  );
}
