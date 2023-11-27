import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import "./homePage.css";
import NavBarHome from "../../Components/navBarHome";
import videoBg from "../../Assets/topvideo.mp4";
import promotionalVideo from "../../Assets/final2.mp4";
import ricardo from "../../Assets/ricardo.png";
import marcelo from "../../Assets/marcelo.png";
import featureOnePicture from "../../Assets/banner-security.jpg";
import featureTwoPicture from "../../Assets/comfort.jpg";
import featureThreePicture from "../../Assets/business.jpg";
import computerImg from "../../Assets/top-image.png";
import "react-bootstrap";

export default function HomePage() {
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
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        console.log(entry);
        if (entry.isIntersecting) {
          entry.target.classList.add("rotated-video");
        } else {
          entry.target.classList.remove("rotated-video");
        }
      });
    });

    const observerText = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        console.log(entry);
        if (entry.isIntersecting) {
          entry.target.classList.add("visible-text");
        } else {
          entry.target.classList.remove("visible-text");
        }
      });
    });

    const observerCard = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        console.log(entry);
        if (entry.isIntersecting) {
          entry.target.classList.add("visible-card");
        } else {
          entry.target.classList.remove("visible-card");
        }
      });
    });

    const observerTeam = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        console.log(entry);
        if (entry.isIntersecting) {
          entry.target.classList.add("visible-team");
        }
      });
    });

    const titleBody = document.querySelectorAll(".body-title");
    const presentationVideo = document.querySelectorAll(".promotional-video");
    const cardFeature = document.querySelectorAll(".feature-card");
    const ourTeam = document.querySelectorAll(".our-team");

    presentationVideo.forEach((el) => observer.observe(el));
    titleBody.forEach((el) => observerText.observe(el));
    cardFeature.forEach((el) => observerCard.observe(el));
    ourTeam.forEach((el) => observerTeam.observe(el));

    // Cleanup function
    return () => {
      presentationVideo.forEach((el) => observer.unobserve(el));
      titleBody.forEach((el) => observerText.unobserve(el));
    };
  }, []);

  return (
    <>
      <NavBarHome></NavBarHome>
      <div className="container-landing">
        <video className="video-header" src={videoBg} autoPlay loop muted />
        <div className="header-box">
          <div className="text-section">
            <h1>
              Segurança & <br></br>Agilidade
            </h1>
            <h2>
              Segurança e agilidade no processo de concessão e manutenção de
              bolsas estudantis.
            </h2>
            <a id="btn-more">Saiba mais</a>
          </div>
          <div className="image-section"></div>
        </div>
      </div>
      <div className="body-landing">
        <div className="our-team">
          <div className="team-block">
            <h1 className="great-title">
              <span>Resolvendo</span> <br></br>O Problema
            </h1>
          </div>
          <div className="team-block">
            <h2>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Pellentesque quis sem arcu. Maecenas sit amet odio ornare,
              tristique ante in, lacinia tellus. Nullam hendrerit felis a lorem
              euismod, quis consequat justo fermentum
            </h2>
          </div>
          <div className="team-block">
            <h2>
              <h1 className="subtitle">Ricardo Scarpari</h1>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Pellentesque quis sem arcu. Maecenas sit amet odio ornare,
              tristique ante in, lacinia tellus. Nullam hendrerit felis a lorem
              euismod, quis consequat justo fermentum
            </h2>
          </div>
          <div className="team-block">
            <img src={ricardo} className="founder-picture"></img>
          </div>

          {windowWidth > 800 && (
            <>
              <div className="team-block">
                <img src={marcelo} className="founder-picture"></img>
              </div>
              <div className="team-block">
                <h2>
                  <h1 className="subtitle">Marcelo Torres</h1>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Pellentesque quis sem arcu. Maecenas sit amet odio ornare,
                  tristique ante in, lacinia tellus. Nullam hendrerit felis a
                  lorem euismod, quis consequat justo fermentum
                </h2>
              </div>
            </>
          )}

          {windowWidth < 800 && (
            <>
              <div className="team-block">
                <h2>
                  <h1 className="subtitle">Marcelo Torres</h1>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Pellentesque quis sem arcu. Maecenas sit amet odio ornare,
                  tristique ante in, lacinia tellus. Nullam hendrerit felis a
                  lorem euismod, quis consequat justo fermentum
                </h2>
              </div>
              <div className="team-block">
                <img src={marcelo} className="founder-picture"></img>
              </div>
            </>
          )}
        </div>

        <div className="features-description">
          <div className="feature-card">
            <img src={featureOnePicture}></img>
            <h2>
              <h1 className="subtitle">
                Segurança &<br></br> Agilidade
              </h1>
              Uma jornada digital que permite o manuseio seguro e ágil dos
              documentos
            </h2>
          </div>
          <div className="feature-card">
            <img src={featureTwoPicture}></img>
            <h2>
              <h1 className="subtitle">
                Facilidade &<br></br> Conforto
              </h1>
              Uma inscrição digital simplificada com o acompanhamento dos seus
              editais torna o processo ainda mais fácil
            </h2>
          </div>
          <div className="feature-card">
            <img src={featureThreePicture}></img>
            <h2>
              <h1 className="subtitle">
                Controle &<br></br> Coordenação{" "}
              </h1>
              A rápida visualização dos relatórios padronizados auxilia uma
              melhor organização e detalhamento do processo
            </h2>
          </div>
        </div>

        <div className="initial-presentation">
          <h1 className="body-title">
            Conheça um pouco mais sobre<br></br> nossa plataforma
          </h1>
          <h2></h2>
          <div className="video-wrap">
            <video
              className="promotional-video"
              src={promotionalVideo}
              autoPlay
              loop
              muted
              controls
            />
          </div>
        </div>

        <div className="footer-container">
          <div className="footer-box">
            <h2>
              <h1>Sobre</h1>
              Somos uma Plataforma para as entidades do terceiro setor para a
              Gestão do Processo de Concessões de Bolsas
            </h2>
          </div>
          <div className="footer-box">
            <h2>
              <h1>Navegação</h1>
              <ul>
                <li>Início</li>
                <li>Recursos</li>
                <li>Sobre</li>
              </ul>
            </h2>
          </div>

          <div className="footer-box">
            <h2>
              <h1>Contatos</h1>
              <ul>
                <li>ricardo@cadastraqui.com.br</li>
                <li>(12) 98205-0366</li>
              </ul>
            </h2>
          </div>
          <div className="footer-box">
            <h2>
              Copyright © 2023 All Rights Reserved by Journey Brasil LTDA.
            </h2>
          </div>
        </div>
      </div>
    </>
  );
}
