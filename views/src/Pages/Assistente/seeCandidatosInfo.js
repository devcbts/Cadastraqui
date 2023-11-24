import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import MultiStep from "react-multistep";
import "./seeCandidatosInfo.css";
import { UilAngleLeft } from "@iconscout/react-unicons";
import { UilAngleRight } from "@iconscout/react-unicons";
import { UilCommentAltMedical } from "@iconscout/react-unicons";
import { UilTimesSquare } from "@iconscout/react-unicons";
import Comment from "../../Components/comment";
import { api } from "../../services/axios";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

import MembrosFamiliaAssistente from "../../Components/Assistente/Familia/MembrosFamiliaAssistente";
import MoradiaAssistente from "../../Components/Assistente/Moradia/MoradiaAssistente";
import VeiculosAssistente from "../../Components/Assistente/Veiculo/VeiculoAssistente";
import DespesasTotaisAssistente from "../../Components/Assistente/Despesas/DespesasTotaisAssistente";
import VerBasico from "../../Components/Básico/ver-basico";
import BasicoAssistente from "../../Components/Assistente/Básico/BasicoAssistente";
import MembrosFamiliaRendaAssistente from "../../Components/Assistente/Renda/rendaAssistente";
import VerDocumentosAssistente from "../../Components/Assistente/Documentos/VerDocumentos";
import MembrosFamiliaSaudeAssistente from "../../Components/Assistente/Saúde/membroSaudeAssistente";


export default function SeeCandidatosInfo() {
  const [commentIsShown, setCommentIsShown] = useState(false)
  const nextButton = useRef(null)
  const prevButton = useRef(null)
  const { announcement_id, application_id } = useParams()
  const [candidateId, setCandidateId] = useState('')

  useEffect( () => {
    async function getCandidateId(){

      const token = localStorage.getItem('token')
      try {
        const response = await api.get(`/assistant/${announcement_id}/${application_id}`, {
          headers: {
            'Authorization' : 'Bearer ' + token
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
  },[announcement_id])


  const handleCommentClick = () => {
    setCommentIsShown((prev) => !prev);
  };

  const [descricao, setDescricao] = useState('');
  const [selectedValue, setSelectedValue] = useState('Document');
  const [deadLine, setDeadLine] = useState(null);

  const handleSubmitButton = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.post(`assistant/solicitation/${application_id}`, { description: descricao, solicitation: selectedValue, deadLine: deadLine },
        {
          headers: {
            'authorization': `Bearer ${token}`,
          }
        })
      setDescricao("")
    } catch (error) {
      alert("erro ao criar solicitação")

    }
  }

  function BasicInfoDiv() {
    return (
      <div >
        <BasicoAssistente id={candidateId}/>

      </div>
    );
  }

  function FamilyInfoDiv() {
    return (
      <div >
        <MembrosFamiliaAssistente id={candidateId}/>
      </div>
    );
  }

  function HousingInfoDiv() {
    return (
      <div >
       <MoradiaAssistente id={candidateId}/>
      </div>
    );
  }

  function VehicleInfoDiv() {
    return (
      <div >
       <VeiculosAssistente id={candidateId} />
      </div>
    );
  }

  function EarningInfoDiv() {
    

    return (
      <div >
      <MembrosFamiliaRendaAssistente id={candidateId} />
      </div>
    );
  }

  function BudgetInfoDiv() {
    return (
      <div >
               <DespesasTotaisAssistente id={candidateId} />

      </div>
    );
  }

  function HealthInfoDiv() {
    return (
      <div >
        <MembrosFamiliaSaudeAssistente id={candidateId}/>
        </div>
    
    );
  }

  function DeclarationsInfoDiv() {
    return (
      <div className="fill-container">
        <h1>8</h1>
      </div>
    );
  }

  function DocumentsInfoDiv() {
    return (
      <div >
        <VerDocumentosAssistente id={candidateId}/>
      </div>
    );
  }

  return (
    <div className="container-cadastro-candidato">
      <div className="upper-cadastro-candidato candidato-info-assistente">
        <div>
          <a className="btn-cadastro go-back"><Link className="btn-cadastro" to={`/assistente/cadastrados/geral/${announcement_id}/${application_id}`}>{"< "}Voltar</Link></a>
        </div>
        <div>
          <h1>Formulário detalhado</h1>
          <h2>João da Silva</h2>
        </div>
      </div>
      <div className="container-info">
        <MultiStep
          activeStep={0}
          className="multi-step"
          stepCustomStyle={{
            fontSize: 0.8 + "rem",
          }}
          showNavigation={false}
        >
          <BasicInfoDiv title="Básico"></BasicInfoDiv>
          <FamilyInfoDiv title="Família"></FamilyInfoDiv>
          <HousingInfoDiv title="Moradia"></HousingInfoDiv>
          <VehicleInfoDiv title="Veículo"></VehicleInfoDiv>
          <EarningInfoDiv title="Renda"></EarningInfoDiv>
          <BudgetInfoDiv title="Despesas"></BudgetInfoDiv>
          <HealthInfoDiv title="Saúde"></HealthInfoDiv>
          <DeclarationsInfoDiv title="Declarações"></DeclarationsInfoDiv>
          <DocumentsInfoDiv title="Documentos"></DocumentsInfoDiv>
        </MultiStep>
        <div className="add-comment">
          <UilCommentAltMedical
            size="30"
            color="#1F4B73"
            onClick={() => handleCommentClick()}
          ></UilCommentAltMedical>
        </div>

        {commentIsShown && <div className="comment-backdrop"></div>}

        {commentIsShown && (
          <div className="comment-popup">
            <div className="upper-sections">
              <div>
                <h2>Comentários</h2>
                <h3>João da Silva</h3>
              </div>
              <UilTimesSquare
                size="30"
                color="#1F4B73"
                onClick={() => handleCommentClick()}
                className="btn"
              ></UilTimesSquare>
            </div>
            <div className="create-comment">
              <h2>Adicionar comentario de seção</h2>
              <textarea className="text-fixed" onChange={e => setDescricao(e.target.value)}></textarea>
              <div className="send-comment">
                <div class="box">
                  <select value={selectedValue} onChange={e => setSelectedValue(e.target.value)}>
                    <option value='Document'>Documento</option>
                    <option value="Interview">Entrevista</option>
                    <option value="Visit">Visita Domiciliar</option>
                  </select>
                </div>
                {selectedValue === 'Document' ?
                  <div class="box">
                    <select value={deadLine ? deadLine : 1} onChange={e => setDeadLine(e.target.value)}>
                      <option value="1">1 dia</option>
                      <option value="2">2 dias</option>
                      <option value="3">3 dias</option>
                      <option value="4">4 dias</option>
                      <option value="5">5 dias</option>
                      <option value="6">6 dias</option>
                      <option value="7">7 dias</option>
                    </select>
                  </div> : ''}
                <button className="btn-send" onClick={handleSubmitButton}>Enviar</button>
              </div>
            </div>
            <div className="comments-box">
              <Comment></Comment>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
