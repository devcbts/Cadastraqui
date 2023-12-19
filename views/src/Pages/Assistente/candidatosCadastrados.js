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

  //Lista rankeada pela renda
  const [rankedList, setRankedList] = useState([])
  const { isShown } = useAppState();
  const [filterIsShown, setFilterIsShown] = useState(false);
  const [applications, setApplications] = useState();

  //Edital e education levels
  const [announcement, setAnnouncement] = useState();
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
    fetchRankedCandidates();
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
      setAnnouncement(response.data.announcement)
      console.log(response.data.announcement)
    } catch (error) {
      console.error("Error fetching announcement details:", error);
    }
  }

  async function fetchRankedCandidates() {
    const token = localStorage.getItem("token");
    try {
      const response = await api.get(`/assistant/rank-income/${announcement_id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data)
      setRankedList(response.data.rankedList)
    } catch (error) {
      console.error("Erro ao rankear candidatos", error);
    }
  }

  return (
    <div className="container">
      <div className="section-nav">
        <NavBarAssistente></NavBarAssistente>
      </div>

      <div className="container-contas">
        <div className="upper-cadastrados">
          <h1>Editail - {announcement?.announcementName}</h1>
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
                {rankedList[level.id]?.map((application) => (
                  <div>
                    {console.log(application)}
                    <Candidatura
                      key={application.candidateApplication.id}
                      name={application.candidateApplication.candidateName}
                      assistente={application.candidateApplication.SocialAssistantName}
                      id={application.candidateApplication.id}
                      announcement_id={announcement_id}
                      valor={application.totalIncomePerCapita}
                      announcementName = {announcement.announcementName}
                    />

                  </div>
                ))}
                <Candidatura
                  name="João Paulo"
                  assistente='Fernado Souza'
                  announcement_id={announcement_id}
                  valor = {3500}
                /><Candidatura
                  name="João Paulo"
                  assistente='Fernado Souza'
                  announcement_id={announcement_id}
                  valor = {5000}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
