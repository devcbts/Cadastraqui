import React, { useEffect } from "react";


import { Link } from "react-router-dom";


export default function LoadingCandidaturaAssistente(props) {
  
  return (
    <div className="card-candidatura">
      <div className="candidato-assistente">
        <div className="skeleton skeleton-mid-text"/>
        <div className="application-info">
          <div className="skeleton skeleton-small-image"/>
          <div className="skeleton skeleton-mid-text"/>
        </div>
      </div>
      <div className="candidatura-btn">
      <div className="skeleton skeleton-button" />
      <div className="skeleton skeleton-button" />
        </div>
    </div>
  );
}
