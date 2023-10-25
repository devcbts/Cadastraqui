import React from "react";
import "./home.css";
import NavBar from "../../Components/navBar";
import { useAppState } from "../../AppGlobal";
import NavBarCandidato from "../../Components/navBarCandidato";
import Edital from "../../Components/edital";
import Candidatura from "../../Components/candidatura";

export default function HomeCandidato() {
  const { isShown } = useAppState();

  return (
    <div className="container">
      <div className="section-nav">
        <NavBarCandidato></NavBarCandidato>
      </div>

      <div className="container-contas">
        <div className="upper-contas status-title">
          <h1>Status</h1>
        </div>

        <div className="solicitacoes">
          <Candidatura></Candidatura>
          <Candidatura></Candidatura>
        </div>

        <div className="upper-contas status-title">
          <h1>Editais Abertos</h1>
          <div className="filters">
            <select>
              <option>-- Estado --</option>
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
              <option>Option 4</option>
              <option>Option 5</option>
            </select>

            <select>
              <option>-- Cidade --</option>
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
              <option>Option 4</option>
              <option>Option 5</option>
            </select>

            <select>
              <option>-- Ensino --</option>
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
              <option>Option 4</option>
              <option>Option 5</option>
            </select>
          </div>
        </div>

        <div className="container-editais">
          <Edital></Edital>
          <Edital></Edital>
          <Edital></Edital>
          <Edital></Edital>
          <Edital></Edital>
          <Edital></Edital>
        </div>
      </div>
    </div>
  );
}
