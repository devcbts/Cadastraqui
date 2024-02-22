import React, { useState } from "react";
import axios from "axios";
import { api } from "../../services/axios";
import "./verMoradia.css";

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

export default function VerMoradia({ candidateProp  }) {
  console.log(candidateProp)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = name === "numberOfBedrooms" ? Number(value) : value;
    setCandidate(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : updatedValue,
    }));
  };
  // Estado inicial dos dados do candidato
  const [candidate, setCandidate] = useState(candidateProp );
  // Estado para controlar o modo de edição
  const [isEditing, setIsEditing] = useState(false);



  function toggleEdit() {
    setIsEditing(!isEditing); 
    setCandidate(candidateProp)// Alterna o estado de edição
  }

  async function saveCandidateData(e) {
    e.preventDefault();
    const token = localStorage.getItem('token')
    try {
      const response = await api.patch("/candidates/housing-info", candidate, {
        headers: {
          "Content-Type": "application/json",
          // Aqui você adicionaria o token de autorização se necessário
           'Authorization': `Bearer ${token}`,
        },
      });
      console.log(response.data);
      // Tratar a resposta conforme necessário
    } catch (error) {
      console.error(error.response.data);
      // Tratar o erro conforme necessário
    }
    console.log('Dados salvos', candidate);
    setIsEditing(false); // Desabilita o modo de edição após salvar
  }
  

  return (
    <div className="fill-box">
      <form id="survey-form">
        <div className="survey-box">
          <label>Status da propriedade:</label>
          <br />
          <select
            name="propertyStatus"
            value={candidate.propertyStatus}
            disabled={!isEditing}
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
        ].includes(candidate.propertyStatus) && (
            <div className="survey-box">
              <label>Nome do cedente:</label>

              <br />

              <input
                className="survey-control"
                type="text"
                name="grantorName"
                value={candidate.grantorName}
                disabled={!isEditing}
                onChange={handleChange}
                required
              />
            </div>
          )}

        {candidate.propertyStatus === "Rented" && (
          <div className="survey-box">
            <label>Tipo de contrato:</label>
            <br />
            <select
              name="contractType"
              value={candidate.contractType}
              disabled={!isEditing}
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
            name="timeLivingInProperty"
            value={candidate.timeLivingInProperty}
            disabled={!isEditing}
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
            name="domicileType"
            value={candidate.domicileType}
            disabled={!isEditing}
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
            name="numberOfRooms"
            value={candidate.numberOfRooms}
            
            disabled={!isEditing}
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
            value={candidate.numberOfBedrooms}
            disabled={!isEditing}
            onChange={handleChange}
            min="0"
            required
          />
          <br />
        </div>

        <div className="survey-box">
          {!isEditing ? (
            <button type="button" className="over-button" onClick={toggleEdit}>Editar</button>
          ) : (
            <>
              <button type="button" className="over-button" onClick={saveCandidateData}>Salvar Dados</button>
              <button type="button" className="over-button" onClick={toggleEdit}>Cancelar</button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
