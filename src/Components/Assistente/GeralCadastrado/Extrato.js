import react, { useEffect, useState } from "react";
import { UilCheckSquare, UilSquareFull } from "@iconscout/react-unicons";
import { api } from "../../../services/axios";
import "./Extrato.css";
import { formatCurrency } from "../../../utils/format-currency";
import { formatCPF } from "../../../utils/format-cpf";

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
export default function VerExtrato(props) {
  console.log(props.application);
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
  const [candidateIncome, setCandidateIncome] = useState(0);
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(
        `/assistant/expenses/${props.candidate_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      setTotalExpenses(data.grandTotal);
      console.log("====================================");
      console.log(response.data);
      console.log("====================================");
    } catch (error) {
      console.error("Falha ao buscar despesas:", error);
    }
  };

  function translateRelationship(relationshipValue) {
    const relationship = Relationship.find(
      (r) => r.value === relationshipValue
    );
    return relationship ? relationship.label : "Não especificado";
  }
  useEffect(() => {
    async function fetchData() {
      await fetchExpenses();
      await fetchIncomeCandidate();
    }

    fetchData();
    // Remova props.application se não for necessário ou se estiver causando re-renderizações constantes
  }, [props.application]); // Potencialmente remova props.application deste array

  async function fetchIncomeCandidate() {
    const token = localStorage.getItem("token");
    try {
      const response = await api.get(
        `/assistant/income/${props.candidate_id}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setCandidateIncome(
        response.data.totalIncomePerCapita *
        (props.familyMembers.length + 1)
      );
    } catch (error) {
      console.error("Erro ao rankear candidatos", error);
    }
  }
  return (
    <div
      className="fill-container general-info"
      style={{ maxHeight: "fit-content" }}
    >
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
          {props.familyMembers.map((familyMember) => {
            return (
              <tr>
                <td>
                  <strong>{familyMember.fullName}</strong>
                </td>
                <td>{formatCPF(familyMember.CPF)}</td>
                <td>{calculateAge(familyMember.birthDate)}</td>
                <td>{translateRelationship(familyMember.relationship)}</td>
                <td>{familyMember.profession}</td>
              </tr>
            );
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
            <td>{formatCurrency(candidateIncome)}</td>
            <td>{formatCurrency(totalExpenses)}</td>
            <td>Não</td>
            <td>Casa própria</td>
            <td>{props.Vehicles.length}</td>
          </tr>
        </tbody>
      </table>
      <h1>Resumo dos dados do candidato</h1>
      <table>
        <thead>
          <tr>
            <th>Edital</th>
            <th>Inscrição</th>
            <th>Nome civil completo</th>
            <th>RG</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>001/2024</td>
            <td>{props.application.number.toString().padStart(4,'0')}</td>
            <td>{props.identityInfo.fullName}</td>
            <td>{props.identityInfo.RG}</td>
          </tr>
        </tbody>
      </table>
      <h1>Renda familiar bruta mensal compatível com:</h1>
      <div className="check-options">
        <ul>
          <li>
            <UilCheckSquare size="25" color="#1b4f73"></UilCheckSquare>
            <h2>
              Bolsa de estudo integral a aluno cuja renda mensal não exceda a
              1,5 salários mínimos per capita.
            </h2>
          </li>
          <li>
            <UilSquareFull size="25" color="#1b4f73"></UilSquareFull>
            <h2>
              Bolsa de estudo parcial com 50% (cinquenta por cento) de
              gratuidade a aluno cuja renda familiar bruta mensal per capita não
              exceda o valor de 3 (três) salários mínimos.
            </h2>
          </li>
        </ul>
      </div>
    </div>
  );
}
