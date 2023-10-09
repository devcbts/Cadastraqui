import React from "react";
import "./perfil.css";
import NavBar from "../../Components/navBar";
import { useAppState } from "../../AppGlobal";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

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

  return (
    <div>
      <div className="container">
        <div className="section-nav">
          <NavBar></NavBar>
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
