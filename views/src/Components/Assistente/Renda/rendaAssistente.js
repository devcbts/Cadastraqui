import { useEffect, useState } from "react";
import { VerRendaAssistente } from "./verRendaAssistente";
import { api } from "../../../services/axios";
import { handleAuthError } from "../../../ErrorHandling/handleError";

const IncomeSource = [
  { value: "PrivateEmployee", label: "Empregado Privado" },
  { value: "PublicEmployee", label: "Empregado Público" },
  { value: "DomesticEmployee", label: "Empregado Doméstico" },
  { value: "TemporaryRuralEmployee", label: "Empregado Rural Temporário" },
  { value: "BusinessOwnerSimplifiedTax", label: "Empresário - Regime Simples" },
  { value: "BusinessOwner", label: "Empresário" },
  { value: "IndividualEntrepreneur", label: "Empreendedor Individual" },
  { value: "SelfEmployed", label: "Autônomo" },
  { value: "Retired", label: "Aposentado" },
  { value: "Pensioner", label: "Pensionista" },
  { value: "Apprentice", label: "Aprendiz" },
  { value: "Volunteer", label: "Voluntário" },
  { value: "RentalIncome", label: "Renda de Aluguel" },
  { value: "Student", label: "Estudante" },
  { value: "InformalWorker", label: "Trabalhador Informal" },
  { value: "Unemployed", label: "Desempregado" },
  {
    value: "TemporaryDisabilityBenefit",
    label: "Benefício por Incapacidade Temporária",
  },
  { value: "LiberalProfessional", label: "Profissional Liberal" },
  { value: "FinancialHelpFromOthers", label: "Ajuda Financeira de Terceiros" },
  { value: "Alimony", label: "Pensão Alimentícia" },
  { value: "PrivatePension", label: "Previdência Privada" },
];
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

export default function MembrosFamiliaRendaAssistente({ id}) {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [memberSelected, setMemberSelected] = useState(null);
  const [memberSelectedToSeeIncome, setMemberSelectedToSeeIncome] =
    useState(null);
    const [candidato, setCandidato] = useState(null);
  const [identityInfo, setIdentityInfo] = useState(null);
  useEffect(() => {
    async function pegarCandidato() {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get(`/candidates/basic-info/${id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        setCandidato(response.data.candidate);
      } catch (error) {
        handleAuthError(error);
      }
    }
    async function pegarIdentityInfo() {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get(`/candidates/identity-info/${id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        setIdentityInfo(response.data.identityInfo);
      } catch (error) {
        handleAuthError(error);
      }
    }
    
    pegarCandidato();
    pegarIdentityInfo();
  })
  useEffect(() => {
    async function fetchFamilyMembers() {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get(`/candidates/family-member/${id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
       
        const membrosdaFamilia = response.data.familyMembers;
        const candidateWithIncomeInfo = {
          ...candidato,
          incomeSource: identityInfo.incomeSource || [], // Adiciona ou sobrescreve o campo incomeSource com o valor de identityInfo.IncomeSource
        };
        // Inclui o candidato atualizado no início do array de membros da família
        setFamilyMembers([candidateWithIncomeInfo, ...membrosdaFamilia]);
      } catch (err) {
        alert(err);
      }
    }
    fetchFamilyMembers();
  }, [identityInfo]);

  function handleShowRegisterIncome(familyMemberId) {
    const member = familyMembers.find((member) => member.id === familyMemberId);
    setMemberSelected(member);
  }

  function handleShowIncome(familyMemberId) {
    const member = familyMembers.find((member) => member.id === familyMemberId);
    setMemberSelectedToSeeIncome(member);
  }

  function handleHideRegisterIncome() {
    setMemberSelected(null);
  }
  function handleHideSeeIncome() {
    setMemberSelectedToSeeIncome(null);
  }

  function translateRelationship(relationshipValue) {
    const relationship = Relationship.find(
      (r) => r.value === relationshipValue
    );
    return relationship ? relationship.label : "Não especificado";
  }
  function translateIncomeSource(incomeSources) {
    return incomeSources
      .map((incomeValue) => {
        const incomeSourceItem = IncomeSource.find(
          (item) => item.value === incomeValue
        );
        return incomeSourceItem ? incomeSourceItem.label : "Não especificado";
      })
      .join(", ");
  }
  return (
    <>
      {!memberSelected &&
        !memberSelectedToSeeIncome &&
        familyMembers.map((familyMember) => {
          return (
            <div id={familyMember.id} className="container-teste">
              <div className="member-info">
                <h4>{familyMember.fullName || familyMember.name}</h4>
                <h4>{translateRelationship(familyMember.relationship)}</h4>
                <h4>{translateIncomeSource(familyMember.incomeSource)}</h4>
              </div>
              <button
                className="renda-btn"
                type="button"
                onClick={() => handleShowIncome(familyMember.id)}
              >
                Ver Renda
              </button>
            </div>
          );
        })}

      {memberSelectedToSeeIncome && (
        <>
          <VerRendaAssistente member={memberSelectedToSeeIncome} />
          <button
            className="renda-btn"
            type="button"
            onClick={handleHideSeeIncome}
          >
            Voltar
          </button>
        </>
      )}
    </>
  );
}
