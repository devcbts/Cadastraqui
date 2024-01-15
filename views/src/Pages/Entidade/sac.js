import React, { useEffect, useState } from "react";
import "./sac.css";
import NavBar from "../../Components/navBar";
import { UilBell } from "@iconscout/react-unicons";
import { useAppState } from "../../AppGlobal";
import { api } from "../../services/axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";

export default function SacEntidade() {
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

      <div className="container-sac">
        <h1>Em que podemos ajudar?</h1>
        <div id="form-main">
          <div id="form-div">
            <form class="form-sac" id="form1">
              <p class="name">
                <input
                  name="name"
                  type="text"
                  class="validate[required,custom[onlyLetter],length[0,100]] feedback-input"
                  placeholder="Nome"
                  id="name"
                />
              </p>

              <p class="email">
                <input
                  name="email"
                  type="text"
                  class="validate[required,custom[email]] feedback-input"
                  id="email"
                  placeholder="Email"
                />
              </p>

              <p class="text">
                <textarea
                  name="text"
                  class="validate[required,length[6,300]] feedback-input"
                  id="comment"
                  placeholder="Comentário"
                ></textarea>
              </p>

              <div class="submit">
                <input type="submit" value="Enviar" id="button-blue" />
                <div class="ease"></div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
