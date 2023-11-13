import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import MultiStep from "react-multistep";
import "./cadastroInformacoes.css";
import { UilAngleLeft } from "@iconscout/react-unicons";
import { UilAngleRight } from "@iconscout/react-unicons";
import CadastroFamiliar from "../../Components/Familia/cadastroFamiliar";
import MembrosFamilia from "../../Components/Familia/MembrosFamilia";
import CadastroBasico from "../../Components/cadastro-basico";
import CadastroRenda from "../../Components/cadastro-renda";
import Moradia from "../../Components/Moradia/Moradia";
import Veiculo from "../../Components/Veiculo/Veiculo";
import DespesasTotais from "../../Components/Despesas/DespesasTotais";
export default function CadastroInfo() {
  const nextButton = useRef(null);
  const prevButton = useRef(null);

  function BasicInfoDiv() {
    return (
      <div>
        <CadastroBasico/>
      </div>
    )
  }

  function FamilyInfoDiv() {
    return (
      <div>
        <MembrosFamilia/>
      </div>
    );
  }

  function HousingInfoDiv() {
    return (
      <div >
        <Moradia/>
      </div>
    );
  }

  function VehicleInfoDiv() {
    return (
      <div >
        <Veiculo/>
      </div>
    );
  }

  function EarningInfoDiv() {
    return (
      <div>
        <CadastroRenda/>
      </div>
    )
  }

  function BudgetInfoDiv() {
    return (
      <div >
        <DespesasTotais/>
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
