import { useState } from "react";
import React from "react";
import universityLogo from "../Assets/usp-logo.png";
import "./editalDescription.css";

export default function EditalInscricao() {
  return (
    <div className="container-inscricao">
      <div className="school-logo">
        <img src={universityLogo}></img>
      </div>
      <div className="descricao-edital">
        <h1>USP 2023.1</h1>
        <h4>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          auctor sapien risus. Mauris efficitur lacus ex, et condimentum turpis
          rutrum consequat. Vivamus id fermentum nisl. Curabitur turpis tortor,
          molestie vel tincidunt id, volutpat eu ante. Donec porta risus et
          pretium euismod. Integer in odio nec purus volutpat interdum id non
          turpis. Duis ut orci consequat, cursus tellus elementum, ultricies
          nulla. Praesent ut vestibulum lorem. Nulla eu ex in dui efficitur
          posuere id id erat. Mauris vitae suscipit turpis. Aenean tristique,
          ligula a congue bibendum, lorem est mollis orci, in sollicitudin
          mauris orci in risus. Quisque ut vehicula felis. Fusce ut eros finibus
          diam convallis condimentum non sed urna. Praesent vitae facilisis
          turpis
        </h4>
      </div>
      <div className="info-inscricao">
        <h2>Vagas: </h2>
        <h2>Escolaridades: </h2>
        <h2>Turno: </h2>
      </div>
      <button className="cadastro-btn">Inscrever-se</button>
    </div>
  );
}
