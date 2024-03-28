import React, { useEffect, useState } from "react";
import "./historico.css";
import NavBar from "../../Components/navBar";
import { useAppState } from "../../AppGlobal";
import NavBarCandidato from "../../Components/navBarCandidato";
import photoProfile from "../../Assets/profile-padrao.jpg";
import { UilPen } from "@iconscout/react-unicons";
import { UilLock } from "@iconscout/react-unicons";
import Candidatura from "../../Components/candidatura";
import { api } from "../../services/axios";
import CandidatoCandidatura from "../../Components/Candidatocandidatura";
import LoadingCandidaturaAssistente from "../../Components/Loading/loadingCandidaturaAssistente";

export default function HistoricoCandidato() {
  const { isShown } = useAppState();

  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    async function getUserInfo() {
      const token = localStorage.getItem("token")
      const user_role = localStorage.getItem("role")
      if (user_role === 'CANDIDATE') {
        const user_info = await api.get('/candidates/basic-info', {
          headers: {
            'authorization': `Bearer ${token}`,
          }
        })
        setUserInfo(user_info.data.candidate)
      } else if (user_role === 'RESPONSIBLE') {
        const user_info = await api.get('/responsibles', {
          headers: {
            'authorization': `Bearer ${token}`,
          }
        })
        setUserInfo(user_info.data.responsible)
      }
    }
    getUserInfo()
    getApplications()
  }, [])
  const [applications, setApplications] = useState()

  async function getApplications() {
    const token = localStorage.getItem("token")
    try {
      const response = await api.post('/candidates/application/see', {}, {
        headers: {
          'authorization': `Bearer ${token}`,
        }
      })

      console.log(response.data)
      setApplications(response.data.applications)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="container">
      <div className="section-nav">
        <NavBarCandidato user={userInfo}></NavBarCandidato>
      </div>

      <div className="container-contas">
        <div className="upper-contas status-title">
          <h1>Histórico</h1>
        </div>
        <div className="sub-title">
          <h2>Candidaturas em andamento</h2>
        </div>
        {applications ? applications.map((application) => {
          return <CandidatoCandidatura application={application} />
        }) : <div>
          <LoadingCandidaturaAssistente />
        </div>
        }

        <div className="loading">

        </div>

        <div className="sub-title">
          <h2>Candidaturas finalizadas</h2>
        </div>

        <div className="loading">

        </div>
      </div>
    </div>
  );
}
