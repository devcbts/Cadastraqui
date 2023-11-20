import react from 'react'
import {UilCheckSquare, UilSquareFull} from '@iconscout/react-unicons'
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
export default function VerExtrato({ familyMembers }) {
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
    const relationship = Relationship.find(r => r.value === relationshipValue);
    return relationship ? relationship.label : 'Não especificado';
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
          {familyMembers.map(familyMember => {
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
            <th>Distância da residência</th>
            <th>Situação da moradia</th>
            <th>Veículos discriminados</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Sim</td>
            <td>R$3500,00</td>
            <td>R$3487,00</td>
            <td>Não</td>
            <td>2,4 km</td>
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