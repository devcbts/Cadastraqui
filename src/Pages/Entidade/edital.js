import React from "react";
import "./edital.css";
import NavBar from "../../Components/navBar";
import { UilBell } from "@iconscout/react-unicons";
import { useAppState } from "../../AppGlobal";
import EditalInscricao from "../../Components/editalDescription";

export default function EditalAberto() {
  const { isShown } = useAppState();

  return (
    <div className="container">
      <div className="section-nav">
        <NavBar></NavBar>
      </div>

      <div className="container-open-edital">
        <EditalInscricao></EditalInscricao>
      </div>
    </div>
  );
}
