import { useEffect, useState } from "react";
import { api } from "../../services/axios";
import "./membroFamilia.css";
import { CadastroRenda } from "../cadastro-renda";
import { VerRenda } from "./verRenda";

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

export default function MembrosFamiliaRendaTeste({candidate, identityInfo}) {
  const [familyMembers, setFamilyMembers] = useState(null);
  const [memberSelected, setMemberSelected] = useState(null);
  const [memberSelectedToSeeIncome, setMemberSelectedToSeeIncome] =
    useState(null);

  useEffect(() => {
    async function fetchFamilyMembers() {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get("/candidates/family-member", {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        console.log("====================================");
        console.log(response.data);
        console.log("====================================");
        const membrosdaFamilia = response.data.familyMembers;
        const candidateWithIncomeInfo = {
          ...candidate,
          incomeSource: identityInfo.incomeSource || [], // Adiciona ou sobrescreve o campo incomeSource com o valor de identityInfo.IncomeSource
        };
        console.log(candidate)
        // Inclui o candidato atualizado no início do array de membros da família
        setFamilyMembers([candidateWithIncomeInfo, ...membrosdaFamilia]);
            } catch (err) {
        alert(err);
      }
    }
    fetchFamilyMembers();
  }, []);

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
  function translateIncomeSource(incomeArray) {
    const translatedIncome = incomeArray?.map(incomeValue => {
        const foundIncome = IncomeSource.find(item => item.value === incomeValue);
        return foundIncome ? foundIncome.label : "Não especificado";
    });
    return translatedIncome?.join(', ');
}
  return (
    <>
      {!memberSelected &&
        !memberSelectedToSeeIncome && familyMembers &&
        familyMembers.map((familyMember) => {
          return (
            <div id={familyMember.id} className="container-teste">
              <div className="member-info">
                <h4 className="family-name">{familyMember.fullName || familyMember.name}</h4>
                <h4>{translateRelationship(familyMember.relationship)}</h4>
                <h4>{translateIncomeSource(familyMember.incomeSource)}</h4>
              </div>
              <div className="box-renda-btn">
                <button
                  type="button"
                  className="renda-btn"
                  onClick={() => handleShowIncome(familyMember.id)}
                >
                  Ver Renda
                </button>
                <button
                  type="button"
                  className="renda-btn"
                  onClick={() => handleShowRegisterIncome(familyMember.id)}
                >
                  Cadastrar Renda
                </button>
              </div>
            </div>
          );
        })}

      {memberSelectedToSeeIncome && (
        <>
          <VerRenda member={memberSelectedToSeeIncome} />
          <button type="button" onClick={handleHideSeeIncome}>
            Voltar
          </button>
        </>
      )}

      {memberSelected && (
        <>
          <CadastroRenda member={memberSelected} />
          <button type="button" onClick={handleHideRegisterIncome}>
            Voltar
          </button>
        </>
      )}
    </>
  );
}
