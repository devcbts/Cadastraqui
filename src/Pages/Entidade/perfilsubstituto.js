import React, { useEffect, useState } from "react";
import "./perfil.css";
import NavBar from "../../Components/navBar";
import { useAppState } from "../../AppGlobal";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import { api } from "../../services/axios";

export default function PerfilEntidade() {
  const { isShown } = useAppState();

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 700 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 700, min: 0 },
      items: 1,
    },
  };

  // Estado para informações acerca do usuário logado
  const [entityInfo, setEntityInfo] = useState()

  const navigate = useNavigate()

  useEffect(() => {
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

        navigate('/login')
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

      }
    }

    getEntityInfo()
    return () => {
      // Limpar o intervalo
      clearInterval(intervalId);
    };
  }, [])

  return (
    <div>
      <div className="container">
        <div className="section-nav">
          <NavBar entity={entityInfo}></NavBar>
        </div>

        <div className="container-perfil">
          <div className="upper-perfil">
            <h1>Perfil</h1>
          </div>
          <h2>Editais abertos: ?</h2>
          <div className="editais-abertos">
            <Carousel
              autoPlay={true}
              autoPlaySpeed={5000}
              partialVisible={true}
              infinite={true}
              responsive={responsive}
              className="carousel"
            >
              <div className="item i-perfil">1</div>
              <div className="item i-perfil">2</div>
              <div className="item i-perfil">3</div>
              <div className="item i-perfil">4</div>
              <div className="item i-perfil">5</div>
            </Carousel>
          </div>
          <h2>Matriz e filiais</h2>
          <div className="matriz-filiais">
            <Carousel
              autoPlay={true}
              autoPlaySpeed={5000}
              partialVisible={true}
              infinite={true}
              responsive={responsive}
              className="carousel"
            >
              <div className="item i-perfil">1</div>
              <div className="item i-perfil">2</div>
              <div className="item i-perfil">3</div>
              <div className="item i-perfil">4</div>
              <div className="item i-perfil">5</div>
            </Carousel>
          </div>

          <h2>Responsável legal</h2>
          <div className="responsavel-legal">
            <Carousel
              autoPlay={true}
              autoPlaySpeed={5000}
              partialVisible={true}
              infinite={true}
              responsive={responsive}
              className="carousel"
            >
              <div className="item i-perfil">1</div>
              <div className="item i-perfil">2</div>
              <div className="item i-perfil">3</div>
              <div className="item i-perfil">4</div>
              <div className="item i-perfil">5</div>
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
}
