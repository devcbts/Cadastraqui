import React from "react";
import { useNavigate } from "react-router";
import NavBarAssistente from "../../Components/navBarAssistente";

export default function Estatisticas() {
  return (
    <div className="container">
      <div className="section-nav">
        <NavBarAssistente></NavBarAssistente>
      </div>
      <div className="container-contas">
        <div className="upper-cadastrados">
          <h1>Editais - Unifei 2023.1</h1>
          <div className="btns-cadastro">
            <a className="btn-cadastro">Extrair PDF</a>
            <a className="btn-cadastro">Voltar</a>
          </div>
        </div>
        <h1 className="title-thin">Estatísticas</h1>
      </div>
    </div>
  );
}
