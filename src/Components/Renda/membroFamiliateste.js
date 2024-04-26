import { useEffect, useState } from "react";
import { api } from "../../services/axios";
import "./membroFamilia.css";
import { CadastroRenda } from "../cadastro-renda";
import { VerRenda } from "./verRenda";
import { DropdownMembros } from "../Familia/MembrosFamilia";
import ReactSelect from "react-select";
import Swal from "sweetalert2";

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

export default function MembrosFamiliaRendaTeste({ candidate, identityInfo }) {
  const [familyMembers, setFamilyMembers] = useState(null);
  const [memberSelected, setMemberSelected] = useState(null);
  const [memberSelectedToSeeIncome, setMemberSelectedToSeeIncome] =
    useState(null);
  const [members, setMembers] = useState(null)
  const [currentMember, setCurrentMember] = useState()
  const [isAddingIncome, setIsAddingIncome] = useState(false)
  const candidateWithIncomeInfo = {
    ...candidate,
    incomeSource: identityInfo?.incomeSource || [], // Adiciona ou sobrescreve o campo incomeSource com o valor de identityInfo.IncomeSource
  };
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

        console.log('income', candidateWithIncomeInfo)
        // Inclui o candidato atualizado no início do array de membros da família
        setFamilyMembers([candidateWithIncomeInfo, ...membrosdaFamilia]);
      } catch (err) {
        console.log(err)
      }
    }
    fetchFamilyMembers();

  }, [identityInfo]);

  function handleShowRegisterIncome(familyMemberId) {
    setIsAddingIncome(false)
    const member = familyMembers.find((member) => member.id === familyMemberId);
    setMemberSelected(currentMember);
  }

  function handleShowIncome(familyMemberId) {
    setIsAddingIncome(false)
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
  useEffect(() => {
    async function pegarMembros() {
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
        console.log('MEMBROS', membrosdaFamilia)
        setMembers([{ ...candidateWithIncomeInfo, fullName: candidate.name }, ...membrosdaFamilia,]);
        console.log(candidate)

      } catch (err) {
        alert(err);
      }
    }
    pegarMembros();
  }, []);
  const handleSelectIncome = (e) => {
    setCurrentMember((prevState) => ({ ...prevState, incomeSource: e.map(v => v.value) }))
  }
  const handleOpenSelection = () => {
    if (isAddingIncome) {
      setCurrentMember(null)
    }
    setIsAddingIncome(!isAddingIncome)
  }
  const handleRegisterNewIncomeSources = async () => {
    try {

      await api.post('/candidates/update-income-source', {
        id: currentMember.id,
        incomeSource: currentMember.incomeSource
      })
      handleOpenSelection()
      setFamilyMembers((prevState) => prevState.map(member => {
        return member.id === currentMember.id ? { ...member, incomeSource: currentMember.incomeSource } : member
      }))
      if (currentMember.incomeSource.length !== 0) handleShowRegisterIncome(currentMember.id)

    } catch (err) {
      Swal.fire({
        title: 'Erro',
        icon: "error",
        text: err.response.data.message
      })
    }

  }
  return (
    <>
      {(!!members && isAddingIncome) &&
        <>

          <DropdownMembros membros={members} onSelect={setCurrentMember} />
          {currentMember &&
            <>
              <div class="survey-box">
                <label for="incomeSource" id="incomeSource-label">
                  Fonte(s) de renda:
                </label>
                <br />
                <ReactSelect
                  name="incomeSource"
                  isMulti
                  is
                  onChange={handleSelectIncome}
                  options={IncomeSource}
                  value={IncomeSource.filter(obj => currentMember?.incomeSource?.includes(obj.value))}
                  id="incomeSource"
                  class="select-data"
                />
              </div>
              <button
                type="button"
                className="renda-btn"
                onClick={handleRegisterNewIncomeSources}
              >
                Cadastrar
              </button>
            </>
          }
        </>
      }
      {(!memberSelected && !memberSelectedToSeeIncome) && <button
        type="button"
        className="renda-btn"
        onClick={handleOpenSelection}
      >
        {isAddingIncome ? 'Fechar' : 'Cadastrar fontes de renda'}
      </button>}
      {!memberSelected &&
        !memberSelectedToSeeIncome && familyMembers &&
        familyMembers.map((familyMember) => {
          return familyMember.incomeSource.length !== 0 ? (
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
                {/* <button
                  type="button"
                  className="renda-btn"
                  onClick={() => handleShowRegisterIncome(familyMember.id)}
                >
                  Cadastrar Renda
                </button> */}
              </div>
            </div>
          ) : null;
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
