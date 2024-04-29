import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./navBarAdmin.css";
import photoProfile from "../Assets/profile-padrao.jpg";
import ReactDOM from "react-dom";
import { UilEstate } from "@iconscout/react-unicons";
import { UilFileAlt } from "@iconscout/react-unicons";
import { UilPlusCircle } from "@iconscout/react-unicons";
import { UilCommentAltNotes } from "@iconscout/react-unicons";
import { UilUsersAlt } from "@iconscout/react-unicons";
import { UilExchange } from "@iconscout/react-unicons";
import { UilUserCircle } from "@iconscout/react-unicons";
import { UilFileEditAlt } from "@iconscout/react-unicons";
import { UilAngleDoubleLeft } from "@iconscout/react-unicons";
import { UilAngleDoubleRight } from "@iconscout/react-unicons";
import { UilHistory } from "@iconscout/react-unicons";
import { UilCreateDashboard } from "@iconscout/react-unicons";
import { UilUniversity } from "@iconscout/react-unicons";
import whiteLogoText from "../Assets/logo_branca_texto.png";
import { useAppState } from "../AppGlobal";
import { useLocation } from "react-router-dom";
import { Fade as Hamburger } from "hamburger-react";
import Logout from "../utils/logout";
// ReactDOM.render(element, document.body);

export default function NavBarAdmin() {
  const { isShown, handleClick, setIsShown } = useAppState();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const navigate = useNavigate();

  function urlNavigation(entry) {
    let path = `/admin/${entry}`;
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
              <h6>Current User</h6>
            </div>
          </div>
          <div className="menu-itens">
            <ul>
              <li>
                <a
                  href="#"
                  className={`${
                    currentPath == "/admin/cadastro" ? "active" : "inactive"
                  }`}
                  onClick={() => urlNavigation("cadastro")}
                >
                  <UilCreateDashboard
                    size="30"
                    color={`${
                      currentPath == "/admin/cadastro" ? "#1F4B73" : "white"
                    }`}
                  />
                  <span>Cadastro</span>
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className={`${
                    currentPath == "/admin/entidades" ? "active" : "inactive"
                  }`}
                  onClick={() => urlNavigation("entidades")}
                >
                  <UilFileAlt
                    size="30"
                    color={`${
                      currentPath == "/admin/entidades" ? "#1F4B73" : "white"
                    }`}
                  />
                  <span>Entidades</span>
                </a>
              </li>

              {/* <li>
                <a
                  href="#"
                  className={`${
                    currentPath == "/admin/geral" ? "active" : "inactive"
                  }`}
                  onClick={() => urlNavigation("geral")}
                >
                  <UilUserCircle
                    size="30"
                    color={`${
                      currentPath == "/admin/geral" ? "#1F4B73" : "white"
                    }`}
                  />
                  <span>Geral</span>
                </a>
              </li> */}

              <li>
                <Logout/>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
