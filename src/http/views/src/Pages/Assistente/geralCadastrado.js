import React, { useState, useEffect } from "react";
import NavBarAssistente from "../../Components/navBarAssistente";
import MultiStep from "react-multistep";
import { UilCheckSquare } from "@iconscout/react-unicons";
import { UilSquareFull } from "@iconscout/react-unicons";
import "./geralCadastrado.css";
import Comment from "../../Components/comment";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { api } from "../../services/axios";
import VerExtrato from "../../Components/Assistente/GeralCadastrado/Extrato";
import VerParecer from "../../Components/Assistente/GeralCadastrado/Parecer";
import VerEditaisAnteriores from "../../Components/Assistente/GeralCadastrado/EditaisAnteriores";
import SolicitacoesAssistente from "../../Components/Assistente/GeralCadastrado/SolicitacoesAssistente";

export default function GeralCadastrado() {
  const { announcement_id, application_id } = useParams();
  console.log("====================================");
  console.log(announcement_id, application_id);
  console.log("====================================");

  const [candidateId, setCandidateId] = useState('')
  const [familyMembers, setFamilyMembers] = useState([])
  const [housing, setHousing] = useState()
  const [vehicles, setVehicles] = useState()
  const [candidateInfo, setCandidateInfo] = useState()
  const [identityInfo , setIdentityInfo] = useState()
  const [applications , setApplications] = useState()



  useEffect(() => {
    async function getCandidateId() {

      const token = localStorage.getItem('token')
      try {
        const response = await api.get(`/assistant/${announcement_id}/${application_id}`, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        })

        setCandidateId(response.data.application.candidate_id)
        console.log('====================================');
        console.log(response.data.application);
        console.log('====================================');
      } catch (error) {

      }
    }
    getCandidateId()

    async function pegarFamiliares() {
      const token = localStorage.getItem('token');
      try {
        const response = await api.get(`/candidates/family-member/${candidateId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setFamilyMembers(response.data.familyMembers);
        console.log('====================================');
        console.log(response.data.familyMembers);
        console.log('====================================');
      } catch (error) {
        // Trate o erro conforme necessário
      }
    }


    async function pegarMoradia() {
      const token = localStorage.getItem('token');
      try {

        const response = await api.get(`/candidates/housing-info/${candidateId}`, {
          headers: {
            'authorization': `Bearer ${token}`,
          }
        })
        console.log('====================================');
        console.log(response.data);
        console.log('====================================');
        const dadosMoradia = response.data.housingInfo
        setHousing(dadosMoradia)
      }
      catch (err) {
        alert(err)
      }
    }
    async function pegarVeiculos() {
      const token = localStorage.getItem('token');
      try {
        const response = await api.get(`/candidates/vehicle-info/${candidateId}`, {
          headers: {
            'authorization': `Bearer ${token}`,
          }
        });
        setVehicles(response.data.vehicleInfoResults);

      } catch (err) {
        alert(err);
      }
    }
    async function pegarCandidato() {
      const token = localStorage.getItem('token');
      try {
        const response = await api.get(`/candidates/basic-info/${candidateId}`, {
          headers: {
            'authorization': `Bearer ${token}`,
          }
        });
        setCandidateInfo(response.data.candidate);

      } catch (err) {
        alert(err);
      }
    }
    async function pegarIdentidade() {
      const token = localStorage.getItem('token');
      try {
        const response = await api.get(`/candidates/identity-info/${candidateId}`, {
          headers: {
            'authorization': `Bearer ${token}`,
          }
        });
        setIdentityInfo(response.data.identityInfo);
        console.log('====================================');
        console.log(response.data.identityInfo);
        console.log('====================================');
      } catch (err) {
        alert(err);
      }
    }

    async function pegarInscricoes() {
      const token = localStorage.getItem('token');
      try {
        const response = await api.post(`candidates/application/see`, {
          candidate_id: candidateId
        }, {
          headers: {
            'authorization': `Bearer ${token}`,
          }
        });
        setApplications(response.data.applications);
        console.log('====================================');
        console.log(response.data.applications);
        console.log('====================================');
      } catch (err) {
        alert(err);
      }
    }

    if (candidateId) {
      pegarInscricoes()
      pegarCandidato()
      pegarVeiculos()
      pegarMoradia()
      pegarFamiliares()
      pegarIdentidade()
    }
  }, [candidateId])

  const [formData, setFormData] = useState({
    dateAndTime: "",
    candidateName: "",
    rgId: "",
    rgIssuer: "",
    // ... (add other form fields as necessary)
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form Data Submitted:", formData);
    // You can process or display the filled out form here
  };

  function EditaisAnteriores() {
    return (
      <VerEditaisAnteriores applications={applications} />
    );
  }

  function Extrato() {
    return (
      <div>
        <VerExtrato familyMembers={familyMembers} />
      </div>
    );
  }

  function Solicitacoes() {
    return (
      <SolicitacoesAssistente application_id={application_id} announcement_id={announcement_id}/>
    );
  }

  function Parecer() {
    return (
     <VerParecer FamilyMembers={familyMembers} Housing={housing} Vehicles={vehicles} candidate={candidateInfo} identityInfo={identityInfo} />
    );
  }

  function Acoes() {
    return (
      <div className="fill-container general-info">
        <h1 id="title-action">
          *Informações posteriores à conclusão da análise referente ao processo
          de matrícula
        </h1>
        <div class="container-form">
          <div class="row">
            <form id="survey-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="name" id="name-label">
                    Candidato{"(a)"} desistiu da bolsa de estudo ou não efetuou
                    a matrícula:
                  </label>
                  <input
                    type="checkbox"
                    class="form-control"
                    id="name"
                    placeholder="Enter your name"
                    required
                  ></input>
                </div>
                <div class="form-group">
                  <label for="email" id="email-label">
                    Código de Identificação do bolsista:
                  </label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    placeholder=""
                    required
                  ></input>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-4">
                  <label for="exp" id="number-label">
                    A entidade irá conceder bolsa ao aluno?{" "}
                    {"(Responder sim ou não)"}
                  </label>
                  <input type="radio" name="bolsa" value="yes" />
                  Sim
                  <input type="radio" name="bolsa" value="no" />
                  Não
                </div>
                <div class="form-group col-md-4">
                  <label for="dropdown" id="dropdown-label">
                    Se sim, especifique quais:
                  </label>
                  <form>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="1" id="materialDidatico" />
                      <label class="form-check-label" for="materialDidatico">
                        Material didático
                      </label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="2" id="uniforme" />
                      <label class="form-check-label" for="uniforme">
                        Uniforme
                      </label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="3" id="transporteEscolar" />
                      <label class="form-check-label" for="transporteEscolar">
                        Transporte escolar
                      </label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="4" id="alimentacao" />
                      <label class="form-check-label" for="alimentacao">
                        Alimentação
                      </label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="5" id="moradia" />
                      <label class="form-check-label" for="moradia">
                        Moradia
                      </label>
                    </div>
                  </form>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-md-12">
                  <textarea
                    class="form-control"
                    placeholder="Comentários adicionais"
                  ></textarea>
                </div>
              </div>

              <h2 className="law-text">
                O Termo de Concessão de Benefícios - Tipo 1: Ações de apoio ao
                aluno bolsista, abaixo será disponibilizado no perfil do
                candidato para que o mesmo ou seu responsável legal assine e
                providencie a entrega na entidade
              </h2>

              <a className="btn-cadastro">Enviar</a>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="section-nav">
        <NavBarAssistente></NavBarAssistente>
      </div>
      <div className="container-contas">
        <div className="upper-cadastrados">
          <h1>Editais - USP 2024.1</h1>
          <div className="btns-cadastro">
            <a className="btn-cadastro">
              <Link
                className="btn-cadastro"
                to={`/assistente/cadastrados/${announcement_id}`}
              >
                {"< "}Voltar
              </Link>
            </a>
            <a className="btn-cadastro">
              <Link
                className="btn-cadastro"
                to={`/assistente/cadastrados/info/${announcement_id}/${application_id}`}
              >
                Ver formulário
              </Link>
            </a>
          </div>
        </div>
        <div className="multistep-container">
          <MultiStep
            activeStep={0}
            className="multi-step"
            stepCustomStyle={{
              fontSize: 0.8 + "rem",
              margin: "auto",
              width: 100 + "%",
            }}
            showNavigation={false}
          >
            <EditaisAnteriores title="Editais anteriores"></EditaisAnteriores>
            <Extrato title="Extrato"></Extrato>
            <Solicitacoes title="Solicitacoes"></Solicitacoes>
            <Parecer title="Parecer"></Parecer>
            <Acoes title="Ações posteriores"></Acoes>
          </MultiStep>
        </div>
      </div>
    </div>
  );
}
