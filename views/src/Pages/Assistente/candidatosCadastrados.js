import React, { useState } from "react";
import "./candidatosCadastrados.css";
import NavBar from "../../Components/navBar";
import { UilBell } from "@iconscout/react-unicons";
import { useAppState } from "../../AppGlobal";
import Candidatura from "../../Components/candidatura";
import Colaboracao from "../../Components/colaboracao";
import NavBarAssistente from "../../Components/navBarAssistente";
import { UilFilter } from "@iconscout/react-unicons";
import { useParams, } from "react-router";
import { useEffect } from "react";
import { useAuth } from "../../context/auth";
import { api } from "../../services/axios";
import { Link } from "react-router-dom";
import LoadingCandidaturaAssistente from "../../Components/Loading/loadingCandidaturaAssistente";

export default function CandidatosCadastrados() {
  const { announcement_id } = useParams();
  const { user } = useAuth();

  const { isShown } = useAppState();
  const [filterIsShown, setFilterIsShown] = useState(false);

  const [applications, setApplications] = useState();
  const [educationLevels, setEducationLevels] = useState([]);
  const handleClickFilter = () => {
    setFilterIsShown((prev) => !prev);
  };

  useEffect(() => {
    async function fetchCandidates() {
      const token = localStorage.getItem("token");
      const response = await api.get(`/assistant/${announcement_id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      setApplications(response.data.applications);
      console.log(response.data.applications);
    }
    fetchAnnouncement();
    fetchCandidates();
  }, []);

  async function fetchAnnouncement() {
    const token = localStorage.getItem("token");
    try {
      const response = await api.get(`/assistant/announcement/${announcement_id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setEducationLevels(response.data.announcement.educationLevels);
      console.log(response.data.announcement)
    } catch (error) {
      console.error("Error fetching announcement details:", error);
    }
  }


  return (
    <div className="container">
      <div className="section-nav">
        <NavBarAssistente></NavBarAssistente>
      </div>

      <div className="container-contas">
        <div className="upper-cadastrados">
          <h1>Editais - USP 2024.1</h1>
          <div className="btns-cadastro">
            <a className="btn-cadastro">Extrair PDF</a>

            <a className="btn-cadastro"> <Link className="btn-cadastro" to={`/assistente/estatisticas/${announcement_id}`}>Ver estatísticas</Link></a>

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
          
          <div className="education-levels-container">
            {educationLevels.map((level) => (
              <div key={level.id} className="education-level">
                <h2>{level.availableCourses}</h2>
                {/* Renderize os candidatos para este nível de educação */}
                {applications?.filter(app => app.educationLevel_id === level.id).map((application) => (
                  <div>

                    <Candidatura
                      key={application.id}
                      name={application.candidateName}
                      assistente={application.SocialAssistantName}
                      id={application.id}
                      announcement_id={announcement_id}
                    />

                  </div>
                ))}
                <Candidatura
                  name="João Paulo"
                  assistente='Fernado Souza'
                  announcement_id={announcement_id}
                /><Candidatura
                  name="João Paulo"
                  assistente='Fernado Souza'
                  announcement_id={announcement_id}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
