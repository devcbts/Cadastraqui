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

  const navigate = useNavigate()

  useEffect(() => {
    async function refreshAccessToken() {
      try{
        const refreshToken = Cookies.get('refreshToken')
  
        const response = await api.patch(`/refresh?refreshToken=${refreshToken}`)
        
        const {newToken, newRefreshToken} = response.data
        localStorage.setItem('token', newToken)
        Cookies.set('refreshToken', newRefreshToken, {
          expires: 7,
          sameSite: true,
          path: '/',
        })
      } catch(err) {
        console.log(err)
        navigate('/login')
      }
    }
    const intervalId = setInterval(refreshAccessToken, 480000) // Chama a função refresh token a cada 
  
    async function getEntityInfo() {
      const token = localStorage.getItem("token")

      try{
        const entity_info = await api.get('/entities/', {
          headers: {
            'authorization': `Bearer ${token}`,
          }})
          setEntityInfo(entity_info.data.entity)
        } catch(err) {
            console.log(err)
        }
    }
        
    getEntityInfo()
    return () => {
      // Limpar o intervalo
      clearInterval(intervalId);
    };
  },[])

  return (
    <div className="container">
      <div className="section-nav">
        <NavBar entity={entityInfo}></NavBar>
      </div>

      <div className="container-contas">
        <div className="upper-contas">
          <h1>Universidade</h1>
        </div>

        <h2>Status das solicitações de cadastro de novos colaboradores</h2>
        <div className="solicitacoes">
          <Colaboracao />
        </div>

        <div className="historico">
          <h2>Histórico</h2>
          <div className="solicitacoes"></div>
        </div>
      </div>
    </div>
  );
}
