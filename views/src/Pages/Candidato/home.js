import React, { useEffect, useState } from "react";
import "./home.css";
import NavBar from "../../Components/navBar";
import { useAppState } from "../../AppGlobal";
import NavBarCandidato from "../../Components/navBarCandidato";
import Edital from "../../Components/edital";
import Candidatura from "../../Components/candidatura";
import { api } from "../../services/axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import LoadingCandidaturaAssistente from "../../Components/Loading/loadingCandidaturaAssistente";
import CandidatoCandidatura from "../../Components/Candidatocandidatura";
import { handleAuthError } from "../../ErrorHandling/handleError";

export default function HomeCandidato() {
  const { isShown } = useAppState()

  // Armazena todos os estados para colocar no select
  const UF = ['AC',
    'AL',
    'AM',
    'AP',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MG',
    'MS',
    'MT',
    'PA',
    'PB',
    'PE',
    'PI',
    'PR',
    'RJ',
    'RN',
    'RO',
    'RR',
    'RS',
    'SC',
    'SE',
    'SP',
    'TO',]

  // Estados para os editais
  const [openAnnouncements, setOpenAnnouncements] = useState()

  //Estado para as aplicações
  const [applications, setApplications] = useState()

  // Estado para informações acerca do usuário logado
  const [userInfo, setUserInfo] = useState()

  const navigate = useNavigate()

  useEffect(() => {
    async function fetchAnnouncements() {
      const token = localStorage.getItem("token")
      try {
        const response = await api.get('/candidates/anouncements', {
          headers: {
            'authorization': `Bearer ${token}`,
          }
        })
        // Pega todos os editais e armazena em um estado
        setOpenAnnouncements(response.data.announcements)
      } catch (err) {
        console.log(err)
      }
    }

    async function getApplications() {
      const token = localStorage.getItem("token")
      try {
        const response = await api.post('/candidates/application/see', {},{
          headers: {
            'authorization': `Bearer ${token}`,
          }
        })

        console.log(response.data)
        setApplications(response.data.applications)
      } catch (err) {
        handleAuthError(err,navigate)

        console.log(err)
      }
    }

    async function refreshAccessToken() {
      try {
        const refreshToken = Cookies.get('refreshToken')

        const response = await api.patch(`/refresh?refreshToken=${refreshToken}`)

        const { newToken, newRefreshToken } = response.data
        localStorage.setItem('token', newToken)
        Cookies.set('refreshToken', newRefreshToken, {
          expires: 7,
          sameSite: true,
          path: '/',
        })
      } catch (err) {
        console.log(err)
        navigate('/login')
      }
    }
    const intervalId = setInterval(refreshAccessToken, 480000) // Chama a função refresh token a cada 

    async function getUserInfo() {
      const token = localStorage.getItem("token")
      const user_role = localStorage.getItem("role")
      console.log(user_role)
      if (user_role === 'CANDIDATE') {
        try {
          const user_info = await api.get('/candidates/basic-info', {
            headers: {
              'authorization': `Bearer ${token}`,
            }
          })
          setUserInfo(user_info.data.candidate)
        } catch (err) {
          console.log(err)
        }

      } else if (user_role === 'RESPONSIBLE') {
        try {
          const user_info = await api.get('/responsibles', {
            headers: {
              'authorization': `Bearer ${token}`,
            }
          })
          setUserInfo(user_info.data.responsible)
        } catch (err) {
          handleAuthError(err,navigate)
        }
      }
    }

    getUserInfo()
    fetchAnnouncements()
    getApplications()

    return () => {
      // Limpar o intervalo
      clearInterval(intervalId);
    };
  }, [])

  return (
    <div className="container">
      <div className="section-nav">
        <NavBarCandidato user={userInfo}></NavBarCandidato>
      </div>

      <div className="container-contas">
        <div className="upper-contas status-title">
          <h1>Status</h1>
        </div>

        <div className="solicitacoes">
          {applications ? applications.map((application) => {
            return <CandidatoCandidatura application={application} />
          }) : <div>
            <LoadingCandidaturaAssistente/> 
          </div>
          }
        </div>

        
      </div>
    </div>
  );
}
