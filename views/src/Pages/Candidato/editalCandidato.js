import React, { useEffect, useState } from "react";
import "./editalCandidato.css";
import NavBar from "../../Components/navBar";
import { UilBell } from "@iconscout/react-unicons";
import { useAppState } from "../../AppGlobal";
import EditalInscricao from "../../Components/editalDescription";
import NavBarCandidato from "../../Components/navBarCandidato";
import AcceptEdital from "./acceptEdital";
import { useNavigate, useParams } from "react-router";
import { api } from "../../services/axios";
import Cookies from 'js-cookie'
import EditalInscricaoFake from "../../Components/editalDescriptionFake";

export default function EditalAbertoCandidato() {
  const { isShown } = useAppState();

  const params = useParams()
  console.log(params)

  // Estado para informações acerca do usuário logado
  const [userInfo, setUserInfo] = useState()

  
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
  
    async function getUserInfo() {
      const token = localStorage.getItem("token")
        try{
          const user_info = await api.get('/candidates/basic-info', {
            headers: {
              'authorization': `Bearer ${token}`,
            }})
            setUserInfo(user_info.data.candidate)
        } catch(err) {
            console.log(err)
        }
    }

    getUserInfo()
    return () => {
      // Limpar o intervalo
      clearInterval(intervalId);
    };
  },[])

  const [pageState, setPageState] = useState('show')
  function handlePage() {
    if(pageState === 'show') {
      setPageState('hidden')
    }
    if (pageState === 'hidden') {
      setPageState('show')
    }
    console.log(pageState)
  }

  return (
    <div className="container">
      <div className="section-nav">
        <NavBarCandidato user={userInfo}></NavBarCandidato>
      </div>

      <div className="container-open-edital">
        {pageState === 'show' ? (
          <>
          {/*<EditalInscricao className={`${pageState}`}></EditalInscricao>*/}
          <EditalInscricaoFake></EditalInscricaoFake>
          <button className="cadastro-btn" type="button" onClick={handlePage}>Continuar &rarr;</button>
        </>
        ) : ''}      
        {pageState === 'hidden' ? <AcceptEdital></AcceptEdital> : ''}

        {pageState === 'hidden' ? (
        <div className="register">
          <button className="cadastro-btn" type="button" onClick={handlePage}>&larr; Voltar</button>
        </div>
        ) : ''}
      </div>
    </div>
  );
}
