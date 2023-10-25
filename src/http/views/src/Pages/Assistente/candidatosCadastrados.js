import React, { useState } from "react";
import "./candidatosCadastrados.css";
import NavBar from "../../Components/navBar";
import { UilBell } from "@iconscout/react-unicons";
import { useAppState } from "../../AppGlobal";
import Candidatura from "../../Components/candidatura";
import Colaboracao from "../../Components/colaboracao";
import NavBarAssistente from "../../Components/navBarAssistente";
import { UilFilter } from "@iconscout/react-unicons";

export default function CandidatosCadastrados() {
  const { isShown } = useAppState();
  const [filterIsShown, setFilterIsShown] = useState(false);

  const handleClickFilter = () => {
    setFilterIsShown((prev) => !prev);
  };

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
            <a className="btn-cadastro">Ver estatísticas</a>
          </div>
        </div>
        <h1 className="title-thin">Candidatos</h1>
        <div
          className="filter-ico"
          onClick={() => {
            handleClickFilter();
          }}
        >
          <UilFilter size="30" color="#9e9e9e" id="btn-filter"></UilFilter>
        </div>

        {filterIsShown && (
          <div className="filters">
            <ul>
              <li>
                <div>
                  <select>
                    <option>USP Bauru</option>
                    <option>USP Pinheiros</option>
                  </select>
                </div>
              </li>

              <li>
                <div>
                  <select>
                    <option value="" disabled>
                      Curso
                    </option>
                    <option>Engenharia</option>
                    <option>Medicina</option>
                  </select>
                </div>
              </li>

              <li>
                <div>
                  <select>
                    <option value="" disabled>
                      Turno
                    </option>
                    <option>Matutino</option>
                    <option>Vespertino</option>
                    <option>Noturno</option>
                  </select>
                </div>
              </li>

              <li>
                <div>
                  <select>
                    <option value="" disabled>
                      Assistente
                    </option>
                    <option>Todos</option>
                    <option></option>
                  </select>
                </div>
              </li>
            </ul>
          </div>
        )}

        <div className="solicitacoes">
          <Candidatura></Candidatura>
          <Candidatura></Candidatura>
        </div>
      </div>
    </div>
  );
}
