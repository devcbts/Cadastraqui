import React from "react";
import "./sac.css";
import NavBar from "../../Components/navBar";
import { UilBell } from "@iconscout/react-unicons";
import { useAppState } from "../../AppGlobal";

export default function SacEntidade() {
  const { isShown } = useAppState();

  return (
    <div className="container">
      <div className="section-nav">
        <NavBar></NavBar>
      </div>

      <div className="container-sac">
        <div className="mail-box">
          <label class="desc" id="title4" for="Field4">
            Digite sua mensagem
          </label>

          <div>
            <textarea
              id="Field4"
              name="Field4"
              spellcheck="true"
              rows="10"
              cols="50"
              tabindex="4"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}
