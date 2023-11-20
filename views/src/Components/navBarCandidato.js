import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./navBarCandidato.css";
import photoProfile from "../Assets/profile-padrao.jpg";
import { UilTimesCircle, UilArchive } from "@iconscout/react-unicons";
import { UilEstate } from "@iconscout/react-unicons";
import { UilExchange } from "@iconscout/react-unicons";
import { UilUserCircle } from "@iconscout/react-unicons";
import { UilHistory ,UilPlusCircle } from "@iconscout/react-unicons";
import whiteLogoText from "../Assets/logo_branca_texto.png";
import { useAppState } from "../AppGlobal";
import { useLocation } from "react-router-dom";
import { Fade as Hamburger } from "hamburger-react";
import { api } from "../services/axios";
// ReactDOM.render(element, document.body);

export default function NavBarCandidato(props) {
  const { isShown, handleClick, setIsShown } = useAppState();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [popupIsShown, setPopupIsShown] = useState(false);

  const handleClosePopup = () => {
    setPopupIsShown((prev) => !prev);
  };

  const navigate = useNavigate();

  function urlNavigation(entry) {
    let path = `/candidato/${entry}`;
    navigate(path);
  }

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

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    // Function to handle the resize event
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    // Attach the event handler
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };

  }, []); // The empty array ensures this effect only runs once, on mount and unmount


  // BackEnd Functions 
  const user = props.user
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [candidateInfo, setCandidateInfo] = useState(null);
  useEffect(() => {
    async function getProfilePhoto() {
      const token = localStorage.getItem("token")

      try {
        const profilePhoto = await api.get('/candidates/profilePicture', {
          headers: {
            'authorization': `Bearer ${token}`,
          }
        })
        setProfilePhoto(profilePhoto.data.url)
      } catch (err) {
        if (err.response.status === 401) {
          navigate('/login')
        }
      }
    }

    getProfilePhoto()

    const token = localStorage.getItem("token");
    const candidate = JSON.parse(localStorage.getItem("candidate") || 'null');

    if (!candidate) {

      async function getCandidateInfo() {
        const response = await api.get("/candidates/basic-info", {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setCandidateInfo(response.data.candidate);
        localStorage.setItem("candidate", JSON.stringify(response.data.candidate))
      }
      getCandidateInfo()
    } else {
      setCandidateInfo(candidate)
    }
  }, [])

  var location = useLocation();
  var currentPath = location.pathname;

  return (
    <div className="outer-sidebar">
      {popupIsShown && (
        <>
          <div className="switch-popup">
            <div className="popup-upper">
              <a
                onClick={() => {
                  handleClosePopup();
                }}
              >
                <UilTimesCircle size="30" color="#1F4B73"></UilTimesCircle>
              </a>
            </div>
          </div>
          <div className="backdrop"></div>
        </>
      )}

      {windowWidth < 1030 && (
        <div className="mobile-menu">
          <div className="mobile-user">
            <img src={profilePhoto !== null ? profilePhoto : photoProfile} className="user-sidebar" />
          </div>
          <div class="search">
            <input type="text" class="search__input" placeholder="Buscar" />
            <button class="search__button">
              <svg class="search__icon" aria-hidden="true" viewBox="0 0 24 24">
                <g>
                  <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                </g>
              </svg>
            </button>
          </div>
          <Hamburger
            size={0.05 * windowHeight}
            color="white"
            onToggle={(toggled) => {
              handleClick();
            }}
            toggled={!isShown}
            className="menu-btn"
          ></Hamburger>
        </div>
      )}

      <div
        className={`sidebar ${isShown && windowWidth < 1030 ? "hidden" : ""}`}
      >
        <div className="inner-sidebar">
          <div className="logo">
            <img src={whiteLogoText}></img>
          </div>
          <div className="user">
            <img src={profilePhoto !== null ? profilePhoto : photoProfile} className="user-sidebar"></img>
            <div className="user-name">
              <h6>{candidateInfo ? candidateInfo.name : ""}</h6>
            </div>
            <div
              className="alternate"
              onClick={() => {
                handleClosePopup();
              }}
            >
              <UilExchange size="20" color="#ffff"></UilExchange>
              <h2>Alternar subconta</h2>
            </div>
          </div>
          <div className="menu-itens">
            <ul>
              <li>
                <a
                  href="#"
                  className={`${currentPath == "/candidato/home" ? "active" : "inactive"
                    }`}
                  onClick={() => urlNavigation("home")}
                >
                  <UilEstate
                    size="30"
                    color={`${currentPath == "/candidato/home" ? "#1F4B73" : "white"
                      }`}
                  />
                  <span>Home</span>
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className={`${currentPath == "/candidato/historico"
                    ? "active"
                    : "inactive"
                    }`}
                  onClick={() => urlNavigation("historico")}
                >
                  <UilHistory
                    size="30"
                    color={`${currentPath == "/candidato/historico"
                      ? "#1F4B73"
                      : "white"
                      }`}
                  />
                  <span>Histórico</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`${currentPath == "/candidato/solicitacoes" ? "active" : "inactive"
                    }`}
                  onClick={() => urlNavigation("solicitacoes")}
                >
                  <UilArchive
                    size="30"
                    color={`${currentPath == "/candidato/solicitacoes" ? "#1F4B73" : "white"
                      }`}
                  />
                  <span>Solicitações</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`${currentPath == "/candidato/info" ? "active" : "inactive"
                    }`}
                  onClick={() => urlNavigation("info")}
                >
                  <UilPlusCircle 
                    size="30"
                    color={`${currentPath == "/candidato/info" ? "#1F4B73" : "white"
                      }`}
                  />
                  <span >Cadastrar Informações</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`${currentPath == "/candidato/perfil" ? "active" : "inactive"
                    }`}
                  onClick={() => urlNavigation("perfil")}
                >
                  <UilUserCircle
                    size="30"
                    color={`${currentPath == "/candidato/perfil" ? "#1F4B73" : "white"
                      }`}
                  />
                  <span>Perfil</span>
                </a>
              </li>


            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
