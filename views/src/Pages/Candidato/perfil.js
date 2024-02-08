import React, { useEffect, useState } from "react";
import "./perfil.css";
import NavBar from "../../Components/navBar";
import { useAppState } from "../../AppGlobal";
import NavBarCandidato from "../../Components/navBarCandidato";
import photoProfile from "../../Assets/profile-padrao.jpg";
import { UilPen } from "@iconscout/react-unicons";
import { UilLock } from "@iconscout/react-unicons";
import { api } from "../../services/axios";
import { useNavigate } from "react-router";
import { UilHunting } from "@iconscout/react-unicons";

export default function PerfilCandidato() {
  const { isShown } = useAppState();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const navigate = useNavigate();
  const [showLgpdPopup, setShowLgpdPopup] = useState(false);

  const toggleLgpdPopup = () => {
    setShowLgpdPopup(!showLgpdPopup);
  };

  const [userInfo, setUserInfo] = useState(null);

  async function getProfilePhoto() {
    const token = localStorage.getItem("token");

    try {
      const profilePhoto = await api.get("/candidates/profilePicture", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      console.log(profilePhoto);
      setProfilePhoto(profilePhoto.data.url);
    } catch (err) {
      if (err.response.status === 401) {
        navigate("/login");
      }
    }
  }


  useEffect(() => {
    async function getUserInfo() {
      const token = localStorage.getItem("token")
      const user_role = localStorage.getItem("role")
      if (user_role === 'CANDIDATE') {
        try {
          const user_info = await api.get('/candidates/basic-info', {
            headers: {
              'authorization': `Bearer ${token}`,
            }
          })
          setUserInfo(user_info.data.candidate)
        } catch (err) {
          if (err.response.status === 401) {
            try {
              const newToken = await api.patch('/token/refresh')
              localStorage.setItem("token", newToken)
            } catch (err) {
              console.log(err)
            }
          }
        }
      } else if (user_role === 'RESPONSIBLE') {
        const user_info = await api.get('/responsibles', {
          headers: {
            'authorization': `Bearer ${token}`,
          }
        })
        setUserInfo(user_info.data.responsible)
      }
    }
    getProfilePhoto()
    getUserInfo()
  }, [])

  async function handleImageUpload(event) {
    const file = event.target.files[0];
    console.log(file);

    if (file) {
      const token = localStorage.getItem("token");

      try {
        const formData = new FormData();
        formData.append("file", file);
        await api.post("/candidates/profilePicture", formData, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        getProfilePhoto();
      } catch (err) {
        alert("Erro ao atualizar foto de perfil.");
        console.log(err);
      }
    }
  }




  return (
    <div className="container">
      <div className="section-nav">
        <NavBarCandidato user={userInfo}></NavBarCandidato>
      </div>

      <div className="container-contas">
        <div className="upper-contas status-title">
          <h1>{userInfo ? userInfo.name : ''}</h1>
        </div>
        <div className="user-photo">
          <div className="profile-photo">
            <div className="bg-image">
              <img
                id="profile-photo"
                className="photo-profile-img"
                alt="imagem-do-usuario"
                src={profilePhoto !== null ? profilePhoto : photoProfile}
              />
            </div>
            <label className="profile-label" for="photo">
              Editar Foto
            </label>
            <input
              type="file"
              name="profile-photo"
              id="photo"
              accept="image/png, image/jpeg, image/jpg, image/pdf"
              onChange={handleImageUpload}
            ></input>

          </div>
          <div className="side-profile" onClick={toggleLgpdPopup}>
            <h1>
              

                <UilHunting size="30"></UilHunting>LGPD
            </h1>
          </div>
        </div>
        {showLgpdPopup && <LgpdPopup onClose={() => setShowLgpdPopup(false)} />}

        <div className="novos-colaboradores profile-candidate">
          {userInfo ?
            <div className="solicitacoes personal-info">
              <div className="upper-info">
                <h2>Informações pessoais</h2>
                <div className="info-item">
                  <h3>Nome:</h3>
                  <h3>{userInfo ? userInfo.name : "User Name"}</h3>
                </div>
                <div className="info-item">
                  <h3>Telefone:</h3>
                  <h3>{userInfo ? userInfo.phone : ""}</h3>
                </div>
                <div className="info-item">
                  <h3>CPF:</h3>
                  <h3>{userInfo ? userInfo.CPF : ""}</h3>
                </div>
                <div className="info-item">
                  <h3>Endereço:</h3>
                  <h3>{userInfo ? userInfo.address : ""}</h3>
                </div>
                <div className="info-item">
                  <h3>Email:</h3>
                  <h3>{userInfo ? userInfo.email : ""}</h3>
                </div>
                <div className="info-item">
                  <h3>Senha:</h3>
                  <h3>********</h3>
                </div>

              </div>
              <a href="#">
                <UilPen size="20" color="#1F4B73"></UilPen>
              </a>
            </div>
            :

            <div className="solicitacoes personal-info">
              <div className="upper-info">
                <h2>Informações pessoais</h2>
                <div className="info-item">
                  <h3>Nome:</h3>
                  <div className="skeleton-text skeleton-loading"></div>
                </div>
                <div className="info-item">
                  <h3>Telefone:</h3>

                  <div className="skeleton-text skeleton-loading"></div>
                </div>
                <div className="info-item">
                  <h3>CPF:</h3>

                  <div className="skeleton-text skeleton-loading"></div>
                </div>
                <div className="info-item">
                  <h3>Endereço:</h3>

                  <div className="skeleton-text skeleton-loading"></div>
                </div>
                <div className="info-item">
                  <h3>Email:</h3>

                  <div className="skeleton-text skeleton-loading"></div>
                </div>
                <div className="info-item">
                </div>

              </div>
              <a href="#">
                <UilPen size="20" color="#1F4B73"></UilPen>
              </a>
            </div>
          }
          <a href="#" className="btn-alterar">
            <UilLock size="20" color="white"></UilLock>
            Alterar senha
          </a>
        </div>
      </div>
    </div>
  );
}


const LgpdPopup = ({ onClose }) => (
  <div className="lgpd-popup-overlay">
    <div className="lgpd-popup-content">
      <h2>DO TRATAMENTO E PROTEÇÃO DE DADOS PESSOAIS COM SEU CONSENTIMENTO</h2>
      <p>O tratamento de dados pessoais e sensíveis realizado pela CADASTRAQUI está de acordo com a legislação relativa à privacidade e à proteção de dados pessoais no Brasil, tais como a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018), as leis e normas setoriais, a Lei nº 12.965/2014 e o Decreto nº 8771/16; bem como se dará nos termos dos Editais de Seleção ou Manutenção de Bolsa de Estudo, concedidas ou mantidas nos termos da Lei Complementar nº 187, de 16 de dezembro de 2021. A finalidade específica do tratamento dos dados é a seleção de beneficiários de bolsas de estudo integrais e parciais com 50% (cinquenta por cento) de gratuidade, com base em critérios socioeconômicos.</p>
      <p>Ao realizar o processo de preenchimento do formulário eletrônico, bem como o upload da documentação exigida, os candidatos(as)/alunos(as) maiores de idade, os pais e/ou responsáveis legais de candidatos(as) ou alunos(as) já beneficiários autorizam a CADASTRAQUI acessar e a disponibilizar as informações à INSTITUIÇÃO DE ENSINO de sua escolha para que esta realize o tratamento dos dados pessoais e sensíveis e esta poderá comunicar ou transferir em parte, ou na sua totalidade, os dados pessoais do candidato, familiares, representantes legais, a entidades públicas e/ou privadas, sempre que o fornecimento dos respectivos dados decorra de obrigação legal e/ou seja necessário para o cumprimento do Edital aberto. Cabe ressaltar, que a INSTITUIÇÃO DE ENSINO presta contas de seus processos seletivos (como: quantidade de inscritos, aprovados e indeferidos) e beneficiários de suas bolsas de estudo ao Ministério da Educação.</p>
      <p>A CADASTRAQUI fará o arquivo da documentação que instruiu o processo de seleção de candidatos (novos alunos ou renovação) para a concessão da gratuidade integral ou parcial com 50% (cinquenta por cento de gratuidade) pelo prazo de 10 (dez) anos, a contar do encerramento dos prazos de que trata cada Edital, conforme determina a Lei Complementar nº 187, de 16 de dezembro de 2021, facultando a INSTITUIÇÃO DE ENSINO obter cópia para manter arquivo secundário. </p>
      <p>A CADASTRAQUI firmou acordo de confidencialidade com seus colaboradores, prepostos, subcontratados e outros que possam ter acesso às informações sobre o dever de confidencialidade e sigilo.</p>
      <p>As informações constantes do formulário eletrônico, da análise técnica dos documentos apresentados e da análise da condição social dos alunos não selecionados serão submetidas ao processo de anonimização pela CADASTRAQUI e após o cumprimento do prazo legal de guarda e arquivo, as informações prestadas e arquivos de upload de documentos serão eliminados, através de procedimentos seguros que garantam a exclusão das informações. </p>
      <p>É garantido aos usuários maiores de idade e representantes legais o exercício de todos os direitos, nos termos do art. 18 da Lei Geral de Proteção de Dados, bem como o livre acesso aos dados pessoais do(a) CANDIDATO(A)/ALUNO(A), especialmente em razão da obrigação destes em manter os dados atualizados, mediante procedimento de login no sistema.</p>
      <p>Em casos de violação de dados pessoais, a controladora, comunicará o fato aos titulares de dados e a Autoridade Nacional de Proteção de Dados – ANPD, atendendo aos termos e condições previstos na Lei Geral de Proteção de Dados. </p>
      <p>Para esclarecimentos adicionais, dúvidas ou sugestões, sobre o sistema CADASTRAQUI, solicita-se o envio pelo SAC disponível no sistema.</p>

      <button onClick={onClose}>Li e Aceito</button>
    </div>
  </div>
);