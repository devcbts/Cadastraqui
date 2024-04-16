import React, { useEffect } from "react";
import "./Familia/cadastroFamiliar.css";
import { useState } from "react";
import { api } from "../services/axios";
import FamilyMember from "./family-member";
import { handleSuccess } from "../ErrorHandling/handleSuceess";
import { handleAuthError } from "../ErrorHandling/handleError";
import { formatCurrency } from "../utils/format-currency";
import { formatCPF } from "../utils/format-cpf";
import { formatCNPJ } from "../utils/format-cnpj";
import InputCheckbox from "./Inputs/InputCheckbox";
import useForm from "../hooks/useForm";
import Input from "./Inputs/FormInput";
import FormCheckbox from "./Inputs/FormCheckbox";
import IncomeFormModelA from "./Renda/FormModels/IncomeFormModelA";
import Swal from "sweetalert2";
import IncomeFormModelB from "./Renda/FormModels/IncomeFormModelB";
import IncomeFormModelC from "./Renda/FormModels/IncomeFormModelC";
import IncomeFormModelD from "./Renda/FormModels/IncomeFormModelD";

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

const GENDER = [
  { value: "MALE", label: "Masculino" },
  { value: "FEMALE", label: "Feminino" },
];

const COUNTRY = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AM", label: "Amazonas" },
  { value: "AP", label: "Amapá" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MG", label: "Minas Gerais" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MT", label: "Mato Grosso" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "PR", label: "Paraná" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SE", label: "Sergipe" },
  { value: "SP", label: "São Paulo" },
  { value: "TO", label: "Tocantins" },
];

const DOCUMENT_TYPE = [
  { value: "DriversLicense", label: "Carteira de Motorista" },
  { value: "FunctionalCard", label: "Carteira Funcional" },
  { value: "MilitaryID", label: "Identidade Militar" },
  { value: "ForeignerRegistration", label: "Registro de Estrangeiro" },
  { value: "Passport", label: "Passaporte" },
  { value: "WorkCard", label: "Carteira de Trabalho" },
];

const MARITAL_STATUS = [
  { value: "Single", label: "Solteiro(a)" },
  { value: "Married", label: "Casado(a)" },
  { value: "Separated", label: "Separado(a)" },
  { value: "Divorced", label: "Divorciado(a)" },
  { value: "Widowed", label: "Viúvo(a)" },
  { value: "StableUnion", label: "União Estável" },
];

const SkinColor = [
  { value: "Yellow", label: "Amarela" },
  { value: "White", label: "Branca" },
  { value: "Indigenous", label: "Indígena" },
  { value: "Brown", label: "Parda" },
  { value: "Black", label: "Preta" },
  { value: "NotDeclared", label: "Não Declarado" },
];

const RELIGION = [
  { value: "Catholic", label: "Católica" },
  { value: "Evangelical", label: "Evangélica" },
  { value: "Spiritist", label: "Espírita" },
  { value: "Atheist", label: "Ateia" },
  { value: "Other", label: "Outra" },
  { value: "NotDeclared", label: "Não Declarada" },
];

const SCHOLARSHIP = [
  { value: "Illiterate", label: "Analfabeto" },
  { value: "ElementarySchool", label: "Ensino Fundamental" },
  { value: "HighSchool", label: "Ensino Médio" },
  { value: "CollegeGraduate", label: "Graduação" },
  { value: "CollegeUndergraduate", label: "Graduação Incompleta" },
  { value: "Postgraduate", label: "Pós-Graduação" },
  { value: "Masters", label: "Mestrado" },
  { value: "Doctorate", label: "Doutorado" },
  { value: "PostDoctorate", label: "Pós-Doutorado" },
];

const Institution_Type = [
  { value: "Public", label: "Pública" },
  { value: "Private", label: "Privada" },
];

const Education_Type = [
  { value: "Alfabetizacao", label: "Alfabetização" },
  { value: "Ensino_Medio", label: "Ensino Médio" },
  { value: "Ensino_Tecnico", label: "Ensino Técnico" },
  { value: "Ensino_Superior", label: "Ensino Superior" },
];

const SHIFT = [
  { value: "Morning", label: "Matutino" },
  { value: "Afternoon", label: "Vespertino" },
  { value: "Evening", label: "Noturno" },
  { value: "FullTime", label: "Integral" },
];

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
export const CadastroRenda = ({ member }) => {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    async function fetchFamilyMemberIncome() {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get(`/candidates/family-member/income/${member.id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        console.log(response.data.familyMemberIncomeInfo)

        setLoading(false)

      } catch (err) {
        alert(err);
      }
    }
    fetchFamilyMemberIncome();
  }, []);

  function translateRelationship(relationshipValue) {
    const relationship = Relationship.find(
      (r) => r.value === relationshipValue
    );
    return relationship ? relationship.label : "Não especificado";
  }

  function translateIncomeSource(incomeArray) {
    const translatedIncome = incomeArray.map((incomeValue) => {
      const foundIncome = IncomeSource.find(
        (item) => item.value === incomeValue
      );
      return foundIncome ? foundIncome.label : "Não especificado";
    });
    return translatedIncome.join(", ");
  }




  const handleSubmit = async (data) => {
    const foundIncome = IncomeSource.find(
      (item) => item.value === data.incomeSource
    ).label;
    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/candidates/family-member/income/${member.id}`,
        data,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      )
      Swal.fire({
        title: 'Renda cadastrada',
        text: `Renda para ${foundIncome} cadastrada`,
        icon: 'success'
      })
    } catch (err) { }
  }


  return (
    <div>
      <div className="fill-box">
        <form id="survey-form-renda">
          <h4>
            Cadastro do {member.fullName} ({" "}
            {translateRelationship(member.relationship)} )
          </h4>
          {/* Fonte de Renda  */}
          <h4>Fonte de renda: {translateIncomeSource(member.incomeSource)}</h4>
          {member.incomeSource
            .filter((source) => ["Retired", "Pensioner", "TemporaryDisabilityBenefit", "TemporaryRuralEmployee", "DomesticEmployee", "PublicEmployee", "PrivateEmployee", "Apprentice"].includes(source))
            .map((source) => (
              <IncomeFormModelA incomeSource={source} onSubmit={handleSubmit} member={member} />
            ))}
          {/* MEI */}
          {member.incomeSource
            .filter((source) => ["IndividualEntrepreneur", "SelfEmployed", "InformalWorker", "RentalIncome", "FinancialHelpFromOthers", "PrivatePension", "LiberalProfessional"].includes(source))
            .map((source) => (
              <IncomeFormModelB incomeSource={source} onSubmit={handleSubmit} member={member} />
            ))}

          {/* Desempregado */}
          {member.incomeSource.includes("Unemployed") && (
            <IncomeFormModelC incomeSource={"Unemployed"} onSubmit={handleSubmit} member={member} />
          )}


          {/* Empresário */}
          {member.incomeSource
            .filter((source) => ["BusinessOwner", "BusinessOwnerSimplifiedTax"].includes(source))
            .map((source) => (
              <IncomeFormModelD incomeSource={source} onSubmit={handleSubmit} member={member} />
            ))}



        </form>
      </div></div>

  )
}
