import React, { useEffect } from "react";
import "./cadastro.css";
import NavBar from "../../Components/navBar";
import { UilBell } from "@iconscout/react-unicons";
import { useAppState } from "../../AppGlobal";
import { useState } from "react";
import { useRef } from "react";
import axios from "axios";
import CadastroEdital from "../../Components/Announcement/cadastroEdital"
import { api } from "../../services/axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { handleAuthError } from "../../ErrorHandling/handleError";
import { handleSuccess } from "../../ErrorHandling/handleSuceess";
import { formatCPF } from "../../utils/format-cpf";
import { formatCNPJ } from "../../utils/format-cnpj";
import EntityFormInput from "../Admin/EntityFormInput";
import useForm from "../../hooks/useForm";
import directorInfoValidation from "./validations/director-info-validation";
import { formatTelephone } from "../../utils/format-telephone";
import Swal from 'sweetalert2'
import assistantInfoValidation from "./validations/assistant-info-validation";
import { formatRG } from "../../utils/format-rg";
import { formatCEP } from "../../utils/format-cep";
import subsidiaryInfoValidation from "./validations/subsidiary-info-validation";
import useCep from "../../hooks/useCep";
import Select from "../../Components/Select/Select";
import STATES from "../../utils/enums/states";

export default function CadastroEntidade() {
  const { isShown } = useAppState();
  const [file, setFile] = useState();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const firstForm = useRef(null);
  const secondForm = useRef(null);
  const thirdForm = useRef(null);



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



  // Functions to handle responsible register
  const [[directorInfo], handleDirectorInfo, directorErrors, submitDirector, resetDirector] = useForm({
    name: "",
    email: "",
    phone: "",
    CPF: "",
    password: ""
  }, directorInfoValidation)

  // Functions to handle social assistant register
  const [[assistantInfo], handleAssistantInfo, assistantErrors, submitAssistant, resetAssistant] = useForm({
    name: "",
    phone: "",
    email: "",
    password: "",
    CPF: "",
    RG: "",
    CRESS: "",
  }, assistantInfoValidation)

  async function handleCreateDirector() {
    if (!submitDirector()) {
      return
    }
    const token = localStorage.getItem("token");
    try {
      const response = await api.post("/entities/director/", directorInfo, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      handleSuccess(response, "Diretor cadastrado com sucesso.");
      resetDirector()
    } catch (err) {
      Swal.fire({
        title: 'Erro',
        text: err.response.data.message,
        icon: 'error',
        confirmButtonText: 'Ok'
      })

    }

  }

  async function handleCreateAssistant() {
    if (!submitAssistant()) {
      return
    }
    const token = localStorage.getItem("token");
    try {
      await api.post("/assistant/", assistantInfo, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        title: "Sucesso",
        text: "Assistente cadastrado com sucesso",
        icon: "success"
      })
      resetAssistant()
    } catch (err) {
      Swal.fire({
        title: "Erro",
        text: err.response.data.message,
        icon: "error"
      })
    }
  }
  const [[subsidiaryInfo, setSubsidiaryInfo], handleSubsidiaryInfo, subsidiaryErrors, submitSubsidiary, resetSubsidiary] = useForm({
    name: "",
    email: "",
    password: "",
    CEP: "",
    CNPJ: "",
    educationalInstitutionCode: "",
    socialReason: "",
    address: "",
    addressNumber: "",
    city: "",
    UF: "",
    neighborhood: "",
  }, subsidiaryInfoValidation)
  useCep((address) => {
    setSubsidiaryInfo(address)
  }, subsidiaryInfo.CEP)
  async function handleCreateSubsidiary() {
    if (!submitSubsidiary()) {
      return
    }
    const token = localStorage.getItem("token");
    try {
      const response = await api.post("/entities/subsidiary", subsidiaryInfo, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      handleSuccess(response, "Filial cadastrada com sucesso.");
      resetSubsidiary()
    } catch (err) {
      Swal.fire({
        title: 'Erro',
        text: err.response.data.message,
        icon: 'error',
      })
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
        handleAuthError(err, navigate)
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
              className={`novo-cadastro page-one ${currentPage !== 1 && "hidden-page"
                }`}
            >
              <form id="contact" ref={thirdForm}>
                <h3>Informações cadastrais</h3>
                <h4>Preencha as informações abaixo para realizar o cadastro</h4>
                <EntityFormInput
                  name="CNPJ"
                  label="CNPJ"
                  type="text"
                  placeholder="Exemplo: XX. XXX. XXX/0001-XX"
                  onChange={handleSubsidiaryInfo}
                  value={formatCNPJ(subsidiaryInfo.CNPJ)}
                  error={subsidiaryErrors}
                  autofocus
                />
                <EntityFormInput
                  name="socialReason"
                  label="Razão Social"
                  type="text"
                  onChange={handleSubsidiaryInfo}
                  value={subsidiaryInfo.socialReason}
                  error={subsidiaryErrors}
                />
                <EntityFormInput
                  name="CEP"
                  label="CEP"
                  type="text"
                  maxLength={9}
                  onChange={handleSubsidiaryInfo}
                  value={formatCEP(subsidiaryInfo.CEP)}
                  error={subsidiaryErrors}
                />
                <EntityFormInput
                  name="address"
                  label="Endereço"
                  type="text"
                  onChange={handleSubsidiaryInfo}
                  value={subsidiaryInfo.address}
                  error={subsidiaryErrors}
                />
                <EntityFormInput
                  name="neighborhood"
                  label="Bairro"
                  type="text"
                  onChange={handleSubsidiaryInfo}
                  value={subsidiaryInfo.neighborhood}
                  error={subsidiaryErrors}
                />
                <EntityFormInput
                  name="city"
                  label="Cidade"
                  type="text"
                  onChange={handleSubsidiaryInfo}
                  value={subsidiaryInfo.city}
                  error={subsidiaryErrors}
                />
                <Select
                  name="UF"
                  label="Estado"
                  options={STATES}
                  onChange={handleSubsidiaryInfo}
                  value={subsidiaryInfo.UF}
                  error={subsidiaryErrors}
                />
                <EntityFormInput
                  name="addressNumber"
                  label="Número"
                  type="text"
                  onChange={handleSubsidiaryInfo}
                  value={subsidiaryInfo.addressNumber}
                  error={subsidiaryErrors}
                />
                <EntityFormInput
                  name="educationalInstitutionCode"
                  label="Código no Educacenso/e-MEC"
                  type="text"
                  onChange={handleSubsidiaryInfo}
                  value={subsidiaryInfo.educationalInstitutionCode}
                  error={subsidiaryErrors}
                />
                <EntityFormInput
                  name="email"
                  label="Email Institucional"
                  type="text"
                  onChange={handleSubsidiaryInfo}
                  value={subsidiaryInfo.email}
                  error={subsidiaryErrors}
                />
                <EntityFormInput
                  name="password"
                  label="Senha"
                  type="password"
                  onChange={handleSubsidiaryInfo}
                  value={subsidiaryInfo.password}
                  error={subsidiaryErrors}
                />

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
              className={`novo-cadastro page-one ${currentPage !== 1 && "hidden-page"
                }`}
            >
              <form id="contact" >
                <h3>Informações cadastrais</h3>
                <h4>Preencha as informações abaixo para realizar o cadastro</h4>
                <EntityFormInput
                  name="name"
                  label="Nome"
                  placeholder="Exemplo: João Carlos"
                  type="text"
                  onChange={handleDirectorInfo}
                  value={directorInfo.name}
                  error={directorErrors}
                  autofocus
                />
                <EntityFormInput
                  name="email"
                  label="Email"
                  placeholder="Exemplo: responsável@email.com"
                  type="text"
                  onChange={handleDirectorInfo}
                  value={directorInfo.email}
                  error={directorErrors}
                />
                <EntityFormInput
                  name="phone"
                  label="Celular/Telefone comercial"
                  placeholder="(XX) XXXXX-XXXX"
                  type="tel"
                  onChange={handleDirectorInfo}
                  value={formatTelephone(directorInfo.phone)}
                  error={directorErrors}
                />
                <EntityFormInput
                  name="CPF"
                  label="CPF"
                  placeholder="Exemplo: XXX.XXX.XXX-XX"
                  type="text"
                  onChange={handleDirectorInfo}
                  value={formatCPF(directorInfo.CPF)}
                  error={directorErrors}
                />
                <EntityFormInput
                  name="password"
                  placeholder="Digite sua senha"
                  label="Senha"
                  type="password"
                  onChange={handleDirectorInfo}
                  value={directorInfo.password}
                  error={directorErrors}
                />

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
              className={`novo-cadastro page-one ${currentPage !== 1 && "hidden-page"
                }`}
            >
              <form id="contact" ref={secondForm}>
                <h3>Informações cadastrais</h3>
                <h4>Preencha as informações abaixo para realizar o cadastro</h4>
                <EntityFormInput
                  label="Nome"
                  name="name"
                  type="text"
                  placeholder="Exemplo: João Carlos"
                  onChange={handleAssistantInfo}
                  value={assistantInfo.name}
                  error={assistantErrors}
                  autofocus
                />
                <EntityFormInput
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Exemplo: assistente@email.com"
                  onChange={handleAssistantInfo}
                  value={assistantInfo.email}
                  error={assistantErrors}
                />
                <EntityFormInput
                  label="Celular"
                  name="phone"
                  type="text"
                  placeholder="Exemplo: (XX) XXXXX-XXXX"
                  onChange={handleAssistantInfo}
                  value={formatTelephone(assistantInfo.phone)}
                  error={assistantErrors}
                />
                <EntityFormInput
                  label="CPF"
                  name="CPF"
                  type="text"
                  placeholder="Exemplo:XXX.XXX.XXX-XX"
                  onChange={handleAssistantInfo}
                  value={formatCPF(assistantInfo.CPF)}
                  error={assistantErrors}
                />
                <EntityFormInput
                  label="RG"
                  name="RG"
                  type="text"
                  placeholder="Exemplo: AB-XX.XXX.XXX"
                  onChange={handleAssistantInfo}
                  value={formatRG(assistantInfo.RG)}
                  error={assistantErrors}
                />
                <EntityFormInput
                  label="CRESS"
                  name="CRESS"
                  type="text"
                  onChange={handleAssistantInfo}
                  value={assistantInfo.CRESS}
                  error={assistantErrors}
                />
                <EntityFormInput
                  label="Senha"
                  name="password"
                  type="password"
                  onChange={handleAssistantInfo}
                  value={assistantInfo.password}
                  error={assistantErrors}
                />
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
