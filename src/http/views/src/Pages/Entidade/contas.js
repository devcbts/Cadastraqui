import React from "react";
import "./contas.css";
import NavBar from "../../Components/navBar";
import { UilBell } from "@iconscout/react-unicons";
import { useAppState } from "../../AppGlobal";

export default function ContasEntidade() {
  const { isShown } = useAppState();

  return (
    <div className="container">
      <div className="section-nav">
        <NavBar></NavBar>
      </div>

      <div className="container-contas">
        <div className="upper-contas">
          <h1>Universidade</h1>
          <a className="btn-solicitar">Solicitar Cadastro</a>
        </div>
        <div className="novos-colaboradores">
          <h2>Status das solicitações de cadastro de novos colaboradores</h2>
          <div className="solicitacoes"></div>
        </div>

        <div className="historico">
          <h2>Histórico</h2>
          <div className="solicitacoes"></div>
        </div>
      </div>
    </div>
  );
}
