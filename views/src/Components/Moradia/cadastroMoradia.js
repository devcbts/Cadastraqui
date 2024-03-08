import React, { useState } from "react";
import axios from "axios";
import "./cadastroMoradia.css";
import { api } from "../../services/axios";
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

export default function CadastroMoradia() {
  const [formData, setFormData] = useState({
    grantorName: "",
    propertyStatus: "OwnPaidOff",
    contractType: "",
    timeLivingInProperty: "UpTo11Months",
    domicileType: "House",
    numberOfRooms: "One",
    numberOfBedrooms: 0,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    try {
      const response = await api.post(
        "/candidates/housing-info",
        {
          grantorName: formData.grantorName || undefined,
          propertyStatus: formData.propertyStatus,
          contractType: formData.contractType || undefined,
          timeLivingInProperty: formData.timeLivingInProperty || undefined,
          domicileType: formData.domicileType,
          numberOfRooms: formData.numberOfRooms || undefined,
          numberOfBedrooms: Number(formData.numberOfBedrooms),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      alert("Dados cadastrados com sucesso!");

      // Tratar a resposta conforme necessário
    } catch (error) {
      console.error(error.response.data);
      // Tratar o erro conforme necessário
    }
  };

  return (
    <div className="fill-box">
      <form onSubmit={handleSubmit} id="survey-form">
        <div className="survey-box">
          <label>Status da propriedade:</label>
          <br />
          <select
            className="select-data"
            name="propertyStatus"
            value={formData.propertyStatus}
            onChange={handleChange}
            required
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
              className="select-data"
              name="contractType"
              value={formData.contractType}
              onChange={handleChange}
              required
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
            className="select-data"
            name="timeLivingInProperty"
            value={formData.timeLivingInProperty}
            onChange={handleChange}
            required
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
            className="select-data"
            name="domicileType"
            value={formData.domicileType}
            onChange={handleChange}
            required
          >
            {DomicileType.map((type) => (
              <option value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        <div className="survey-box">
          <label>Número de cômodos:</label>
          <br />
          <select
            className="select-data-2"
            name="numberOfRooms"
            value={formData.numberOfRooms}
            onChange={handleChange}
            required
          >
            {NumberOfRooms.map((number) => (
              <option value={number.value}>{number.label}</option>
            ))}
          </select>
        </div>
        <div className="survey-box">
          <label>Número de quartos:</label>

          <input
            className="survey-control"
            type="number"
            name="numberOfBedrooms"
            value={formData.numberOfBedrooms}
            onChange={handleChange}
            min="0"
            required
          />
          <br />
        </div>

        <button type="submit" className="send-btn">
          Enviar
        </button>
      </form>
    </div>
  );
}
