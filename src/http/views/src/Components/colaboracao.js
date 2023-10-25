import React from "react";
import { useState } from "react";
import universityLogo from "../Assets/usp-logo.png";
import "./colaboracao.css";

export default function Colaboracao() {
  return (
    <div className="card-candidatura">
      <div className="nome-candidato">
        <h2>Renan</h2>
      </div>

      <div className="entidade-nome colaboracao-status">
        <h2>Status: </h2>
        <h2>Em análise</h2>
      </div>
      <div className="situacao">
        <h2>10/11/2023</h2>
      </div>
    </div>
  );
}
