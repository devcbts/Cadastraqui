import React from "react";
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
        <div className="input-cadastro"></div>
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
        <h1>3</h1>
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
    return (
      <div className="fill-container">
        <h1>5</h1>
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
