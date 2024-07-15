import { useEffect, useState } from "react";

import { VerSaudeAssistente } from "./verSaude";
import { api } from "../../../services/axios";

const Relationship = [
  { value: 'Wife', label: 'Esposa' },
  { value: 'Husband', label: 'Marido' },
  { value: 'Father', label: 'Pai' },
  { value: 'Mother', label: 'Mãe' },
  { value: 'Stepfather', label: 'Padrasto' },
  { value: 'Stepmother', label: 'Madrasta' },
  { value: 'Sibling', label: 'Irmão/Irmã' },
  { value: 'Grandparent', label: 'Avô/Avó' },
  { value: 'Child', label: 'Filho/Filha' },
  { value: 'Other', label: 'Outro' },
];
export default function MembrosFamiliaSaudeAssistente({ id }) {
  const [familyMembers, setFamilyMembers] = useState([])
  const [memberSelected, setMemberSelected] = useState(null)
  const [memberSelectedToSeeHealth, setMemberSelectedToSeeHealth] =
    useState(null);

  useEffect(() => {
    async function fetchFamilyMembers() {
      const token = localStorage.getItem('token');
      try {

        const response = await api.get(`/candidates/family-member/${id}`, {
          headers: {
            'authorization': `Bearer ${token}`,
          }
        })
          ;
        ;
        ;
        const membrosdaFamilia = response.data.familyMembers
        setFamilyMembers(membrosdaFamilia)
      }
      catch (err) {
        alert(err)
      }
    }
    fetchFamilyMembers()

  }, [])

  function handleShowRegisterIncome(familyMemberId) {
    const member = familyMembers.find((member) => member.id === familyMemberId)
    setMemberSelected(member)
  }

  function handleHideRegisterIncome() {
    setMemberSelectedToSeeHealth(null)
  }
  function translateRelationship(relationshipValue) {
    const relationship = Relationship.find(r => r.value === relationshipValue);
    return relationship ? relationship.label : 'Não especificado';
  }
  function handleShowHealth(familyMemberId) {
    const member = familyMembers.find((member) => member.id === familyMemberId);
    setMemberSelectedToSeeHealth(member);
  }

  return (
    <>
      {!memberSelected && !memberSelectedToSeeHealth && familyMembers.map(familyMember => {
        return (
          <div id={familyMember.id} className="container-teste">
            <div className="member-info">
              <h4>{familyMember.fullName}</h4>
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

            </div>
          </div>
        )
      })}

      {memberSelectedToSeeHealth && (
        <>
          <VerSaudeAssistente member={memberSelectedToSeeHealth} />
          <button type="button" onClick={handleHideRegisterIncome}>Voltar</button>
        </>
      )}
    </>
  );
}
