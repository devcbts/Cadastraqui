import React, { useEffect, useState } from "react";
import "./navBarHome.css";
import LogoWhite from "../Assets/Prancheta 3@300x-8.png";
import LogoBlue from "../Assets/logoblue.png";
import { Cross as Hamburger } from "hamburger-react";
import { Link } from "react-router-dom";
const NavBarHome = () => {
  // isSticy is a function that verifies if the scroll of the page is zero or not
  const [isSticky, setIsSticky] = useState(false);

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
  useEffect(() => {
    const handleScroll = () => {
      // Update the isSticky state based on scroll position
      setIsSticky(window.scrollY > 0);
    };

    // Attach the event listener to the window
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    // It is, when you go back to the top, isSticky is set as false again
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // A variable that defines if the menu is open or not
  const [isOPen, setIsOpen] = useState(false);

  return (
    <div>
      <div className={`navbar-container ${isSticky ? "sticky" : ""}`}>
        <div className={`navbar-inner ${isSticky ? "sticky-inner" : ""}`}>
          <div className="logo-box">
            <a
              className={`logo-home secondary-logo ${
                !isSticky ? "typewriter" : ""
              }`}
            >
              <img
                src={LogoBlue}
                className={`show-dark ${!isSticky ? "icon-dark" : ""}`}
              ></img>
            </a>

            <a className={`logo-home ${isSticky ? "typewriter" : ""}`}>
              <img src={LogoWhite} className="icon-logo" />
              CADASTRAQUI
            </a>
          </div>
          <div className={`nav-list ${isSticky ? "nav-dark" : ""}`}>
            {windowWidth > 800 && (
              <ul>
                <li>
                  <a>Início</a>
                </li>
                <li>
                  <a>Recursos</a>
                </li>
                <li>
                  <a>Sobre</a>
                </li>
                <li>
                  <a>Contato</a>
                </li>
                <li>
                  <Link to={"/login"}>
                    <a
                      className={`${!isSticky ? "dark-login" : "white-login"}`}
                    >
                      Login
                    </a>
                  </Link>
                </li>
              </ul>
            )}
            {windowWidth < 800 && (
              <Hamburger
                toggled={isOPen}
                toggle={setIsOpen}
                color={`${isSticky ? "#1b4f73" : "#fff"}`}
              />
            )}
          </div>
        </div>
      </div>
      <div className={`backdrop-menu ${isOPen ? "backdrop-show" : ""}`}>
        <div className="nav-buttons">
          <ul>
            <li>
              <a href="#" className="menu-button">
                Início
              </a>
            </li>
            <li>
              <a href="#" className="menu-button">
                Recursos
              </a>
            </li>
            <li>
              <a href="#" className="menu-button">
                Sobre
              </a>
            </li>
            <li>
              <a href="#" className="menu-button">
                Contato
              </a>
            </li>
            <li>
              <a href="#" className="menu-button">
                Login
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBarHome;
