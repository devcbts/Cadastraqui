import React, { useEffect, useRef, useState } from "react";
import Card from "react-bootstrap/Card";
import "./edital.css";
import uspLogo from "../Assets/usp-logo.png";

export default function Edital() {
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
      </div>
    </>
  );
}
