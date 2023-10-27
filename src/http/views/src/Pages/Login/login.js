import React from "react";
import { useState, useRef } from "react";
import "./login.css";
import logo from "../../Assets/Prancheta 3@300x-8.png";
import videoBg from "../../Assets/bg-school-vid.mp4";
import { UilUserCircle } from "@iconscout/react-unicons";
import { UilLock } from "@iconscout/react-unicons";
import { UilGoogle } from "@iconscout/react-unicons";
import { useAuth } from "../../context/auth";
import { UilAngleLeft } from "@iconscout/react-unicons";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useAuth;

  function handleSingIn() {
    signIn({ email, password });
  }

  const passwordForm = useRef(null);
  const firstForm = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const responsavelRef = useRef(null);
  const candidatoRef = useRef(null);
  const [numDependentes, setNumDependentes] = useState(0);

  function CadastroComponent({ i }) {
    return (
      <div className="dependente-info">
        <h2>{i}.1) Nome civil completo</h2>
        <input
          type="text"
          id={`nome-${i}`}
          placeholder="Exemplo: Jean Carlo do Amaral"
        />
        <h2>{i}.2) Data de nascimento</h2>
        <input type="date" id={`data-${i}`} />
        <h2>{i}.3) CPF</h2>
        <input
          type="text"
          id={`cpf-${i}`}
          placeholder="Exemplo: Jean Carlo do Amaral"
        />
      </div>
    );
  }

  function CadastroDependentes({ num }) {
    let components = [];
    for (let i = 1; i <= num; i++) {
      components.push(<CadastroComponent key={i} i={i} />);
    }
    return components;
  }

  function handlePageChange() {
    if (firstForm.current.checkValidity()) {
      setCurrentPage((prevPage) => {
        if (prevPage === 1) return 2;
        if (prevPage === 2) return 3;
        if (prevPage === 3) return 4;
        if (prevPage === 4 && responsavelRef.current.checked) return 5;
        if (prevPage === 4 && candidatoRef.current.checked) return 6;
        if (prevPage === 5) return 7;
      });
    } else {
      alert("Preencha os campos exigidos!");
    }
  }
  return (
    <div className="login-container">
      <div id="object-one">
        <video className="video-header" src={videoBg} autoPlay loop muted />
      </div>

      <div id="object-two"></div>

      <div className="login-box">
        <div className="login-logo">
          <img src={logo}></img>
        </div>
        <div className="text-login">
          <h1>CADASTRO</h1>

          <div
            className={`info-user-sign ${currentPage !== 1 && "hidden-page"}`}
          >
            <form ref={firstForm}>
              <div>
                <label for="nome">
                  <h2 className="info-cadastrado">Nome civil completo</h2>
                </label>
                <input
                  type="text"
                  id="nome"
                  placeholder="Exemplo: Jean Carlo do Amaral"
                ></input>
              </div>
              <div>
                <label for="nome">
                  <h2 className="info-cadastrado">CPF</h2>
                </label>
                <input
                  type="text"
                  id="nome"
                  placeholder="Exemplo: XXX.XXX.XXX-XX"
                ></input>
              </div>
              <div className="info-dependente">
                <label for="nome">
                  <h2 className="info-cadastrado">Data de nascimento</h2>
                </label>
                <input type="date" id="nome" value="2003-10-24"></input>
              </div>
              <div>
                <label for="nome">
                  <h2 className="info-cadastrado">Telefone</h2>
                </label>
                <input
                  type="text"
                  id="nome"
                  placeholder="Exemplo: +55 (35) 9 8820-7198"
                ></input>
              </div>
              <div className="btn-entrar" onClick={() => handlePageChange()}>
                <a>Próximo</a>
              </div>
            </form>
          </div>

          <div
            className={`cadastro-second ${currentPage !== 2 && "hidden-page"}`}
          >
            <h2>Cadastre seu email e senha </h2>
            <form ref={firstForm}>
              <div className="user-login mail">
                <label for="usermail">
                  <UilUserCircle size="40" color="white" />
                </label>
                <input type="email" id="usermail" placeholder="Email"></input>
              </div>
              <div className="user-login password">
                <label for="pass">
                  <UilLock size="40" color="white" />
                </label>
                <input type="password" id="pass" placeholder="Senha"></input>
              </div>
              <button className="login-btn" type="button">
                <div className="btn-entrar" onClick={() => handlePageChange()}>
                  <a>Próximo</a>
                </div>
              </button>

              <div className="btn-next-back" onClick={() => handlePageChange()}>
                <a>
                  <UilAngleLeft size="30"></UilAngleLeft>
                </a>
              </div>
            </form>
          </div>

          <div
            className={`info-user-sign ${currentPage !== 3 && "hidden-page"}`}
          >
            <form ref={firstForm}>
              <div>
                <h2 className="text-form">
                  Insira seu endereço para prosseguir
                </h2>
                <label for="nome">
                  <h2 className="info-cadastrado">CEP</h2>
                </label>
                <input
                  type="number"
                  id="nome"
                  placeholder="Exemplo: Jean Carlo do Amaral"
                ></input>
                <label for="nome">
                  <h2 className="info-cadastrado">Endereço completo</h2>
                </label>
                <input
                  type="text"
                  id="nome"
                  placeholder="Exemplo: Jean Carlo do Amaral"
                ></input>
              </div>
              <button className="login-btn" type="button">
                <div className="btn-entrar" onClick={() => handlePageChange()}>
                  <a>Próximo</a>
                </div>
              </button>
            </form>
          </div>

          <div
            className={`cadastro-subperfil ${
              currentPage !== 4 && "hidden-page"
            }`}
          >
            <div>
              <h2>
                Para concluir o cadastro básico e poder acessar o sistema
                selecione se você é o responsável legal por filhos menores ou se
                é o próprio candidato (maior de idade).
              </h2>
              <fieldset>
                <div className="radio-select">
                  <div className="radio-input">
                    <label for="huey">
                      <h2>Responsável Legal</h2>
                    </label>
                    <input
                      type="radio"
                      id="huey"
                      name="drone"
                      value="responsavel"
                      ref={responsavelRef}
                    />
                  </div>

                  <div className="radio-input">
                    <label for="dewey">
                      <h2>Candidato</h2>
                    </label>
                    <input
                      type="radio"
                      id="dewey"
                      name="drone"
                      value="candidato"
                      ref={candidatoRef}
                    />
                  </div>
                  <div className="radio-input">
                    <label for="confirm-read">
                      <h3>Li e concordo com os termos LGPD</h3>
                    </label>
                    <input type="checkbox" id="confirm-read"></input>
                  </div>
                </div>
              </fieldset>
              <div className="btn-confirmar" onClick={() => handlePageChange()}>
                <a>Concluir</a>
              </div>
            </div>
          </div>

          <div
            className={`cadastro-subperfil ${
              currentPage !== 5 && "hidden-page"
            }`}
          >
            <div>
              <h2 style={{ marginTop: "1rem" }}>
                Deseja cadastrar quantos dependentes para concorrer a bolsas de
                estudos?
              </h2>
            </div>

            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="radio-input number-children">
                <label htmlFor={`num-${i + 1}`}>
                  <h2>{i + 1}</h2>
                </label>
                <input
                  type="radio"
                  id={`num-${i + 1}`}
                  name="child"
                  value={i + 1}
                  onChange={(e) => setNumDependentes(parseInt(e.target.value))}
                />
              </div>
            ))}

            <div className="btn-confirmar" onClick={() => handlePageChange()}>
              <a>Continuar</a>
            </div>
          </div>

          <div
            className={`create-subperfil ${currentPage !== 7 && "hidden-page"}`}
          >
            <CadastroDependentes num={numDependentes} />
          </div>
        </div>
      </div>
    </div>
  );
}
