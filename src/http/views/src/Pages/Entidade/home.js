import React from "react";
import "./home.css";
import NavBar from "../../Components/navBar";
import { UilBell } from "@iconscout/react-unicons";
import { useAppState } from "../../AppGlobal";
import { useState, useEffect } from "react";
import Edital from "../../Components/edital";
import { useNavigate } from "react-router";
import { api } from "../../services/axios";
import Cookies from "js-cookie";

export default function HomeEntidade() {
  const { isShown } = useAppState();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Function to handle the resize event
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Attach the event handler
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // The empty array ensures this effect only runs once, on mount and unmount

  // BackEnd Functions

  // Estados para os editais
  const [announcements, setAnnouncements] = useState()
  
  // Estado para informações acerca do usuário logado
  const [entityInfo, setEntityInfo] = useState()

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
        console.log(err)  
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
          <h1>Editais Vigentes</h1>
          <div className="search-ring">
            <div style={{ minHeight: "0vh" }}></div>
            <div class="right search">
              {windowWidth > 1000 && (
                <form>
                  <input type="search" placeholder="Search..." />
                </form>
              )}
            </div>
          </div>
        </div>
        <div className="container-editais">
          {announcements  && announcements.length > 0 ? announcements.map((announcement) => {
            return <Edital announcement={announcement} key={announcement.id}/>
          }) : <div className="without-announcement">Não há editais abertos no momento </div>}
        </div>
      </div>
    </div>
  );
}
