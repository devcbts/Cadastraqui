import React from "react";
import "./sacAssistente.scss";
import NavBar from "../../Components/navBar";
import { UilBell } from "@iconscout/react-unicons";
import { useAppState } from "../../AppGlobal";
import NavBarAssistente from "../../Components/navBarAssistente";

export default function SacAssistente() {
  const { isShown } = useAppState();

  return (
    <div className="container">
      <div className="section-nav">
        <NavBarAssistente></NavBarAssistente>
      </div>

      <div className="container-sac">
        <h1>Em que podemos ajudar?</h1>
        <div id="form-main">
          <div id="form-div">
            <form class="form form-sac-assistente" id="form1">
              <p class="name">
                <input
                  name="name"
                  type="text"
                  class="validate[required,custom[onlyLetter],length[0,100]] feedback-input"
                  placeholder="Nome"
                  id="name"
                />
              </p>

              <p class="email">
                <input
                  name="email"
                  type="text"
                  class="validate[required,custom[email]] feedback-input"
                  id="email"
                  placeholder="Email"
                />
              </p>

              <p class="text">
                <textarea
                  name="text"
                  class="validate[required,length[6,300]] feedback-input"
                  id="comment"
                  placeholder="Comentário"
                ></textarea>
              </p>

              <div class="submit">
                <input type="submit" value="Enviar" id="button-blue" />
                <div class="ease"></div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
