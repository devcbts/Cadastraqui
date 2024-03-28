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


    setCurrentPage((prevPage) => {
      if (prevPage === 1) {
        return 2;
      }
      if (prevPage === 2) return 3;
      return 1; // Default to page 1 for all other cases
    });

  }
  function onChangeInput(event) {
    const { name, value } = event.target;
    setCurrentRegisterEntity(prevState => ({
      ...prevState,
      [name]: value
    }));
    console.log('====================================');
    console.log(currentRegisterEntity);
    console.log('====================================');
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
    formData.append('name', currentRegisterEntity.name);
    formData.append('email', currentRegisterEntity.email);
    formData.append('password', currentRegisterEntity.password);
    formData.append('CNPJ', currentRegisterEntity.CNPJ);
    formData.append('socialReason', currentRegisterEntity.socialReason);
    formData.append('CEP', currentRegisterEntity.CEP);
    formData.append('address', currentRegisterEntity.address);
    formData.append('educationalInstitutionCode', currentRegisterEntity.educationalInstitutionCode);

    try {
      const response = await api.post("/entities", {
        name: currentRegisterEntity.name,
        email: currentRegisterEntity.email,
        password: currentRegisterEntity.password,
        CNPJ: currentRegisterEntity.CNPJ,
        socialReason: currentRegisterEntity.socialReason,
        CEP: currentRegisterEntity.CEP,
        address: currentRegisterEntity.address,
        educationalInstitutionCode: currentRegisterEntity.educationalInstitutionCode,
        role: 'ENTITY'
      }, {
        headers: {
          "Authorization": `Bearer ${token}` // Incluindo o token no cabeçalho
        }
      });

      console.log(response.data);
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
  return (
    <div className="container">
      <div className="section-nav">
        <NavBarAdmin></NavBarAdmin>
      </div>
      <div className={`editais ${isShown ? "hidden-menu" : ""}`}>
        <div className="upper">
          <h1>Cadastrar Entidade</h1>
        </div>
        <div className="container-cadastros" style={{width: currentPage !== 3 ? '70%' : '0'}}>
          {currentPage !== 3 &&

            < div  id="first-register-entity" className={`novo-cadastro page-one `}>
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
                    name="name" // Ajuste para corresponder à chave do estado
                    onChange={onChangeInput}
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
                    name="email" // Ajuste para corresponder à chave do estado
                    onChange={onChangeInput}

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
                    name="CNPJ" // Ajuste para corresponder à chave do estado
                    onChange={onChangeInput}

                  />
                </fieldset>
                <fieldset>
                  <label for="nome-edital">Razão social</label>
                  <input
                    placeholder=""
                    ref={socialReasonForm}
                    type="text"
                    tabindex="4"
                    name="socialReason" // Ajuste para corresponder à chave do estado
                    onChange={onChangeInput}

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
                    onChange={onChangeInput}
                    name="password"
                  ></input>
                  <input type="checkbox" onClick={() => myFunction()} />
                  Mostrar senha
                </fieldset>

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
                <fieldset>
                  <label for="nome-edital">Endereço</label>
                  <input
                    placeholder=""
                    ref={adressForm}
                    type="text"
                    tabindex="4"
                    required
                    onChange={onChangeInput}
                    name="address" // Ajuste para corresponder à chave do estado
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
                    onChange={onChangeInput}
                    name="CEP" // Ajuste para corresponder à chave do estado
                  />
                </fieldset>



                <fieldset>
                  <label for="">Código institucional</label>
                  <input
                    placeholder=""
                    ref={institucionalCodeForm}
                    type="text"
                    tabindex="4"
                    required
                    onChange={onChangeInput}
                    name="educationalInstitutionCode" // Ajuste para corresponder à chave do estado
                  />
                </fieldset>

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

        
        <div id="contact" style={{ width: currentPage === 3 ? '70%' : '0', height: '600px', padding: '10px'}}>


          <div
            id="first-register-entity"
            className={`novo-cadastro  page-one ${currentPage !== 3 && "hidden-page"
              } }` } style={{flexDirection:'column', padding: '10px'}}
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
