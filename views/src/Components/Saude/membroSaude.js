import { useEffect, useState } from "react";
import { api } from "../../services/axios";
import "./membroSaude.css";
import { CadastroSaude } from "../cadastro-saude";
import { VerSaude } from "./verSaude";
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

export default function MembrosFamiliaSaude({candidate}) {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [memberSelected, setMemberSelected] = useState(null);

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
  function translateRelationship(relationshipValue) {
    const relationship = Relationship.find(
      (r) => r.value === relationshipValue
    );
    return relationship ? relationship.label : "Não especificado";
  }
  function handleShowRegisterIncome(familyMemberId) {
    const member = familyMembers.find((member) => member.id === familyMemberId);
    setMemberSelected(member);
  }

  function handleShowHealth(familyMemberId) {
    const member = familyMembers.find((member) => member.id === familyMemberId);
    setMemberSelectedToSeeHealth(member);
  }

  function handleHideRegisterIncome() {
    setMemberSelected(null);
  }

  function handleHideSeeIncome() {
    setMemberSelectedToSeeHealth(null);
  }

  const [memberSelectedToSeeHealth, setMemberSelectedToSeeHealth] =
    useState(null);

  return (
    <>
      {!memberSelected &&
        !memberSelectedToSeeHealth &&
        familyMembers.map((familyMember) => {
          return (
            <div id={familyMember.id} className="container-teste">
              <div className="member-info">
                <h4 className="family-name">{familyMember.fullName || familyMember.name}</h4>
                <h4>{translateRelationship(familyMember.relationship)}</h4>
              </div>
              <div className="box-renda-btn">
                <button
                  type="button"
                  className="renda-btn"
                  onClick={() => handleShowHealth(familyMember.id)}
                >
                  Ver Saúde
                </button>
                <button
                  type="button"
                  className="renda-btn"
                  onClick={() => handleShowRegisterIncome(familyMember.id)}
                >
                  Cadastrar Saúde
                </button>
              </div>
            </div>
          );
        })}

      {memberSelectedToSeeHealth && (
        <>
          <VerSaude member={memberSelectedToSeeHealth} />
          <button type="button" onClick={handleHideSeeIncome}>
            Voltar
          </button>
        </>
      )}

      {memberSelected && (
        <>
          <CadastroSaude member={memberSelected} />
          <button type="button" onClick={handleHideRegisterIncome}>
            Voltar
          </button>
        </>
      )}
    </>
  );
}
