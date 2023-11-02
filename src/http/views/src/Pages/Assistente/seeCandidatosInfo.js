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

export default function SeeCandidatosInfo() {
  const [commentIsShown, setCommentIsShown] = useState(false);
  const nextButton = useRef(null);
  const prevButton = useRef(null);

  const handleCommentClick = () => {
    setCommentIsShown((prev) => !prev);
  };

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
            value="999.999.999-09"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="RG"
            value="MG - 88.888.888"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Orgão Emissor"
            value="IIMG"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="UF do orgão emissor"
            value="MG"
            disabled
          ></input>
        </div>
        <div className="input-cadastro hidden-title"></div>
        <div className="input-cadastro  hidden-title"></div>
        <div className="input-cadastro title">
          <h2>4. Adicionais</h2>
        </div>
        <div className="input-cadastro hidden-title"></div>
        <div className="input-cadastro hidden-title"></div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="E-mail"
            required
            value="jeanjcsa@email.com"
            disabled
          ></input>
        </div>
        <div className="input-cadastro">
          <input
            type="text"
            placeholder="Profissão"
            value="Estudante"
            disabled
          ></input>
        </div>
      </div>
    );
  }

  function FamilyInfoDiv() {
    return (
      <div className="fill-container">
        <h1>2</h1>
      </div>
    );
  }

  function HousingInfoDiv() {
    return (
      <div className="fill-container">
        <div className="input-cadastro">
          <input type="text" placeholder="CEP"></input>
        </div>
        <div className="input-cadastro">
          <input type="text" placeholder="Logradouro"></input>
        </div>
        <div className="input-cadastro">
          <input type="text" placeholder="nº"></input>
        </div>
        <div className="input-cadastro">
          <input type="text" placeholder="Complemento"></input>
        </div>
        <div className="input-cadastro">
          <input type="text" placeholder="Bairro"></input>
        </div>
        <div className="input-cadastro">
          <input type="text" placeholder="Cidade"></input>
        </div>
        <div className="input-cadastro">
          <input type="text" placeholder="Estado"></input>
        </div>
      </div>
    );
  }

  function VehicleInfoDiv() {
    return (
      <div className="fill-container">
        <h1>4</h1>
      </div>
    );
  }

  function EarningInfoDiv() {
    const [isSubscribed, setSubscribed] = useState(null);

    useEffect(() => {
      if (isSubscribed === "no") {
        document.getElementById("nis-input").disabled = true;
      } else {
        document.getElementById("nis-input").disabled = false;
      }
    }, [isSubscribed]);

    return (
      <div className="fill-container">
        <div className="input-cadastro title question">
          <h2>5. Inscrito em programas de transferência de renda? </h2>
        </div>
        <div className="input-cadastro hidden-title"></div>
        <div className="input-cadastro hidden-title"></div>
        <div className="input-cadastro input-secondary">
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
        </div>
        <div className="input-cadastro hidden-title"></div>
        <div className="input-cadastro hidden-title"></div>
        <div className="input-cadastro input-dropbox">
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
        </div>
      </div>
    );
  }

  function BudgetInfoDiv() {
    return (
      <div className="fill-container">
        <h1>6</h1>
      </div>
    );
  }

  function HealthInfoDiv() {
    return (
      <div className="fill-container">
        <h1>7</h1>
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
          <a className="btn-cadastro go-back">{"< "}Voltar</a>
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
              <textarea className="text-fixed"></textarea>
              <div className="send-comment">
                <div class="box">
                  <select>
                    <option>Documento</option>
                    <option>RG</option>
                    <option>CPF</option>
                    <option>Comprovante de residência</option>
                    <option>...</option>
                  </select>
                </div>
                <button className="btn-send">Enviar</button>
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
