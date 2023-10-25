import React from "react";
import "./home.css";
import NavBar from "../../Components/navBar";
import { UilBell } from "@iconscout/react-unicons";
import { useAppState } from "../../AppGlobal";
import { useState, useEffect } from "react";
import Edital from "../../Components/edital";

export default function HomeEntidade() {
  const { isShown } = useAppState();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Function to handle the resize event
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Attach the event handler
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // The empty array ensures this effect only runs once, on mount and unmount
  return (
    <div className="container">
      <div className="section-nav">
        <NavBar></NavBar>
      </div>
      <div className={`editais ${isShown ? "hidden-menu" : ""}`}>
        <div className="upper">
          <h1>Editais Vigentes</h1>
          <div className="search-ring">
            <div style={{ minHeight: "0vh" }}></div>
            <div class="right search">
              {windowWidth > 1000 && (
                <form>
                  <input type="search" placeholder="Search..." />
                </form>
              )}
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
