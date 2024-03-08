import React, { useEffect, useState } from "react";
import "./perfil.css";
import NavBarCandidato from "../../Components/navBarCandidato";
import { UilLock } from "@iconscout/react-unicons";
import "./verHistorico.css";

export default function VerHistorico() {
  return (
    <div className="container">
      <div className="section-nav">
        <NavBarCandidato user={userInfo}></NavBarCandidato>
      </div>

      <div className="container-contas">
        <div className="upper-contas status-title">
          <h1>{userInfo ? userInfo.name : ""}</h1>
        </div>
      </div>
    </div>
  );
}
