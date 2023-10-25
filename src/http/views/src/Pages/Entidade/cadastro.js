import React from "react";
import "./cadastro.css";
import NavBar from "../../Components/navBar";
import { UilBell } from "@iconscout/react-unicons";
import { useAppState } from "../../AppGlobal";
import { useState } from "react";
import { useRef } from "react";
import axios from "axios";

export default function CadastroEntidade() {
  const { isShown } = useAppState();
  const [file, setFile] = useState();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [value, setValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const firstForm = useRef(null);

  // Properties for the object entity subsidiary
  const nameForm = useRef(null);
  const mailForm = useRef(null);
  const passwordForm = useRef(null);
  const cnpjForm = useRef(null);
  const socialReasonForm = useRef(null);
  const adressForm = useRef(null);
  const cepForm = useRef(null);
  const institucionalCodeForm = useRef(null);

  const [announcementType, setAnnouncementType] = useState(""); // Initial value can be set to default if needed.
  const [educationLevel, setEducationLevel] = useState("");

  // Set announcement type according to the option selected
  const handleAnnouncementTypeChange = (e) => {
    setAnnouncementType(e.target.value);
  };

  // Set announcement ed. level according to the option selected
  const handleEducationLevelChange = (e) => {
    setEducationLevel(e.target.value);
  };

  // Object with info for entity registration
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

  // Object with info for announcement registration
  const [currentRegisterAnnouncement, setCurrentRegisterAnnouncement] =
    useState({
      id: "",
      entityChanged: "",
      branchChanged: "",
      announcementType: "",
      announcementNumber: "",
      announcementDate: "",
      offeredVacancies: "",
      verifiedScholarships: "",
      timelines: "",
      educationLevels: "",

      entity: "",
      entity_id: "",

      entity_subsidiary: "",
      entity_subsidiary_id: "",
    });

  // Object with info for social assistant registration
  const [socialAssistant, setSocialAssistant] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    CPF: "",
  });

  // Object with info for director registration
  const [entityDirector, setEntityDirector] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    CPF: "",
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

  function handleSelectChange(event) {
    setSelectedOption(event.target.value);
  }

  // function that hides and shows password on click
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
        <NavBar></NavBar>
      </div>
      <div className={`editais ${isShown ? "hidden-menu" : ""}`}>
        <div className="upper entidade-upper">
          <select onChange={handleSelectChange}>
            <option value="">Selecionar ação</option>
            <option value="cadastrar-edital">Cadastrar Edital</option>
            <option value="cadastrar-assistente">Cadastrar Assistente</option>
            <option value="cadastrar-diretor">Cadastrar Diretor</option>
            <option value="cadastrar-filial">Cadastrar Filial</option>
          </select>
        </div>

        {selectedOption === "cadastrar-edital" && (
          <div className="container-cadastros">
            <div className="novo-cadastro">
              <form
                id="contact"
                action=""
                method="post"
                onSubmit={handleSubmit}
              >
                <h3>Informações do edital</h3>
                <h4>Preencha as informações abaixo para realizar o cadastro</h4>

                <fieldset>
                  <select
                    value={announcementType}
                    onChange={handleAnnouncementTypeChange}
                  >
                    <option value="" disabled>
                      Selecionar o tipo de edital
                    </option>
                    <option value="ScholarshipGrant">Scholarship Grant</option>
                    <option value="PeriodicVerification">
                      Periodic Verification
                    </option>
                  </select>
                </fieldset>

                <fieldset>
                  <select
                    value={educationLevel}
                    onChange={handleEducationLevelChange}
                  >
                    <option value="" disabled>
                      Selecionar o nível de ensino
                    </option>
                    <option value="higherEducation">Ensino superior</option>
                    <option value="basicEducation">Ensino básico</option>
                  </select>
                </fieldset>

                <fieldset>
                  <label for="nome-edital">Número do edital</label>
                  <input
                    placeholder="Exemplo: 2023.1"
                    type="text"
                    tabindex="1"
                    id="nome-edital"
                    required
                    autofocus
                  />
                </fieldset>
                <fieldset>
                  <label for="email-institucional">
                    Data limite para inscrição
                  </label>
                  <input
                    placeholder="Exemplo: 10/11/2023"
                    type="date"
                    tabindex="2"
                    id="email-institucional"
                    required
                  />
                </fieldset>
                <fieldset>
                  <label for="nome-edital">Número de vagas</label>
                  <input
                    placeholder="Exemplo: 10"
                    type="number"
                    tabindex="3"
                    required
                  />
                </fieldset>
                <fieldset>
                  <label for="nome-edital">Número de bolsas</label>
                  <input
                    placeholder="Exemplo: 7"
                    type="number"
                    tabindex="3"
                    required
                  />
                </fieldset>
                <fieldset className="file-div">
                  <label
                    for="edital-pdf"
                    className="file-label"
                    id="label-file"
                  >
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
        )}

        {selectedOption === "cadastrar-filial" && (
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
                  <label
                    for="edital-pdf"
                    className="file-label"
                    id="label-file"
                  >
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
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        )}

        {selectedOption === "cadastrar-diretor" && (
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
                <h3>Informações de cadastro</h3>
                <h4>Preencha as informações abaixo para realizar o cadastro</h4>
                <fieldset>
                  <label for="nome-edital">Nome</label>
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
                  <label for="email-diretor">Email</label>
                  <input
                    placeholder="Exemplo: universidade@email.com"
                    type="email"
                    tabindex="2"
                    ref={mailForm}
                    id="email-diretor"
                    required
                  />
                </fieldset>

                <fieldset>
                  <label for="nome-edital">Celular</label>
                  <input
                    placeholder="Exemplo: (XX) XXXX-XXXX"
                    ref={socialReasonForm}
                    type="text"
                    tabindex="4"
                    required
                  />
                </fieldset>

                <fieldset>
                  <label for="nome-edital">CPF</label>
                  <input
                    placeholder="Exemplo: (XX) XXXX-XXXX"
                    ref={socialReasonForm}
                    type="text"
                    tabindex="4"
                    required
                  />
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
                    Cadastrar
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        )}

        {selectedOption === "cadastrar-assistente" && (
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
                <h3>Informações de cadastro</h3>
                <h4>Preencha as informações abaixo para realizar o cadastro</h4>
                <fieldset>
                  <label for="nome-edital">Nome</label>
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
                  <label for="email-diretor">Email</label>
                  <input
                    placeholder="Exemplo: universidade@email.com"
                    type="email"
                    tabindex="2"
                    ref={mailForm}
                    id="email-diretor"
                    required
                  />
                </fieldset>

                <fieldset>
                  <label for="nome-edital">Celular</label>
                  <input
                    placeholder="Exemplo: (XX) XXXX-XXXX"
                    ref={socialReasonForm}
                    type="text"
                    tabindex="4"
                    required
                  />
                </fieldset>

                <fieldset>
                  <label for="nome-edital">CPF</label>
                  <input
                    placeholder="Exemplo: (XX) XXXX-XXXX"
                    ref={socialReasonForm}
                    type="text"
                    tabindex="4"
                    required
                  />
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
                    Cadastrar
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
