import React, { useEffect } from "react";
import "./cadastro.css";
import NavBar from "../../Components/navBar";
import { UilBell } from "@iconscout/react-unicons";
import { useAppState } from "../../AppGlobal";
import { useState } from "react";
import { useRef } from "react";
import axios from "axios";
import CadastroEdital from "../../Components/cadastroEdital";
import { api } from "../../services/axios";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";

export default function CadastroEntidade() {
  const { isShown } = useAppState();
  const [file, setFile] = useState();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [value, setValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const firstForm = useRef(null);
  const secondForm = useRef(null);
  const thirdForm = useRef(null);

  // Properties for the object entity subsidiary
  const nameForm = useRef(null);
  const mailForm = useRef(null);
  const passwordForm = useRef(null);
  const cnpjForm = useRef(null);
  const socialReasonForm = useRef(null);
  const adressForm = useRef(null);
  const cepForm = useRef(null);
  const institucionalCodeForm = useRef(null);

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

      entity_id: "",
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

  // BackEnd Functions
  /*
  async function handleCreateAnnouncement() {}

  async function handleCreateDirector() {
    const directorForm = firstForm.current;

    if (directorForm.checkValidity()) {
      const name = directorForm.querySelector(
        'input[name="director-name"]'
      ).value;
      const phone = directorForm.querySelector(
        'input[name="director-phone"]'
      ).value;
      const CPF = directorForm.querySelector(
        'input[name="director-CPF"]'
      ).value;
      const email = directorForm.querySelector(
        'input[name="director-email"]'
      ).value;
      const password = directorForm.querySelector(
        'input[name="director-password"]'
      ).value;

      const createInfo = {
        name,
        phone,
        email,
        password,
        CPF,
      };

      const token = localStorage.getItem("token");
      try {
        await api.post("/entities/director/", createInfo, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        alert("Diretor cadastrado com sucesso.");
      } catch (err) {
        alert(`${err.response.data.message}`);
        console.log(err);
      }
    } else {
      alert("Preencha os campos exigidos.");
    }
  }

  async function handleCreateAssistant() {
    const assistantForm = secondForm.current;

    if (assistantForm.checkValidity()) {
      const name = assistantForm.querySelector(
        'input[name="assistant-name"]'
      ).value;
      const phone = assistantForm.querySelector(
        'input[name="assistant-phone"]'
      ).value;
      const CPF = assistantForm.querySelector(
        'input[name="assistant-CPF"]'
      ).value;
      const email = assistantForm.querySelector(
        'input[name="assistant-email"]'
      ).value;
      const password = assistantForm.querySelector(
        'input[name="assistant-password"]'
      ).value;
      const RG = assistantForm.querySelector(
        'input[name="assistant-RG"]'
      ).value;
      const CRESS = assistantForm.querySelector(
        'input[name="assistant-CRESS"]'
      ).value;

      const createInfo = {
        name,
        phone,
        email,
        password,
        CPF,
        RG,
        CRESS,
      };

      const token = localStorage.getItem("token");
      try {
        await api.post("/assistant/", createInfo, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        alert("Assistente cadastrado com sucesso.");
      } catch (err) {
        alert(`${err.response.data.message}`);
        console.log(err);
      }
    } else {
      alert("Preencha os campos exigidos.");
    }
  }

  async function handleCreateSubsidiary() {
    const subsidiaryForm = thirdForm.current;

    if (subsidiaryForm.checkValidity()) {
      const name = subsidiaryForm.querySelector(
        'input[name="subsidiary-name"]'
      ).value;
      const address = subsidiaryForm.querySelector(
        'input[name="subsidiary-address"]'
      ).value;
      const CNPJ = subsidiaryForm.querySelector(
        'input[name="subsidiary-CNPJ"]'
      ).value;
      const email = subsidiaryForm.querySelector(
        'input[name="subsidiary-email"]'
      ).value;
      const password = subsidiaryForm.querySelector(
        'input[name="subsidiary-password"]'
      ).value;
      const educationalInstitutionCode = subsidiaryForm.querySelector(
        'input[name="subsidiary-code"]'
      ).value;
      const socialReason = subsidiaryForm.querySelector(
        'input[name="subsidiary-socialReason"]'
      ).value;
      const CEP = subsidiaryForm.querySelector(
        'input[name="subsidiary-CEP"]'
      ).value;

      const createInfo = {
        name,
        email,
        password,
        CEP,
        CNPJ,
        educationalInstitutionCode,
        socialReason,
        address,
      };

      const token = localStorage.getItem("token");
      try {
        await api.post("/entities/subsidiary", createInfo, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        alert("Filial cadastrado com sucesso.");
      } catch (err) {
        console.log(err);
        alert(`${err.response.data.message}`);
      }
    } else {
      alert("Preencha os campos exigidos.");
    }
  }
*/
  // Estado para informações acerca do usuário logado
  const [entityInfo, setEntityInfo] = useState();

  /*const navigate = useNavigate();*/
  /*
  useEffect(() => {
    async function refreshAccessToken() {
      try {
        const refreshToken = Cookies.get("refreshToken");

        const response = await api.patch(
          `/refresh?refreshToken=${refreshToken}`
        );

        const { newToken, newRefreshToken } = response.data;
        localStorage.setItem("token", newToken);
        Cookies.set("refreshToken", newRefreshToken, {
          expires: 7,
          sameSite: true,
          path: "/",
        });
      } catch (err) {
        console.log(err);
        navigate("/login");
      }
    }
    const intervalId = setInterval(refreshAccessToken, 480000); // Chama a função refresh token a cada

    async function getEntityInfo() {
      const token = localStorage.getItem("token");

      try {
        const entity_info = await api.get("/entities/", {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setEntityInfo(entity_info.data.entity);
      } catch (err) {
        console.log(err);
      }
    }

    getEntityInfo();
    return () => {
      // Limpar o intervalo
      clearInterval(intervalId);
    };
  }, []);*/

  return (
    <div className="container">
      <div className="section-nav">
        <NavBar entity={entityInfo}></NavBar>
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

        {selectedOption === "cadastrar-edital" ? <CadastroEdital /> : ""}

        {selectedOption === "cadastrar-filial" && (
          <div className="container-cadastros">
            <div
              id="first-register-entity"
              className={`novo-cadastro page-one ${
                currentPage !== 1 && "hidden-page"
              }`}
            >
              <form id="contact" ref={thirdForm}>
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
                    name="subsidiary-name"
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
                    name="subsidiary-email"
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
                    name="subsidiary-password"
                  ></input>
                  <input type="checkbox" onClick={() => myFunction()} />
                  Mostrar senha
                </fieldset>
                <fieldset>
                  <label for="email-institucional">Código Educacional</label>
                  <input
                    placeholder="Exemplo: universidade@email.com"
                    type="text"
                    tabindex="2"
                    ref={mailForm}
                    id="email-institucional"
                    name="subsidiary-code"
                    required
                  />
                </fieldset>
                <fieldset>
                  <label for="email-institucional">CEP</label>
                  <input
                    placeholder="Exemplo: universidade@email.com"
                    type="text"
                    tabindex="2"
                    ref={mailForm}
                    id="email-institucional"
                    name="subsidiary-CEP"
                    required
                  />
                </fieldset>

                <fieldset>
                  <label for="email-institucional">Endereço</label>
                  <input
                    placeholder="Exemplo: universidade@email.com"
                    type="text"
                    tabindex="2"
                    ref={mailForm}
                    id="email-institucional"
                    name="subsidiary-address"
                    required
                  />
                </fieldset>

                <fieldset>
                  <label for="nome-edital">CNPJ</label>
                  <input
                    placeholder="Exemplo: XX. XXX. XXX/0001-XX"
                    ref={cnpjForm}
                    type="text"
                    name="subsidiary-CNPJ"
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
                    name="subsidiary-socialReason"
                    required
                  />
                </fieldset>
                {/*<fieldset className="file-div">
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
            </fieldset>*/}

                <fieldset className="btn-field">
                  <button name="submit" id="contact-submit" type="button">
                    Cadastrar
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
              <form id="contact" ref={firstForm}>
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
                    name="director-name"
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
                    name="director-email"
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
                    name="director-phone"
                    required
                  />
                </fieldset>

                <fieldset>
                  <label for="nome-edital">CPF</label>
                  <input
                    placeholder="Exemplo: (XX) XXXX-XXXX"
                    ref={socialReasonForm}
                    name="director-CPF"
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
                    name="director-password"
                    placeholder="Digite a senha..."
                  ></input>
                  <input type="checkbox" onClick={() => myFunction()} />
                  Mostrar senha
                </fieldset>

                <fieldset className="btn-field">
                  <button name="submit" type="button" id="contact-submit">
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
              <form id="contact" ref={secondForm}>
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
                    name="assistant-name"
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
                    name="assistant-email"
                    required
                  />
                </fieldset>

                <fieldset>
                  <label for="nome-edital">Celular</label>
                  <input
                    placeholder="Exemplo: (XX) XXXX-XXXX"
                    ref={socialReasonForm}
                    type="text"
                    name="assistant-phone"
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
                    name="assistant-CPF"
                    tabindex="4"
                    required
                  />
                </fieldset>
                <fieldset>
                  <label for="nome-edital">RG</label>
                  <input
                    placeholder="Exemplo: (XX) XXXX-XXXX"
                    ref={socialReasonForm}
                    type="text"
                    name="assistant-RG"
                    tabindex="4"
                    required
                  />
                </fieldset>
                <fieldset>
                  <label for="nome-edital">CRESS</label>
                  <input
                    placeholder="Exemplo: (XX) XXXX-XXXX"
                    ref={socialReasonForm}
                    type="text"
                    name="assistant-CRESS"
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
                    name="assistant-password"
                    placeholder="Digite a senha..."
                  ></input>
                  <input type="checkbox" onClick={() => myFunction()} />
                  Mostrar senha
                </fieldset>

                <fieldset className="btn-field">
                  <button name="submit" type="button" id="contact-submit">
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
