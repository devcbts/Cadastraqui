import React, { useEffect, useState } from "react";
import "./contas.css";
import NavBar from "../../Components/navBar";
import { UilBell } from "@iconscout/react-unicons";
import { useAppState } from "../../AppGlobal";
import Candidatura from "../../Components/candidatura";
import Colaboracao from "../../Components/colaboracao";
import { api } from "../../services/axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";

export default function ContasEntidade() {
  const { isShown } = useAppState();

  // Estado para informações acerca do usuário logado
  const [entityInfo, setEntityInfo] = useState()
  const [subsidiaries, setSubsidiaries] = useState([])
  const [assistants, setAssistants] = useState([])
  const [directors, setDirectors] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
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

    async function getEntityInfo() {
      const token = localStorage.getItem("token")

      try {
        const entity_info = await api.get('/entities/', {
          headers: {
            'authorization': `Bearer ${token}`,
          }
        })
        setEntityInfo(entity_info.data.entity)
        setSubsidiaries(entity_info.data.entity.EntitySubsidiary)
      } catch (err) {
        console.log(err)
      }
    }
    async function getAssistants() {
      const token = localStorage.getItem("token")

      try {
        const response = await api.get('/entities/announcement/assistant', {
          headers: {
            'authorization': `Bearer ${token}`,
          }
        })

        setAssistants(response.data.socialAssistants)
        console.log(response.data.socialAssistants)
      } catch (err) {
        console.log(err)
      }
    }

    getAssistants()
    getEntityInfo()
    return () => {
      // Limpar o intervalo
      clearInterval(intervalId);
    };
  }, [])
  useEffect(() => {
    async function getDirectors() {
      const token = localStorage.getItem("token")

      try {
        const response = await api.get(`/entities/director/`, {
          headers: {
            'authorization': `Bearer ${token}`,
          }
        })

        setDirectors(response.data.directors)
        console.log(response.data.directors)
      } catch (err) {
        console.log(err)
      }
    }
    getDirectors()

  }, [entityInfo])
  return (
    <div className="container">
      <div className="section-nav">
        <NavBar entity={entityInfo}></NavBar>
      </div>

      <div className="container-contas">


        <h2> Status dos colaboradores</h2>
        <div className="solicitacoes">
          {directors ?
            directors.map(director => {
              return (
                <Colaboracao
                  name={director.name}
                  role={"Responsável"}
                  id={director.id}
                />
              )
            })
            : ''}

          {assistants ?
            assistants.map(assistant => {
              return (
                <Colaboracao
                  name={assistant.name}
                  role={"Assistente"}
                  id={assistant.id}
                />
              )
            })
            : ''}
        </div>

        <div className="historico">
          <h2>Filiais</h2>
          <div className="solicitacoes">
            {subsidiaries ?
              subsidiaries.map(subsidiary => {
                return (
                  <Colaboracao
                    name={subsidiary.socialReason}
                    role={"Filial"}
                    address={subsidiary.address}
                    CEP={subsidiary.CEP}
                    educationalInstitutionCode={subsidiary.educationalInstitutionCode}
                    id={subsidiary.id}
                  />
                )
              }) : ''}
          </div>
        </div>
      </div>
    </div>
  );
}
