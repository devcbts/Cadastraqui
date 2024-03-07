import React from "react";
import { useState, useEffect } from "react";
import VerExtrato from "./Extrato";
import "./Parecer.css";
import { api } from "../../../services/axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { UilFileCheckAlt } from "@iconscout/react-unicons";
import { UilCheckCircle } from "@iconscout/react-unicons";
import { UilTimesCircle } from "@iconscout/react-unicons";

const Relationship = [
  { value: "Wife", label: "Esposa" },
  { value: "Husband", label: "Marido" },
  { value: "Father", label: "Pai" },
  { value: "Mother", label: "Mãe" },
  { value: "Stepfather", label: "Padrasto" },
  { value: "Stepmother", label: "Madrasta" },
  { value: "Sibling", label: "Irmão/Irmã" },
  { value: "Grandparent", label: "Avô/Avó" },
  { value: "Child", label: "Filho/Filha" },
  { value: "Other", label: "Outro" },
];

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

const VehicleSituation = [
  { value: "PaidOff", label: "Quitado" },
  { value: "Financed", label: "Financiado" },
];
const MARITAL_STATUS = [
  { value: "Single", label: "Solteiro(a)" },
  { value: "Married", label: "Casado(a)" },
  { value: "Separated", label: "Separado(a)" },
  { value: "Divorced", label: "Divorciado(a)" },
  { value: "Widowed", label: "Viúvo(a)" },
  { value: "StableUnion", label: "União Estável" },
];

const Disease = [
  { value: "ALIENATION_MENTAL", label: "Alienação Mental" },
  { value: "CARDIOPATHY_SEVERE", label: "Cardiopatia Grave" },
  { value: "BLINDNESS", label: "Cegueira" },
  { value: "RADIATION_CONTAMINATION", label: "Contaminação por Radiação" },
  { value: "PARKINSONS_DISEASE", label: "Doença de Parkinson" },
  { value: "ANKYLOSING_SPONDYLITIS", label: "Espondilite Anquilosante" },
  { value: "PAGETS_DISEASE", label: "Doença de Paget" },
  { value: "HANSENS_DISEASE", label: "Hanseníase (Lepra)" },
  { value: "SEVERE_HEPATOPATHY", label: "Hepatopatia Grave" },
  { value: "SEVERE_NEPHROPATHY", label: "Nefropatia Grave" },
  { value: "PARALYSIS", label: "Paralisia" },
  { value: "ACTIVE_TUBERCULOSIS", label: "Tuberculose Ativa" },
  { value: "HIV_AIDS", label: "HIV/AIDS" },
  { value: "MALIGNANT_NEOPLASM", label: "Neoplasma Maligno (Câncer)" },
  { value: "TERMINAL_STAGE", label: "Estágio Terminal" },
  { value: "MICROCEPHALY", label: "Microcefalia" },
  {
    value: "AUTISM_SPECTRUM_DISORDER",
    label: "Transtorno do Espectro Autista",
  },
  { value: "RARE_DISEASE", label: "Doença Rara" },
  { value: "OTHER_HIGH_COST_DISEASE", label: "Outra Doença de Alto Custo" },
];
export default function VerParecer({
  identityInfo,
  FamilyMembers,
  Housing,
  Vehicles,
  candidate,
  announcement,
  application_id,
  healthInfo,
  application
}) {
  console.log(application)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const printDocument = () => {
    const input = document.getElementById('parecer-print');
    setIsGeneratingPDF(true)
    // Ajusta o estilo para garantir que toda a página seja capturada
    const originalStyle = input.style.cssText;
    input.style.maxHeight = 'none';
    input.style.overflow = 'visible';
  
    html2canvas(input, { scrollY: -window.scrollY, scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
      });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('parecer.pdf');
      // Restaura o estilo original após a captura
      input.style.cssText = originalStyle;
      setIsGeneratingPDF(false)
    });
  };
  
  
  function updateApplicationStatus(newStatus) {
    api
      .patch(`/assistant/${announcement.id}/${application_id}`, {
        status: newStatus,
      })
      .then((response) => {
        // Handle successful response
        console.log("Status atualizado com sucesso:", response.data);
      })
      .catch((error) => {
        // Handle error
        console.error("Erro ao atualizar status:", error);
      });
  }

  function calculateAge(birthDate) {
    const birthDateObj = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const m = today.getMonth() - birthDateObj.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }

    return age;
  }

  function translateRelationship(relationshipValue) {
    const relationship = Relationship.find(
      (r) => r.value === relationshipValue
    );
    return relationship ? relationship.label : "Não especificado";
  }
  function translatePropetyStatus(propertyStatus) {
    const Status = PropertyStatus.find((r) => r.value === propertyStatus);
    return Status ? Status.label : "Não especificado";
  }
  function translateContractType(contractTypeValue) {
    const type = ContractType.find((t) => t.value === contractTypeValue);
    return type ? type.label : "Não especificado";
  }

  function translateTimeLivingInProperty(timeValue) {
    const time = TimeLivingInProperty.find((t) => t.value === timeValue);
    return time ? time.label : "Não especificado";
  }

  function translateDomicileType(domicileTypeValue) {
    const type = DomicileType.find((t) => t.value === domicileTypeValue);
    return type ? type.label : "Não especificado";
  }

  function translateNumberRooms(Number) {
    const type = NumberOfRooms.find((t) => t.value === Number);
    return type ? type.label : "Não especificado";
  }

  function translateVehicleSituation(situation) {
    const type = VehicleSituation.find((t) => t.value === situation);
    return type ? type.label : "Não especificado";
  }
  function translateMaritalStatus(status) {
    const type = MARITAL_STATUS.find((t) => t.value === status);
    return type ? type.label : "Não especificado";
  }

  const getDiseaseValuesByLabels = (diseaseLabels) => {
    return diseaseLabels
      .map((value) => {
        const diseaseItem = Disease.find((item) => item.value === value);
        return diseaseItem ? diseaseItem.label : "";
      })
      .filter((label) => label !== ""); // Filtra quaisquer valores não encontrados (strings vazias)
  };
  return (
    <div
      id="parecer-print"
      className="fill-container general-info"
      style={{ maxHeight: "fit-content" }}
    >
      <h1 id="parecer-text">
        Em, {"02-11-2023"} o(a) candidato
        {"("}a{")"} {identityInfo.fullName}, portador{"("}a{")"} da cédula de
        identidade RG número {identityInfo.RG}, orgão emissor{" "}
        {identityInfo.rgIssuingAuthority}, UF do orgão emissor{" "}
        {identityInfo.rgIssuingState}, com Nacionalidade{" "}
        {identityInfo.nationality},{" "}
        {translateMaritalStatus(identityInfo.maritalStatus)} e{" "}
        {identityInfo.profession}, residente no {candidate.address}{" "}
        {candidate.addressNumber}, CEP {candidate.CEP}, {candidate.neighborhood}
        , {candidate.city}, {candidate.UF}. Com email {candidate.email}, se
        inscreveu para participar do processo seletivo de que trata o Edital{" "}
        {announcement.announcementName} e recebeu número de inscrição {application.number.toString().padStart(4,'0')}.
        <br></br>
      </h1>
      <h1 id="parecer-text" style={{display: 'block'}}>
        O candidato possui a idade de {calculateAge(identityInfo.birthDate)}{" "}
        anos e reside com:
        {FamilyMembers.map((familyMember, index) => (
          <span key={index}>
            {index > 0 && ", "}{" "}
            {/* Adiciona vírgula entre os nomes, exceto antes do primeiro */}
            {familyMember.fullName} (
            {translateRelationship(familyMember.relationship)})
          </span>
        ))}
      </h1>
        .
      <h1 id="parecer-text">
        <br></br>O grupo familiar objeto da análise reside em imóvel{" "}
        {translatePropetyStatus(Housing.propertyStatus)}{" "}
        {Housing.propertyStatus === "Rented" &&
          translateContractType(Housing.contractType)}{" "}
        pelo prazo de{" "}
        {translateTimeLivingInProperty(Housing.timeLivingInProperty)} e a
        moradia é do tipo {translateDomicileType(Housing.domicileType)}. Esta
        moradia possui {translateNumberRooms(Housing.numberOfRooms)} cômodos,
        sendo que {Housing.numberOfBedrooms} estão servindo permanentemente de
        dormitório para os moradores deste domicílio.
        <br></br>
        <br></br>
        Nenhum integrante do grupo familiar possui doença grave ou crônica que
        exija custeio elevado.
        <br></br>
        <br></br>
        Os integrantes possuem veículos conforme identificação abaixo:
      </h1>
      <table id="vehicle-info">
        <thead>
          <tr>
            <th>Proprietário</th>
            <th>Modelo/Marca</th>
            <th>Ano/fabricação</th>
            <th>Situação</th>
          </tr>
        </thead>
        <tbody>
          {Vehicles.map((vehicle) => {
            return (
              <tr>
                <td>
                  {vehicle.ownerNames
                    .map((name) => name.split(" ")[0])
                    .join(", ")}{" "}
                </td>
                <td>{vehicle.modelAndBrand}</td>
                <td>{vehicle.manufacturingYear}</td>
                <td>{translateVehicleSituation(vehicle.situation)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <VerExtrato
        familyMembers={FamilyMembers}
        candidate_id={candidate.id}
        identityInfo={identityInfo}
        Vehicles={Vehicles}
      />
      <h1>Informações de Saúde do Grupo Familiar</h1>
      <table id="health-info-family">
        <thead>
          <tr>
            <th>Integrante do grupo familiar</th>
            <th>Doença</th>
            <th>Possui relatório médico e laudo de exames?</th>
          </tr>
        </thead>
        <tbody>
          {/* Adicione linhas estáticas ou dinâmicas conforme necessário */}
          {healthInfo?.map((member) => {
            console.log(member.healthInfo[0]?.diseases);
            return (
              <tr>
                <td>{member.name}</td>
                <td>
                  {member.healthInfo[0]?.diseases
                    ? getDiseaseValuesByLabels(
                      member.healthInfo[0]?.diseases
                    ).join(", ")
                    : "Não há"}
                </td>
                <td>
                  {member.healthInfo[0]?.hasMedicalReport ? "Sim" : "Não"}
                </td>
              </tr>
            );
          })}
          {/* ... mais linhas conforme necessário */}
        </tbody>
      </table>

      <h1>Medicamentos Usados pelo Grupo Familiar</h1>
      <table id="medication-info-family">
        <thead>
          <tr>
            <th>Integrante do grupo</th>
            <th>Nome do(s) Medicamento(s)</th>
            <th>Obtém medicamentos através da rede pública?</th>
            <th>Relação de medicamentos obtidos através da rede pública.</th>
          </tr>
        </thead>
        <tbody>
          {/* Adicione linhas estáticas ou dinâmicas conforme necessário */}
          {healthInfo?.map((member) => {
            if (member.healthInfo.medicationName) {
              return (
                <tr>
                  <td>{member.name}</td>
                  <td>
                    {member.healthInfo?.medicationName
                      ? member.healthInfo?.medicationName
                      : "Não há"}
                  </td>
                  <td>{member.healthInfo?.obtainedPublicly ? "Sim" : "Não"}</td>
                  <td>
                    {member.healthInfo?.specificMedicationPublicly
                      ? member.healthInfo?.specificMedicationPublicly
                      : "Não há"}
                  </td>
                </tr>
              );
            }
          })}
          {/* ... mais linhas conforme necessário */}
        </tbody>
      </table>
      <h1 style={{marginTop: '18px' ,width: 'fit-content', fontSize: '19px'}}>Diante do acima exposto, conclui-se a análise pelo:</h1>
      <div className="buttons-box">
        <div className="decision-buttons">
          <button
            className="button-deferido"
            onClick={() => updateApplicationStatus("Approved")}
          >
            <UilCheckCircle></UilCheckCircle>
            Deferimento
          </button>
          <button
            className="button-indeferido"
            onClick={() => updateApplicationStatus("Rejected")}
          >
            <UilTimesCircle></UilTimesCircle>
            Indeferimento
          </button>
        </div>

        <button onClick={printDocument} className="button-pdf">
          <UilFileCheckAlt></UilFileCheckAlt>
          Gerar PDF
        </button>
      </div>
      
      <div style={{ display: isGeneratingPDF ? 'block' : 'block', fontSize: '12px', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ marginBottom: '20px' }}>
          <label>Local:</label>
          <div style={{ borderBottom: '1px solid #000', width: '70%', display: 'inline-block' }}></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
          <div>
            <label>Nome:</label>
            <div style={{ borderBottom: '1px solid #000', width: '200px', display: 'inline-block' }}></div>
          </div>
          <div>
            <label>CPF:</label>
            <div style={{ borderBottom: '1px solid #000', width: '200px', display: 'inline-block' }}></div>
          </div>
          <div>
            <label>CRESS/ :</label>
            <div style={{ borderBottom: '1px solid #000', width: '80px', display: 'inline-block' }}></div>
          </div>
        </div>
      </div>

    </div>
  );
}

