import React from "react";
import "./home.css";
import NavBar from "../../Components/navBar";
import { useAppState } from "../../AppGlobal";
import NavBarAssistente from "../../Components/navBarAssistente";

export default function HomeAssistente() {
  const { isShown } = useAppState();

  return (
    <div className="container">
      <div className="section-nav">
        <NavBarAssistente></NavBarAssistente>
      </div>

      <div className="container-contas">
        <div className="upper-contas status-title">
          <h1>Editais com atuação</h1>
        </div>

        <div className="container-editais">
          <div className="item"></div>
          <div className="item"></div>
          <div className="item"></div>
        </div>

        <div className="upper-contas status-title">
          <h1>Editais abertos</h1>
        </div>

        <div className="container-editais">
          <div className="item"></div>
          <div className="item"></div>
          <div className="item"></div>
        </div>

        <div className="upper-contas status-title">
          <h1>Editais anteriores</h1>
        </div>

        <div className="container-editais">
          <div className="item"></div>
          <div className="item"></div>
          <div className="item"></div>
        </div>
      </div>
    </div>
  );
}
