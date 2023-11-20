import React, { useEffect } from "react";
import "./newEntidade.css";
import NavBar from "../../Components/navBar";
import { UilBell } from "@iconscout/react-unicons";
import { UilAngleRightB } from "@iconscout/react-unicons";
import { useAppState } from "../../AppGlobal";
import { useState } from "react";
import axios from "axios";
import NavBarAdmin from "../../Components/navBarAdmin";
import { useRef } from "react";

export default function NewEntidade() {
  const [value, setValue] = useState("");
  const { isShown } = useAppState();
  const [file, setFile] = useState();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const firstForm = useRef(null);
  const nameForm = useRef(null);
  const mailForm = useRef(null);
  const passwordForm = useRef(null);
  const cnpjForm = useRef(null);
  const socialReasonForm = useRef(null);
  const adressForm = useRef(null);
  const cepForm = useRef(null);
  const institucionalCodeForm = useRef(null);

  const [currentRegisterEntity, setCurrentRegisterEntity] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    CNPJ: "",
    logo: "",
    socialReason: "",
    CEP: "",
    address: "",
    educationalInstitutionCode: "",
  });

  function handlePageChange() {
    if (firstForm.current.checkValidity()) {
      // Set the name in the currentRegisterEntity object
      const nameValue = nameForm.current.value;
      const mailValue = mailForm.current.value;
      const passwordValue = passwordForm.current.value;
      const cnpjValue = cnpjForm.current.value;
      const socialReasonValue = socialReasonForm.current.value;
      const adressValue = adressForm.current.value;
      const cepValue = cepForm.current.value;
      const institucionalCodeValue = institucionalCodeForm.current.value;

      setCurrentRegisterEntity((prevState) => ({
        ...prevState,
        name: nameValue,
        email: mailValue,
        password: passwordValue,
        CNPJ: cnpjValue,
        socialReason: socialReasonValue,
        address: adressValue,
        CEP: cepValue,
        educationalInstitutionCode: institucionalCodeValue,
      }));
      setCurrentPage((prevPage) => {
        if (prevPage === 1) {
          return 2;
        }
        if (prevPage === 2) return 3;
        return 1; // Default to page 1 for all other cases
      });
    } else {
      alert("Preencha os campos exigidos!");
    }
  }

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

  function myFunction() {
    var x = document.getElementById("myInput");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
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
        <NavBarAdmin></NavBarAdmin>
      </div>
      <div className={`editais ${isShown ? "hidden-menu" : ""}`}>
        <div className="upper">
          <h1>Cadastrar Entidade</h1>
        </div>
        <div className="container-cadastros">
          <div
            id="first-register-entity"
            className={`novo-cadastro page-one ${
              currentPage !== 1 && "hidden-page"
            }`}
          >
            <form
              id="contact"
              ref={firstForm}
              action=""
              method="post"
              onSubmit={handleSubmit}
            >
              <div className="page">
                <h1>1</h1>
              </div>
              <h3>Informações de cadastro</h3>
              <h4>Preencha as informações abaixo para realizar o cadastro</h4>
              <fieldset>
                <label for="nome-edital">Instituição</label>
                <input
                  placeholder="Exemplo: Unicamp"
                  type="text"
                  tabindex="1"
                  ref={nameForm}
                  className="nome-entidade"
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
                  ref={mailForm}
                  id="email-institucional"
                  required
                />
              </fieldset>

              <fieldset>
                <label for="nome-edital">CNPJ</label>
                <input
                  placeholder="Exemplo: XX. XXX. XXX/0001-XX"
                  ref={cnpjForm}
                  type="tel"
                  tabindex="3"
                  required
                />
              </fieldset>
              <fieldset>
                <label for="nome-edital">Razão social</label>
                <input
                  placeholder=""
                  ref={socialReasonForm}
                  type="text"
                  tabindex="4"
                  required
                />
              </fieldset>
              <fieldset className="file-div">
                <label for="edital-pdf" className="file-label" id="label-file">
                  Fazer upload da logo
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
              <fieldset id="senha-entidade">
                <label>Senha</label>
                <input
                  type="password"
                  id="myInput"
                  ref={passwordForm}
                  placeholder="Digite a senha..."
                ></input>
                <input type="checkbox" onClick={() => myFunction()} />
                Mostrar senha
              </fieldset>

              <fieldset className="btn-field">
                <button
                  name="submit"
                  type="submit"
                  id="contact-submit"
                  data-submit="...Sending"
                  onClick={() => handlePageChange()}
                >
                  Próximo
                  <UilAngleRightB size="20"></UilAngleRightB>
                </button>
              </fieldset>
            </form>
          </div>

          <div
            id="second-register-entity"
            className={`novo-cadastro page-two ${
              currentPage !== 2 && "hidden-page"
            }`}
          >
            <form id="contact" action="" method="post" onSubmit={handleSubmit}>
              <div className="page">
                <h1>2</h1>
              </div>
              <h3>Quase lá...</h3>
              <h4>Somente mais alguns dados para concluirmos</h4>
              <fieldset>
                <label for="nome-edital">Endereço</label>
                <input
                  placeholder=""
                  ref={adressForm}
                  type="text"
                  tabindex="4"
                  required
                />
              </fieldset>
              <fieldset>
                <label for="email-institucional">CEP</label>
                <input
                  placeholder="Exemplo: 12228460"
                  type="number"
                  ref={cepForm}
                  id="email-institucional"
                  required
                />
              </fieldset>
              {/*<fieldset>
                <label for="nome-edital">Cidade</label>
                <input
                  placeholder="Exemplo: São José dos Campos"
                  type="text"
                  tabindex="1"
                  id="nome-edital"
                  required
                  autofocus
                />
          </fieldset>
              <fieldset>
                <label for="nome-edital">Estado</label>
                <input
                  placeholder="Exemplo: MG, SP, RS"
                  type="text"
                  tabindex="4"
                  required
                />
              </fieldset>*/}

              <fieldset>
                <label for="">Código institucional</label>
                <input
                  placeholder=""
                  ref={institucionalCodeForm}
                  type="text"
                  tabindex="4"
                  required
                />
              </fieldset>

              <fieldset className="btn-field">
                <button
                  name="submit"
                  type="submit"
                  id="contact-submit"
                  data-submit="...Sending"
                  onClick={() => handlePageChange()}
                >
                  Cadastrar
                </button>
              </fieldset>
            </form>
          </div>

          <div
            id="third-register-entity"
            className={`novo-cadastro page-two ${
              currentPage !== 3 && "hidden-page"
            }`}
          >
            <form id="contact" action="" method="post" onSubmit={handleSubmit}>
              <div className="page">
                <h1>3</h1>
              </div>
              <h3>Cadastro Realizado com sucesso</h3>
              <h4>Abaixo são apresentadas as informações registradas</h4>

              <ul className="registered-data">
                <li>
                  <h2>
                    <span>Nome: </span>
                    {currentRegisterEntity.name}
                  </h2>
                </li>
                <li>
                  <h2>
                    <span>Email: </span>
                    {currentRegisterEntity.email}
                  </h2>
                </li>
                <li>
                  <h2>
                    <span>Senha: </span>
                    {currentRegisterEntity.password}
                  </h2>
                </li>
              </ul>

              <fieldset className="btn-field">
                <button
                  name="submit"
                  type="submit"
                  id="contact-submit"
                  data-submit="...Sending"
                  onClick={() => {
                    handlePageChange();
                    window.location.reload();
                  }}
                >
                  Finalizar
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
