import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import MultiStep from "react-multistep";
import "./cadastroInformacoes.css";
import { UilAngleLeft } from "@iconscout/react-unicons";
import { UilAngleRight } from "@iconscout/react-unicons";
import CadastroFamiliar from "../../Components/Familia/cadastroFamiliar";
import MembrosFamilia from "../../Components/Familia/MembrosFamilia";
import CadastroBasico from "../../Components/Básico/cadastro-basico.js";
import { CadastroRenda } from "../../Components/cadastro-renda";
import Moradia from "../../Components/Moradia/Moradia";
import { api } from "../../services/axios";
import MembrosFamiliaSaude from "../../Components/Saude/membroSaude";
import Veiculos from "../../Components/Veiculo/Veiculo";
import DespesasTotais from "../../Components/Despesas/DespesasTotais";
import EnviarDocumentos from "../../Components/Documentos/EnvioDocumentos";
import MembrosFamiliaRendaTeste from '../../Components/Renda/membroFamiliateste.js'
import Basico from "../../Components/Básico/basico.js";
import EnviarDeclaracoes from "../../Components/Declarações/Declarações.js";

export default function CadastroInfo() {
  const nextButton = useRef(null);
  const prevButton = useRef(null);

  const [candidato, setCandidato] = useState(null)
  useEffect(() => {
    async function pegarCandidato() {
      const token = localStorage.getItem("token")
      try {
        const response = await api.get("/candidates/basic-info", {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        setCandidato(response.data.candidate)
      } catch (error) {
        alert(error.message)
      }
    }
    pegarCandidato()
  }, [])

  function BasicInfoDiv() {
    return (
      <div>
        <Basico />
      </div>
    )
  }

  function FamilyInfoDiv() {
    return (
      <div>
        <MembrosFamilia />
      </div>
    );
  }

  function HousingInfoDiv() {
    return (
      <div >
        <Moradia />
      </div>
    );
  }

  function VehicleInfoDiv() {
    return (
      <div >
        <Veiculos candidato={candidato}/>
      </div>
    );
  }

  function EarningInfoDiv() {
    return (
      <div>
        <MembrosFamiliaRendaTeste />
      </div>
    )
  }

  function BudgetInfoDiv() {
    return (
      <div >
        <DespesasTotais />
      </div>
    );
  }

  function HealthInfoDiv() {
    return (
      <div >
        <MembrosFamiliaSaude />
      </div>
    );
  }

  function DeclarationsInfoDiv() {
    return (
      <div>
        <EnviarDeclaracoes id={candidato.id}/>
      </div>
    );
  }

  function DocumentsInfoDiv() {
    return (
      <div>
        <EnviarDocumentos id={candidato.id} />
      </div>
    );
  }

  return (
    <div className="container-cadastro-candidato">
      <div className="upper-cadastro-candidato candidato-info-assistente">
        <a className="btn-cadastro go-back"><Link className="btn-cadastro" to={`/candidato/home`}>{"< "}Voltar</Link></a>

        <div className="upper-cadastro-candidato">
          <h1>CADASTRO</h1>
          <h1>PREENCHA SEUS DADOS</h1>
        </div>
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
              display: "none"
            },
          }}
          nextButton={{
            title: ">",
            style: {
              display: "none"
            },
          }}
        >
          <BasicInfoDiv title="Básico"></BasicInfoDiv>
          <FamilyInfoDiv title="Grupo Familiar"></FamilyInfoDiv>
          <HousingInfoDiv title="Moradia"></HousingInfoDiv>
          <VehicleInfoDiv title="Veículo"></VehicleInfoDiv>
          <EarningInfoDiv title="Renda"></EarningInfoDiv>
          <BudgetInfoDiv title="Despesas"></BudgetInfoDiv>
          <HealthInfoDiv title="Saúde"></HealthInfoDiv>
          <DocumentsInfoDiv title="Documentos"></DocumentsInfoDiv>
          <DeclarationsInfoDiv title="Declarações"></DeclarationsInfoDiv>
        </MultiStep>
      </div>
    </div>
  );
}
