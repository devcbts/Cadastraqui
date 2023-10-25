import React from "react";
import { useState } from "react";
import "./login.css";
import logo from "../../Assets/Prancheta 3@300x-8.png";
import videoBg from "../../Assets/bg-school-vid.mp4";
import { UilUserCircle } from "@iconscout/react-unicons";
import { UilLock } from "@iconscout/react-unicons";
import { UilGoogle } from "@iconscout/react-unicons";
import { useAuth } from "../../context/auth";

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { signIn } = useAuth

  function handleSingIn() {
    signIn({email, password})
  }

  return (
    <div className="login-container">
      <div id="object-one">
        <video className="video-header" src={videoBg} autoPlay loop muted />
      </div>

      <div id="object-two"></div>
      {/* <div className="login-box">
        <div className="login-logo">
          <img src={logo}></img>
        </div>
        <div className="text-login">
          <span className="subperfil-number">1</span>
          <div className="info-dependente">
            <label for="nome">
              <h2 className="info-cadastrado">Nome civil completo</h2>
            </label>
            <input
              type="text"
              id="nome"
              placeholder="Exemplo: Jean Carlo do Amaral"
            ></input>
          </div>
          <div className="info-dependente">
            <label for="nome">
              <h2 className="info-cadastrado">Data de nascimento</h2>
            </label>
            <input type="date" id="nome" value="2005-10-24"></input>
          </div>
          <div className="info-dependente">
            <label for="nome">
              <h2 className="info-cadastrado">CPF</h2>
            </label>
            <input
              type="text"
              id="nome"
              placeholder="Exemplo: XXX.XXX.XXX-XX"
            ></input>
          </div>
          <div className="btn-entrar">
            <a href="">Continuar</a>
          </div>
        </div>
      </div> */}

      {/* <div className="login-box">
        <div className="login-logo">
          <img src={logo}></img>
        </div>
        <div className="text-login">
          <h1>SUBPERFIL</h1>
          <div>
            <h2 style={{ marginTop: 1 + "rem" }}>
              Deseja cadastrar quantos dependentes para concorrer a bolsas de
              estudos?
            </h2>
          </div>
          <div className="radio-input number-children">
            <label for="one">
              <h2>1</h2>
            </label>
            <input type="radio" id="one" name="child"></input>
          </div>

          <div className="radio-input number-children">
            <label for="one">
              <h2>2</h2>
            </label>
            <input type="radio" id="one" name="child"></input>
          </div>

          <div className="radio-input number-children">
            <label for="one">
              <h2>3</h2>
            </label>
            <input type="radio" id="one" name="child"></input>
          </div>

          <div className="radio-input number-children">
            <label for="one">
              <h2>4</h2>
            </label>
            <input type="radio" id="one" name="child"></input>
          </div>

          <div className="radio-input number-children">
            <label for="one">
              <h2>5</h2>
            </label>
            <input type="radio" id="one" name="child"></input>
          </div>

          <div className="radio-input number-children">
            <label for="one">
              <h2>6</h2>
            </label>
            <input type="radio" id="one" name="child"></input>
          </div>

          <div className="btn-entrar">
            <a href="">Continuar</a>
          </div>
        </div>
      </div> */}

      <div className="login-box">
        <div className="login-logo">
          <img src={logo}></img>
        </div>
        <div className="text-login">
          <h1>LOGIN</h1>
          <div className="user-login mail">
            <label for="usermail">
              <UilUserCircle size="40" color="white" />
            </label>
            <input type="email" id="usermail" placeholder="Email" onChange={e => setEmail(e.target.value)}></input>
          </div>
          <div className="user-login password">
            <label for="pass">
              <UilLock size="40" color="white" />
            </label>
            <input type="password" id="pass" placeholder="Senha" onChange={e => setPassword(e.target.value)}></input>
          </div>
          <div className="btn-entrar">
            <a href="" onClick={handleSingIn}>Entrar</a>
          </div>
          <div className="btn-entrar">
            <a href="">Cadastrar</a>
          </div>
          <div className="btn-google-login">
            <a href="">
              <UilGoogle size="30" color="#1F4B73"></UilGoogle>
            </a>
          </div>
        </div>
      </div>

      {/*<div className="login-box">
        <div className="login-logo">
          <img src={logo}></img>
        </div>
        <div className="text-login">
          <div>
            <h1>CADASTRO</h1>
            <h2>
              Para concluir o cadastro básico e poder acessar o sistema
              selecione se você é o responsável legal por filhos menores ou se é
              o próprio candidato (maior de idade).
            </h2>
            <fieldset>
              <div className="radio-select">
                <div className="radio-input">
                  <label for="huey">
                    <h2>Responsável Legal</h2>
                  </label>
                  <input type="radio" id="huey" name="drone" value="huey" />
                </div>

                <div className="radio-input">
                  <label for="dewey">
                    <h2>Candidato</h2>
                  </label>
                  <input type="radio" id="dewey" name="drone" value="dewey" />
                </div>
                <div className="radio-input">
                  <label for="confirm-read">
                    <h3>Li e concordo com os termos LGPD</h3>
                  </label>
                  <input type="checkbox" id="confirm-read"></input>
                </div>
              </div>
            </fieldset>
            <div className="btn-confirmar">
              <a>Concluir</a>
            </div>
          </div>
        </div>
  </div>*/}
    </div>
  );
}
