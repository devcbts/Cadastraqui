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
import EditalEntidade from "../../Components/editalEntidade";
import LoadingEdital from "../../Components/Loading/LoadingEdital";
import { handleAuthError } from "../../ErrorHandling/handleError";
import debounce from "lodash.debounce";

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
  const [entity, setEntity] = useState(null)
  // Estado para informações acerca do usuário logado
  const [entityInfo, setEntityInfo] = useState()
  const [closedAnnouncements, setClosedAnnouncements] = useState()
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchAnnouncements() {
      const token = localStorage.getItem("token")
      try {
        const response = await api.get('/entities/announcement/open', {
          headers: {
            'authorization': `Bearer ${token}`,
          }
        })
        // Pega todos os editais e armazena em um estado
        setAnnouncements(response.data.announcements)
        setEntity(response.data.entity)

      } catch (err) {
        handleAuthError(err, navigate)
      }
    }
    async function fetchClosedAnnouncements() {
      const token = localStorage.getItem("token")
      try {
        const response = await api.get('/entities/announcement/close', {
          headers: {
            'authorization': `Bearer ${token}`,
          }
        })
        console.log(response.data)
        // Pega todos os editais e armazena em um estado
        setClosedAnnouncements(response.data.announcements)

      } catch (err) {
        handleAuthError(err, navigate)
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
      } catch (err) {
        console.log(err)
      }
    }
    Promise.all([
      getEntityInfo(),
      fetchAnnouncements(),
      fetchClosedAnnouncements()
    ])

    return () => {
      // Limpar o intervalo
      clearInterval(intervalId);
    };
  }, [])
  const searchAnnouncements = debounce(async (e) => {
    const { value } = e.target
    const response = await api.post('/entities/announcement/find', {
      id: entity.id,
      filter: value,
      open: true
    })
    setAnnouncements(response.data.announcements)
  }, 600)
  const searchClosedAnnouncements = debounce(async (e) => {
    const { value } = e.target
    const response = await api.post('/entities/announcement/find', {
      id: entity.id,
      filter: value,
      open: false
    })
    setClosedAnnouncements(response.data.announcements)
  }, 600)
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
                  <input type="search" placeholder="Search..." onChange={searchAnnouncements} />
                </form>
              )}
            </div>
          </div>
        </div>
        <div className="container-editais">
          {announcements && announcements.length > 0 ? announcements.map((announcement) => {
            return <EditalEntidade announcement={announcement} key={announcement.id} />
          }) : <div className="container-editais" ><LoadingEdital />
            <LoadingEdital />
            <LoadingEdital />
            <LoadingEdital /> </div>}
        </div>
      </div>
      <div className={`editais ${isShown ? "hidden-menu" : ""}`}>
        <div className="upper">
          <h1>Editais Anteriores</h1>
          <div className="search-ring">
            <div style={{ minHeight: "0vh" }}></div>
            <div class="right search">
              {windowWidth > 1000 && (
                <form>
                  <input type="search" placeholder="Search..." onChange={searchClosedAnnouncements} />
                </form>
              )}
            </div>
          </div>
        </div>
        <div className="container-editais">
          {closedAnnouncements && closedAnnouncements.length > 0 ? closedAnnouncements.map((announcement) => {
            return <EditalEntidade announcement={announcement} key={announcement.id} />
          }) : <div className="container-editais" ><LoadingEdital />
            <LoadingEdital />
            <LoadingEdital />
            <LoadingEdital /> </div>}
        </div>
      </div>
    </div>
  );
}
