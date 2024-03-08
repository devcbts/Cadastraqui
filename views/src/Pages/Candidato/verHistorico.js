import React, { useEffect, useState } from "react";
import "./perfil.css";
import NavBarCandidato from "../../Components/navBarCandidato";
import { UilLock } from "@iconscout/react-unicons";
import "./verHistorico.css";
import { api } from "../../services/axios";
import { UilSearch } from "@iconscout/react-unicons";
import sampleimg from "../../Assets/profile-padrao.jpg";
import { useParams } from "react-router-dom";
import { handleAuthError } from "../../ErrorHandling/handleError";
export default function VerHistorico() {
  const params = useParams()
  const application_id = params.application_id
  console.log(application_id)

  const [application, setApplication] = useState(null)
  const [history, setHistory] = useState(null)
 
  useEffect(() => {
    async function getApplication(){
      const token = localStorage.getItem('token')
      try {
        const response = await api.get(`/candidates/application/history/${application_id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        setApplication(response.data.application)
        setHistory(response.data.applicationHistory)
        console.log(response.data)
      } catch (error) {
        console.log(error)
        handleAuthError(error)
      }
    }
    getApplication()
  }, [application_id])

  return (
    <div className="container">
      <div className="section-nav">
        <NavBarCandidato></NavBarCandidato>
      </div>

      <div className="container-contas">
        <div className="upper-contas status-title title-history">
          <h1>
            Histórico - <span>Edital 2/2023 - Medicina - Diurno</span>
          </h1>
          <h2>Status:</h2>

          <div className="history-card">
            <ul>
              <li>
                <div>
                  <h3>Inscrição número:</h3>
                  <h3>
                    <span>0000000</span>
                  </h3>
                </div>
              </li>
            </ul>
            <h1>|</h1>
            <ul>
              <li>
                <div>
                  <img src={sampleimg}></img>
                  <h1>Anhanguera</h1>
                </div>
              </li>
            </ul>
            <h1>|</h1>
            <ul>
              <li>
                <div>
                  <h3>Situação</h3>
                  <h3>
                    <span>Em análise</span>
                  </h3>
                </div>
              </li>
            </ul>
            <h1>|</h1>
            <ul>
              <li>
                <div>
                  <UilSearch size="35"></UilSearch>
                </div>
              </li>
            </ul>
          </div>
          <h2>Linha do Tempo:</h2>
          <div className="history-timeline">
            <div className="history">
              <h1>Cadastro concluído</h1>
              <h1>
                <span>23/08/2023</span>
              </h1>
            </div>
            <hr></hr>
            <div className="history">
              <h1>Cadastro concluído</h1>
              <h1>
                <span>23/08/2023</span>
              </h1>
            </div>
          </div>
          <div className="history-btn">
            <button>Visualizar documentos apresentados</button>
          </div>
        </div>
      </div>
    </div>
  );
}
