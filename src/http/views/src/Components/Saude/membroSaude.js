import { useEffect, useState } from "react";
import { api } from "../../services/axios";
import './membroSaude.css'
import { CadastroSaude } from "../cadastro-saude";


export default function MembrosFamiliaSaude() {
  const [familyMembers, setFamilyMembers] = useState([])
  const [memberSelected, setMemberSelected] = useState(null)
  
  useEffect(() => {
    async function fetchFamilyMembers() {
        const token = localStorage.getItem('token');
        try {

            const response = await api.get("/candidates/family-member", {
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

  return (
    <>
    {!memberSelected && familyMembers.map(familyMember => {
      return (
        <div id={familyMember.id} className="container-teste">
          <div className="member-info">
            <h4>{familyMember.fullName}</h4>
            <h4>{familyMember.relationship}</h4>
            <h4>{familyMember.incomeSource}</h4>
          </div>
        <button type="button" onClick={() => handleShowRegisterIncome(familyMember.id)}>Cadastrar Saúde</button>
      </div>
      )
    })}

    {memberSelected && (
      <>
    <CadastroSaude member={memberSelected}/>
    <button type="button" onClick={handleHideRegisterIncome}>Voltar</button>
    </>
    )}
    </>
  );
}
