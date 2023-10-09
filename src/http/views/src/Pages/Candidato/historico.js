import React from "react";
import "./historico.css";
import NavBar from "../../Components/navBar";
import { useAppState } from "../../AppGlobal";
import NavBarCandidato from "../../Components/navBarCandidato";
import photoProfile from "../../Assets/profile-padrao.jpg";
import { UilPen } from "@iconscout/react-unicons";
import { UilLock } from "@iconscout/react-unicons";

export default function HistoricoCandidato() {
  const { isShown } = useAppState();

  return (
    <div className="container">
      <div className="section-nav">
        <NavBarCandidato></NavBarCandidato>
      </div>

      <div className="container-contas">
        <div className="upper-contas status-title">
          <h1>Historico</h1>
        </div>
        <div className="sub-title">
          <h2>Candidaturas em andamento</h2>
        </div>

        <div className="novos-colaboradores status-solicitacoes">
          <div className="solicitacoes"></div>
        </div>

        <div className="sub-title">
          <h2>Candidaturas finalizadas</h2>
        </div>

        <div className="novos-colaboradores status-solicitacoes">
          <div className="solicitacoes"></div>
        </div>
      </div>
    </div>
  );
}
