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
export default function MembrosFamiliaSaudeAssistente({id}) {
  const [familyMembers, setFamilyMembers] = useState([])
  const [memberSelected, setMemberSelected] = useState(null)
  
  useEffect(() => {
    async function fetchFamilyMembers() {
        const token = localStorage.getItem('token');
        try {

            const response = await api.get(`/candidates/family-member/${id}`, {
                headers: {
                    'authorization': `Bearer ${token}`,
                }
            })
            console.log('====================================');
            console.log(response.data);
            console.log('====================================');
            const membrosdaFamilia = response.data.familyMembers
            setFamilyMembers(membrosdaFamilia)
        }
        catch (err) {
            alert(err)
        }
    }
    fetchFamilyMembers()
    
},[])

 function handleShowRegisterIncome(familyMemberId) {
  const member = familyMembers.find((member) => member.id === familyMemberId)
  setMemberSelected(member)
 }

 function handleHideRegisterIncome() {
  setMemberSelected(null)
 }
 function translateRelationship(relationshipValue) {
  const relationship = Relationship.find(r => r.value === relationshipValue);
  return relationship ? relationship.label : 'Não especificado';
}
  return (
    <>
    {!memberSelected && familyMembers.map(familyMember => {
      return (
        <div id={familyMember.id} className="container-teste">
          <div className="member-info">
            <h4>{familyMember.fullName}</h4>
            <h4>{translateRelationship(familyMember.relationship)}</h4>
            <h4>{familyMember.incomeSource}</h4>
          </div>
      </div>
      )
    })}

    {memberSelected && (
      <>
    <VerSaudeAssistente member={memberSelected}/>
    <button type="button" onClick={handleHideRegisterIncome}>Voltar</button>
    </>
    )}
    </>
  );
}
