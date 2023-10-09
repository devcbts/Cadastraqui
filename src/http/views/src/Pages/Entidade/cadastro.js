import React from "react";
import "./cadastro.css";
import NavBar from "../../Components/navBar";
import { UilBell } from "@iconscout/react-unicons";
import { useAppState } from "../../AppGlobal";
import { useState } from "react";
import axios from "axios";

export default function CadastroEntidade() {
  const { isShown } = useAppState();
  const [file, setFile] = useState();
  const [uploadProgress, setUploadProgress] = useState(0);

  function handleChange(event) {
    setFile(event.target.files[0]);
    const fileInput = event.target;
    const label = document.querySelector(".file-label");

    if (fileInput.files && fileInput.files.length > 0) {
      // If there's a file attached, update label text with file name
      label.textContent = "Alterar arquivo";
    } else {
      // If no file is attached, revert back to default label text
      label.textContent = "Selecione um arquivo";
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const url = "http://localhost:3000/uploadFile";
    const formData = new FormData();
    formData.append("file", file);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
      onUploadProgress: function (progressEvent) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      },
    };

    axios
      .post(url, formData, config)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error uploading file: ", error);
      });
  }
  return (
    <div className="container">
      <div className="section-nav">
        <NavBar></NavBar>
      </div>
      <div className={`editais ${isShown ? "hidden-menu" : ""}`}>
        <div className="upper">
          <h1>Cadastrar Edital</h1>
        </div>
        <div className="container-cadastros">
          <div className="novo-cadastro">
            <form id="contact" action="" method="post" onSubmit={handleSubmit}>
              <h3>Informações do edital</h3>
              <h4>Preencha as informações abaixo para realizar o cadastro</h4>
              <fieldset>
                <label for="nome-edital">Título do edital</label>
                <input
                  placeholder="Exemplo: Unicamp 2023.1"
                  type="text"
                  tabindex="1"
                  id="nome-edital"
                  required
                  autofocus
                />
              </fieldset>
              <fieldset>
                <label for="email-institucional">Email institucional</label>
                <input
                  placeholder="Exemplo: universidade@email.com"
                  type="email"
                  tabindex="2"
                  id="email-institucional"
                  required
                />
              </fieldset>
              <fieldset>
                <label for="nome-edital">Telefone</label>
                <input
                  placeholder="Exemplo: (DDD) XXXX-XXXX"
                  type="tel"
                  tabindex="3"
                  required
                />
              </fieldset>
              <fieldset>
                <label for="nome-edital">Site institucional</label>
                <input
                  placeholder="Seu site iniciando com http://"
                  type="url"
                  tabindex="4"
                  required
                />
              </fieldset>
              <fieldset className="file-div">
                <label for="edital-pdf" className="file-label" id="label-file">
                  Fazer upload do PDF do Edital
                </label>
                <div className="upload">
                  <input
                    type="file"
                    id="edital-pdf"
                    title="Escolher arquivo"
                    onChange={handleChange}
                  />
                </div>
              </fieldset>
              <fieldset>
                <textarea
                  placeholder="Descrição"
                  tabindex="5"
                  required
                ></textarea>
              </fieldset>

              <fieldset>
                <button
                  name="submit"
                  type="submit"
                  id="contact-submit"
                  data-submit="...Sending"
                >
                  Cadastrar
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
