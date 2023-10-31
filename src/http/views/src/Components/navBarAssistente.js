import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./navBarAssistente.css";
import photoProfile from "../Assets/profile-padrao.jpg";
import ReactDOM from "react-dom";
import { UilEstate } from "@iconscout/react-unicons";
import { UilFileAlt } from "@iconscout/react-unicons";
import { UilPlusCircle } from "@iconscout/react-unicons";
import { UilCommentAltNotes } from "@iconscout/react-unicons";
import { UilUsersAlt } from "@iconscout/react-unicons";
import { UilUserCircle } from "@iconscout/react-unicons";
import { UilAngleDoubleLeft } from "@iconscout/react-unicons";
import { UilAngleDoubleRight } from "@iconscout/react-unicons";
import whiteLogoText from "../Assets/logo_branca_texto.png";
import { useAppState } from "../AppGlobal";
import { useLocation } from "react-router-dom";
import { Fade as Hamburger } from "hamburger-react";
import { api } from "../services/axios";
// ReactDOM.render(element, document.body);

export default function NavBarAssistente() {
  const { isShown, handleClick, setIsShown } = useAppState();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [assistantInfo, setAssistantInfo] = useState();

  const navigate = useNavigate();

  function urlNavigation(entry) {
    let path = `/assistente/${entry}`;
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

  var location = useLocation();
  var currentPath = location.pathname;

  useEffect(() => {
    const token = localStorage.getItem("token")
    async function getAssistantInfo() {
      const response = await api.get("/assistant/basic-info", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setAssistantInfo(response.data.assistant);
    }
    getAssistantInfo()
  },[])
  console.log(assistantInfo)
  return (
    <div className="outer-sidebar">
      {windowWidth < 1030 && (
        <div className="mobile-menu">
          <div className="mobile-user">
            <img src={photoProfile} className="user-sidebar"></img>
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
            <img src={photoProfile} className="user-sidebar"></img>
            <div className="user-name">
              <h6>{assistantInfo ? assistantInfo.name : ""}</h6>
            </div>
          </div>
          <div className="menu-itens">
            <ul>
              <li>
                <a
                  href="#"
                  className={`${
                    currentPath == "/assistente/home" ? "active" : "inactive"
                  }`}
                  onClick={() => urlNavigation("home")}
                >
                  <UilEstate
                    size="30"
                    color={`${
                      currentPath == "/assistente/home" ? "#1F4B73" : "white"
                    }`}
                  />
                  <span>Home</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`${
                    currentPath == "/assistente/editais" ? "active" : "inactive"
                  }`}
                  onClick={() => urlNavigation("editais")}
                >
                  <UilFileAlt
                    size="30"
                    color={`${
                      currentPath == "/assistente/editais" ? "#1F4B73" : "white"
                    }`}
                  />
                  <span>Editais</span>
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className={`${
                    currentPath == "/assistente/sac" ? "active" : "inactive"
                  }`}
                  onClick={() => urlNavigation("sac")}
                >
                  <UilCommentAltNotes
                    size="30"
                    color={`${
                      currentPath == "/assistente/sac" ? "#1F4B73" : "white"
                    }`}
                  />
                  <span>Sac</span>
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className={`${
                    currentPath == "/assistente/perfil" ? "active" : "inactive"
                  }`}
                  onClick={() => urlNavigation("perfil")}
                >
                  <UilUserCircle
                    size="30"
                    color={`${
                      currentPath == "/assistente/perfil" ? "#1F4B73" : "white"
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
