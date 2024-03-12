import React, { useEffect } from "react";
import "./cadastro.css";
import NavBar from "../../Components/navBar";
import { UilBell } from "@iconscout/react-unicons";
import { useAppState } from "../../AppGlobal";
import { useState } from "react";
import { useRef } from "react";
import axios from "axios";
import CadastroEdital from "../../Components/cadastroEdital"
import { api } from "../../services/axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { handleAuthError } from "../../ErrorHandling/handleError";
import { handleSuccess } from "../../ErrorHandling/handleSuceess";
import { formatCPF } from "../../utils/format-cpf";
import { formatCNPJ } from "../../utils/format-cnpj";


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
  const [CPFDirector, setCPFDirector] = useState('')
  const [CPFAssistant, setCPFAssistant] = useState('')
  const [CNPJSubsidiary, setCNPJSubsidiary] = useState('')
  // Object with info for entity registration
 
  const handleCPFAssistantChange = (e) => {
    const formattedCPF = formatCPF(e.target.value);
    setCPFAssistant(formattedCPF); // Atualiza o estado com o CPF formatado
  };
 
  const handleCPFDirectorChange = (e) => {
    const formattedCPF = formatCPF(e.target.value);
    setCPFDirector(formattedCPF); // Atualiza o estado com o CPF formatado
  };
  const handleCNPJChange = (e) => {
    const formattedCNPJ = formatCNPJ(e.target.value);
    setCNPJSubsidiary(formattedCNPJ); // Atualiza o estado com o CPF formatado
  };
 

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

  

  // BackEnd Functions
  

  async function handleCreateDirector() {
    const directorForm = firstForm.current;

    if (directorForm.checkValidity()) {
      const name = directorForm.querySelector(
        'input[name="director-name"]'
      ).value;
      const phone = directorForm.querySelector(
        'input[name="director-phone"]'
      ).value;
      const CPF =CPFDirector;
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
       const response = await api.post("/entities/director/", createInfo, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        handleSuccess(response,"Diretor cadastrado com sucesso.");
      } catch (err) {
        handleAuthError(err)
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
      const CPF = CPFAssistant
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
      const name = 'Exemplo'
      const address = subsidiaryForm.querySelector(
        'input[name="subsidiary-address"]'
      ).value;
      const CNPJ = CNPJSubsidiary;
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
       const response = await api.post("/entities/subsidiary", createInfo, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        handleSuccess(response, "Filial cadastrada com sucesso.");
      } catch (err) {
        console.log(err);
        handleAuthError(err,navigate)

      }
    } else {
      alert("Preencha os campos exigidos.");
    }
  }

  // Estado para informações acerca do usuário logado
  const [entityInfo, setEntityInfo] = useState();

  const navigate = useNavigate();
  
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
       handleAuthError(err,navigate)
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
  }, []);

  return (
    <div className="container">
      <div className="section-nav">
        <NavBar entity={entityInfo}></NavBar>
      </div>
      <div className={`editais ${isShown ? "hidden-menu" : ""}`}>
        <div className="upper entidade-upper">
          <select onChange={handleSelectChange}>
            <option value="">Selecionar ação</option>
            <option value="cadastrar-filial">Cadastrar Filial</option>
            <option value="cadastrar-diretor">Cadastrar Responsável</option>
            <option value="cadastrar-assistente">Cadastrar Assistente</option>
            <option value="cadastrar-edital">Cadastrar Edital</option>
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
                <h3>Informações cadastrais</h3>
                <h4>Preencha as informações abaixo para realizar o cadastro</h4>
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
                {/*<fieldset>
                  <label for="nome-edital" style={{display:'none'}}>Instituição</label>
                  <input
                    placeholder="Exemplo: Unicamp"
                    type="text"
                    tabindex="1"
                    ref={nameForm}
                    className="nome-entidade"
                    name="subsidiary-name"
                    required
                    autofocus
                    style={{display: 'none'}}
                  />
            </fieldset>*/}
                <fieldset>
                  <label for="nome-edital">CNPJ</label>
                  <input
                    placeholder="Exemplo: XX. XXX. XXX/0001-XX"
                    ref={cnpjForm}
                    type="text"
                    name="subsidiary-CNPJ"
                    tabindex="3"
                    required
                    value={CNPJSubsidiary}
                    onChange={handleCNPJChange}
                  />
                </fieldset>
                <fieldset>
                  <label for="email-institucional">CEP</label>
                  <input
                    placeholder="Exemplo: universidade@email.com"
                    type="text"
                    tabindex="2"
                    ref={cepForm}
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
                    ref={adressForm}
                    id="email-institucional"
                    name="subsidiary-address"
                    required
                  />
                </fieldset>
                <fieldset>
                  <label for="email-institucional">Código no Educacenso/e-MEC</label>
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
                  <label for="email-institucional">E-mail institucional</label>
                  <input
                    placeholder="Exemplo: universidade@email.com"
                    type="email"
                    tabindex="2"
                    ref={institucionalCodeForm}
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
                  <button name="submit" id="contact-submit" type="button" onClick={handleCreateSubsidiary}>
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
                <h3>Informações cadastrais</h3>
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
                  <label for="nome-edital">Celular / Telefone Comercial</label>
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
                    placeholder="Exemplo: XXX.XXX.XXX-XX"
                    ref={socialReasonForm}
                    name="director-CPF"
                    type="text"
                    tabindex="4"
                    required
                    value={CPFDirector}
                    onChange={handleCPFDirectorChange}
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
                  <button name="submit" type="button" id="contact-submit" onClick={handleCreateDirector}>
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
                <h3>Informações cadastrais</h3>
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
                  <label for="nome-edital">Celular / Telefone Comercial</label>
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
                    value={CPFAssistant}
                    onChange={handleCPFAssistantChange}
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
                  <button onClick={handleCreateAssistant} name="submit" type="button" id="contact-submit">
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
