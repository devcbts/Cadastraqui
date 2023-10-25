import React from "react";
import "./editalCandidato.css";
import NavBar from "../../Components/navBar";
import { UilBell } from "@iconscout/react-unicons";
import { useAppState } from "../../AppGlobal";
import EditalInscricao from "../../Components/editalDescription";
import NavBarCandidato from "../../Components/navBarCandidato";
import AcceptEdital from "./acceptEdital";

export default function EditalAbertoCandidato() {
  const { isShown } = useAppState();

  return (
    <div className="container">
      <div className="section-nav">
        <NavBarCandidato></NavBarCandidato>
      </div>

      <div className="container-open-edital">
        {/*<EditalInscricao></EditalInscricao>*/}
        <AcceptEdital></AcceptEdital>
      </div>
    </div>
  );
}
