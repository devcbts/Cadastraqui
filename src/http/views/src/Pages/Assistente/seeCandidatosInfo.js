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
      <div className="fill-container">
        <div className="input-cadastro title">
          <h2>1. Identificação</h2>
        </div>
        <div className="input-cadastro hidden-title"></div>
        <div className="input-cadastro hidden-title"></div>

        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Nome completo"
            value="João da Silva"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input type="date" placeholder="" value="2003-12-03" disabled></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Sexo"
            value="Masculino"
            disabled
          ></input>
        </div>

        <div className="input-cadastro title">
          <h2>2. Naturalidade</h2>
        </div>
        <div className="input-cadastro hidden-title"></div>
        <div className="input-cadastro hidden-title"></div>

        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Estado"
            value="Minas Gerais"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Cidade"
            value="Itajubá"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Nacionalidade"
            value="Brasileira"
            disabled
          ></input>
        </div>

        <div className="input-cadastro title">
          <h2>3. Documentos</h2>
        </div>
        <div className="input-cadastro hidden-title"></div>
        <div className="input-cadastro hidden-title"></div>

        <div className="input-cadastro">
          <input
            type="text"
            placeholder="CPF"
            value="CPF - 999.999.999-09"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="RG"
            value="RG - 88.888.888"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Orgão Emissor"
            value="Orgão Emissor - IIMG"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="UF do orgão emissor"
            value="UF orgão emissor-MG"
            disabled
          ></input>
        </div>
        <div className="input-cadastro hidden-title"></div>
        <div className="input-cadastro  hidden-title"></div>
        <div className="input-cadastro title">
          <h2>4. Básicos</h2>
        </div>
        <div className="input-cadastro hidden-title"></div>
        <div className="input-cadastro hidden-title"></div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Estado Civil"
            required
            value="Solteiro"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Cor"
            value="Branca"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Religião"
            value="Cristão"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Nível de Educação"
            value="Ensino Superior Incompleto"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="NIS"
            value="Não Possui NIS"
            disabled
          ></input>
        </div>
        <div className="input-cadastro hidden-title"></div>

        <div className="input-cadastro title">
          <h2>5. Contato</h2>
        </div>
        <div className="input-cadastro hidden-title"></div>
        <div className="input-cadastro hidden-title"></div>


        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Telefone"
            required
            value="(12) 99932 - 2112"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Email"
            value="jeancarlos@email.com"
            disabled
          ></input>
        </div>

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
      <div className="fill-container">
        <div className="input-cadastro title question">
          <h2>1.Renda mensal</h2>
        </div>
        <div className="input-cadastro hidden-title"></div>
        <div className="input-cadastro hidden-title"></div>
        {/*<div className="input-cadastro input-secondary">
          <input
            type="radio"
            name="gov-program"
            value="yes"
            onClick={() => setSubscribed("yes")}
          />
          Sim
          <input
            type="radio"
            name="gov-program"
            value="no"
            onClick={() => setSubscribed("no")}
          />
          Não
    </div>
        <div className="input-cadastro">
          <input type="text" id="nis-input" placeholder="Se sim, informe NIS" />
    </div>*/}


        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Recebe ajuda"
            value="Recebe ajuda Financeira "
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Valor da ajuda"
            value="Ajuda de R$2000"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Qual familiar ajuda"
            value="Familiar que ajuda: Pai"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="CPF do ajudante"
            value="CPF do Pai - 122.332.345-09"
            disabled
          ></input>
        </div>
        {/*<div className="input-cadastro input-dropbox">
          <div>
            <input
              type="radio"
              name="employmentType"
              value="empregado-privado"
            />
            Empregado privado (CLT)
          </div>
          <div>
            <input
              type="radio"
              name="employmentType"
              value="empregado-publico"
            />
            Empregado público
          </div>
          <div>
            <input
              type="radio"
              name="employmentType"
              value="empregado-domestico"
            />
            Empregado doméstico
          </div>
          <div>
            <input type="radio" name="employmentType" value="empregado-rural" />
            Empregado temporário na área rural
          </div>
          <div>
            <input
              type="radio"
              name="employmentType"
              value="empresario-simples"
            />
            Empresário (Simples Nacional)
          </div>
          <div>
            <input type="radio" name="employmentType" value="empresario" />
            Empresário
          </div>
          <div>
            <input type="radio" name="employmentType" value="mei" />
            MEI
          </div>
          <div>
            <input type="radio" name="employmentType" value="autonomo" />
            Autônomo (conta-própria)
          </div>
          <div>
            <input type="radio" name="employmentType" value="aposentado" />
            Aposentado
          </div>
          <div>
            <input type="radio" name="employmentType" value="pensionista" />
            Pensionista
          </div>
          <div>
            <input type="radio" name="employmentType" value="aprendiz" />
            Aprendiz ou estagiário
          </div>
          <div>
            <input type="radio" name="employmentType" value="voluntario" />
            Trabalhador voluntário
          </div>
          <div>
            <input type="radio" name="employmentType" value="renda-aluguel" />
            Renda de aluguéis ou arrendamento
          </div>
          <div>
            <input type="radio" name="employmentType" value="estudante" />
            Estudante
          </div>
          <div>
            <input type="radio" name="employmentType" value="informal" />
            Trabalhador informal
          </div>
          <div>
            <input type="radio" name="employmentType" value="desempregado" />
            Desempregado
          </div>
          <div>
            <input type="radio" name="employmentType" value="desempregado" />
            Desempregado
          </div>
          <div>
            <input type="radio" name="employmentType" value="auxilio-doenca" />
            Auxílio doença
          </div>
          <div>
            <input type="radio" name="employmentType" value="prof-liberal" />
            Profissional Liberal
          </div>
          <div>
            <input type="radio" name="employmentType" value="ajuda-terceiros" />
            Ajuda Financeira de Terceiros
          </div>
          <div>
            <input
              type="radio"
              name="employmentType"
              value="pensao-alimenticia"
            />
            Pensão alimentícia
          </div>
          <div>
            <input
              type="radio"
              name="employmentType"
              value="pensao-alimenticia"
            />
            Pensão alimentícia
          </div>
          <div>
            <input
              type="radio"
              name="employmentType"
              value="previdencia-privada"
            />
            Previdência Privada
          </div>
          <div>
            <input
              type="radio"
              name="employmentType"
              value="previdencia-privada"
            />
            Previdência Privada
          </div>
        </div>*/}
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
      <div className="fill-container">
        <h1>8</h1>
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
