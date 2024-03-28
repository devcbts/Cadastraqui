import React from "react";
import "./comment.css";
import assistenteImage from "../Assets/profile-padrao.jpg";
import { UilLinkAdd } from "@iconscout/react-unicons";

export default function Comment() {
  return (
    <div className="comment-container">
      <div className="upper-comment">
        <img src={assistenteImage}></img>
        <h2>Victor</h2>
      </div>
      <div className="body-comment"></div>
      <div className="attach-file">
        <UilLinkAdd size="25" color="#1f4b73"></UilLinkAdd>
        <h3>Anexar documento</h3>
      </div>
    </div>
  );
}
