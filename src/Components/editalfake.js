import React, { useEffect, useRef, useState } from "react";
import Card from "react-bootstrap/Card";
import "./edital.css";
import uspLogo from "../Assets/usp-logo.png";
import { formatDate } from "../utils/get-date-formatted";
import { Link } from "react-router-dom";

export default function EditalFake() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  

  //const announcementDate = formatDate(announcement.announcementDate)
  return (
    <Link to={`/candidato/editaltest/teste`}>
      <div className="edital-card">
        <h3>Prazo: 19/01/2024</h3>
        <img src={uspLogo}></img>
        <h2>USP 2024.1</h2>
      </div>
    </Link>
  );
}
