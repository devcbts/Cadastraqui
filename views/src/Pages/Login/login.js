import React from "react";
import { useState, useRef } from "react";
import "./login.css";
import logo from "../../Assets/Prancheta 3@300x-8.png";
import videoBg from "../../Assets/bg-school-vid.mp4";
import { UilUserCircle } from "@iconscout/react-unicons";
import { UilLock } from "@iconscout/react-unicons";
import { UilGoogle } from "@iconscout/react-unicons";
import { UilAngleLeft } from "@iconscout/react-unicons";
import { api } from "../../services/axios";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router";


export default function Login() {
  const [currentPage, setCurrentPage] = useState(0);
  const responsavelRef = useRef(null);
  const candidatoRef = useRef(null);
  const [numDependentes, setNumDependentes] = useState(0);

  const [responsibleId, setResponsibleId] = useState();
  const [typeOfUser, setTypeOfUser] = useState()

  const formRef1 = useRef(null);
  const formRef2 = useRef(null);
  const formRef3 = useRef(null);
  const formRef4 = useRef(null);
  const formRef5 = useRef(null);
  const formRef6 = useRef(null);
  const formRef7 = useRef(null);

  const loginForm = useRef(null);

  function handlePageChange() {
    let currentForm;

    switch (currentPage) {
      case 0:
        currentForm = formRef1;
        break;
      case 1:
        currentForm = formRef2;
        break;
      case 2:
        currentForm = formRef3;
        break;
      case 3:
        currentForm = formRef4;
        break;
      case 4:
        currentForm = formRef5;
        break;
      case 5:
        currentForm = formRef6;
        break;
      case 6:
        currentForm = formRef7;
        break;
      default:
        currentForm = formRef1;
    }

    if (currentForm.current.checkValidity()) {
      setCurrentPage((prevPage) => {
        if (prevPage === 0) return 1;
        if (prevPage === 1) return 2;
        if (prevPage === 2) return 3;
        if (prevPage === 3) return 4;
        if (prevPage === 4 && responsavelRef.current.checked) return 5;
        if (prevPage === 4 && candidatoRef.current.checked) return 6;
        if (prevPage === 5) return 7;
      });
    } else {
      alert("Preencha os campos exigidos!")
    }
  }

  function CadastroComponent({ i }) {
    return (
      <div className="dependente-info">
        <h2>{i}.1) Nome civil completo</h2>
        <input
          type="text"
          id={`nome-${i}`}
          name={`name-${i}`}
          placeholder="Exemplo: Jean Carlo do Amaral"
        />
        <h2>{i}.2) Data de nascimento</h2>
        <input type="date" id={`data-${i}`} name={`birthDate-${i}`} />
        <h2>{i}.3) CPF</h2>
        <input
          type="text"
          id={`cpf-${i}`}
          name={`CPF-${i}`}
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

  function handleBackChange() {
    setCurrentPage((prevPage) => {
      if (prevPage === 1) return 0;
      if (prevPage === 2) return 1;
      if (prevPage === 3) return 2;
      if (prevPage === 4) return 3;
      if (prevPage === 5) return 4;
      if (prevPage === 6) return 4;
      if (prevPage === 7) return 5;
    });
  }

  function handlePageToRegister() {
    setCurrentPage(1)
  }

  // BackEnd Functions 
  const { SignIn } = useAuth()
  const navigate  = useNavigate()

  async function login() {
    // Pega o valor do email e password dos inputs 
    const loginFormElement = loginForm.current
    
    if(loginFormElement.checkValidity()) {
      const email = loginFormElement.querySelector('input[id="usermail"]').value
      const password = loginFormElement.querySelector('input[id="pass"]').value

      const credentials = { email, password }

      // Loga na aplicação
      const role = await SignIn(credentials)


      if(role ==='CANDIDATE' || role === 'RESPONSIBLE') {
        navigate('/candidato/home')
      } else if(role === 'ENTITY') {
        navigate('/entidade/home')
      } else if(role === 'ASSISTANT') {
        navigate('/assistente/home')
      } else if(role === 'ENTITY') {
        navigate('/entidade/home')
      }else if(role === 'ADMIN'){
        navigate('/admin/cadastro')
      }
    } else {
      alert("Preencha os campos exigidos!")
    }
  }

  async function handleRegister() {
    // Acesse o elemento do formulário usando a referência
    const firstFormElement = formRef2.current
    const credentialsFormElement = formRef3.current
    const addressFormElement = formRef4.current

    // Acesse os campos do formulário pelo nome
    const name = firstFormElement.querySelector('input[name="name"]').value
    const CPF = firstFormElement.querySelector('input[name="CPF"]').value
    const birthDate = firstFormElement.querySelector('input[name="birthDate"]').value
    const phone = firstFormElement.querySelector('input[name="phone"]').value
    const email = credentialsFormElement.querySelector('input[id="usermail"]').value
    const password = credentialsFormElement.querySelector('input[id="pass"]').value

    const address = addressFormElement.querySelector('input[name="address"]').value
    const CEP = addressFormElement.querySelector('input[name="CEP"]').value
    const UF = addressFormElement.querySelector('input[name="UF"]').value
    const city = addressFormElement.querySelector('input[name="city"]').value
    const neighborhood = addressFormElement.querySelector('input[name="neighborhood"]').value
    const addressNumber = addressFormElement.querySelector('input[name="addressNumber"]').value
    
    const registerInfo = {
      name,
      CPF,
      birthDate,
      phone,
      email,
      password,
      address,
      CEP,
      UF,
      city,
      neighborhood,
      addressNumber: Number(addressNumber)
    }

    if(typeOfUser === 'candidate') {
      api.post('/candidates', registerInfo)
      .then(() => { alert('Cadastro realizado com sucesso !')
      setCurrentPage(0)
    })
      .catch((err) => {
        alert(`${err.response.data.message}`)
      })
    } else if(typeOfUser === 'responsible') {
      api.post('/responsibles', registerInfo)
      .then(response => {alert('Cadastro realizado com sucesso !')
        setResponsibleId(response.data.responsible_id)
        handlePageChange()
      })
      .catch((err) => alert(`${err.response.data.message}`))  
    }
  }

  async function handleRegisterDependent() {
    let names =[]
    let CPFs = []
    let birthDates = []

    for (let i = 1; i <= numDependentes; i++) {
      const name = document.querySelector(`input[name="name-${i}"]`).value
      const CPF = document.querySelector(`input[name="CPF-${i}"]`).value
      const birthDate = document.querySelector(`input[name="birthDate-${i}"]`).value
      names.push(name)
      CPFs.push(CPF)
      birthDates.push(birthDate)
    }

    
      for (let i = 0; i < numDependentes; i++) {
        const data = {
          CPF:CPFs[i],
          birthDate: new Date(birthDates[i]),
          name: names[i],
          responsible_id:responsibleId
        }

        await api.post('/responsibles/legal-dependents', data)
        .then(() => alert('Cadastro Concluído com sucesso !'))
        .catch((error) => {console.log(error)
          alert(`${error.response.data.message}`)
        })
      }
      setCurrentPage(0)
    
    
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
          <h1>{currentPage === 0 ? 'LOGIN': 'CADASTRO'}</h1>

          <div
            className={`cadastro-second ${currentPage !== 0 && "hidden-page"}`}
          >
            <h2>Digite seu email e senha </h2>
            <form ref={loginForm}>
              <div className="user-login mail">
                <label for="usermail">
                  <UilUserCircle size="40" color="white" />
                </label>
                <input
                  type="email"
                  id="usermail"
                  placeholder="Email"
                  required
                ></input>
              </div>
              <div className="user-login password">
                <label for="pass">
                  <UilLock size="40" color="white" />
                </label>
                <input
                  type="password"
                  id="pass"
                  placeholder="Senha"
                  required
                ></input>
              </div>
              <button className="login-btn" type="button" onClick={login}>
                <div className="btn-entrar">
                  <a>Entrar</a>
                </div>
              </button>
              <button className="login-btn" type="button">
                <div className="btn-entrar" onClick={handlePageToRegister}>
                  <a>Registrar</a>
                </div>
              </button>
              <button className="login-btn" type="button">
                <div className="btn-google">
                  <UilGoogle size="30" color="#1F4B73"></UilGoogle>
                </div>
              </button>
            </form>
          </div>

          <div
            className={`info-user-sign ${currentPage !== 1 && "hidden-page"}`}
          >
            <form ref={formRef2}>
              <div>
                <label for="nome">
                  <h2 className="info-cadastrado">Nome civil completo</h2>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Exemplo: Jean Carlo do Amaral"
                  required
                ></input>
              </div>
              <div>
                <label for="nome">
                  <h2 className="info-cadastrado">CPF</h2>
                </label>
                <input
                  type="text"
                  id="CPF"
                  name="CPF"
                  placeholder="Exemplo: XXX.XXX.XXX-XX"
                  required
                ></input>
              </div>
              <div className="info-dependente">
                <label for="nome">
                  <h2 className="info-cadastrado">Data de nascimento</h2>
                </label>
                <input type="date" name="birthDate" id="nome" placeholder="2003-10-24"></input>
              </div>
              <div>
                <label for="nome">
                  <h2 className="info-cadastrado">Telefone</h2>
                </label>
                <input
                  type="text"
                  id="nome"
                  name="phone"
                  placeholder="Exemplo: +55 (35) 9 8820-7198"
                  required
                ></input>
              </div>
              <div className="btn-entrar" onClick={() => handlePageChange()}>
                <a>Próximo</a>
              </div>
              <div>
                <div className="go-back">
                  <UilAngleLeft
                    size="30"
                    color="#1F4B73"
                    className="back"
                    onClick={() => handleBackChange()}
                  ></UilAngleLeft>
                </div>
              </div>
            </form>
          </div>

          <div
            className={`cadastro-second ${currentPage !== 2 && "hidden-page"}`}
          >
            <h2>Cadastre seu email e senha </h2>
            <form ref={formRef3}>
              <div className="user-login mail">
                <label for="usermail">
                  <UilUserCircle size="40" color="white" />
                </label>
                <input
                  type="email"
                  id="usermail"
                  placeholder="Email"
                  required
                ></input>
              </div>
              <div className="user-login password">
                <label for="pass">
                  <UilLock size="40" color="white" />
                </label>
                <input
                  type="password"
                  id="pass"
                  placeholder="Senha"
                  required
                ></input>
              </div>
              <button className="login-btn" type="button">
                <div className="btn-entrar" onClick={() => handlePageChange()}>
                  <a>Próximo</a>
                </div>
              </button>

              <div>
                <div className="go-back">
                  <UilAngleLeft
                    size="30"
                    color="#1F4B73"
                    className="back"
                    onClick={() => handleBackChange()}
                    style={{ marginTop: 1 + "rem" }}
                  ></UilAngleLeft>
                </div>
              </div>
            </form>
          </div>

          <div
            className={`info-user-sign ${currentPage !== 3 && "hidden-page"}`}
          >
            <form ref={formRef4}>
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
                  name="CEP"
                  placeholder="Exemplo: Jean Carlo do Amaral"
                ></input>
                 <label for="nome">
                  <h2 className="info-cadastrado">UF</h2>
                </label>
                <input
                  type="text"
                  id="nome"
                  name="UF"
                  placeholder="Exemplo: Jean Carlo do Amaral"
                ></input>
                <label for="nome">
                  <h2 className="info-cadastrado">Cidade</h2>
                </label>
                <input
                  type="text"
                  id="nome"
                  name="city"
                  placeholder="Exemplo: Jean Carlo do Amaral"
                ></input>
                <label for="nome">
                  <h2 className="info-cadastrado">Bairro</h2>
                </label>
                <input
                  type="text"
                  id="nome"
                  name="neighborhood"
                  placeholder="Exemplo: Jean Carlo do Amaral"
                ></input>
                <label for="nome">
                  <h2 className="info-cadastrado">Número do Endereço</h2>
                </label>
                <input
                  type="text"
                  id="nome"
                  name="addressNumber"
                  placeholder="Exemplo: Jean Carlo do Amaral"
                ></input>
                <label for="nome">
                  <h2 className="info-cadastrado">Endereço completo</h2>
                </label>
                <input
                  type="text"
                  id="nome"
                  name="address"
                  placeholder="Exemplo: Jean Carlo do Amaral"
                  required
                ></input>
              </div>
              <button className="login-btn" type="button">
                <div className="btn-entrar" onClick={() => handlePageChange()}>
                  <a>Próximo</a>
                </div>
              </button>
              <div>
                <div className="go-back">
                  <UilAngleLeft
                    size="30"
                    color="#1F4B73"
                    className="back"
                    onClick={() => handleBackChange()}
                    style={{ marginTop: 1 + "rem" }}
                  ></UilAngleLeft>
                </div>
              </div>
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
              <form ref={formRef5}>
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
                      onClick={() => {setTypeOfUser('responsible')}}
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
                      onClick={() => {setTypeOfUser('candidate')}}
                    />
                  </div>
                  <div className="radio-input">
                    <label for="confirm-read">
                      <h3>Li e concordo com os termos LGPD</h3>
                    </label>
                    <input type="checkbox" id="confirm-read" required></input>
                  </div>
                </div>
              </form>
              <div className="btn-confirmar" onClick={() => handleRegister()}>
                <a>Concluir</a>
              </div>
              <div>
                <div className="go-back">
                  <UilAngleLeft
                    size="30"
                    color="#1F4B73"
                    className="back"
                    onClick={() => handleBackChange()}
                    style={{ marginTop: 1 + "rem" }}
                  ></UilAngleLeft>
                </div>
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

            <form ref={formRef6}>
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
                    onChange={(e) =>
                      setNumDependentes(parseInt(e.target.value))
                    }
                  />
                </div>
              ))}
            </form>

            <div className="btn-confirmar" onClick={() => handlePageChange()}>
              <a>Continuar</a>
            </div>
            <div>
              <div className="go-back">
                <UilAngleLeft
                  size="30"
                  color="#1F4B73"
                  className="back"
                  onClick={() => handleBackChange()}
                  style={{ marginTop: 1 + "rem" }}
                ></UilAngleLeft>
              </div>
            </div>
          </div>

          <div
            className={`create-subperfil ${currentPage !== 7 && "hidden-page"}`}
          >
            <CadastroDependentes num={numDependentes} />
            <button className="login-btn finish" type="button" onClick={handleRegisterDependent}>
              <div className="btn-entrar">
                <a>Concluir</a>
              </div>
            </button>
            <div>
              <div className="go-back">
                <UilAngleLeft
                  size="30"
                  color="#1F4B73"
                  className="back"
                  onClick={() => handleBackChange()}
                  style={{ marginTop: 1 + "rem" }}
                ></UilAngleLeft>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
