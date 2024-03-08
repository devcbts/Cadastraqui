import React, { useState } from "react";
import axios from "axios";
import "./verMoradiaAssistente.css";
const PropertyStatus = [
  { value: "OwnPaidOff", label: "Própria e quitada" },
  { value: "OwnFinanced", label: "Própria e financiada" },
  { value: "Rented", label: "Alugada" },
  { value: "ProvidedByEmployer", label: "Cedida pelo empregador" },
  { value: "ProvidedByFamily", label: "Cedida pela família" },
  { value: "ProvidedOtherWay", label: "Cedida de outra forma" },
  { value: "Irregular", label: "Irregular" },
];

const ContractType = [
  { value: "Verbal", label: "Verbal" },
  { value: "ThroughRealEstateAgency", label: "Através de imobiliária" },
  { value: "DirectWithOwner", label: "Direto com o proprietário" },
];

const TimeLivingInProperty = [
  { value: "UpTo11Months", label: "Até 11 meses" },
  { value: "From1To10Years", label: "De 1 a 10 anos" },
  { value: "From10To20Years", label: "De 10 a 20 anos" },
  { value: "Over20Years", label: "Mais de 20 anos" },
];

const DomicileType = [
  { value: "House", label: "Casa" },
  { value: "CondominiumHouse", label: "Casa em condomínio" },
  { value: "Apartment", label: "Apartamento" },
  { value: "RoomingHouse", label: "Casa de cômodos" },
];

const NumberOfRooms = [
  { value: "One", label: "Um" },
  { value: "Two", label: "Dois" },
  { value: "Three", label: "Três" },
  { value: "Four", label: "Quatro" },
  { value: "Five", label: "Cinco" },
  { value: "Six", label: "Seis" },
  { value: "Seven", label: "Sete" },
  { value: "Eight", label: "Oito" },
  { value: "Nine", label: "Nove" },
  { value: "Ten", label: "Dez" },
  { value: "Eleven", label: "Onze" },
  { value: "Twelve", label: "Doze" },
];

export default function VerMoradiaAssistente({ formData }) {
  const handleChange = (e) => {
    //setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {};

  return (
    <div className="fill-box">
      <form onSubmit={handleSubmit} id="survey-form">
        <div className="survey-box">
          <label>Status da propriedade:</label>
          <br />
          <select
            name="propertyStatus"
            value={formData.propertyStatus}
            disabled
            onChange={handleChange}
            required
            className="select-data"
          >
            {PropertyStatus.map((status) => (
              <option value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
        {[
          "ProvidedByEmployer",
          "ProvidedByFamily",
          "ProvidedOtherWay",
        ].includes(formData.propertyStatus) && (
          <div className="survey-box">
            <label>Nome do cedente:</label>

            <br />

            <input
              className="survey-control"
              type="text"
              name="grantorName"
              value={formData.grantorName}
              disabled
              onChange={handleChange}
              required
            />
          </div>
        )}

        {formData.propertyStatus === "Rented" && (
          <div className="survey-box">
            <label>Tipo de contrato:</label>
            <br />
            <select
              name="contractType"
              value={formData.contractType}
              disabled
              onChange={handleChange}
              required
              className="select-data"
            >
              {ContractType.map((type) => (
                <option value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        )}
        <div className="survey-box">
          <label>Tempo vivendo na propriedade:</label>
          <br />
          <select
            name="timeLivingInProperty"
            value={formData.timeLivingInProperty}
            disabled
            onChange={handleChange}
            required
            className="select-data"
          >
            {TimeLivingInProperty.map((time) => (
              <option value={time.value}>{time.label}</option>
            ))}
          </select>
        </div>
        <div className="survey-box">
          <label>Tipo de domicílio:</label>
          <br />
          <select
            name="domicileType"
            value={formData.domicileType}
            disabled
            onChange={handleChange}
            required
            className="select-data"
          >
            {DomicileType.map((type) => (
              <option value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        <div className="survey-box">
          <label>Quantos cômodos tem esse domicílio?</label>
          <br />
          <select
            name="numberOfRooms"
            value={formData.numberOfRooms}
            disabled
            onChange={handleChange}
            required
            className="select-data"
          >
            {NumberOfRooms.map((number) => (
              <option value={number.value}>{number.label}</option>
            ))}
          </select>
        </div>
        <div className="survey-box">
          <label>Quantos cômodos estão servindo permanentemente de dormitório para os moradores deste domicílio?</label>

          <input
            className="survey-control"
            type="number"
            name="numberOfBedrooms"
            value={formData.numberOfBedrooms}
            disabled
            onChange={handleChange}
            min="0"
            required
          />
          <br />
        </div>

        <button type="submit" className="renda-btn width-control">
          Enviar
        </button>
      </form>
    </div>
  );
}
