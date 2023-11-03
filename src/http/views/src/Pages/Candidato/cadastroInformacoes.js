import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import MultiStep from "react-multistep";
import "./cadastroInformacoes.css";
import { UilAngleLeft } from "@iconscout/react-unicons";
import { UilAngleRight } from "@iconscout/react-unicons";

export default function CadastroInfo() {
  const nextButton = useRef(null);
  const prevButton = useRef(null);

  function BasicInfoDiv() {
    return (
      <div className="fill-container">
        <div className="input-cadastro title">
          <h2>1. Identificação</h2>
        </div>
        <div className="input-cadastro hidden-title"></div>
        <div className="input-cadastro hidden-title"></div>

        <div className="input-cadastro">
          <input type="text" name="" placeholder="Nome completo"></input>
        </div>
        <div className="input-cadastro">
          <input type="date" placeholder=""></input>
        </div>
        <div className="input-cadastro">
          <input type="text" placeholder="Sexo"></input>
        </div>

        <div className="input-cadastro title">
          <h2>2. Naturalidade</h2>
        </div>
        <div className="input-cadastro hidden-title"></div>
        <div className="input-cadastro hidden-title"></div>

        <div className="input-cadastro">
          <input type="text" placeholder="Estado"></input>
        </div>
        <div className="input-cadastro">
          <input type="text" placeholder="Cidade"></input>
        </div>
        <div className="input-cadastro">
          <input type="text" placeholder="Nacionalidade"></input>
        </div>

        <div className="input-cadastro title">
          <h2>3. Documentos</h2>
        </div>
        <div className="input-cadastro hidden-title"></div>
        <div className="input-cadastro hidden-title"></div>

        <div className="input-cadastro">
          <input type="text" placeholder="CPF"></input>
        </div>
        <div className="input-cadastro">
          <input type="text" placeholder="RG"></input>
        </div>
        <div className="input-cadastro">
          <input type="text" placeholder="Orgão Emissor"></input>
        </div>
        <div className="input-cadastro">
          <input type="text" placeholder="UF do orgão emissor"></input>
        </div>
        <div className="input-cadastro hidden-title"></div>
        <div className="input-cadastro  hidden-title"></div>
        <div className="input-cadastro">
          <input type="text" placeholder="E-mail" required></input>
        </div>
        <div className="input-cadastro">
          <input type="text" placeholder="Profissão"></input>
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
      <div className="upper-cadastro-candidato">
        <h1>CADASTRO</h1>
        <h1>PREENCHA SEUS DADOS</h1>
      </div>
      <div className="container-info">
        <MultiStep
          activeStep={0}
          className="multi-step"
          stepCustomStyle={{
            fontSize: 0.8 + "rem",
          }}
          prevButton={{
            title: "<",
            style: {
              width: 3 + "rem",
              marginTop: 1 + "rem",
              borderWidth: 0,
              fontSize: 2 + "rem",
              backgroundColor: "white",
            },
          }}
          nextButton={{
            title: ">",
            style: {
              width: 3 + "rem",
              borderWidth: 0,
              fontSize: 2 + "rem",
              backgroundColor: "white",
            },
          }}
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
      </div>
    </div>
  );
}
