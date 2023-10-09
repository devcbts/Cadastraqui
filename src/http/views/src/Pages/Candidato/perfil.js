import React from "react";
import "./perfil.css";
import NavBar from "../../Components/navBar";
import { useAppState } from "../../AppGlobal";
import NavBarCandidato from "../../Components/navBarCandidato";
import photoProfile from "../../Assets/profile-padrao.jpg";
import { UilPen } from "@iconscout/react-unicons";
import { UilLock } from "@iconscout/react-unicons";

export default function PerfilCandidato() {
  const { isShown } = useAppState();

  return (
    <div className="container">
      <div className="section-nav">
        <NavBarCandidato></NavBarCandidato>
      </div>

      <div className="container-contas">
        <div className="upper-contas status-title">
          <h1>Current User</h1>
        </div>
        <div className="user-photo">
          <div className="bg-image">
            <img src={photoProfile}></img>
          </div>
          <div className="side-photo"></div>
        </div>
        <div className="novos-colaboradores profile-candidate">
          <div className="solicitacoes personal-info">
            <div className="upper-info">
              <h2>Informações pessoais</h2>
            </div>
            <a href="#">
              <UilPen size="20" color="#1F4B73"></UilPen>
            </a>
          </div>
          <a href="#" className="btn-alterar">
            <UilLock size="20" color="white"></UilLock>
            Alterar senha
          </a>
        </div>
      </div>
    </div>
  );
}
