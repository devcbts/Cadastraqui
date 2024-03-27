import React, { useEffect } from "react";
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
import { formatCPF } from "../../utils/format-cpf";
import { calculateAge } from "../../utils/calculate-age";
import Swal from 'sweetalert2';
import { isValidCPF } from "../../utils/validate-cpf";
import { formatCEP } from "../../utils/format-cep";
import { formatTelephone } from "../../utils/format-telephone";
import useForm from "../../hooks/useForm";
import RegisterInput from "./RegisterInput";
import registerInfoValidation from "./validations/register-info-validation";
import getUserAddress from "../../utils/get-user-address";



export default function Login() {
  const [currentPage, setCurrentPage] = useState(0);
  const responsavelRef = useRef(null);
  const candidatoRef = useRef(null);
  const [numDependentes, setNumDependentes] = useState(0);
  const [showLgpdPopup, setShowLgpdPopup] = useState(false);

  const [responsibleId, setResponsibleId] = useState();
  const [typeOfUser, setTypeOfUser] = useState()

  // CPF dinamico
  const [CPFCandidate, setCPFCandidate] = useState('')
  const [CEPCandidate, setCEPCandidate] = useState('')
  const [phoneCandidate, setPhoneCandidate] = useState('')
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
        // Additional step to check age when moving away from page 1
        const birthDate = new Date(currentForm.current['birthDate'].value); // Assuming the input's name is 'birthDate'
        const age = calculateAge(birthDate);
        if (!isValidCPF(registerInfo.CPF)) {
          Swal.fire({
            title: 'Erro!',
            text: 'CPF inválido.',
            icon: 'warning',
            confirmButtonText: 'Ok'
          });
          return; // Prevents the transition to the next page
        }
        if (age < 18) {
          Swal.fire({
            title: 'Erro!',
            text: 'Você deve ter mais de 18 anos para continuar.',
            icon: 'warning',
            confirmButtonText: 'Ok'
          });
          return; // Prevents the transition to the next page
        }
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
      Swal.fire({
        title: 'Erro!',
        text: 'Preencha os campos exigidos.',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
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
  const navigate = useNavigate()

  async function login() {
    // Pega o valor do email e password dos inputs 
    const loginFormElement = loginForm.current

    if (loginFormElement.checkValidity()) {
      const email = loginFormElement.querySelector('input[id="usermail"]').value
      const password = loginFormElement.querySelector('input[id="pass"]').value

      const credentials = { email, password }

      // Loga na aplicação
      const role = await SignIn(credentials)


      if (role === 'CANDIDATE' || role === 'RESPONSIBLE') {
        navigate('/candidato/home')
      } else if (role === 'ENTITY') {
        navigate('/entidade/home')
      } else if (role === 'ASSISTANT') {
        navigate('/assistente/home')
      } else if (role === 'ENTITY') {
        navigate('/entidade/home')
      } else if (role === 'ADMIN') {
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
    const CPF = CPFCandidate;
    const birthDate = firstFormElement.querySelector('input[name="birthDate"]').value
    const phone = firstFormElement.querySelector('input[name="phone"]').value
    const email = credentialsFormElement.querySelector('input[id="usermail"]').value
    const password = credentialsFormElement.querySelector('input[id="pass"]').value

    const address = addressFormElement.querySelector('input[name="address"]').value
    const CEP = addressFormElement.querySelector('input[name="CEP"]').value
    const UF = addressFormElement.querySelector('select[name="UF"]').value;
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
      addressNumber: (addressNumber)
    }

    if (typeOfUser === 'candidate') {
      api.post('/candidates', registerInfo)
        .then(() => {
          alert('Cadastro realizado com sucesso !')
          setCurrentPage(0)
        })
        .catch((err) => {
          console.log(err)
          alert(`${err.response.data.message}`)
        })
    } else if (typeOfUser === 'responsible') {
      api.post('/responsibles', registerInfo)
        .then(response => {
          alert('Cadastro realizado com sucesso !')
          setResponsibleId(response.data.responsible_id)
          handlePageChange()
        })
        .catch((err) => console.log(err))
    }
  }

  async function handleRegisterDependent() {
    let names = []
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
        CPF: CPFs[i],
        birthDate: new Date(birthDates[i]),
        name: names[i],
        responsible_id: responsibleId
      }

      await api.post('/responsibles/legal-dependents', data)
        .then(() => alert('Cadastro Concluído com sucesso !'))
        .catch((error) => {
          console.log(error)
          alert(`${error.response.data.message}`)
        })
    }
    setCurrentPage(0)


  }
  const toggleLgpdPopup = () => {
    setShowLgpdPopup(!showLgpdPopup);
  };

  const [registerInfo, handleRegisterInfoChange, registerErrors, , setRegisterFields] = useForm({
    name: '',
    CPF: '',
    birthDate: '',
    phone: '',
    email: '',
    password: '',
    address: '',
    CEP: '',
    UF: '',
    city: '',
    neighborhood: '',
    addressNumber: ''
  }, registerInfoValidation)

  useEffect(() => {
    const cep = registerInfo.CEP.replace(/\D/g, '')
    console.log('CEP', cep)
    const updateAddress = async () => {
      if (cep.length === 8) {
        const address = await getUserAddress(cep)
        setRegisterFields((prevState) => ({ ...prevState, ...address }))
      }

    }
    updateAddress()
  }, [registerInfo.CEP])
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
          <h1>{currentPage === 0 ? 'LOGIN' : 'CADASTRO'}</h1>

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
                  <a>Cadastrar-se</a>
                </div>
              </button>

            </form>
          </div>

          <div
            className={`info-user-sign ${currentPage !== 1 && "hidden-page"}`}
          >
            <form ref={formRef2}>
              <RegisterInput
                name="name"
                label="Nome Civil Completo"
                type="text"
                placeholder="Exemplo: Jean Carlo do Amaral"
                onChange={handleRegisterInfoChange}
                error={registerErrors}
                required
              />
              <RegisterInput
                name="CPF"
                label="CPF"
                type="text"
                placeholder="Exemplo: XXX.XXX.XXX-XX"
                onChange={handleRegisterInfoChange}
                value={formatCPF(registerInfo.CPF)}
                error={registerErrors}
                required
              />
              <RegisterInput
                className="info-dependente"
                name="birthDate"
                label="Data de Nascimento"
                type="date"
                placeholder="2003-10-24"
                onChange={handleRegisterInfoChange}
                error={registerErrors}
                required
              />
              <RegisterInput
                name="phone"
                label="Telefone"
                type="text"
                placeholder="Exemplo: +55 (35) 9 8820-7198"
                onChange={handleRegisterInfoChange}
                value={formatTelephone(registerInfo.phone)}
                error={registerErrors}
                required
              />



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
                <RegisterInput
                  name="CEP"
                  label="CEP"
                  onChange={handleRegisterInfoChange}
                  type="text"
                  placeholder="Exemplo: 12228-402"
                  value={formatCEP(registerInfo.CEP)}
                />

                <label for="nome">
                  <h2 className="info-cadastrado">UF</h2>
                </label>
                <select id="uf" name="UF" value={registerInfo.UF}>
                  {COUNTRY.map(({ value, label }) => (
                    <option value={value}>{label}</option>
                  ))}
                </select>

                <RegisterInput
                  name="city"
                  label="Cidade"
                  onChange={handleRegisterInfoChange}
                  type="text"
                  value={registerInfo.city}
                  placeholder="Exemplo: São Paulo"
                />
                <RegisterInput
                  name="neighborhood"
                  label="Bairro"
                  onChange={handleRegisterInfoChange}
                  value={registerInfo.neighborhood}
                  type="text"
                  placeholder="Exemplo: Ipiranga"
                />

                <RegisterInput
                  name="addressNumber"
                  label="Número do Endereço"
                  onChange={handleRegisterInfoChange}
                  type="text"
                  placeholder="Exemplo: 101"
                />
                <RegisterInput
                  name="address"
                  label="Endereço Completo"
                  value={registerInfo.address}
                  onChange={handleRegisterInfoChange}
                  type="text"
                />

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
            className={`cadastro-subperfil ${currentPage !== 4 && "hidden-page"
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
                      onClick={() => { setTypeOfUser('responsible') }}
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
                      onClick={() => { setTypeOfUser('candidate') }}
                    />
                  </div>
                  <div className="radio-input">
                    <label for="confirm-read" onClick={toggleLgpdPopup}>
                      <h3>Li e concordo com os termos LGPD</h3>
                    </label>
                    <input type="checkbox" id="confirm-read" required></input>
                  </div>
                  {showLgpdPopup && <LgpdPopup onClose={() => setShowLgpdPopup(false)} />}

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
            className={`cadastro-subperfil ${currentPage !== 5 && "hidden-page"
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

const LgpdPopup = ({ onClose }) => (
  <div className="lgpd-popup-overlay" style={{ width: '100%' }}>
    <div className="lgpd-popup-content">
      <h2>DO TRATAMENTO E PROTEÇÃO DE DADOS PESSOAIS COM SEU CONSENTIMENTO</h2>
      <p>
        O tratamento de dados pessoais e sensíveis realizado pela CADASTRAQUI
        está de acordo com a legislação relativa à privacidade e à proteção de
        dados pessoais no Brasil, tais como a Lei Geral de Proteção de Dados
        Pessoais (Lei nº 13.709/2018), as leis e normas setoriais, a Lei nº
        12.965/2014 e o Decreto nº 8771/16; bem como se dará nos termos dos
        Editais de Seleção ou Manutenção de Bolsa de Estudo, concedidas ou
        mantidas nos termos da Lei Complementar nº 187, de 16 de dezembro de
        2021. A finalidade específica do tratamento dos dados é a seleção de
        beneficiários de bolsas de estudo integrais e parciais com 50%
        (cinquenta por cento) de gratuidade, com base em critérios
        socioeconômicos.
      </p>
      <p>
        Ao realizar o processo de preenchimento do formulário eletrônico, bem
        como o upload da documentação exigida, os candidatos(as)/alunos(as)
        maiores de idade, os pais e/ou responsáveis legais de candidatos(as) ou
        alunos(as) já beneficiários autorizam a CADASTRAQUI acessar e a
        disponibilizar as informações à INSTITUIÇÃO DE ENSINO de sua escolha
        para que esta realize o tratamento dos dados pessoais e sensíveis e esta
        poderá comunicar ou transferir em parte, ou na sua totalidade, os dados
        pessoais do candidato, familiares, representantes legais, a entidades
        públicas e/ou privadas, sempre que o fornecimento dos respectivos dados
        decorra de obrigação legal e/ou seja necessário para o cumprimento do
        Edital aberto. Cabe ressaltar, que a INSTITUIÇÃO DE ENSINO presta contas
        de seus processos seletivos (como: quantidade de inscritos, aprovados e
        indeferidos) e beneficiários de suas bolsas de estudo ao Ministério da
        Educação.
      </p>
      <p>
        A CADASTRAQUI fará o arquivo da documentação que instruiu o processo de
        seleção de candidatos (novos alunos ou renovação) para a concessão da
        gratuidade integral ou parcial com 50% (cinquenta por cento de
        gratuidade) pelo prazo de 10 (dez) anos, a contar do encerramento dos
        prazos de que trata cada Edital, conforme determina a Lei Complementar
        nº 187, de 16 de dezembro de 2021, facultando a INSTITUIÇÃO DE ENSINO
        obter cópia para manter arquivo secundário.{" "}
      </p>
      <p>
        A CADASTRAQUI firmou acordo de confidencialidade com seus colaboradores,
        prepostos, subcontratados e outros que possam ter acesso às informações
        sobre o dever de confidencialidade e sigilo.
      </p>
      <p>
        As informações constantes do formulário eletrônico, da análise técnica
        dos documentos apresentados e da análise da condição social dos alunos
        não selecionados serão submetidas ao processo de anonimização pela
        CADASTRAQUI e após o cumprimento do prazo legal de guarda e arquivo, as
        informações prestadas e arquivos de upload de documentos serão
        eliminados, através de procedimentos seguros que garantam a exclusão das
        informações.{" "}
      </p>
      <p>
        É garantido aos usuários maiores de idade e representantes legais o
        exercício de todos os direitos, nos termos do art. 18 da Lei Geral de
        Proteção de Dados, bem como o livre acesso aos dados pessoais do(a)
        CANDIDATO(A)/ALUNO(A), especialmente em razão da obrigação destes em
        manter os dados atualizados, mediante procedimento de login no sistema.
      </p>
      <p>
        Em casos de violação de dados pessoais, a controladora, comunicará o
        fato aos titulares de dados e a Autoridade Nacional de Proteção de Dados
        – ANPD, atendendo aos termos e condições previstos na Lei Geral de
        Proteção de Dados.{" "}
      </p>
      <p>
        Para esclarecimentos adicionais, dúvidas ou sugestões, sobre o sistema
        CADASTRAQUI, solicita-se o envio pelo SAC disponível no sistema.
      </p>

      <button className="btn-accept" onClick={onClose}>
        Li e Aceito
      </button>
    </div>
  </div>
);


const COUNTRY = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AM", label: "Amazonas" },
  { value: "AP", label: "Amapá" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MG", label: "Minas Gerais" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MT", label: "Mato Grosso" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "PR", label: "Paraná" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SE", label: "Sergipe" },
  { value: "SP", label: "São Paulo" },
  { value: "TO", label: "Tocantins" },
];