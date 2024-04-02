import React from "react";
import "./editais.css";
import { useState,useEffect } from "react";
import { UilBell } from "@iconscout/react-unicons";
import { useAppState } from "../../AppGlobal";
import NavBarAdmin from "../../Components/navBarAdmin";
import NavBar from "../../Components/navBar";
import Edital from "../../Components/edital";
import { api } from "../../services/axios";
import Cookies from "js-cookie";
import {useNavigate} from 'react-router';
import EditalEntidade from "../../Components/editalEntidade";
import LoadingEdital from "../../Components/Loading/LoadingEdital";
import { handleAuthError } from "../../ErrorHandling/handleError";
export default function EditaisEntidade() {
  const { isShown } = useAppState();
 // The empty array ensures this effect only runs once, on mount and unmount

  // BackEnd Functions

  // Estados para os editais
  const [announcements, setAnnouncements] = useState(null)
  
  // Estado para informações acerca do usuário logado
  const [entityInfo, setEntityInfo] = useState(null)
 const navigate = useNavigate()

  useEffect(() => {
    async function fetchAnnouncements() {
      const token = localStorage.getItem("token")
      try{
        const response = await api.get('/entities/announcement', {
          headers: {
            'authorization': `Bearer ${token}`,
          }})
          console.log(response.data)
        // Pega todos os editais e armazena em um estado
        setAnnouncements(response.data.announcements)  
      } catch(err) {
        handleAuthError(err, navigate) 
      } 
    }

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
    fetchAnnouncements()

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
      <div className={`editais ${isShown ? "hidden-menu" : ""}`}>
        <div className="upper">
          <h1>Editais Anteriores</h1>
          <div className="search-ring">
            <div style={{ minHeight: "0vh" }}></div>
            <div class="right search">
              <form>
                <input type="search" placeholder="Search..." />
              </form>
            </div>
          </div>
        </div>
        <div className="container-editais">
          {announcements? announcements.map((announcement) => {
            return <EditalEntidade announcement={announcement} />
          }) : 
          <div className="container-editais" ><LoadingEdital/>
          <LoadingEdital/>
          <LoadingEdital/>
          <LoadingEdital/> </div>}
        </div>
      </div>
    </div>
  );
}
