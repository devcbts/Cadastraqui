import react, { useEffect, useState } from 'react'
import {UilCheckSquare, UilSquareFull} from '@iconscout/react-unicons'
import { api } from '../../../services/axios';
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
export default function VerExtrato(props) {
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
  //Despesas
  const [totalExpenses, setTotalExpenses] = useState(0);
  //Renda
  const [candidateIncome, setCandidateIncome] = useState(0)
    useEffect(() => {
      const fetchExpenses = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await api.get(`/assistant/expenses/${props.candidate_id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
  
         
  
          const data = response.data;
          setTotalExpenses(`R$${data.grandTotal.toFixed(2)}`);
          console.log('====================================');
          console.log(response.data);
          console.log('====================================');
        } catch (error) {
          console.error('Falha ao buscar despesas:', error);
        } 
      };
  
      fetchExpenses();
      fetchIncomeCandidate();
    }, [props.familyMembers]);

  function translateRelationship(relationshipValue) {
    const relationship = Relationship.find(r => r.value === relationshipValue);
    return relationship ? relationship.label : 'Não especificado';
  }
  async function fetchIncomeCandidate() {
    const token = localStorage.getItem("token");
    try {
      const response = await api.get(`/assistant/income/${props.candidate_id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data)
      setCandidateIncome(`R$${response.data.totalIncomePerCapita.toFixed(2)}`)
    } catch (error) {
      console.error("Erro ao rankear candidatos", error);
    }
  }
  return (

    <div className="fill-container general-info">
      <h1>Integrantes do grupo familiar</h1>
      <table>
        <thead>
          <tr>
            <th>Nome Completo</th>
            <th>CPF</th>
            <th>Idade</th>
            <th>Parentesco</th>
            <th>Emprego</th>
          </tr>
        </thead>
        <tbody>
          {props.familyMembers.map(familyMember => {
            return (
              <tr>
                <td>
                  <strong>{familyMember.fullName}</strong>
                </td>
                <td>{familyMember.CPF}</td>
                <td>{calculateAge(familyMember.birthDate)}</td>
                <td>{translateRelationship(familyMember.relationship)}</td>
                <td>{familyMember.profession}</td>
              </tr>
            )
          })}


        </tbody>
      </table>
      <h1>Resumo dos dados relevantes</h1>
      <table>
        <thead>
          <tr>
            <th>Cód. Único</th>
            <th>Renda familiar bruta</th>
            <th>Soma das despesas</th>
            <th>Doença grave</th>
            <th>Situação da moradia</th>
            <th>Veículos discriminados</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Sim</td>
            <td>{candidateIncome}</td>
            <td>{totalExpenses}</td>
            <td>Não</td>
            <td>Casa própria</td>
            <td>0</td>
          </tr>
        </tbody>
      </table>
      <h1>Renda familiar bruta mensal compatível com:</h1>
      <div className="check-options">
        <ul>
          <li>
            <UilCheckSquare size="25" color="#1b4f73"></UilCheckSquare>
            Bolsa de estudo integral a aluno cuja renda mensal não exceda a
            1,5 salários mínimos per capita.
          </li>
          <li>
            <UilSquareFull size="25" color="#1b4f73"></UilSquareFull>
            Bolsa de estudo parcial.
          </li>
        </ul>
      </div>
    </div>
  )
}