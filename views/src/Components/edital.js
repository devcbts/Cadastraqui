import React, { useEffect, useRef, useState } from "react";
import Card from "react-bootstrap/Card";
import "./edital.css";
import uspLogo from "../Assets/usp-logo.png";
import { formatDate } from "../utils/get-date-formatted";
import { Link } from "react-router-dom";

export default function Edital(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const announcement = props.announcement

  const announcementDate = formatDate(announcement.announcementDate)
  return (
    <Link to={`/candidato/editaltest/${announcement.id}`}>
      <div className="edital-card">
        <h3>Prazo: {announcementDate}</h3>
        <img src={uspLogo}></img>
        <h2>{announcement.announcementName}</h2>
      </div>
    </Link>
  );
}
