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
import { api } from "../../services/axios";
import EntityFormInput from "./EntityFormInput";
import useForm from "../../hooks/useForm";
import { formatCEP } from "../../utils/format-cep";
import { formatCNPJ } from "../../utils/format-cnpj";
import useCnpj from "../../hooks/useCnpj";
import entityInfoValidation from "./validations/entity-info-validation";

export default function NewEntidade() {
  const { isShown } = useAppState();
  const [file, setFile] = useState();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const firstForm = useRef(null);


  const [[entityInfo, setEntityInfo], handleEntityInfo, entityErrors, , submitEntity] = useForm({
    name: "",
    email: "",
    password: "",
    role: "",
    CNPJ: "",
    logo: "",
    socialReason: "",
    CEP: "",
    address: "",
    addressNumber: "",
    neighborhood: "",
    city: "",
    educationalInstitutionCode: "",
  }, entityInfoValidation);

  function handlePageChange() {


    setCurrentPage((prevPage) => {
      if (prevPage === 1) {
        if (submitEntity("name", "email", "password", "socialReason", "CNPJ")) {
          return 2;
        }
      }
      if (prevPage === 2) {
        if (submitEntity("address", "addressNumber", "city", "neighborhood", "CEP", "educationalInstitutionCode")) {
          return 3;
        }
      };
      return 1; // Default to page 1 for all other cases
    });

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
  async function handleSubmit(event) {
    event.preventDefault();

    // Recuperando o token armazenado
    const token = localStorage.getItem("token");

    // Endereço da API para enviar os dados do registro da entidade


    // Preparando os dados para envio
    const formData = new FormData();
    formData.append('name', entityInfo.name);
    formData.append('email', entityInfo.email);
    formData.append('password', entityInfo.password);
    formData.append('CNPJ', entityInfo.CNPJ);
    formData.append('socialReason', entityInfo.socialReason);
    formData.append('CEP', entityInfo.CEP);
    formData.append('address', entityInfo.address);
    formData.append('educationalInstitutionCode', entityInfo.educationalInstitutionCode);

    try {
      const response = await api.post("/entities", {
        ...entityInfo,
        role: 'ENTITY'
      }, {
        headers: {
          "Authorization": `Bearer ${token}` // Incluindo o token no cabeçalho
        }
      });

      setCurrentPage(3)
      // Processamento adicional aqui, como redirecionamento ou atualização de estado
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Tratamento de erro de autenticação aqui
        try {
          const newToken = await api.patch("/token/refresh");
          localStorage.setItem("token", newToken);
          // Tente reenviar o formulário após atualizar o token
        } catch (refreshError) {
          console.error(refreshError);
          // Tratamento adicional de erro
        }
      } else {
        // Tratamento de outros erros de rede ou do servidor
        console.error("Erro ao enviar dados: ", error);
      }
    }
  }
  useCnpj((companyData) => {
    const { street, number, district, city, zip } = companyData.address
    setEntityInfo((prevState) => {
      return (
        {
          ...prevState,
          address: street,
          addressNumber: number,
          neighborhood: district,
          city,
          CEP: zip,
          name: companyData.name,
          email: companyData.emails[0].address ?? ""
        })
    })
  }, entityInfo.CNPJ)
  return (
    <div className="container">
      <div className="section-nav">
        <NavBarAdmin></NavBarAdmin>
      </div>
      <div className={`editais ${isShown ? "hidden-menu" : ""}`}>
        <div className="upper">
          <h1>Cadastrar Entidade</h1>
        </div>
        <div className="container-cadastros" style={{ width: currentPage !== 3 ? '70%' : '0' }}>
          {currentPage !== 3 &&

            < div id="first-register-entity" className={`novo-cadastro page-one `}>
              <form form
                id="contact"
                ref={firstForm}
                action=""
                onSubmit={handleSubmit}

              >

                {currentPage === 1 &&

                  <div>
                    <div className="page">
                      <h1>1</h1>
                    </div>
                    <h3>Informações de cadastro</h3>
                    <h4>Preencha as informações abaixo para realizar o cadastro</h4>
                    <EntityFormInput
                      label="CNPJ"
                      name="CNPJ"
                      placeholder="Exemplo: XX. XXX. XXX/0001-XX"
                      className="nome-entidade"
                      required
                      value={formatCNPJ(entityInfo.CNPJ)}
                      onChange={handleEntityInfo}
                      autofocus
                      type="text"
                      error={entityErrors}
                    />
                    <EntityFormInput
                      label="Nome da Instituição"
                      name="name"
                      placeholder="Exemplo: Unicamp"
                      className="nome-entidade"
                      required
                      value={entityInfo.name}
                      onChange={handleEntityInfo}
                      type="text"
                      error={entityErrors}

                    />
                    <EntityFormInput
                      label="Email Institucional"
                      name="email"
                      placeholder="Exemplo: universidade@email.com"
                      className="nome-entidade"
                      required
                      value={entityInfo.email}
                      onChange={handleEntityInfo}
                      type="email"
                      error={entityErrors}

                    />
                    <EntityFormInput
                      label="Razão Social"
                      name="socialReason"
                      placeholder="Razão Social"
                      className="nome-entidade"
                      required
                      value={entityInfo.socialReason}
                      onChange={handleEntityInfo}
                      type="text"
                      error={entityErrors}

                    />

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
                    <EntityFormInput
                      label="Senha"
                      name="password"
                      placeholder="Digite a senha"
                      className="nome-entidade"
                      required
                      value={entityInfo.password}
                      onChange={handleEntityInfo}
                      type="password"
                      error={entityErrors}

                    />


                    <fieldset className="btn-field">
                      <button
                        type="button"
                        name="next"
                        id="contact-submit"
                        onClick={() => handlePageChange()}
                      >
                        Próximo
                        <UilAngleRightB size="20"></UilAngleRightB>
                      </button>
                    </fieldset>
                  </div>}

                {currentPage === 2 &&

                  <div>


                    <div className="page">
                      <h1>2</h1>
                    </div>
                    <h3>Quase lá...</h3>
                    <h4>Somente mais alguns dados para concluirmos</h4>
                    <EntityFormInput
                      label="CEP"
                      name="CEP"
                      placeholder="Exemplo: 12228460"
                      className="nome-entidade"
                      required
                      maxLength={14}
                      value={formatCEP(entityInfo.CEP)}
                      onChange={handleEntityInfo}
                      type="text"
                      error={entityErrors}

                    />
                    <EntityFormInput
                      label="Endereço"
                      name="address"
                      className="nome-entidade"
                      required
                      value={entityInfo.address}
                      onChange={handleEntityInfo}
                      type="text"
                      error={entityErrors}

                    />
                    <EntityFormInput
                      label="Bairro"
                      name="neighborhood"
                      className="nome-entidade"
                      required
                      value={entityInfo.neighborhood}
                      onChange={handleEntityInfo}
                      type="text"
                      error={entityErrors}

                    />
                    <EntityFormInput
                      label="Cidade"
                      name="city"
                      className="nome-entidade"
                      required
                      value={entityInfo.city}
                      onChange={handleEntityInfo}
                      type="text"
                      error={entityErrors}

                    />
                    <EntityFormInput
                      label="Número"
                      name="addressNumber"
                      className="nome-entidade"
                      required
                      value={entityInfo.addressNumber}
                      onChange={handleEntityInfo}
                      type="number"
                      error={entityErrors}

                    />
                    <EntityFormInput
                      label="Código Institucional"
                      name="educationalInstitutionCode"
                      className="nome-entidade"
                      required
                      value={entityInfo.educationalInstitutionCode}
                      onChange={handleEntityInfo}
                      type="text"
                      error={entityErrors}

                    />




                    <fieldset className="btn-field">
                      <button
                        name="submit"
                        type="submit"
                        id="contact-submit"
                        data-submit="...Sending"
                        onClick={(e) => handleSubmit(e)}
                      >
                        Cadastrar
                      </button>
                    </fieldset>
                  </div>

                }
              </form>
              <div />
            </div>
          }


          <div id="contact" style={{ width: currentPage === 3 ? '70%' : '0', height: '600px', padding: '10px' }}>


            <div
              id="first-register-entity"
              className={`novo-cadastro  page-one ${currentPage !== 3 && "hidden-page"
                } }`} style={{ flexDirection: 'column', padding: '10px' }}
            >
              <div className="page">
                <h1>3</h1>
              </div>
              <h3>Cadastro Realizado com sucesso</h3>
              <h4>Abaixo são apresentadas as informações registradas</h4>

              <ul className="registered-data">
                <li>
                  <h2>
                    <span>Nome: </span>
                    {entityInfo.name}
                  </h2>
                </li>
                <li>
                  <h2>
                    <span>Email: </span>
                    {entityInfo.email}
                  </h2>
                </li>
                <li>
                  <h2>
                    <span>Senha: </span>
                    {entityInfo.password}
                  </h2>
                </li>
              </ul>

              <fieldset className="btn-field">
                <button
                  name="submit"
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
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
