import React, { useEffect, useRef, useState } from "react";
import Card from "react-bootstrap/Card";
import "./editalAssistente.css";
import uspLogo from "../Assets/usp-logo.png";
import { UilArrowRight } from "@iconscout/react-unicons";

export default function EditalAssistente() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  console.log(show);
  return (
    <>
      <div className="edital-card">
        <h3>Prazo: 10/11/2023</h3>
        <img src={uspLogo}></img>
        <h2>USP 2023.1</h2>
        <a href="">Saiba mais</a>
      </div>
    </>
  );
}
