import React from "react";
import "./editais.css";
import { UilBell } from "@iconscout/react-unicons";
import { useAppState } from "../../AppGlobal";
import NavBarAdmin from "../../Components/navBarAdmin";
import NavBar from "../../Components/navBar";
import Edital from "../../Components/edital";

export default function EditaisEntidade() {
  const { isShown } = useAppState();

  return (
    <div className="container">
      <div className="section-nav">
        <NavBar></NavBar>
      </div>
      <div className={`editais ${isShown ? "hidden-menu" : ""}`}>
        <div className="upper">
          <h1>Editais Anteriores</h1>
          <div className="search-ring">
            <div style={{ minHeight: "0vh" }}></div>
            <div class="right search">
              <form>
                <input type="search" placeholder="Search..." />
              </form>
            </div>
          </div>
        </div>
        <div className="container-editais">
          <Edital />
          <Edital />
          <Edital />
          <Edital />
          <Edital />
          <Edital />
        </div>
      </div>
    </div>
  );
}
