import React from "react";
import { useState } from "react";
import universityLogo from "../Assets/usp-logo.png";
import { UilPlusSquare } from "@iconscout/react-unicons";
import { UilEllipsisH } from "@iconscout/react-unicons";
import "./candidatura.css";

export default function Candidatura() {
  return (
    <div className="card-candidatura">
      <div className="candidato-assistente">
        <h2>Renan Corrêa</h2>
        <h3>Assistente social: Maria Santos</h3>
      </div>
      <div className="candidatura-btn">
        <UilEllipsisH size="30" color="#7b7b7b" className="icon"></UilEllipsisH>

        <a href="">Extrair PDF</a>
        <UilPlusSquare
          size="30"
          color="#7b7b7b"
          className="icon"
        ></UilPlusSquare>
      </div>
    </div>
  );
}
