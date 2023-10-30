import React, { useState } from "react";
import "./candidatosCadastrados.css";
import NavBar from "../../Components/navBar";
import { UilBell } from "@iconscout/react-unicons";
import { useAppState } from "../../AppGlobal";
import Candidatura from "../../Components/candidatura";
import Colaboracao from "../../Components/colaboracao";
import NavBarAssistente from "../../Components/navBarAssistente";
import { UilFilter } from "@iconscout/react-unicons";
import { useParams } from "react-router";
import { useEffect } from "react";
import { useAuth } from "../../context/auth";
import { api } from "../../services/axios";


export default function CandidatosCadastrados() {
  const { announcement_id } = useParams()
  const { user } = useAuth();

  const { isShown } = useAppState();
  const [filterIsShown, setFilterIsShown] = useState(false);

  const [applications, setApplications] = useState()

  const handleClickFilter = () => {
    setFilterIsShown((prev) => !prev);
  };


  useEffect(() => {
    async function fetchCandidates() {
      const token = localStorage.getItem("token")
      const response = await api.get(`/assistant/${announcement_id}`, {
        headers: {
          'authorization': `Bearer ${token}`,
        }
      })

      setApplications(response.data.applications)
      console.log(response.data.applications)
    }

    fetchCandidates()
  }, [])

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
          {applications ? applications.map((application) => {
            return (<Candidatura name={application.candidateName} assistente={application.SocialAssistantName} id={application.id} announcement_id={announcement_id}  />)
          }) : ""}
        </div>
      </div>
    </div>
  );
}
