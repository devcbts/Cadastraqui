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

export default function SeeCandidatosInfo() {
  const [commentIsShown, setCommentIsShown] = useState(false)
  const nextButton = useRef(null)
  const prevButton = useRef(null)
  const application_id = useParams()
  console.log('====================================');
  console.log(application_id.application_id);
  console.log('====================================');
  const handleCommentClick = () => {
    setCommentIsShown((prev) => !prev);
  };

  const [descricao, setDescricao] = useState('');
  const [selectedValue, setSelectedValue] = useState('Document');
  const [deadLine, setDeadLine] = useState(null);

  const handleSubmitButton = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.post(`assistant/solicitation/${application_id.application_id}`, { description: descricao, solicitation: selectedValue, deadLine: deadLine },
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
            value="Jean Carlo do Amaral"
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
      <div className="fill-container">
        <h1></h1>
      </div>
    );
  }

  function HousingInfoDiv() {
    return (
      <div className="fill-container">
        <h2>Informações sobre Moradia</h2>
        <div className="input-cadastro hidden-title"></div>
        <div className="input-cadastro hidden-title"></div>
        <div className="input-cadastro">
          <input type="text" placeholder="CEP" value="CEP - 12284612"></input>
        </div>
        <div className="input-cadastro">
          <input type="text" placeholder="Logradouro" value="Logradouro"></input>
        </div>
        <div className="input-cadastro">
          <input type="text" placeholder="nº" value="Número - 215"></input>
        </div>
        <div className="input-cadastro">
          <input type="text" placeholder="Complemento" value="Complemento"></input>
        </div>
        <div className="input-cadastro">
          <input type="text" placeholder="Bairro" value="DCTA"></input>
        </div>
        <div className="input-cadastro">
          <input type="text" placeholder="Cidade" value="São José dos Campos"></input>
        </div>
        <div className="input-cadastro">
          <input type="text" placeholder="Estado" value="São Paulo"></input>
        </div>
        <div className="input-cadastro">
          <input type="text" placeholder="Mora com Quantas pessoas ?" value="Mora com 3 pessoas"></input>
        </div>
      </div>
    );
  }

  function VehicleInfoDiv() {
    return (
      <div className="fill-container">
        <h2>Informações do veiculo</h2>
        <div className="input-cadastro hidden-title"></div>
        <div className="input-cadastro hidden-title"></div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Tipo de veículo"
            value="Carros Pequenos e Utilidades"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Modelo e Marca"
            value="Fiat"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Ano de fabricação"
            value="Fabricação - 2018"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Situação"
            value="Financiado"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Valor seguro"
            value="Seguro - 300"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Utilização"
            value="Instrumento de Trabalho"
            disabled
          ></input>
        </div>
      </div>
    );
  }

  function EarningInfoDiv() {
    /*const [isSubscribed, setSubscribed] = useState(null);

    useEffect(() => {
      if (isSubscribed === "no") {
        document.getElementById("nis-input").disabled = true;
      } else {
        document.getElementById("nis-input").disabled = false;
      }
    }, [isSubscribed]);*/

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
      <div className="fill-container">
        <div className="input-cadastro title">
          <h2>1. Despesas básicas</h2>
        </div>
        <div className="input-cadastro hidden-title"></div>
        <div className="input-cadastro hidden-title"></div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Água"
            value="Água - R$100"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Luz"
            value="Luz - R$250"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Telefone"
            value="Telefone - R$60"
            disabled
          ></input>
        </div>

        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Internet"
            value="Internet - R$100"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Saúde"
            value="Saúde - R$200"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Alimentação"
            value="Alimentação - R$800"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Transporte"
            value="Transporte - R$150"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Total"
            value="Total - R$1660"
            disabled
          ></input>
        </div>
        <div className="input-cadastro hidden-title"></div>
        
        <div className="input-cadastro title">
          <h2>2. Financiamento</h2>
        </div>
        <div className="input-cadastro hidden-title"></div>
        <div className="input-cadastro hidden-title"></div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Valor"
            value="Valor total - R$5000"
            disabled
          ></input>
        </div>

        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Parcelas"
            value="16 Parcelas"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Valor Parcela"
            value="Valor da parcela - R$312,5"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Quantidade de Parcelas Paga"
            value="5 Parcelas Pagas"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Banco"
            value="Banco Itaú"
            disabled
          ></input>
        </div>
        <div className="input-cadastro hidden-title"></div>
      </div>
    );
  }

  function HealthInfoDiv() {
    return (
      <div className="fill-container">
        <h2>Informações sobre Saúde</h2>
        <div className="input-cadastro title">
        </div>
        <div className="input-cadastro hidden-title"></div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Tipo da Doença"
            value="Doença Cardiovascular"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Nome da Doença"
            value="Arritmia"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Possui Laudo Médico ?"
            value="Possui Laudo Médico"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Tipo da Doença"
            value="Doença Respiratória"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Nome da Doença"
            value="Asma"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Possui Laudo Médico ?"
            value="Possui Laudo Médico"
            disabled
          ></input>
        </div>
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
          <h2>Jean Carlo do Amaral</h2>
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
                <h3>Jean Carlo do Amaral</h3>
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
                    <h2>Prazo para envio dos documentos</h2>
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
