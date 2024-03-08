import React, { useEffect } from "react";
import "./Familia/cadastroFamiliar.css";
import { useState } from "react";
import { api } from "../services/axios";
import FamilyMember from "./family-member";
import { handleSuccess } from "../ErrorHandling/handleSuceess";
import { handleAuthError } from "../ErrorHandling/handleError";

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
  const [incomeAlreadyRegistered, setIncomeAlreadyRegistered] = useState(false)
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

  const [monthlyIncomes, setMonthlyIncomes] = useState([]);
  console.log(member);
  console.log(member.incomeSource);

  const [incomeInfo, setIncomeInfo] = useState({
    month1: "",
    year1: "",
    grossAmount1: null,
    proLabore1: 0,
    dividends1: 0,
    deductionValue1: 0,
    publicPension1: 0,
    incomeTax1: 0,
    otherDeductions1: 0,
    foodAllowanceValue1: 0,
    transportAllowanceValue1: 0,
    expenseReimbursementValue1: 0,
    advancePaymentValue1: 0,
    reversalValue1: 0,
    compensationValue1: 0,
    judicialPensionValue1: 0,

    month2: "",
    year2: "",
    grossAmount2: null,
    proLabore2: 0,
    dividends2: 0,
    deductionValue2: 0,
    publicPension2: 0,
    incomeTax2: 0,
    otherDeductions2: 0,
    foodAllowanceValue2: 0,
    transportAllowanceValue2: 0,
    expenseReimbursementValue2: 0,
    advancePaymentValue2: 0,
    reversalValue2: 0,
    compensationValue2: 0,
    judicialPensionValue2: 0,

    month3: "",
    year3: "",
    grossAmount3: null,
    proLabore3: 0,
    dividends3: 0,
    deductionValue3: 0,
    publicPension3: 0,
    incomeTax3: 0,
    otherDeductions3: 0,
    foodAllowanceValue3: 0,
    transportAllowanceValue3: 0,
    expenseReimbursementValue3: 0,
    advancePaymentValue3: 0,
    reversalValue3: 0,
    compensationValue3: 0,
    judicialPensionValue3: 0,

    month4: "",
    year4: "",
    grossAmount4: null,
    proLabore4: 0,
    dividends4: 0,
    deductionValue4: 0,
    publicPension4: 0,
    incomeTax4: 0,
    otherDeductions4: 0,
    foodAllowanceValue4: 0,
    transportAllowanceValue4: 0,
    expenseReimbursementValue4: 0,
    advancePaymentValue4: 0,
    reversalValue4: 0,
    compensationValue4: 0,
    judicialPensionValue4: 0,

    month5: "",
    year5: "",
    grossAmount5: null,
    proLabore5: 0,
    dividends5: 0,
    deductionValue5: 0,
    publicPension5: 0,
    incomeTax5: 0,
    otherDeductions5: 0,
    foodAllowanceValue5: 0,
    transportAllowanceValue5: 0,
    expenseReimbursementValue5: 0,
    advancePaymentValue5: 0,
    reversalValue5: 0,
    compensationValue5: 0,
    judicialPensionValue5: 0,

    month6: "",
    year6: "",
    grossAmount6: null,
    proLabore6: 0,
    dividends6: 0,
    deductionValue6: 0,
    publicPension6: 0,
    incomeTax6: 0,
    otherDeductions6: 0,
    foodAllowanceValue6: 0,
    transportAllowanceValue6: 0,
    expenseReimbursementValue6: 0,
    advancePaymentValue6: 0,
    reversalValue6: 0,
    compensationValue6: 0,
    judicialPensionValue6: 0,

    quantity: 0,
  });

  useEffect(() => {
    setIncomeInfo({
      month1: "",
      year1: "",
      grossAmount1: null,
      proLabore1: 0,
      dividends1: 0,
      deductionValue1: 0,
      publicPension1: 0,
      incomeTax1: 0,
      otherDeductions1: 0,
      foodAllowanceValue1: 0,
      transportAllowanceValue1: 0,
      expenseReimbursementValue1: 0,
      advancePaymentValue1: 0,
      reversalValue1: 0,
      compensationValue1: 0,
      judicialPensionValue1: 0,

      month2: "",
      year2: "",
      grossAmount2: null,
      proLabore2: 0,
      dividends2: 0,
      deductionValue2: 0,
      publicPension2: 0,
      incomeTax2: 0,
      otherDeductions2: 0,
      foodAllowanceValue2: 0,
      transportAllowanceValue2: 0,
      expenseReimbursementValue2: 0,
      advancePaymentValue2: 0,
      reversalValue2: 0,
      compensationValue2: 0,
      judicialPensionValue2: 0,

      month3: "",
      year3: "",
      grossAmount3: null,
      proLabore3: 0,
      dividends3: 0,
      deductionValue3: 0,
      publicPension3: 0,
      incomeTax3: 0,
      otherDeductions3: 0,
      foodAllowanceValue3: 0,
      transportAllowanceValue3: 0,
      expenseReimbursementValue3: 0,
      advancePaymentValue3: 0,
      reversalValue3: 0,
      compensationValue3: 0,
      judicialPensionValue3: 0,

      month4: "",
      year4: "",
      grossAmount4: null,
      proLabore4: 0,
      dividends4: 0,
      deductionValue4: 0,
      publicPension4: 0,
      incomeTax4: 0,
      otherDeductions4: 0,
      foodAllowanceValue4: 0,
      transportAllowanceValue4: 0,
      expenseReimbursementValue4: 0,
      advancePaymentValue4: 0,
      reversalValue4: 0,
      compensationValue4: 0,
      judicialPensionValue4: 0,

      month5: "",
      year5: "",
      grossAmount5: null,
      proLabore5: 0,
      dividends5: 0,
      deductionValue5: 0,
      publicPension5: 0,
      incomeTax5: 0,
      otherDeductions5: 0,
      foodAllowanceValue5: 0,
      transportAllowanceValue5: 0,
      expenseReimbursementValue5: 0,
      advancePaymentValue5: 0,
      reversalValue5: 0,
      compensationValue5: 0,
      judicialPensionValue5: 0,

      month6: "",
      year6: "",
      grossAmount6: null,
      proLabore6: 0,
      dividends6: 0,
      deductionValue6: 0,
      publicPension6: 0,
      incomeTax6: 0,
      otherDeductions6: 0,
      foodAllowanceValue6: 0,
      transportAllowanceValue6: 0,
      expenseReimbursementValue6: 0,
      advancePaymentValue6: 0,
      reversalValue6: 0,
      compensationValue6: 0,
      judicialPensionValue6: 0,

      quantity: 3,
    });
  }, [member]);

  const [MEIInfo, setMEIInfo] = useState({
    startDate: "",
    CNPJ: "",
  });
  const [entepreneurInfo, setEntepreneurInfo] = useState({
    startDate: "",
    socialReason: "",
    fantasyName: "",
    CNPJ: "",
  });

  const handleEntepreneurInputChange = (e) => {
    const { name, value } = e.target;

    setEntepreneurInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(entepreneurInfo);
  };

  const [unemployedInfo, setUnemployedInfo] = useState({
    receivesUnemployment: false,
    parcels: 0,
    firstParcelDate: "",
    parcelValue: 0,
  });

  const handleInputChange = (fieldName, value) => {
    setIncomeInfo((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
    console.log(incomeInfo);
  };

  function handleInputUnemployedChange(e) {
    const { name, value } = e.target;

    setUnemployedInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(unemployedInfo);
  }
  const [fixIncomeMEI, setFixIncomeMEI] = useState(false);

  function handleFixIncomeMEI() {
    if (fixIncomeMEI === true) {
      setFixIncomeMEI(false);
      handleInputChange("quantity", 6);
    }
    if (fixIncomeMEI === false) {
      setFixIncomeMEI(true);
      handleInputChange("quantity", 3);
    }
  }

  const [receivesUnemployment, setReceivesUnemployment] = useState(false);

  function handleReceivesUnemployment() {
    if (receivesUnemployment === true) {
      setReceivesUnemployment(false);
    }
    if (receivesUnemployment === false) {
      setReceivesUnemployment(true);
    }
  }

  const handleMEIInputChange = (e) => {
    const { name, value } = e.target;

    setMEIInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(MEIInfo);
  };

  async function handleRegisterIncome(e, incomeSource) {
    e.preventDefault();
    
    const token = localStorage.getItem("token");
    let data = {
      month1: incomeInfo.month1,
      year1: incomeInfo.year1,
      grossAmount1: Number(incomeInfo.grossAmount1),
      proLabore1: Number(incomeInfo.proLabore1),
      dividends1: Number(incomeInfo.dividends1),
      deductionValue1: Number(incomeInfo.deductionValue1),
      publicPension1: Number(incomeInfo.publicPension1),
      incomeTax1: Number(incomeInfo.incomeTax1),
      otherDeductions1: Number(incomeInfo.otherDeductions1),
      foodAllowanceValue1: Number(incomeInfo.foodAllowanceValue1),
      transportAllowanceValue1: Number(incomeInfo.transportAllowanceValue1),
      expenseReimbursementValue1: Number(incomeInfo.expenseReimbursementValue1),
      advancePaymentValue1: Number(incomeInfo.advancePaymentValue1),
      reversalValue1: Number(incomeInfo.reversalValue1),
      compensationValue1: Number(incomeInfo.compensationValue1),
      judicialPensionValue1: Number(incomeInfo.judicialPensionValue1),

      month2: incomeInfo.month2,
      year2: incomeInfo.year2,
      grossAmount2: Number(incomeInfo.grossAmount2),
      proLabore2: Number(incomeInfo.proLabore2),
      dividends2: Number(incomeInfo.dividends2),
      deductionValue2: Number(incomeInfo.deductionValue2),
      publicPension2: Number(incomeInfo.publicPension2),
      incomeTax2: Number(incomeInfo.incomeTax2),
      otherDeductions2: Number(incomeInfo.otherDeductions2),
      foodAllowanceValue2: Number(incomeInfo.foodAllowanceValue2),
      transportAllowanceValue2: Number(incomeInfo.transportAllowanceValue2),
      expenseReimbursementValue2: Number(incomeInfo.expenseReimbursementValue2),
      advancePaymentValue2: Number(incomeInfo.advancePaymentValue2),
      reversalValue2: Number(incomeInfo.reversalValue2),
      compensationValue2: Number(incomeInfo.compensationValue2),
      judicialPensionValue2: Number(incomeInfo.judicialPensionValue2),

      month3: incomeInfo.month3,
      year3: incomeInfo.year3,
      grossAmount3: Number(incomeInfo.grossAmount3),
      proLabore3: Number(incomeInfo.proLabore3),
      dividends3: Number(incomeInfo.dividends3),
      deductionValue3: Number(incomeInfo.deductionValue3),
      publicPension3: Number(incomeInfo.publicPension3),
      incomeTax3: Number(incomeInfo.incomeTax3),
      otherDeductions3: Number(incomeInfo.otherDeductions3),
      foodAllowanceValue3: Number(incomeInfo.foodAllowanceValue3),
      transportAllowanceValue3: Number(incomeInfo.transportAllowanceValue3),
      expenseReimbursementValue3: Number(incomeInfo.expenseReimbursementValue3),
      advancePaymentValue3: Number(incomeInfo.advancePaymentValue3),
      reversalValue3: Number(incomeInfo.reversalValue3),
      compensationValue3: Number(incomeInfo.compensationValue3),
      judicialPensionValue3: Number(incomeInfo.judicialPensionValue3),

      month4: incomeInfo.month4,
      year4: incomeInfo.year4,
      grossAmount4: Number(incomeInfo.grossAmount4),
      proLabore4: Number(incomeInfo.proLabore4),
      dividends4: Number(incomeInfo.dividends4),
      deductionValue4: Number(incomeInfo.deductionValue4),
      publicPension4: Number(incomeInfo.publicPension4),
      incomeTax4: Number(incomeInfo.incomeTax4),
      otherDeductions4: Number(incomeInfo.otherDeductions4),
      foodAllowanceValue4: Number(incomeInfo.foodAllowanceValue4),
      transportAllowanceValue4: Number(incomeInfo.transportAllowanceValue4),
      expenseReimbursementValue4: Number(incomeInfo.expenseReimbursementValue4),
      advancePaymentValue4: Number(incomeInfo.advancePaymentValue4),
      reversalValue4: Number(incomeInfo.reversalValue4),
      compensationValue4: Number(incomeInfo.compensationValue4),
      judicialPensionValue4: Number(incomeInfo.judicialPensionValue4),

      month5: incomeInfo.month5,
      year5: incomeInfo.year5,
      grossAmount5: Number(incomeInfo.grossAmount5),
      proLabore5: Number(incomeInfo.proLabore5),
      dividends5: Number(incomeInfo.dividends5),
      deductionValue5: Number(incomeInfo.deductionValue5),
      publicPension5: Number(incomeInfo.publicPension5),
      incomeTax5: Number(incomeInfo.incomeTax5),
      otherDeductions5: Number(incomeInfo.otherDeductions5),
      foodAllowanceValue5: Number(incomeInfo.foodAllowanceValue5),
      transportAllowanceValue5: Number(incomeInfo.transportAllowanceValue5),
      expenseReimbursementValue5: Number(incomeInfo.expenseReimbursementValue5),
      advancePaymentValue5: Number(incomeInfo.advancePaymentValue5),
      reversalValue5: Number(incomeInfo.reversalValue5),
      compensationValue5: Number(incomeInfo.compensationValue5),
      judicialPensionValue5: Number(incomeInfo.judicialPensionValue5),

      month6: incomeInfo.month6,
      year6: incomeInfo.year6,
      grossAmount6: Number(incomeInfo.grossAmount6),
      proLabore6: Number(incomeInfo.proLabore6),
      dividends6: Number(incomeInfo.dividends6),
      deductionValue6: Number(incomeInfo.deductionValue6),
      publicPension6: Number(incomeInfo.publicPension6),
      incomeTax6: Number(incomeInfo.incomeTax6),
      otherDeductions6: Number(incomeInfo.otherDeductions6),
      foodAllowanceValue6: Number(incomeInfo.foodAllowanceValue6),
      transportAllowanceValue6: Number(incomeInfo.transportAllowanceValue6),
      expenseReimbursementValue6: Number(incomeInfo.expenseReimbursementValue6),
      advancePaymentValue6: Number(incomeInfo.advancePaymentValue6),
      reversalValue6: Number(incomeInfo.reversalValue6),
      compensationValue6: Number(incomeInfo.compensationValue6),
      judicialPensionValue6: Number(incomeInfo.judicialPensionValue6),

      quantity: incomeInfo.quantity,
      incomeSource: incomeSource,
    };
    console.log(data);
    if ( incomeSource === "BusinessOwner" ||
    incomeSource === "BusinessOwnerSimplifiedTax") {
      data.quantity = 6
    }

    console.log(data);

    try {
      const response = await api.post(
        `/candidates/family-member/income/${member.id}`,
        data,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (incomeSource === "IndividualEntrepreneur") {
        const data2 = {
          startDate: MEIInfo.startDate,
          CNPJ: MEIInfo.CNPJ,
        };
        await api.post(`/candidates/family-member/MEI/${member.id}`, data2, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
      }

      if (incomeSource === "FinancialHelpFromOthers") {
        const data2 = {
          financialAssistantCPF: dependentInfo.financialAssistantCPF,
          employmentType: incomeSource,
        };
        await api.post(
          `/candidates/family-member/dependent-autonomous/${member.id}`,
          data2,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
      }
      if (incomeSource === "RentalIncome") {
        const data2 = {
          employmentType: incomeSource,
        };
        await api.post(
          `/candidates/family-member/dependent-autonomous/${member.id}`,
          data2,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
      }
      if (incomeSource === "InformalWorker") {
        const data2 = {
          employmentType: incomeSource,
        };
        await api.post(
          `/candidates/family-member/dependent-autonomous/${member.id}`,
          data2,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
      }
      if (incomeSource === "LiberalProfessional") {
        const data2 = {
          employmentType: incomeSource,
        };
        await api.post(
          `/candidates/family-member/dependent-autonomous/${member.id}`,
          data2,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
      }
      if (incomeSource === "SelfEmployed") {
        const data2 = {
          employmentType: incomeSource,
        };
        await api.post(
          `/candidates/family-member/dependent-autonomous/${member.id}`,
          data2,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
      }
      if (incomeSource === "PrivatePension") {
        const data2 = {
          employmentType: incomeSource,
        };
        await api.post(
          `/candidates/family-member/dependent-autonomous/${member.id}`,
          data2,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
      }
      // CLT types
      if (incomeSource === "Apprentice") {
        const data2 = {
          employmentType: incomeSource,
          admissionDate: CLTInfo.admissionDate,
          payingSource: CLTInfo.payingSource,
          payingSourcePhone: CLTInfo.payingSourcePhone,
          position: CLTInfo.position,
        };
        await api.post(`/candidates/family-member/CLT/${member.id}`, data2, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
      }
      if (incomeSource === "PrivateEmployee") {
        const data2 = {
          employmentType: incomeSource,
          admissionDate: CLTInfo.admissionDate,
          payingSource: CLTInfo.payingSource,
          payingSourcePhone: CLTInfo.payingSourcePhone,
          position: CLTInfo.position,
        };
        await api.post(`/candidates/family-member/CLT/${member.id}`, data2, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
      }
      if (incomeSource === "PublicEmployee") {
        const data2 = {
          employmentType: incomeSource,
          admissionDate: CLTInfo.admissionDate,
          payingSource: CLTInfo.payingSource,
          payingSourcePhone: CLTInfo.payingSourcePhone,
          position: CLTInfo.position,
        };
        await api.post(`/candidates/family-member/CLT/${member.id}`, data2, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
      }
      if (incomeSource === "Pensioner") {
        const data2 = {
          employmentType: incomeSource,
          admissionDate: CLTInfo.admissionDate,
          payingSource: CLTInfo.payingSource,
          payingSourcePhone: CLTInfo.payingSourcePhone,
          position: CLTInfo.position,
        };
        await api.post(`/candidates/family-member/CLT/${member.id}`, data2, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
      }
      if (incomeSource === "Retired") {
        const data2 = {
          employmentType: incomeSource,
          admissionDate: CLTInfo.admissionDate,
          payingSource: CLTInfo.payingSource,
          payingSourcePhone: CLTInfo.payingSourcePhone,
          position: CLTInfo.position,
        };
        await api.post(`/candidates/family-member/CLT/${member.id}`, data2, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
      }
      if (incomeSource === "DomesticEmployee") {
        const data2 = {
          employmentType: incomeSource,
          admissionDate: CLTInfo.admissionDate,
          payingSource: CLTInfo.payingSource,
          payingSourcePhone: CLTInfo.payingSourcePhone,
          position: CLTInfo.position,
        };
        await api.post(`/candidates/family-member/CLT/${member.id}`, data2, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
      }
      if (incomeSource === "TemporaryRuralEmployee") {
        const data2 = {
          employmentType: incomeSource,
          admissionDate: CLTInfo.admissionDate,
          payingSource: CLTInfo.payingSource,
          payingSourcePhone: CLTInfo.payingSourcePhone,
          position: CLTInfo.position,
        };
        await api.post(`/candidates/family-member/CLT/${member.id}`, data2, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
      }
      if (incomeSource === "TemporaryDisabilityBenefit") {
        const data2 = {
          employmentType: incomeSource,
          admissionDate: CLTInfo.admissionDate,
          payingSource: CLTInfo.payingSource,
          payingSourcePhone: CLTInfo.payingSourcePhone,
          position: CLTInfo.position,
        };
        await api.post(`/candidates/family-member/CLT/${member.id}`, data2, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
      }
      if (
        incomeSource === "BusinessOwner" ||
        incomeSource === "BusinessOwnerSimplifiedTax"
      ) {
        const data2 = {
          employmentType: incomeSource,
          startDate: entepreneurInfo.startDate,
          socialReason: entepreneurInfo.socialReason,
          fantasyName: entepreneurInfo.fantasyName,
          CNPJ: entepreneurInfo.CNPJ,
        };
        await api.post(
          `/candidates/family-member/entepreneur/${member.id}`,
          data2,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
      }
     

      console.log("====================================");
      handleSuccess(response, "Dados cadastrados com sucesso");
      console.log("====================================");
    } catch (error) {
      console.log(error);
      handleAuthError(error);
    }
  }

  const [fixIncomeAutonomous, setFixIncomeAutonomous] = useState(false);

  function handleFixIncomeAutonomous() {
    if (fixIncomeAutonomous === true) {
      setFixIncomeAutonomous(false);
      handleInputChange("quantity", 6);
    }
    if (fixIncomeAutonomous === false) {
      setFixIncomeAutonomous(true);
      handleInputChange("quantity", 3);
    }
  }
  const [fixIncomeInformalWorker, setFixIncomeInformalWorker] = useState(false);

  function handleFixIncomeInformalWorker() {
    if (fixIncomeInformalWorker === true) {
      setFixIncomeInformalWorker(false);
      handleInputChange("quantity", 6);
    }
    if (fixIncomeInformalWorker === false) {
      setFixIncomeInformalWorker(true);
      handleInputChange("quantity", 3);
    }
  }
  const [fixIncomePrivatePension, setFixIncomePrivatePension] = useState(false);

  function handleFixIncomePrivatePension() {
    if (fixIncomePrivatePension === true) {
      setFixIncomePrivatePension(false);
      handleInputChange("quantity", 6);
    }
    if (fixIncomePrivatePension === false) {
      setFixIncomePrivatePension(true);
      handleInputChange("quantity", 3);
    }
  }

  const [fixIncomeLiberalProfessional, setFixIncomeLiberalProfessional] =
    useState(false);

  function handleFixIncomeLiberalProfessional() {
    if (fixIncomeLiberalProfessional === true) {
      setFixIncomeLiberalProfessional(false);
      handleInputChange("quantity", 6);
    }
    if (fixIncomeLiberalProfessional === false) {
      setFixIncomeLiberalProfessional(true);
      handleInputChange("quantity", 3);
    }
  }

  const [fixIncomeRentalIncome, setFixIncomeRentalIncome] = useState(false);

  function handleFixIncomeRentalIncome() {
    if (fixIncomeRentalIncome === true) {
      setFixIncomeRentalIncome(false);
      handleInputChange("quantity", 6);
    }
    if (fixIncomeRentalIncome === false) {
      setFixIncomeRentalIncome(true);
      handleInputChange("quantity", 3);
    }
  }
  const [gratificationAutonomous, setGratificationAutonomous] = useState(false);

  function handleGratificationAutonomous() {
    if (gratificationAutonomous === true) {
      setGratificationAutonomous(false);
      handleInputChange("quantity", 6);
    }
    if (gratificationAutonomous === false) {
      setGratificationAutonomous(true);
      handleInputChange("quantity", 3);
    }
  }

  const [dependentInfo, setDependentInfo] = useState({
    financialAssistantCPF: "",
    employmentType: "FinancialHelpFromOthers",
  });

  const handleDependentInputChange = (e) => {
    const { name, value } = e.target;

    setDependentInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(dependentInfo);
  };

  const [CLTInfo, setCLTInfo] = useState({
    admissionDate: "",
    position: "",
    payingSource: "",
    payingSourcePhone: "",
  });

  const handleCLTInputChange = (e) => {
    const { name, value } = e.target;

    setCLTInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(CLTInfo);
  };

  // CheckBox de CLT
  const renderElementes = [
    { id: "deduction-1", label: "Elemento 1" },
    { id: "deduction-2", label: "Elemento 2" },
    { id: "deduction-3", label: "Elemento 3" },
    { id: "deduction-4", label: "Elemento 3" },
    { id: "deduction-5", label: "Elemento 3" },
    { id: "deduction-6", label: "Elemento 3" },
  ];

  // Estado para rastrear os valores do checkbox
  const [deductionsCLT, setDeductionsCLT] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  // Função de manipulação para os checkboxes
  const handleDeductionsCLT = (index) => {
    setDeductionsCLT((prevDeductionsCLT) => {
      const updatedDeductionsCLT = [...prevDeductionsCLT];
      updatedDeductionsCLT[index] = !updatedDeductionsCLT[index]; // Inverte o valor do checkbox
      return updatedDeductionsCLT;
    });
  };

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

          {/* MEI */}
          {loading ? '' : (member.incomeSource.includes("IndividualEntrepreneur") && !incomeAlreadyRegistered) && (
            <>
              {/*<!-- Data de Início -->*/}
              <div class="survey-box survey-renda">
                <label for="startDate" id="startDate-label">
                  Data de Início
                </label>
                <br />
                <input
                  type="date"
                  name="startDate"
                  value={MEIInfo.startDate}
                  onChange={handleMEIInputChange}
                  id="startDate"
                  class="survey-control"
                />
              </div>
              {/*<!-- CNPJ -->*/}
              <div class="survey-box survey-renda">
                <label for="CNPJ" id="CNPJ-label">
                  CNPJ
                </label>
                <br />
                <input
                  type="text"
                  name="CNPJ"
                  value={MEIInfo.CNPJ}
                  onChange={handleMEIInputChange}
                  id="CNPJ"
                  class="survey-control"
                />
              </div>
              {/*<!-- Renda Fixa ? -->*/}
              <div
                class="survey-box survey-renda renda-fixa"
                id="box-renda-fixa"
              >
                <label for="fixIncome" id="fixIncome-label">
                  Renda Fixa ?
                </label>

                <input
                  type="checkbox"
                  name="fixIncome"
                  value={fixIncomeMEI}
                  onChange={handleFixIncomeMEI}
                  id="fixIncome"
                  class="survey-control"
                />
              </div>
              {!fixIncomeMEI ? (
                <div className="mes-ano-box">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <>
                      <div
                        key={`month-${i}`}
                        className="survey-box survey-renda"
                        id="survey-input"
                      >
                        <label htmlFor={`month${i}`} id={`month${i}-label`}>
                          Mês {i + 1}
                        </label>
                        <br />
                        <input
                          type="text"
                          name={`month${i}`}
                          id={`month${i}`}
                          value={incomeInfo[`month${i + 1}`]}
                          onChange={(e) =>
                            handleInputChange(`month${i + 1}`, e.target.value)
                          }
                          className="survey-control"
                        />
                      </div>
                      <div
                        key={`year-${i}`}
                        className="survey-box survey-renda"
                        id="survey-input"
                      >
                        <label htmlFor={`year${i}`} id={`year${i}-label`}>
                          Ano {i + 1}
                        </label>
                        <br />
                        <input
                          type="text"
                          name={`year${i}`}
                          id={`year${i}`}
                          value={incomeInfo[`year${i + 1}`]}
                          onChange={(e) =>
                            handleInputChange(`year${i + 1}`, e.target.value)
                          }
                          className="survey-control"
                        />
                      </div>
                      <div
                        key={`grossAmount-${i}`}
                        className="survey-box survey-renda"
                        id="survey-input"
                      >
                        <label
                          htmlFor={`grossAmount${i}`}
                          id={`grossAmount${i}-label`}
                        >
                          Valor Bruto {i + 1}
                        </label>
                        <br />
                        <input
                          type="number"
                          name={`grossAmount${i}`}
                          id={`grossAmount${i}`}
                          value={incomeInfo[`grossAmount${i + 1}`]}
                          onChange={(e) =>
                            handleInputChange(
                              `grossAmount${i + 1}`,
                              e.target.value
                            )
                          }
                          className="survey-control"
                        />
                      </div>
                    </>
                  ))}
                </div>
              ) : (
                <div className="mes-ano-box">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <>
                      <div
                        key={`month-${i}`}
                        className="survey-box survey-renda"
                        id="survey-input"
                      >
                        <label htmlFor={`month${i}`} id={`month${i}-label`}>
                          Mês {i + 1}
                        </label>
                        <br />
                        <input
                          type="text"
                          name={`month${i}`}
                          id={`month${i}`}
                          value={incomeInfo[`month${i + 1}`]}
                          onChange={(e) =>
                            handleInputChange(`month${i + 1}`, e.target.value)
                          }
                          className="survey-control"
                        />
                      </div>
                      <div
                        key={`year-${i}`}
                        className="survey-box survey-renda"
                        id="survey-input"
                      >
                        <label htmlFor={`year${i}`} id={`year${i}-label`}>
                          Ano {i + 1}
                        </label>
                        <br />
                        <input
                          type="text"
                          name={`year${i}`}
                          id={`year${i}`}
                          value={incomeInfo[`year${i + 1}`]}
                          onChange={(e) =>
                            handleInputChange(`year${i + 1}`, e.target.value)
                          }
                          className="survey-control"
                        />
                      </div>
                      <div
                        key={`grossAmount-${i}`}
                        className="survey-box survey-renda"
                        id="survey-input"
                      >
                        <label
                          htmlFor={`grossAmount${i}`}
                          id={`grossAmount${i}-label`}
                        >
                          Valor Bruto {i + 1}
                        </label>
                        <br />
                        <input
                          type="number"
                          name={`grossAmount${i}`}
                          id={`grossAmount${i}`}
                          value={incomeInfo[`grossAmount${i + 1}`]}
                          onChange={(e) =>
                            handleInputChange(
                              `grossAmount${i + 1}`,
                              e.target.value
                            )
                          }
                          className="survey-control"
                        />
                      </div>
                    </>
                  ))}
                </div>
              )}
              <div class="survey-box survey-renda">
                <button
                  type="submit"
                  onClick={(e) =>
                    handleRegisterIncome(e, "IndividualEntrepreneur")
                  }
                  id="submit-button"
                >
                  Salvar Informações
                </button>
              </div>
            </>
          )}

          {/* Desempregado */}
          {loading ? '' : (member.incomeSource.includes("Unemployed") && !incomeAlreadyRegistered) && (
            <>
              {/*<!-- Recebe Seguro Desemprego ? -->*/}
              <div class="survey-box survey-renda">
                <label
                  for="receivesUnemployment"
                  id="receivesUnemployment-label"
                >
                  Recebe Seguro Desemprego ?
                </label>
                <br />
                <input
                  type="checkbox"
                  name="receivesUnemployment"
                  value={unemployedInfo.receivesUnemployment}
                  onChange={handleReceivesUnemployment}
                  id="receivesUnemployment"
                  class="survey-control"
                />
              </div>
              {receivesUnemployment && (
                <>
                  {/*<!-- Quantidade de Parcelas -->*/}
                  <div class="survey-box survey-renda">
                    <label for="parcels" id="parcels-label">
                      Quantidade de Parcelas
                    </label>
                    <br />
                    <input
                      type="number"
                      name="parcels"
                      value={unemployedInfo.parcels}
                      id="parcels"
                      class="survey-control"
                    />
                  </div>
                  {/*<!-- Data da primeira Parcela -->*/}
                  <div class="survey-box survey-renda">
                    <label for="firstParcelDate" id="firstParcelDate-label">
                      Data da primeira Parcela
                    </label>
                    <br />
                    <input
                      type="date"
                      name="firstParcelDate"
                      value={unemployedInfo.firstParcelDate}
                      onChange={handleInputUnemployedChange}
                      id="firstParcelDate"
                      class="survey-control"
                    />
                  </div>
                  {/*<!-- Valor da Parcela -->*/}
                  <div class="survey-box survey-renda">
                    <label for="parcelValue" id="parcelValue-label">
                      Valor da Parcela
                    </label>
                    <br />
                    <input
                      type="number"
                      name="parcelValue"
                      value={unemployedInfo.parcelValue}
                      onChange={handleInputUnemployedChange}
                      id="parcelValue"
                      class="survey-control"
                    />
                  </div>
                  <div class="survey-box survey-renda">
                    <button
                      type="submit"
                      onClick={(e) => handleRegisterIncome(e, "Unemployed")}
                      id="submit-button"
                    >
                      Salvar Informações
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {/* Trabalhador Informal */}
          {loading ? '' : (member.incomeSource.includes('InformalWorker') && !incomeAlreadyRegistered
          ) && (
              <>
                {/*<!-- Renda Fixa ? -->*/}
                <div class="survey-box survey-renda" id="box-renda-fixa">
                  <label for="fixIncome" id="fixIncome-label">
                    Renda Fixa ?
                  </label>

                  <input
                    type="checkbox"
                    name="fixIncome"
                    value={fixIncomeInformalWorker}
                    onChange={handleFixIncomeInformalWorker}
                    id="fixIncome"
                    class="survey-control"
                  />
                </div>
                {!fixIncomeInformalWorker ? (
                  <div className="mes-ano-box">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <>
                        <div
                          key={`month-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`month${i}`}
                            id={`month${i}`}
                            value={incomeInfo[`month${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(`month${i + 1}`, e.target.value)
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`year-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label htmlFor={`year${i}`} id={`year${i}-label`}>
                            Ano {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`year${i}`}
                            id={`year${i}`}
                            value={incomeInfo[`year${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(`year${i + 1}`, e.target.value)
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`grossAmount-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label
                            htmlFor={`grossAmount${i}`}
                            id={`grossAmount${i}-label`}
                          >
                            Valor Bruto {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`grossAmount${i}`}
                            id={`grossAmount${i}`}
                            value={incomeInfo[`grossAmount${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `grossAmount${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                      </>
                    ))}
                  </div>
                ) : (
                  <div className="mes-ano-box">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <>
                        <div
                          key={`month-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`month${i}`}
                            id={`month${i}`}
                            value={incomeInfo[`month${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(`month${i + 1}`, e.target.value)
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`year-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label htmlFor={`year${i}`} id={`year${i}-label`}>
                            Ano {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`year${i}`}
                            id={`year${i}`}
                            value={incomeInfo[`year${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(`year${i + 1}`, e.target.value)
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`grossAmount-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label
                            htmlFor={`grossAmount${i}`}
                            id={`grossAmount${i}-label`}
                          >
                            Valor Bruto {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`grossAmount${i}`}
                            id={`grossAmount${i}`}
                            value={incomeInfo[`grossAmount${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `grossAmount${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                      </>
                    ))}
                  </div>
                )}
                <div class="survey-box survey-renda">
                  <button
                    type="submit"
                    onClick={(e) => handleRegisterIncome(e, "InformalWorker")}
                    id="submit-button"
                  >
                    Salvar Informações
                  </button>
                </div>
              </>
            )}

          {/* Renda de Aluguel... */}
          {loading ? '' : (member.incomeSource.includes('RentalIncome') && !incomeAlreadyRegistered
          ) && (
              <>
                {/*<!-- Renda Fixa ? -->*/}
                <div class="survey-box survey-renda" id="box-renda-fixa">
                  <label for="fixIncome" id="fixIncome-label">
                    Renda Fixa ?
                  </label>

                  <input
                    type="checkbox"
                    name="fixIncome"
                    value={fixIncomeRentalIncome}
                    onChange={handleFixIncomeRentalIncome}
                    id="fixIncome"
                    class="survey-control"
                  />
                </div>
                {!fixIncomeRentalIncome ? (
                  <div className="mes-ano-box">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <>
                        <div
                          key={`month-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`month${i}`}
                            id={`month${i}`}
                            value={incomeInfo[`month${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(`month${i + 1}`, e.target.value)
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`year-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label htmlFor={`year${i}`} id={`year${i}-label`}>
                            Ano {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`year${i}`}
                            id={`year${i}`}
                            value={incomeInfo[`year${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(`year${i + 1}`, e.target.value)
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`grossAmount-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label
                            htmlFor={`grossAmount${i}`}
                            id={`grossAmount${i}-label`}
                          >
                            Valor Bruto {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`grossAmount${i}`}
                            id={`grossAmount${i}`}
                            value={incomeInfo[`grossAmount${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `grossAmount${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                      </>
                    ))}
                  </div>
                ) : (
                  <div className="mes-ano-box">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <>
                        <div
                          key={`month-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`month${i}`}
                            id={`month${i}`}
                            value={incomeInfo[`month${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(`month${i + 1}`, e.target.value)
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`year-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label htmlFor={`year${i}`} id={`year${i}-label`}>
                            Ano {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`year${i}`}
                            id={`year${i}`}
                            value={incomeInfo[`year${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(`year${i + 1}`, e.target.value)
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`grossAmount-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label
                            htmlFor={`grossAmount${i}`}
                            id={`grossAmount${i}-label`}
                          >
                            Valor Bruto {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`grossAmount${i}`}
                            id={`grossAmount${i}`}
                            value={incomeInfo[`grossAmount${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `grossAmount${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                      </>
                    ))}
                  </div>
                )}
                <div class="survey-box survey-renda">
                  <button
                    type="submit"
                    onClick={(e) => handleRegisterIncome(e, "RentalIncome")}
                    id="submit-button"
                  >
                    Salvar Informações
                  </button>
                </div>
              </>
            )}

          {/* Profissional Liberal */}
          {loading ? '' : ((member.incomeSource.includes('LiberalProfessional') || member.incomeSource.includes('SelfEmployed')) && !incomeAlreadyRegistered
          ) && (
              <>
                {/*<!-- Renda Fixa ? -->*/}
                <div class="survey-box">
                  <label for="fixIncome" id="fixIncome-label">
                    Renda Fixa ?
                  </label>
                  <br />
                  <input
                    type="checkbox"
                    name="fixIncome"
                    value={fixIncomeLiberalProfessional}
                    onChange={handleFixIncomeLiberalProfessional}
                    id="fixIncome"
                    class="survey-control"
                  />
                </div>
                {!fixIncomeLiberalProfessional ? (
                  <div>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <>
                        <div key={`month-${i}`} className="survey-box">
                          <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`month${i}`}
                            id={`month${i}`}
                            value={incomeInfo[`month${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(`month${i + 1}`, e.target.value)
                            }
                            className="survey-control"
                          />
                        </div>
                        <div key={`year-${i}`} className="survey-box">
                          <label htmlFor={`year${i}`} id={`year${i}-label`}>
                            Ano {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`year${i}`}
                            id={`year${i}`}
                            value={incomeInfo[`year${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(`year${i + 1}`, e.target.value)
                            }
                            className="survey-control"
                          />
                        </div>
                        <div key={`grossAmount-${i}`} className="survey-box">
                          <label
                            htmlFor={`grossAmount${i}`}
                            id={`grossAmount${i}-label`}
                          >
                            Valor Bruto {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`grossAmount${i}`}
                            id={`grossAmount${i}`}
                            value={incomeInfo[`grossAmount${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `grossAmount${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                      </>
                    ))}
                  </div>
                ) : (
                  <div>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <>
                        <div key={`month-${i}`} className="survey-box">
                          <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`month${i}`}
                            id={`month${i}`}
                            value={incomeInfo[`month${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(`month${i + 1}`, e.target.value)
                            }
                            className="survey-control"
                          />
                        </div>
                        <div key={`year-${i}`} className="survey-box">
                          <label htmlFor={`year${i}`} id={`year${i}-label`}>
                            Ano {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`year${i}`}
                            id={`year${i}`}
                            value={incomeInfo[`year${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(`year${i + 1}`, e.target.value)
                            }
                            className="survey-control"
                          />
                        </div>
                        <div key={`grossAmount-${i}`} className="survey-box">
                          <label
                            htmlFor={`grossAmount${i}`}
                            id={`grossAmount${i}-label`}
                          >
                            Valor Bruto {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`grossAmount${i}`}
                            id={`grossAmount${i}`}
                            value={incomeInfo[`grossAmount${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `grossAmount${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                      </>
                    ))}
                  </div>
                )}
                <div class="survey-box survey-renda">
                  <button
                    type="submit"
                    onClick={(e) =>
                      handleRegisterIncome(e, "LiberalProfessional")
                    }
                    id="submit-button"
                  >
                    Salvar Informações
                  </button>
                </div>
              </>
            )}

          {/* Pensão Privada */}
          {loading ? '' : (member.incomeSource.includes("PrivatePension") && !incomeAlreadyRegistered) && (
            <>
              {/* Renda Fixa ? */}
              <div class="survey-box survey-renda" id="box-renda-fixa">
                <label for="fixIncome" id="fixIncome-label">Renda Fixa ?</label>
                <br />
                <input
                  type="checkbox"
                  name="fixIncome"
                  value={fixIncomePrivatePension}
                  onChange={handleFixIncomePrivatePension}
                  id="fixIncome"
                  class="survey-control"
                />
              </div>
              {!fixIncomePrivatePension ? (
                <div className="mes-ano-box">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={`month-${i}`} className="survey-box survey-renda" id="survey-input">
                      <label htmlFor={`month${i}`} id={`month${i}-label`}>Mês {i + 1}</label>
                      <br />
                      <input
                        type="text"
                        name={`month${i}`}
                        id={`month${i}`}
                        value={incomeInfo[`month${i + 1}`]}
                        onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
                        className="survey-control"
                      />
                      <label htmlFor={`year${i}`} id={`year${i}-label`}>Ano {i + 1}</label>
                      <br />
                      <input
                        type="text"
                        name={`year${i}`}
                        id={`year${i}`}
                        value={incomeInfo[`year${i + 1}`]}
                        onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                        className="survey-control"
                      />
                      <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>Valor Bruto {i + 1}</label>
                      <br />
                      <input
                        type="number"
                        name={`grossAmount${i}`}
                        id={`grossAmount${i}`}
                        value={incomeInfo[`grossAmount${i + 1}`]}
                        onChange={(e) => handleInputChange(`grossAmount${i + 1}`, e.target.value)}
                        className="survey-control"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mes-ano-box">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={`month-${i}`} className="survey-box survey-renda" id="survey-input">
                      <label htmlFor={`month${i}`} id={`month${i}-label`}>Mês {i + 1}</label>
                      <br />
                      <input
                        type="text"
                        name={`month${i}`}
                        id={`month${i}`}
                        value={incomeInfo[`month${i + 1}`]}
                        onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
                        className="survey-control"
                      />
                      <label htmlFor={`year${i}`} id={`year${i}-label`}>Ano {i + 1}</label>
                      <br />
                      <input
                        type="text"
                        name={`year${i}`}
                        id={`year${i}`}
                        value={incomeInfo[`year${i + 1}`]}
                        onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                        className="survey-control"
                      />
                      <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>Valor Bruto {i + 1}</label>
                      <br />
                      <input
                        type="number"
                        name={`grossAmount${i}`}
                        id={`grossAmount${i}`}
                        value={incomeInfo[`grossAmount${i + 1}`]}
                        onChange={(e) => handleInputChange(`grossAmount${i + 1}`, e.target.value)}
                        className="survey-control"
                      />
                    </div>
                  ))}
                </div>
              )}
              <div class="survey-box survey-renda">
                <button
                  type="submit"
                  onClick={(e) => handleRegisterIncome(e, "PrivatePension")}
                  id="submit-button"
                >
                  Salvar Informações
                </button>
              </div>
            </>
          )}

          {/* Ajuda Financeira de Terceiros */}
          {loading ? '' : (member.incomeSource.includes("FinancialHelpFromOthers") && !incomeAlreadyRegistered) && (
            <>
              {/*<!-- Renda Fixa ? -->*/}
              <div class="survey-box survey-renda" id="box-renda-fixa">
                <label for="fixIncome" id="fixIncome-label">
                  Renda Fixa ?
                </label>

                <input
                  type="checkbox"
                  name="fixIncome"
                  value={fixIncomeAutonomous}
                  onChange={handleFixIncomeAutonomous}
                  id="fixIncome"
                  class="survey-control"
                />
              </div>
              {!fixIncomeMEI ? (
                <div className="mes-ano-box">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <>
                      <div
                        key={`month-${i}`}
                        className="survey-box survey-renda"
                        id="survey-input"
                      >
                        <label htmlFor={`month${i}`} id={`month${i}-label`}>
                          Mês {i + 1}
                        </label>
                        <br />
                        <input
                          type="text"
                          name={`month${i}`}
                          id={`month${i}`}
                          value={incomeInfo[`month${i + 1}`]}
                          onChange={(e) =>
                            handleInputChange(`month${i + 1}`, e.target.value)
                          }
                          className="survey-control"
                        />
                      </div>
                      <div
                        key={`year-${i}`}
                        className="survey-box survey-renda"
                        id="survey-input"
                      >
                        <label htmlFor={`year${i}`} id={`year${i}-label`}>
                          Ano {i + 1}
                        </label>
                        <br />
                        <input
                          type="text"
                          name={`year${i}`}
                          id={`year${i}`}
                          value={incomeInfo[`year${i + 1}`]}
                          onChange={(e) =>
                            handleInputChange(`year${i + 1}`, e.target.value)
                          }
                          className="survey-control"
                        />
                      </div>
                      <div
                        key={`grossAmount-${i}`}
                        className="survey-box survey-renda"
                        id="survey-input"
                      >
                        <label
                          htmlFor={`grossAmount${i}`}
                          id={`grossAmount${i}-label`}
                        >
                          Valor Bruto {i + 1}
                        </label>
                        <br />
                        <input
                          type="number"
                          name={`grossAmount${i}`}
                          id={`grossAmount${i}`}
                          value={incomeInfo[`grossAmount${i + 1}`]}
                          onChange={(e) =>
                            handleInputChange(
                              `grossAmount${i + 1}`,
                              e.target.value
                            )
                          }
                          className="survey-control"
                        />
                      </div>
                    </>
                  ))}
                  <div className="survey-box survey-renda" id="survey-input">
                    <label
                      htmlFor={"financialAssistantCPF"}
                      id={"financialAssistantCPF"}
                    >
                      CPF do Ajudante Financeiro
                    </label>
                    <br />
                    <input
                      type="text"
                      name={"financialAssistantCPF"}
                      id={"financialAssistantCPF"}
                      value={dependentInfo}
                      onChange={handleDependentInputChange}
                      className="survey-control"
                    />
                  </div>
                </div>
              ) : (
                <div className="mes-ano-box">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <>
                      <div
                        key={`month-${i}`}
                        className="survey-box survey-renda"
                        id="survey-input"
                      >
                        <label htmlFor={`month${i}`} id={`month${i}-label`}>
                          Mês {i + 1}
                        </label>
                        <br />
                        <input
                          type="text"
                          name={`month${i}`}
                          id={`month${i}`}
                          value={incomeInfo[`month${i + 1}`]}
                          onChange={(e) =>
                            handleInputChange(`month${i + 1}`, e.target.value)
                          }
                          className="survey-control"
                        />
                      </div>
                      <div
                        key={`year-${i}`}
                        className="survey-box survey-renda"
                        id="survey-input"
                      >
                        <label htmlFor={`year${i}`} id={`year${i}-label`}>
                          Ano {i + 1}
                        </label>
                        <br />
                        <input
                          type="text"
                          name={`year${i}`}
                          id={`year${i}`}
                          value={incomeInfo[`year${i + 1}`]}
                          onChange={(e) =>
                            handleInputChange(`year${i + 1}`, e.target.value)
                          }
                          className="survey-control"
                        />
                      </div>
                      <div
                        key={`grossAmount-${i}`}
                        className="survey-box survey-renda"
                        id="survey-input"
                      >
                        <label
                          htmlFor={`grossAmount${i}`}
                          id={`grossAmount${i}-label`}
                        >
                          Valor Bruto {i + 1}
                        </label>
                        <br />
                        <input
                          type="number"
                          name={`grossAmount${i}`}
                          id={`grossAmount${i}`}
                          value={incomeInfo[`month${i + 1}`]}
                          onChange={(e) =>
                            handleInputChange(
                              `grossAmount${i + 1}`,
                              e.target.value
                            )
                          }
                          className="survey-control"
                        />
                      </div>
                    </>
                  ))}
                  <div className="survey-box survey-renda" id="survey-input">
                    <label
                      htmlFor={"financialAssistantCPF"}
                      id={"financialAssistantCPF"}
                    >
                      CPF do Ajudante Financeiro
                    </label>
                    <br />
                    <input
                      type="text"
                      name={"financialAssistantCPF"}
                      id={"financialAssistantCPF"}
                      value={dependentInfo}
                      onChange={handleDependentInputChange}
                      className="survey-control"
                    />
                  </div>
                </div>
              )}
              <div class="survey-box survey-renda">
                <button
                  type="submit"
                  onClick={(e) =>
                    handleRegisterIncome(e, "FinancialHelpFromOthers")
                  }
                  id="submit-button"
                >
                  Salvar Informações
                </button>
              </div>
            </>
          )}

          {/* Empresário */}
          {(loading ? '' : (((member.incomeSource.includes("BusinessOwner")) ||
            member.incomeSource.includes("BusinessOwnerSimplifiedTax")) && !incomeAlreadyRegistered)) && (
              <>
                {/*<!-- Data de Início -->*/}
                <div class="survey-box">
                  <label for="startDate" id="startDate-label">
                    Data de Início
                  </label>
                  <br />
                  <input
                    type="date"
                    name="startDate"
                    value={entepreneurInfo.startDate}
                    onChange={handleEntepreneurInputChange}
                    id="startDate"
                    class="survey-control"
                  />
                </div>
                {/*<!-- Razao Social -->*/}
                <div class="survey-box">
                  <label for="socialReason" id="socialReason-label">
                    Razão Social
                  </label>
                  <br />
                  <input
                    type="text"
                    name="socialReason"
                    value={entepreneurInfo.socialReason}
                    onChange={handleEntepreneurInputChange}
                    id="socialReason"
                    class="survey-control"
                  />
                </div>
                {/*<!-- Nome Fantasia -->*/}
                <div class="survey-box">
                  <label for="fantasyName" id="fantasyName-label">
                    Nome Fantasia
                  </label>
                  <br />
                  <input
                    type="text"
                    name="fantasyName"
                    value={entepreneurInfo.fantasyName}
                    onChange={handleEntepreneurInputChange}
                    id="fantasyName"
                    class="survey-control"
                  />
                </div>
                {/*<!-- CNPJ -->*/}
                <div class="survey-box">
                  <label for="CNPJ" id="CNPJ-label">
                    CNPJ
                  </label>
                  <br />
                  <input
                    type="text"
                    name="CNPJ"
                    value={entepreneurInfo.CNPJ}
                    onChange={handleEntepreneurInputChange}
                    id="CNPJ"
                    class="survey-control"
                  />
                </div>
                <div>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <>
                      <div key={`month-${i}`} className="survey-box">
                        <label htmlFor={`month${i}`} id={`month${i}-label`}>
                          Mês {i + 1}
                        </label>
                        <br />
                        <input
                          type="text"
                          name={`month${i}`}
                          id={`month${i}`}
                          value={incomeInfo[`month${i + 1}`]}
                          onChange={(e) =>
                            handleInputChange(`month${i + 1}`, e.target.value)
                          }
                          className="survey-control"
                        />
                      </div>
                      <div key={`year-${i}`} className="survey-box">
                        <label htmlFor={`year${i}`} id={`year${i}-label`}>
                          Ano {i + 1}
                        </label>
                        <br />
                        <input
                          type="text"
                          name={`year${i}`}
                          id={`year${i}`}
                          value={incomeInfo[`year${i + 1}`]}
                          onChange={(e) =>
                            handleInputChange(`year${i + 1}`, e.target.value)
                          }
                          className="survey-control"
                        />
                      </div>
                      <div key={`grossAmount-${i}`} className="survey-box">
                        <label
                          htmlFor={`grossAmount${i}`}
                          id={`grossAmount${i}-label`}
                        >
                          Valor Bruto {i + 1}
                        </label>
                        <br />
                        <input
                          type="number"
                          name={`grossAmount${i}`}
                          id={`grossAmount${i}`}
                          value={incomeInfo[`grossAmount${i + 1}`]}
                          onChange={(e) =>
                            handleInputChange(
                              `grossAmount${i + 1}`,
                              e.target.value
                            )
                          }
                          className="survey-control"
                        />
                      </div>
                      <div key={`proLabore-${i}`} className="survey-box">
                        <label
                          htmlFor={`proLabore${i}`}
                          id={`proLabore${i}-label`}
                        >
                          Valor Do Pró-labore {i + 1}
                        </label>
                        <br />
                        <input
                          type="number"
                          name={`proLabore${i}`}
                          id={`proLabore${i}`}
                          value={incomeInfo[`proLabore${i + 1}`]}
                          onChange={(e) =>
                            handleInputChange(
                              `proLabore${i + 1}`,
                              e.target.value
                            )
                          }
                          className="survey-control"
                        />
                      </div>
                      <div key={`dividends-${i}`} className="survey-box">
                        <label
                          htmlFor={`dividends${i}`}
                          id={`dividends${i}-label`}
                        >
                          Valor dos Dividendos {i + 1}
                        </label>
                        <br />
                        <input
                          type="number"
                          name={`dividends${i}`}
                          id={`dividends${i}`}
                          value={incomeInfo[`dividends${i + 1}`]}
                          onChange={(e) =>
                            handleInputChange(
                              `dividends${i + 1}`,
                              e.target.value
                            )
                          }
                          className="survey-control"
                        />
                      </div>
                    </>
                  ))}
                </div>
                <div class="survey-box">
                  {member.incomeSource.includes("BusinessOwnerSimplifiedTax") ? <button
                    type="submit"
                    onClick={(e) => handleRegisterIncome(e, "BusinessOwnerSimplifiedTax")}
                    id="submit-button"
                  >
                    Salvar Informações
                  </button>
                    :
                    <button
                      type="submit"
                      onClick={(e) => handleRegisterIncome(e, "BusinessOwner")}
                      id="submit-button"
                    >
                      Salvar Informações
                    </button>
                  }
                </div>
              </>
            )}

          {/* PrivateEmployee */}
          {loading ? '' : (member.incomeSource.includes("PrivateEmployee") && !incomeAlreadyRegistered) && (
            <>
              {/*<!-- Data de Admissão -->*/}
              <div class="survey-box survey-renda">
                <label for="admissionDate" id="admissionDate-label">
                  Data de Admissão
                </label>
                <br />
                <input
                  type="date"
                  name="admissionDate"
                  value={CLTInfo.admissionDate}
                  onChange={handleCLTInputChange}
                  id="admissionDate"
                  class="survey-control"
                />
              </div>
              {/*<!-- Cargo -->*/}
              <div class="survey-box survey-renda">
                <label for="position" id="position-label">
                  Cargo
                </label>
                <br />
                <input
                  type="text"
                  name="position"
                  value={CLTInfo.position}
                  onChange={handleCLTInputChange}
                  id="position"
                  class="survey-control"
                />
              </div>
              {/*<!-- Fonte Pagadora( Empresa/Governo/ Pessoa Física) -->*/}
              <div class="survey-box survey-renda">
                <label for="payingSource" id="payingSource-label">
                  Fonte Pagadora
                </label>
                <br />
                <input
                  type="text"
                  name="payingSource"
                  value={CLTInfo.payingSource}
                  onChange={handleCLTInputChange}
                  id="payingSource"
                  class="survey-control"
                />
              </div>
              {/*<!-- Telefone da Fonte Pagadora -->*/}
              <div class="survey-box survey-renda">
                <label for="payingSourcePhone" id="payingSourcePhone-label">
                  Telefone da Fonte Pagadora
                </label>
                <br />
                <input
                  type="text"
                  name="payingSourcePhone"
                  value={CLTInfo.payingSourcePhone}
                  onChange={handleCLTInputChange}
                  id="payingSourcePhone"
                  class="survey-control"
                />
              </div>
              {/*<!-- Recebe Gratificação ? -->*/}
              <div class="survey-box survey-check">
                <label for="gratification" id="gratification-label">
                  {" "}
                  Recebe horas extras, premiação ou gratificação ?{" "}
                </label>
                <br />
                <input
                  type="checkbox"
                  name="gratification"
                  value={gratificationAutonomous}
                  onChange={handleGratificationAutonomous}
                  id="gratification"
                  class="survey-control"
                />
              </div>

              <div>
                {gratificationAutonomous ? (
                  <div className="mes-ano-box">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <>
                        <div
                          key={`month-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`month${i}`}
                            id={`month${i}`}
                            value={incomeInfo[`month${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(`month${i + 1}`, e.target.value)
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`year-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label htmlFor={`year${i}`} id={`year${i}-label`}>
                            Ano {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`year${i}`}
                            id={`year${i}`}
                            value={incomeInfo[`year${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(`year${i + 1}`, e.target.value)
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`grossAmount-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label
                            htmlFor={`grossAmount${i}`}
                            id={`grossAmount${i}-label`}
                          >
                            Valor Bruto {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`grossAmount${i}`}
                            id={`grossAmount${i}`}
                            value={incomeInfo[`grossAmount${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `grossAmount${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        {/*<!-- Teve deduções ? -->*/}
                        <div
                          class="survey-box survey-renda"
                          key={`deductions-${i + 1}`}
                        >
                          <label for="deductions" id="deductions-label">
                            {" "}
                            No valor informado, teve deduções ?{" "}
                          </label>
                          <br />
                          <input
                            type="checkbox"
                            name="deductions"
                            value={deductionsCLT[i + 1]}
                            onChange={() => handleDeductionsCLT(i + 1)}
                            id="deductions"
                            class="survey-control"
                          />
                        </div>
                        {deductionsCLT[i + 1] ? (
                          <>
                            <div
                              key={`incomeTax-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`incomeTax${i}`}
                                id={`incomeTax${i}-label`}
                              >
                                Imposto de Renda {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`incomeTax${i}`}
                                id={`incomeTax${i}`}
                                value={Number(incomeInfo[`incomeTax${i + 1}`])}
                                onChange={(e) =>
                                  handleInputChange(
                                    `incomeTax${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`publicPension-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`publicPension${i}`}
                                id={`publicPension${i}-label`}
                              >
                                Previdência Pública {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`publicPension${i}`}
                                id={`publicPension${i}`}
                                value={incomeInfo[`publicPension${i + 1}`]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `publicPension${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`otherDeductions-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`otherDeductions${i}`}
                                id={`otherDeductions${i}-label`}
                              >
                                Outras Deduções {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`otherDeductions${i}`}
                                id={`otherDeductions${i}`}
                                value={Number(
                                  incomeInfo[`otherDeductions${i + 1}`]
                                )}
                                onChange={(e) =>
                                  handleInputChange(
                                    `otherDeductions${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                          </>
                        ) : (
                          ''
                        )}
                        <div>
                          <div
                            key={`foodAllowanceValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`foodAllowanceValue${i}`}
                              id={`foodAllowanceValue${i}-label`}
                            >
                              Auxílio Alimentação {i + 1}
                            </label>
                            <br />
                            <input
                              type="text"
                              name={`foodAllowanceValue${i}`}
                              id={`foodAllowanceValue${i}`}
                              value={incomeInfo[`foodAllowanceValue${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `foodAllowanceValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`transportAllowanceValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`transportAllowanceValue${i}`}
                              id={`transportAllowanceValue${i}-label`}
                            >
                              Auxílio Transporte {i + 1}
                            </label>
                            <br />
                            <input
                              type="text"
                              name={`transportAllowanceValue${i}`}
                              id={`transportAllowanceValue${i}`}
                              value={
                                incomeInfo[`transportAllowanceValue${i + 1}`]
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  `transportAllowanceValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`expenseReimbursementValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`expenseReimbursementValue${i}`}
                              id={`expenseReimbursementValue${i}-label`}
                            >
                              Diárias e reembolsos de despesas {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`expenseReimbursementValue${i}`}
                              id={`expenseReimbursementValue${i}`}
                              value={
                                incomeInfo[`expenseReimbursementValue${i + 1}`]
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  `expenseReimbursementValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`advancePaymentValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`advancePaymentValue${i}`}
                              style={{
                                fontSize: "12px",
                                display: "block",
                                width: "80%",
                              }}
                              id={`advancePaymentValue${i}-label`}
                            >
                              Adiantamentos, Antecipações, Estornos e
                              Compensações referentes a períodos anteriores{" "}
                              {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`advancePaymentValue${i}`}
                              id={`advancePaymentValue${i}`}
                              value={incomeInfo[`advancePaymentValue${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `advancePaymentValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`reversalValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`reversalValue${i}`}
                              style={{
                                fontSize: "12px",
                                display: "block",
                                width: "80%",
                              }}
                              id={`reversalValue${i}-label`}
                            >
                              Indenizações decorrentes de contratos de seguros e
                              por força de decisão judicial {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`reversalValue${i}`}
                              id={`reversalValue${i}`}
                              value={incomeInfo[`reversalValue${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `reversalValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`compensationValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`compensationValue${i}`}
                              style={{
                                fontSize: "12px",
                                display: "block",
                                width: "80%",
                              }}
                              id={`compensationValue${i}-label`}
                            >
                              Rendimentos percebidos no âmbito de programas
                              governamentais {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`compensationValue${i}`}
                              id={`compensationValue${i}`}
                              value={incomeInfo[`compensationValue${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `compensationValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`judicialPensionValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`judicialPensionValue${i}`}
                              id={`judicialPensionValue${i}-label`}
                            >
                              Pensão alimentícia, exclusivamente no caso de
                              decisão judicial {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`judicialPensionValue${i}`}
                              id={`judicialPensionValue${i}`}
                              value={incomeInfo[`judicialPensionValue${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `judicialPensionValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                        </div>
                        ''
                      </>
                    ))}
                  </div>
                ) : (
                  <div className="mes-ano-box">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <>
                        <div
                          key={`month-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`month${i}`}
                            id={`month${i}`}
                            value={incomeInfo[`month${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(`month${i + 1}`, e.target.value)
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`year-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label htmlFor={`year${i}`} id={`year${i}-label`}>
                            Ano {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`year${i}`}
                            id={`year${i}`}
                            value={incomeInfo[`year${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(`year${i + 1}`, e.target.value)
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`grossAmount-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label
                            htmlFor={`grossAmount${i}`}
                            id={`grossAmount${i}-label`}
                          >
                            Valor Bruto {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`grossAmount${i}`}
                            id={`grossAmount${i}`}
                            value={incomeInfo[`grossAmount${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `grossAmount${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        {/*<!-- Teve deduções ? -->*/}
                        <div
                          class="survey-box survey-renda"
                          key={`deductions-${i + 1}`}
                        >
                          <label for="deductions" id="deductions-label">
                            {" "}
                            No valor informado, teve deduções ?{" "}
                          </label>
                          <br />
                          <input
                            type="checkbox"
                            name="deductions"
                            value={deductionsCLT[i + 1]}
                            onChange={() => handleDeductionsCLT(i + 1)}
                            id="deductions"
                            class="survey-control"
                          />
                        </div>
                        {deductionsCLT[i + 1] ? (
                          <>
                            <div
                              key={`incomeTax-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`incomeTax${i}`}
                                id={`incomeTax${i}-label`}
                              >
                                Imposto de Renda {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`incomeTax${i}`}
                                id={`incomeTax${i}`}
                                value={incomeInfo[`incomeTax${i + 1}`]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `incomeTax${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`publicPension-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`publicPension${i}`}
                                id={`publicPension${i}-label`}
                              >
                                Previdência Pública {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`publicPension${i}`}
                                id={`publicPension${i}`}
                                value={incomeInfo[`publicPension${i + 1}`]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `publicPension${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`otherDeductions-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`otherDeductions${i}`}
                                id={`otherDeductions${i}-label`}
                              >
                                Outras Deduções {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`otherDeductions${i}`}
                                id={`otherDeductions${i}`}
                                value={Number(
                                  incomeInfo[`otherDeductions${i + 1}`]
                                )}
                                onChange={(e) =>
                                  handleInputChange(
                                    `otherDeductions${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                          </>
                        ) : (
                          ''
                        )}
                        <div
                          key={`foodAllowanceValue-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label
                            htmlFor={`foodAllowanceValue${i}`}
                            id={`foodAllowanceValue${i}-label`}
                          >
                            Auxílio Alimentação {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`foodAllowanceValue${i}`}
                            id={`foodAllowanceValue${i}`}
                            value={incomeInfo[`foodAllowanceValue${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `foodAllowanceValue${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`transportAllowanceValue-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label
                            htmlFor={`transportAllowanceValue${i}`}
                            id={`transportAllowanceValue${i}-label`}
                          >
                            Auxílio Transporte {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`transportAllowanceValue${i}`}
                            id={`transportAllowanceValue${i}`}
                            value={
                              incomeInfo[`transportAllowanceValue${i + 1}`]
                            }
                            onChange={(e) =>
                              handleInputChange(
                                `transportAllowanceValue${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`expenseReimbursementValue-${i}`}
                          className="survey-box"
                        >
                          <label
                            htmlFor={`expenseReimbursementValue${i}`}
                            id={`expenseReimbursementValue${i}-label`}
                          >
                            Diárias e reembolsos de despesas {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`expenseReimbursementValue${i}`}
                            id={`expenseReimbursementValue${i}`}
                            value={
                              incomeInfo[`expenseReimbursementValue${i + 1}`]
                            }
                            onChange={(e) =>
                              handleInputChange(
                                `expenseReimbursementValue${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`advancePaymentValue-${i}`}
                          className="survey-box"
                        >
                          <label
                            htmlFor={`advancePaymentValue${i}`}
                            style={{
                              fontSize: "12px",
                              display: "block",
                              width: "80%",
                            }}
                            id={`advancePaymentValue${i}-label`}
                          >
                            Adiantamentos, Antecipações, Estornos e Compensações
                            referentes a períodos anteriores {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`advancePaymentValue${i}`}
                            id={`advancePaymentValue${i}`}
                            value={incomeInfo[`advancePaymentValue${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `advancePaymentValue${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        <div key={`reversalValue-${i}`} className="survey-box">
                          <label
                            htmlFor={`reversalValue${i}`}
                            style={{
                              fontSize: "12px",
                              display: "block",
                              width: "80%",
                            }}
                            id={`reversalValue${i}-label`}
                          >
                            Indenizações decorrentes de contratos de seguros e
                            por força de decisão judicial {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`reversalValue${i}`}
                            id={`reversalValue${i}`}
                            value={incomeInfo[`reversalValue${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `reversalValue${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`compensationValue-${i}`}
                          className="survey-box"
                        >
                          <label
                            htmlFor={`compensationValue${i}`}
                            style={{
                              fontSize: "12px",
                              display: "block",
                              width: "80%",
                            }}
                            id={`compensationValue${i}-label`}
                          >
                            Rendimentos percebidos no âmbito de programas
                            governamentais {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`compensationValue${i}`}
                            id={`compensationValue${i}`}
                            value={incomeInfo[`compensationValue${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `compensationValue${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`judicialPensionValue-${i}`}
                          className="survey-box"
                        >
                          <label
                            htmlFor={`judicialPensionValue${i}`}
                            id={`judicialPensionValue${i}-label`}
                          >
                            Pensão alimentícia, exclusivamente no caso de
                            decisão judicial {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`judicialPensionValue${i}`}
                            id={`judicialPensionValue${i}`}
                            value={incomeInfo[`judicialPensionValue${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `judicialPensionValue${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                      </>
                    ))}
                  </div>
                )}
              </div>

              <div class="survey-box survey-renda">
                <button
                  type="submit"
                  onClick={(e) => handleRegisterIncome(e, "PrivateEmployee")}
                  id="submit-button"
                >
                  Salvar Informações
                </button>
              </div>
            </>
          )}

          {/* PublicEmployee */}
          {loading ? '' : (member.incomeSource.includes("PublicEmployee") && !incomeAlreadyRegistered) && (
            <>
              {/*<!-- Data de Admissão -->*/}
              <div class="survey-box survey-renda">
                <label for="admissionDate" id="admissionDate-label">
                  Data de Admissão
                </label>
                <br />
                <input
                  type="date"
                  name="admissionDate"
                  value={CLTInfo.admissionDate}
                  onChange={handleCLTInputChange}
                  id="admissionDate"
                  class="survey-control"
                />
              </div>
              {/*<!-- Cargo -->*/}
              <div class="survey-box survey-renda">
                <label for="position" id="position-label">
                  Cargo
                </label>
                <br />
                <input
                  type="text"
                  name="position"
                  value={CLTInfo.position}
                  onChange={handleCLTInputChange}
                  id="position"
                  class="survey-control"
                />
              </div>
              {/*<!-- Fonte Pagadora( Empresa/Governo/ Pessoa Física) -->*/}
              <div class="survey-box survey-renda">
                <label for="payingSource" id="payingSource-label">
                  Fonte Pagadora
                </label>
                <br />
                <input
                  type="text"
                  name="payingSource"
                  value={CLTInfo.payingSource}
                  onChange={handleCLTInputChange}
                  id="payingSource"
                  class="survey-control"
                />
              </div>
              {/*<!-- Telefone da Fonte Pagadora -->*/}
              <div class="survey-box survey-renda">
                <label for="payingSourcePhone" id="payingSourcePhone-label">
                  Telefone da Fonte Pagadora
                </label>
                <br />
                <input
                  type="text"
                  name="payingSourcePhone"
                  value={CLTInfo.payingSourcePhone}
                  onChange={handleCLTInputChange}
                  id="payingSourcePhone"
                  class="survey-control"
                />
              </div>
              {/*<!-- Recebe Gratificação ? -->*/}
              <div class="survey-box survey-renda">
                <label for="gratification" id="gratification-label">
                  {" "}
                  Recebe horas extras, premiação ou gratificação ?{" "}
                </label>
                <br />
                <input
                  type="checkbox"
                  name="gratification"
                  value={gratificationAutonomous}
                  onChange={handleGratificationAutonomous}
                  id="gratification"
                  class="survey-control"
                />
              </div>

              <div>
                {gratificationAutonomous ? (
                  <div className="mes-ano-box">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <>
                        <div
                          key={`month-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`month${i}`}
                            id={`month${i}`}
                            value={incomeInfo[`month${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(`month${i + 1}`, e.target.value)
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`year-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label htmlFor={`year${i}`} id={`year${i}-label`}>
                            Ano {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`year${i}`}
                            id={`year${i}`}
                            value={incomeInfo[`year${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(`year${i + 1}`, e.target.value)
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`grossAmount-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label
                            htmlFor={`grossAmount${i}`}
                            id={`grossAmount${i}-label`}
                          >
                            Valor Bruto {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`grossAmount${i}`}
                            id={`grossAmount${i}`}
                            value={incomeInfo[`grossAmount${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `grossAmount${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        {/*<!-- Teve deduções ? -->*/}
                        <div
                          class="survey-box survey-renda"
                          key={`deductions-${i + 1}`}
                        >
                          <label for="deductions" id="deductions-label">
                            {" "}
                            No valor informado, teve deduções ?{" "}
                          </label>
                          <br />
                          <input
                            type="checkbox"
                            name="deductions"
                            value={deductionsCLT[i + 1]}
                            onChange={() => handleDeductionsCLT(i + 1)}
                            id="deductions"
                            class="survey-control"
                          />
                        </div>
                        {deductionsCLT[i + 1] ? (
                          <>
                            <div
                              key={`incomeTax-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`incomeTax${i}`}
                                id={`incomeTax${i}-label`}
                              >
                                Imposto de Renda {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`incomeTax${i}`}
                                id={`incomeTax${i}`}
                                value={Number(incomeInfo[`incomeTax${i + 1}`])}
                                onChange={(e) =>
                                  handleInputChange(
                                    `incomeTax${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`publicPension-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`publicPension${i}`}
                                id={`publicPension${i}-label`}
                              >
                                Previdência Pública {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`publicPension${i}`}
                                id={`publicPension${i}`}
                                value={incomeInfo[`publicPension${i + 1}`]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `publicPension${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`otherDeductions-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`otherDeductions${i}`}
                                id={`otherDeductions${i}-label`}
                              >
                                Outras Deduções {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`otherDeductions${i}`}
                                id={`otherDeductions${i}`}
                                value={Number(
                                  incomeInfo[`otherDeductions${i + 1}`]
                                )}
                                onChange={(e) =>
                                  handleInputChange(
                                    `otherDeductions${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                          </>
                        ) : (
                          ''
                        )}
                        <div>
                          <div
                            key={`foodAllowanceValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`foodAllowanceValue${i}`}
                              id={`foodAllowanceValue${i}-label`}
                            >
                              Auxílio Alimentação {i + 1}
                            </label>
                            <br />
                            <input
                              type="text"
                              name={`foodAllowanceValue${i}`}
                              id={`foodAllowanceValue${i}`}
                              value={incomeInfo[`foodAllowanceValue${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `foodAllowanceValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`transportAllowanceValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`transportAllowanceValue${i}`}
                              id={`transportAllowanceValue${i}-label`}
                            >
                              Auxílio Transporte {i + 1}
                            </label>
                            <br />
                            <input
                              type="text"
                              name={`transportAllowanceValue${i}`}
                              id={`transportAllowanceValue${i}`}
                              value={
                                incomeInfo[`transportAllowanceValue${i + 1}`]
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  `transportAllowanceValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`expenseReimbursementValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`expenseReimbursementValue${i}`}
                              id={`expenseReimbursementValue${i}-label`}
                            >
                              Diárias e reembolsos de despesas {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`expenseReimbursementValue${i}`}
                              id={`expenseReimbursementValue${i}`}
                              value={
                                incomeInfo[`expenseReimbursementValue${i + 1}`]
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  `expenseReimbursementValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`advancePaymentValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`advancePaymentValue${i}`}
                              style={{
                                fontSize: "12px",
                                display: "block",
                                width: "80%",
                              }}
                              id={`advancePaymentValue${i}-label`}
                            >
                              Adiantamentos, Antecipações, Estornos e
                              Compensações referentes a períodos anteriores{" "}
                              {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`advancePaymentValue${i}`}
                              id={`advancePaymentValue${i}`}
                              value={incomeInfo[`advancePaymentValue${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `advancePaymentValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`reversalValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`reversalValue${i}`}
                              style={{
                                fontSize: "12px",
                                display: "block",
                                width: "80%",
                              }}
                              id={`reversalValue${i}-label`}
                            >
                              Indenizações decorrentes de contratos de seguros e
                              por força de decisão judicial {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`reversalValue${i}`}
                              id={`reversalValue${i}`}
                              value={incomeInfo[`reversalValue${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `reversalValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`compensationValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`compensationValue${i}`}
                              style={{
                                fontSize: "12px",
                                display: "block",
                                width: "80%",
                              }}
                              id={`compensationValue${i}-label`}
                            >
                              Rendimentos percebidos no âmbito de programas
                              governamentais {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`compensationValue${i}`}
                              id={`compensationValue${i}`}
                              value={incomeInfo[`compensationValue${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `compensationValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`judicialPensionValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`judicialPensionValue${i}`}
                              id={`judicialPensionValue${i}-label`}
                            >
                              Pensão alimentícia, exclusivamente no caso de
                              decisão judicial {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`judicialPensionValue${i}`}
                              id={`judicialPensionValue${i}`}
                              value={incomeInfo[`judicialPensionValue${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `judicialPensionValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                        </div>
                        ''
                      </>
                    ))}
                  </div>
                ) : (
                  <div className="mes-ano-box">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <>
                        <div
                          key={`month-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`month${i}`}
                            id={`month${i}`}
                            value={incomeInfo[`month${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(`month${i + 1}`, e.target.value)
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`year-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label htmlFor={`year${i}`} id={`year${i}-label`}>
                            Ano {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`year${i}`}
                            id={`year${i}`}
                            value={incomeInfo[`year${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(`year${i + 1}`, e.target.value)
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`grossAmount-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label
                            htmlFor={`grossAmount${i}`}
                            id={`grossAmount${i}-label`}
                          >
                            Valor Bruto {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`grossAmount${i}`}
                            id={`grossAmount${i}`}
                            value={incomeInfo[`grossAmount${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `grossAmount${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        {/*<!-- Teve deduções ? -->*/}
                        <div
                          class="survey-box survey-renda"
                          key={`deductions-${i + 1}`}
                        >
                          <label for="deductions" id="deductions-label">
                            {" "}
                            No valor informado, teve deduções ?{" "}
                          </label>
                          <br />
                          <input
                            type="checkbox"
                            name="deductions"
                            value={deductionsCLT[i + 1]}
                            onChange={() => handleDeductionsCLT(i + 1)}
                            id="deductions"
                            class="survey-control"
                          />
                        </div>
                        {deductionsCLT[i + 1] ? (
                          <>
                            <div
                              key={`incomeTax-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`incomeTax${i}`}
                                id={`incomeTax${i}-label`}
                              >
                                Imposto de Renda {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`incomeTax${i}`}
                                id={`incomeTax${i}`}
                                value={incomeInfo[`incomeTax${i + 1}`]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `incomeTax${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`publicPension-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`publicPension${i}`}
                                id={`publicPension${i}-label`}
                              >
                                Previdência Pública {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`publicPension${i}`}
                                id={`publicPension${i}`}
                                value={incomeInfo[`publicPension${i + 1}`]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `publicPension${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`otherDeductions-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`otherDeductions${i}`}
                                id={`otherDeductions${i}-label`}
                              >
                                Outras Deduções {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`otherDeductions${i}`}
                                id={`otherDeductions${i}`}
                                value={Number(
                                  incomeInfo[`otherDeductions${i + 1}`]
                                )}
                                onChange={(e) =>
                                  handleInputChange(
                                    `otherDeductions${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                          </>
                        ) : (
                          ''
                        )}
                        <div
                          key={`foodAllowanceValue-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label
                            htmlFor={`foodAllowanceValue${i}`}
                            id={`foodAllowanceValue${i}-label`}
                          >
                            Auxílio Alimentação {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`foodAllowanceValue${i}`}
                            id={`foodAllowanceValue${i}`}
                            value={incomeInfo[`foodAllowanceValue${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `foodAllowanceValue${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`transportAllowanceValue-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label
                            htmlFor={`transportAllowanceValue${i}`}
                            id={`transportAllowanceValue${i}-label`}
                          >
                            Auxílio Transporte {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`transportAllowanceValue${i}`}
                            id={`transportAllowanceValue${i}`}
                            value={
                              incomeInfo[`transportAllowanceValue${i + 1}`]
                            }
                            onChange={(e) =>
                              handleInputChange(
                                `transportAllowanceValue${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`expenseReimbursementValue-${i}`}
                          className="survey-box"
                        >
                          <label
                            htmlFor={`expenseReimbursementValue${i}`}
                            id={`expenseReimbursementValue${i}-label`}
                          >
                            Diárias e reembolsos de despesas {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`expenseReimbursementValue${i}`}
                            id={`expenseReimbursementValue${i}`}
                            value={
                              incomeInfo[`expenseReimbursementValue${i + 1}`]
                            }
                            onChange={(e) =>
                              handleInputChange(
                                `expenseReimbursementValue${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`advancePaymentValue-${i}`}
                          className="survey-box"
                        >
                          <label
                            htmlFor={`advancePaymentValue${i}`}
                            style={{
                              fontSize: "12px",
                              display: "block",
                              width: "80%",
                            }}
                            id={`advancePaymentValue${i}-label`}
                          >
                            Adiantamentos, Antecipações, Estornos e Compensações
                            referentes a períodos anteriores {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`advancePaymentValue${i}`}
                            id={`advancePaymentValue${i}`}
                            value={incomeInfo[`advancePaymentValue${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `advancePaymentValue${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        <div key={`reversalValue-${i}`} className="survey-box">
                          <label
                            htmlFor={`reversalValue${i}`}
                            style={{
                              fontSize: "12px",
                              display: "block",
                              width: "80%",
                            }}
                            id={`reversalValue${i}-label`}
                          >
                            Indenizações decorrentes de contratos de seguros e
                            por força de decisão judicial {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`reversalValue${i}`}
                            id={`reversalValue${i}`}
                            value={incomeInfo[`reversalValue${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `reversalValue${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`compensationValue-${i}`}
                          className="survey-box"
                        >
                          <label
                            htmlFor={`compensationValue${i}`}
                            style={{
                              fontSize: "12px",
                              display: "block",
                              width: "80%",
                            }}
                            id={`compensationValue${i}-label`}
                          >
                            Rendimentos percebidos no âmbito de programas
                            governamentais {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`compensationValue${i}`}
                            id={`compensationValue${i}`}
                            value={incomeInfo[`compensationValue${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `compensationValue${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`judicialPensionValue-${i}`}
                          className="survey-box"
                        >
                          <label
                            htmlFor={`judicialPensionValue${i}`}
                            id={`judicialPensionValue${i}-label`}
                          >
                            Pensão alimentícia, exclusivamente no caso de
                            decisão judicial {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`judicialPensionValue${i}`}
                            id={`judicialPensionValue${i}`}
                            value={incomeInfo[`judicialPensionValue${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `judicialPensionValue${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                      </>
                    ))}
                  </div>
                )}
              </div>

              <div class="survey-box survey-renda">
                <button
                  type="submit"
                  onClick={(e) => handleRegisterIncome(e, "PublicEmployee")}
                  id="submit-button"
                >
                  Salvar Informações
                </button>
              </div>
            </>
          )}

          {/* DomesticEmployee */}
          {loading ? '' : (member.incomeSource.includes("DomesticEmployee") && !incomeAlreadyRegistered) && (
            <>
              {/*<!-- Data de Admissão -->*/}
              <div class="survey-box survey-renda">
                <label for="admissionDate" id="admissionDate-label">
                  Data de Admissão
                </label>
                <br />
                <input
                  type="date"
                  name="admissionDate"
                  value={CLTInfo.admissionDate}
                  onChange={handleCLTInputChange}
                  id="admissionDate"
                  class="survey-control"
                />
              </div>
              {/*<!-- Cargo -->*/}
              <div class="survey-box survey-renda">
                <label for="position" id="position-label">
                  Cargo
                </label>
                <br />
                <input
                  type="text"
                  name="position"
                  value={CLTInfo.position}
                  onChange={handleCLTInputChange}
                  id="position"
                  class="survey-control"
                />
              </div>
              {/*<!-- Fonte Pagadora( Empresa/Governo/ Pessoa Física) -->*/}
              <div class="survey-box survey-renda">
                <label for="payingSource" id="payingSource-label">
                  Fonte Pagadora
                </label>
                <br />
                <input
                  type="text"
                  name="payingSource"
                  value={CLTInfo.payingSource}
                  onChange={handleCLTInputChange}
                  id="payingSource"
                  class="survey-control"
                />
              </div>
              {/*<!-- Telefone da Fonte Pagadora -->*/}
              <div class="survey-box survey-renda">
                <label for="payingSourcePhone" id="payingSourcePhone-label">
                  Telefone da Fonte Pagadora
                </label>
                <br />
                <input
                  type="text"
                  name="payingSourcePhone"
                  value={CLTInfo.payingSourcePhone}
                  onChange={handleCLTInputChange}
                  id="payingSourcePhone"
                  class="survey-control"
                />
              </div>
              {/*<!-- Recebe Gratificação ? -->*/}
              <div class="survey-box survey-renda">
                <label for="gratification" id="gratification-label">
                  {" "}
                  Recebe horas extras, premiação ou gratificação ?{" "}
                </label>
                <br />
                <input
                  type="checkbox"
                  name="gratification"
                  value={gratificationAutonomous}
                  onChange={handleGratificationAutonomous}
                  id="gratification"
                  class="survey-control"
                />
              </div>

              <div>
                {gratificationAutonomous ? (
                  <div className="mes-ano-box">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <>
                        <div
                          key={`month-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`month${i}`}
                            id={`month${i}`}
                            value={incomeInfo[`month${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(`month${i + 1}`, e.target.value)
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`year-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label htmlFor={`year${i}`} id={`year${i}-label`}>
                            Ano {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`year${i}`}
                            id={`year${i}`}
                            value={incomeInfo[`year${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(`year${i + 1}`, e.target.value)
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`grossAmount-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label
                            htmlFor={`grossAmount${i}`}
                            id={`grossAmount${i}-label`}
                          >
                            Valor Bruto {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`grossAmount${i}`}
                            id={`grossAmount${i}`}
                            value={incomeInfo[`grossAmount${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `grossAmount${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        {/*<!-- Teve deduções ? -->*/}
                        <div
                          class="survey-box survey-renda"
                          key={`deductions-${i + 1}`}
                        >
                          <label for="deductions" id="deductions-label">
                            {" "}
                            No valor informado, teve deduções ?{" "}
                          </label>
                          <br />
                          <input
                            type="checkbox"
                            name="deductions"
                            value={deductionsCLT[i + 1]}
                            onChange={() => handleDeductionsCLT(i + 1)}
                            id="deductions"
                            class="survey-control"
                          />
                        </div>
                        {deductionsCLT[i + 1] ? (
                          <>
                            <div
                              key={`incomeTax-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`incomeTax${i}`}
                                id={`incomeTax${i}-label`}
                              >
                                Imposto de Renda {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`incomeTax${i}`}
                                id={`incomeTax${i}`}
                                value={Number(incomeInfo[`incomeTax${i + 1}`])}
                                onChange={(e) =>
                                  handleInputChange(
                                    `incomeTax${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`publicPension-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`publicPension${i}`}
                                id={`publicPension${i}-label`}
                              >
                                Previdência Pública {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`publicPension${i}`}
                                id={`publicPension${i}`}
                                value={incomeInfo[`publicPension${i + 1}`]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `publicPension${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`otherDeductions-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`otherDeductions${i}`}
                                id={`otherDeductions${i}-label`}
                              >
                                Outras Deduções {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`otherDeductions${i}`}
                                id={`otherDeductions${i}`}
                                value={Number(
                                  incomeInfo[`otherDeductions${i + 1}`]
                                )}
                                onChange={(e) =>
                                  handleInputChange(
                                    `otherDeductions${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                          </>
                        ) : (
                          ''
                        )}
                        <div>
                          <div
                            key={`foodAllowanceValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`foodAllowanceValue${i}`}
                              id={`foodAllowanceValue${i}-label`}
                            >
                              Auxílio Alimentação {i + 1}
                            </label>
                            <br />
                            <input
                              type="text"
                              name={`foodAllowanceValue${i}`}
                              id={`foodAllowanceValue${i}`}
                              value={incomeInfo[`foodAllowanceValue${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `foodAllowanceValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`transportAllowanceValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`transportAllowanceValue${i}`}
                              id={`transportAllowanceValue${i}-label`}
                            >
                              Auxílio Transporte {i + 1}
                            </label>
                            <br />
                            <input
                              type="text"
                              name={`transportAllowanceValue${i}`}
                              id={`transportAllowanceValue${i}`}
                              value={
                                incomeInfo[`transportAllowanceValue${i + 1}`]
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  `transportAllowanceValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`expenseReimbursementValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`expenseReimbursementValue${i}`}
                              id={`expenseReimbursementValue${i}-label`}
                            >
                              Diárias e reembolsos de despesas {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`expenseReimbursementValue${i}`}
                              id={`expenseReimbursementValue${i}`}
                              value={
                                incomeInfo[`expenseReimbursementValue${i + 1}`]
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  `expenseReimbursementValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`advancePaymentValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`advancePaymentValue${i}`}
                              style={{
                                fontSize: "12px",
                                display: "block",
                                width: "80%",
                              }}
                              id={`advancePaymentValue${i}-label`}
                            >
                              Adiantamentos, Antecipações, Estornos e
                              Compensações referentes a períodos anteriores{" "}
                              {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`advancePaymentValue${i}`}
                              id={`advancePaymentValue${i}`}
                              value={incomeInfo[`advancePaymentValue${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `advancePaymentValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`reversalValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`reversalValue${i}`}
                              style={{
                                fontSize: "12px",
                                display: "block",
                                width: "80%",
                              }}
                              id={`reversalValue${i}-label`}
                            >
                              Indenizações decorrentes de contratos de seguros e
                              por força de decisão judicial {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`reversalValue${i}`}
                              id={`reversalValue${i}`}
                              value={incomeInfo[`reversalValue${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `reversalValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`compensationValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`compensationValue${i}`}
                              style={{
                                fontSize: "12px",
                                display: "block",
                                width: "80%",
                              }}
                              id={`compensationValue${i}-label`}
                            >
                              Rendimentos percebidos no âmbito de programas
                              governamentais {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`compensationValue${i}`}
                              id={`compensationValue${i}`}
                              value={incomeInfo[`compensationValue${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `compensationValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`judicialPensionValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`judicialPensionValue${i}`}
                              id={`judicialPensionValue${i}-label`}
                            >
                              Pensão alimentícia, exclusivamente no caso de
                              decisão judicial {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`judicialPensionValue${i}`}
                              id={`judicialPensionValue${i}`}
                              value={incomeInfo[`judicialPensionValue${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `judicialPensionValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                        </div>
                        ''
                      </>
                    ))}
                  </div>
                ) : (
                  <div>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <>
                        <div key={`month-${i}`} className="survey-box">
                          <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`month${i}`}
                            id={`month${i}`}
                            value={incomeInfo[`month${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(`month${i + 1}`, e.target.value)
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`year-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label htmlFor={`year${i}`} id={`year${i}-label`}>
                            Ano {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`year${i}`}
                            id={`year${i}`}
                            value={incomeInfo[`year${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(`year${i + 1}`, e.target.value)
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`grossAmount-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label
                            htmlFor={`grossAmount${i}`}
                            id={`grossAmount${i}-label`}
                          >
                            Valor Bruto {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`grossAmount${i}`}
                            id={`grossAmount${i}`}
                            value={incomeInfo[`grossAmount${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `grossAmount${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        {/*<!-- Teve deduções ? -->*/}
                        <div
                          class="survey-box survey-renda"
                          key={`deductions-${i + 1}`}
                        >
                          <label for="deductions" id="deductions-label">
                            {" "}
                            No valor informado, teve deduções ?{" "}
                          </label>
                          <br />
                          <input
                            type="checkbox"
                            name="deductions"
                            value={deductionsCLT[i + 1]}
                            onChange={() => handleDeductionsCLT(i + 1)}
                            id="deductions"
                            class="survey-control"
                          />
                        </div>
                        {deductionsCLT[i + 1] ? (
                          <>
                            <div
                              key={`incomeTax-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`incomeTax${i}`}
                                id={`incomeTax${i}-label`}
                              >
                                Imposto de Renda {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`incomeTax${i}`}
                                id={`incomeTax${i}`}
                                value={incomeInfo[`incomeTax${i + 1}`]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `incomeTax${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`publicPension-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`publicPension${i}`}
                                id={`publicPension${i}-label`}
                              >
                                Previdência Pública {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`publicPension${i}`}
                                id={`publicPension${i}`}
                                value={incomeInfo[`publicPension${i + 1}`]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `publicPension${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`otherDeductions-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`otherDeductions${i}`}
                                id={`otherDeductions${i}-label`}
                              >
                                Outras Deduções {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`otherDeductions${i}`}
                                id={`otherDeductions${i}`}
                                value={Number(
                                  incomeInfo[`otherDeductions${i + 1}`]
                                )}
                                onChange={(e) =>
                                  handleInputChange(
                                    `otherDeductions${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                          </>
                        ) : (
                          ''
                        )}
                        <div
                          key={`foodAllowanceValue-${i}`}
                          className="survey-box"
                        >
                          <label
                            htmlFor={`foodAllowanceValue${i}`}
                            id={`foodAllowanceValue${i}-label`}
                          >
                            Auxílio Alimentação {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`foodAllowanceValue${i}`}
                            id={`foodAllowanceValue${i}`}
                            value={incomeInfo[`foodAllowanceValue${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `foodAllowanceValue${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`transportAllowanceValue-${i}`}
                          className="survey-box"
                        >
                          <label
                            htmlFor={`transportAllowanceValue${i}`}
                            id={`transportAllowanceValue${i}-label`}
                          >
                            Auxílio Transporte {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`transportAllowanceValue${i}`}
                            id={`transportAllowanceValue${i}`}
                            value={
                              incomeInfo[`transportAllowanceValue${i + 1}`]
                            }
                            onChange={(e) =>
                              handleInputChange(
                                `transportAllowanceValue${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`expenseReimbursementValue-${i}`}
                          className="survey-box"
                        >
                          <label
                            htmlFor={`expenseReimbursementValue${i}`}
                            id={`expenseReimbursementValue${i}-label`}
                          >
                            Diárias e reembolsos de despesas {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`expenseReimbursementValue${i}`}
                            id={`expenseReimbursementValue${i}`}
                            value={
                              incomeInfo[`expenseReimbursementValue${i + 1}`]
                            }
                            onChange={(e) =>
                              handleInputChange(
                                `expenseReimbursementValue${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`advancePaymentValue-${i}`}
                          className="survey-box"
                        >
                          <label
                            htmlFor={`advancePaymentValue${i}`}
                            style={{
                              fontSize: "12px",
                              display: "block",
                              width: "80%",
                            }}
                            id={`advancePaymentValue${i}-label`}
                          >
                            Adiantamentos, Antecipações, Estornos e Compensações
                            referentes a períodos anteriores {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`advancePaymentValue${i}`}
                            id={`advancePaymentValue${i}`}
                            value={incomeInfo[`advancePaymentValue${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `advancePaymentValue${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        <div key={`reversalValue-${i}`} className="survey-box">
                          <label
                            htmlFor={`reversalValue${i}`}
                            style={{
                              fontSize: "12px",
                              display: "block",
                              width: "80%",
                            }}
                            id={`reversalValue${i}-label`}
                          >
                            Indenizações decorrentes de contratos de seguros e
                            por força de decisão judicial {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`reversalValue${i}`}
                            id={`reversalValue${i}`}
                            value={incomeInfo[`reversalValue${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `reversalValue${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`compensationValue-${i}`}
                          className="survey-box"
                        >
                          <label
                            htmlFor={`compensationValue${i}`}
                            style={{
                              fontSize: "12px",
                              display: "block",
                              width: "80%",
                            }}
                            id={`compensationValue${i}-label`}
                          >
                            Rendimentos percebidos no âmbito de programas
                            governamentais {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`compensationValue${i}`}
                            id={`compensationValue${i}`}
                            value={incomeInfo[`compensationValue${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `compensationValue${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`judicialPensionValue-${i}`}
                          className="survey-box"
                        >
                          <label
                            htmlFor={`judicialPensionValue${i}`}
                            id={`judicialPensionValue${i}-label`}
                          >
                            Pensão alimentícia, exclusivamente no caso de
                            decisão judicial {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`judicialPensionValue${i}`}
                            id={`judicialPensionValue${i}`}
                            value={incomeInfo[`judicialPensionValue${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `judicialPensionValue${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                      </>
                    ))}
                  </div>
                )}
              </div>

              <div class="survey-box">
                <button
                  type="submit"
                  onClick={(e) => handleRegisterIncome(e, "DomesticEmployee")}
                  id="submit-button"
                >
                  Salvar Informações
                </button>
              </div>
            </>
          )}

          {/* TemporaryRuralEmployee */}
          {loading ? '' : (member.incomeSource.includes("TemporaryRuralEmployee") && !incomeAlreadyRegistered) && (
            <>
              {/*<!-- Data de Admissão -->*/}
              <div class="survey-box survey-renda">
                <label for="admissionDate" id="admissionDate-label">
                  Data de Admissão
                </label>
                <br />
                <input
                  type="date"
                  name="admissionDate"
                  value={CLTInfo.admissionDate}
                  onChange={handleCLTInputChange}
                  id="admissionDate"
                  class="survey-control"
                />
              </div>
              {/*<!-- Cargo -->*/}
              <div class="survey-box survey-renda">
                <label for="position" id="position-label">
                  Cargo
                </label>
                <br />
                <input
                  type="text"
                  name="position"
                  value={CLTInfo.position}
                  onChange={handleCLTInputChange}
                  id="position"
                  class="survey-control"
                />
              </div>
              {/*<!-- Fonte Pagadora( Empresa/Governo/ Pessoa Física) -->*/}
              <div class="survey-box survey-renda">
                <label for="payingSource" id="payingSource-label">
                  Fonte Pagadora
                </label>
                <br />
                <input
                  type="text"
                  name="payingSource"
                  value={CLTInfo.payingSource}
                  onChange={handleCLTInputChange}
                  id="payingSource"
                  class="survey-control"
                />
              </div>
              {/*<!-- Telefone da Fonte Pagadora -->*/}
              <div class="survey-box survey-renda">
                <label for="payingSourcePhone" id="payingSourcePhone-label">
                  Telefone da Fonte Pagadora
                </label>
                <br />
                <input
                  type="text"
                  name="payingSourcePhone"
                  value={CLTInfo.payingSourcePhone}
                  onChange={handleCLTInputChange}
                  id="payingSourcePhone"
                  class="survey-control"
                />
              </div>
              {/*<!-- Recebe Gratificação ? -->*/}
              <div class="survey-box survey-renda">
                <label for="gratification" id="gratification-label">
                  {" "}
                  Recebe horas extras, premiação ou gratificação ?{" "}
                </label>
                <br />
                <input
                  type="checkbox"
                  name="gratification"
                  value={gratificationAutonomous}
                  onChange={handleGratificationAutonomous}
                  id="gratification"
                  class="survey-control"
                />
              </div>

              <div>
                {gratificationAutonomous ? (
                  <div className="mes-ano-box">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <>
                        <div
                          key={`month-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`month${i}`}
                            id={`month${i}`}
                            value={incomeInfo[`month${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(`month${i + 1}`, e.target.value)
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`year-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label htmlFor={`year${i}`} id={`year${i}-label`}>
                            Ano {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`year${i}`}
                            id={`year${i}`}
                            value={incomeInfo[`year${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(`year${i + 1}`, e.target.value)
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`grossAmount-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label
                            htmlFor={`grossAmount${i}`}
                            id={`grossAmount${i}-label`}
                          >
                            Valor Bruto {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`grossAmount${i}`}
                            id={`grossAmount${i}`}
                            value={incomeInfo[`grossAmount${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `grossAmount${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        {/*<!-- Teve deduções ? -->*/}
                        <div
                          class="survey-box survey-renda"
                          key={`deductions-${i + 1}`}
                        >
                          <label for="deductions" id="deductions-label">
                            {" "}
                            No valor informado, teve deduções ?{" "}
                          </label>
                          <br />
                          <input
                            type="checkbox"
                            name="deductions"
                            value={deductionsCLT[i + 1]}
                            onChange={() => handleDeductionsCLT(i + 1)}
                            id="deductions"
                            class="survey-control"
                          />
                        </div>
                        {deductionsCLT[i + 1] ? (
                          <>
                            <div
                              key={`incomeTax-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`incomeTax${i}`}
                                id={`incomeTax${i}-label`}
                              >
                                Imposto de Renda {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`incomeTax${i}`}
                                id={`incomeTax${i}`}
                                value={Number(incomeInfo[`incomeTax${i + 1}`])}
                                onChange={(e) =>
                                  handleInputChange(
                                    `incomeTax${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`publicPension-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`publicPension${i}`}
                                id={`publicPension${i}-label`}
                              >
                                Previdência Pública {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`publicPension${i}`}
                                id={`publicPension${i}`}
                                value={incomeInfo[`publicPension${i + 1}`]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `publicPension${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`otherDeductions-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`otherDeductions${i}`}
                                id={`otherDeductions${i}-label`}
                              >
                                Outras Deduções {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`otherDeductions${i}`}
                                id={`otherDeductions${i}`}
                                value={Number(
                                  incomeInfo[`otherDeductions${i + 1}`]
                                )}
                                onChange={(e) =>
                                  handleInputChange(
                                    `otherDeductions${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                          </>
                        ) : (
                          ''
                        )}
                        <div>
                          <div
                            key={`foodAllowanceValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`foodAllowanceValue${i}`}
                              id={`foodAllowanceValue${i}-label`}
                            >
                              Auxílio Alimentação {i + 1}
                            </label>
                            <br />
                            <input
                              type="text"
                              name={`foodAllowanceValue${i}`}
                              id={`foodAllowanceValue${i}`}
                              value={incomeInfo[`foodAllowanceValue${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `foodAllowanceValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`transportAllowanceValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`transportAllowanceValue${i}`}
                              id={`transportAllowanceValue${i}-label`}
                            >
                              Auxílio Transporte {i + 1}
                            </label>
                            <br />
                            <input
                              type="text"
                              name={`transportAllowanceValue${i}`}
                              id={`transportAllowanceValue${i}`}
                              value={
                                incomeInfo[`transportAllowanceValue${i + 1}`]
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  `transportAllowanceValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`expenseReimbursementValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`expenseReimbursementValue${i}`}
                              id={`expenseReimbursementValue${i}-label`}
                            >
                              Diárias e reembolsos de despesas {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`expenseReimbursementValue${i}`}
                              id={`expenseReimbursementValue${i}`}
                              value={
                                incomeInfo[`expenseReimbursementValue${i + 1}`]
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  `expenseReimbursementValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`advancePaymentValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`advancePaymentValue${i}`}
                              style={{
                                fontSize: "12px",
                                display: "block",
                                width: "80%",
                              }}
                              id={`advancePaymentValue${i}-label`}
                            >
                              Adiantamentos, Antecipações, Estornos e
                              Compensações referentes a períodos anteriores{" "}
                              {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`advancePaymentValue${i}`}
                              id={`advancePaymentValue${i}`}
                              value={incomeInfo[`advancePaymentValue${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `advancePaymentValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`reversalValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`reversalValue${i}`}
                              style={{
                                fontSize: "12px",
                                display: "block",
                                width: "80%",
                              }}
                              id={`reversalValue${i}-label`}
                            >
                              Indenizações decorrentes de contratos de seguros e
                              por força de decisão judicial {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`reversalValue${i}`}
                              id={`reversalValue${i}`}
                              value={incomeInfo[`reversalValue${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `reversalValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`compensationValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`compensationValue${i}`}
                              style={{
                                fontSize: "12px",
                                display: "block",
                                width: "80%",
                              }}
                              id={`compensationValue${i}-label`}
                            >
                              Rendimentos percebidos no âmbito de programas
                              governamentais {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`compensationValue${i}`}
                              id={`compensationValue${i}`}
                              value={incomeInfo[`compensationValue${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `compensationValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`judicialPensionValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`judicialPensionValue${i}`}
                              id={`judicialPensionValue${i}-label`}
                            >
                              Pensão alimentícia, exclusivamente no caso de
                              decisão judicial {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`judicialPensionValue${i}`}
                              id={`judicialPensionValue${i}`}
                              value={incomeInfo[`judicialPensionValue${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `judicialPensionValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                        </div>
                        ''
                      </>
                    ))}
                  </div>
                ) : (
                  <div className="mes-ano-box">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <>
                        <div
                          key={`month-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`month${i}`}
                            id={`month${i}`}
                            value={incomeInfo[`month${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(`month${i + 1}`, e.target.value)
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`year-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label htmlFor={`year${i}`} id={`year${i}-label`}>
                            Ano {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`year${i}`}
                            id={`year${i}`}
                            value={incomeInfo[`year${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(`year${i + 1}`, e.target.value)
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`grossAmount-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label
                            htmlFor={`grossAmount${i}`}
                            id={`grossAmount${i}-label`}
                          >
                            Valor Bruto {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`grossAmount${i}`}
                            id={`grossAmount${i}`}
                            value={incomeInfo[`grossAmount${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `grossAmount${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        {/*<!-- Teve deduções ? -->*/}
                        <div
                          class="survey-box survey-renda"
                          key={`deductions-${i + 1}`}
                        >
                          <label for="deductions" id="deductions-label">
                            {" "}
                            No valor informado, teve deduções ?{" "}
                          </label>
                          <br />
                          <input
                            type="checkbox"
                            name="deductions"
                            value={deductionsCLT[i + 1]}
                            onChange={() => handleDeductionsCLT(i + 1)}
                            id="deductions"
                            class="survey-control"
                          />
                        </div>
                        {deductionsCLT[i + 1] ? (
                          <>
                            <div
                              key={`incomeTax-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`incomeTax${i}`}
                                id={`incomeTax${i}-label`}
                              >
                                Imposto de Renda {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`incomeTax${i}`}
                                id={`incomeTax${i}`}
                                value={incomeInfo[`incomeTax${i + 1}`]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `incomeTax${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`publicPension-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`publicPension${i}`}
                                id={`publicPension${i}-label`}
                              >
                                Previdência Pública {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`publicPension${i}`}
                                id={`publicPension${i}`}
                                value={incomeInfo[`publicPension${i + 1}`]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `publicPension${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`otherDeductions-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`otherDeductions${i}`}
                                id={`otherDeductions${i}-label`}
                              >
                                Outras Deduções {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`otherDeductions${i}`}
                                id={`otherDeductions${i}`}
                                value={Number(
                                  incomeInfo[`otherDeductions${i + 1}`]
                                )}
                                onChange={(e) =>
                                  handleInputChange(
                                    `otherDeductions${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                          </>
                        ) : (
                          ''
                        )}
                        <div
                          key={`foodAllowanceValue-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label
                            htmlFor={`foodAllowanceValue${i}`}
                            id={`foodAllowanceValue${i}-label`}
                          >
                            Auxílio Alimentação {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`foodAllowanceValue${i}`}
                            id={`foodAllowanceValue${i}`}
                            value={incomeInfo[`foodAllowanceValue${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `foodAllowanceValue${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`transportAllowanceValue-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label
                            htmlFor={`transportAllowanceValue${i}`}
                            id={`transportAllowanceValue${i}-label`}
                          >
                            Auxílio Transporte {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`transportAllowanceValue${i}`}
                            id={`transportAllowanceValue${i}`}
                            value={
                              incomeInfo[`transportAllowanceValue${i + 1}`]
                            }
                            onChange={(e) =>
                              handleInputChange(
                                `transportAllowanceValue${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`expenseReimbursementValue-${i}`}
                          className="survey-box"
                        >
                          <label
                            htmlFor={`expenseReimbursementValue${i}`}
                            id={`expenseReimbursementValue${i}-label`}
                          >
                            Diárias e reembolsos de despesas {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`expenseReimbursementValue${i}`}
                            id={`expenseReimbursementValue${i}`}
                            value={
                              incomeInfo[`expenseReimbursementValue${i + 1}`]
                            }
                            onChange={(e) =>
                              handleInputChange(
                                `expenseReimbursementValue${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`advancePaymentValue-${i}`}
                          className="survey-box"
                        >
                          <label
                            htmlFor={`advancePaymentValue${i}`}
                            style={{
                              fontSize: "12px",
                              display: "block",
                              width: "80%",
                            }}
                            id={`advancePaymentValue${i}-label`}
                          >
                            Adiantamentos, Antecipações, Estornos e Compensações
                            referentes a períodos anteriores {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`advancePaymentValue${i}`}
                            id={`advancePaymentValue${i}`}
                            value={incomeInfo[`advancePaymentValue${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `advancePaymentValue${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        <div key={`reversalValue-${i}`} className="survey-box">
                          <label
                            htmlFor={`reversalValue${i}`}
                            style={{
                              fontSize: "12px",
                              display: "block",
                              width: "80%",
                            }}
                            id={`reversalValue${i}-label`}
                          >
                            Indenizações decorrentes de contratos de seguros e
                            por força de decisão judicial {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`reversalValue${i}`}
                            id={`reversalValue${i}`}
                            value={incomeInfo[`reversalValue${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `reversalValue${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`compensationValue-${i}`}
                          className="survey-box"
                        >
                          <label
                            htmlFor={`compensationValue${i}`}
                            style={{
                              fontSize: "12px",
                              display: "block",
                              width: "80%",
                            }}
                            id={`compensationValue${i}-label`}
                          >
                            Rendimentos percebidos no âmbito de programas
                            governamentais {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`compensationValue${i}`}
                            id={`compensationValue${i}`}
                            value={incomeInfo[`compensationValue${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `compensationValue${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`judicialPensionValue-${i}`}
                          className="survey-box"
                        >
                          <label
                            htmlFor={`judicialPensionValue${i}`}
                            id={`judicialPensionValue${i}-label`}
                          >
                            Pensão alimentícia, exclusivamente no caso de
                            decisão judicial {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`judicialPensionValue${i}`}
                            id={`judicialPensionValue${i}`}
                            value={incomeInfo[`judicialPensionValue${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `judicialPensionValue${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                      </>
                    ))}
                  </div>
                )}
              </div>

              <div class="survey-box survey-renda">
                <button
                  type="submit"
                  onClick={(e) =>
                    handleRegisterIncome(e, "TemporaryRuralEmployee")
                  }
                  id="submit-button"
                >
                  Salvar Informações
                </button>
              </div>
            </>
          )}

          {/* Retired */}
          {loading ? '' : (member.incomeSource.includes("Retired") && !incomeAlreadyRegistered) && (
            <>
              {/*<!-- Data de Admissão -->*/}
              <div class="survey-box survey-renda">
                <label for="admissionDate" id="admissionDate-label">
                  Data de Admissão
                </label>
                <br />
                <input
                  type="date"
                  name="admissionDate"
                  value={CLTInfo.admissionDate}
                  onChange={handleCLTInputChange}
                  id="admissionDate"
                  class="survey-control"
                />
              </div>
              {/*<!-- Cargo -->*/}
              <div class="survey-box survey-renda">
                <label for="position" id="position-label">
                  Cargo
                </label>
                <br />
                <input
                  type="text"
                  name="position"
                  value={CLTInfo.position}
                  onChange={handleCLTInputChange}
                  id="position"
                  class="survey-control"
                />
              </div>
              {/*<!-- Fonte Pagadora( Empresa/Governo/ Pessoa Física) -->*/}
              <div class="survey-box survey-renda">
                <label for="payingSource" id="payingSource-label">
                  Fonte Pagadora
                </label>
                <br />
                <input
                  type="text"
                  name="payingSource"
                  value={CLTInfo.payingSource}
                  onChange={handleCLTInputChange}
                  id="payingSource"
                  class="survey-control"
                />
              </div>
              {/*<!-- Telefone da Fonte Pagadora -->*/}
              <div class="survey-box survey-renda">
                <label for="payingSourcePhone" id="payingSourcePhone-label">
                  Telefone da Fonte Pagadora
                </label>
                <br />
                <input
                  type="text"
                  name="payingSourcePhone"
                  value={CLTInfo.payingSourcePhone}
                  onChange={handleCLTInputChange}
                  id="payingSourcePhone"
                  class="survey-control"
                />
              </div>
              {/*<!-- Recebe Gratificação ? -->*/}
              <div class="survey-box survey-renda">
                <label for="gratification" id="gratification-label">
                  {" "}
                  Recebe horas extras, premiação ou gratificação ?{" "}
                </label>
                <br />
                <input
                  type="checkbox"
                  name="gratification"
                  value={gratificationAutonomous}
                  onChange={handleGratificationAutonomous}
                  id="gratification"
                  class="survey-control"
                />
              </div>

              <div>
                {gratificationAutonomous ? (
                  <div className="mes-ano-box">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <>
                        <div
                          key={`month-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`month${i}`}
                            id={`month${i}`}
                            value={incomeInfo[`month${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(`month${i + 1}`, e.target.value)
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`year-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label htmlFor={`year${i}`} id={`year${i}-label`}>
                            Ano {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`year${i}`}
                            id={`year${i}`}
                            value={incomeInfo[`year${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(`year${i + 1}`, e.target.value)
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`grossAmount-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label
                            htmlFor={`grossAmount${i}`}
                            id={`grossAmount${i}-label`}
                          >
                            Valor Bruto {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`grossAmount${i}`}
                            id={`grossAmount${i}`}
                            value={incomeInfo[`grossAmount${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `grossAmount${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        {/*<!-- Teve deduções ? -->*/}
                        <div
                          class="survey-box survey-renda"
                          key={`deductions-${i + 1}`}
                        >
                          <label for="deductions" id="deductions-label">
                            {" "}
                            No valor informado, teve deduções ?{" "}
                          </label>
                          <br />
                          <input
                            type="checkbox"
                            name="deductions"
                            value={deductionsCLT[i + 1]}
                            onChange={() => handleDeductionsCLT(i + 1)}
                            id="deductions"
                            class="survey-control"
                          />
                        </div>
                        {deductionsCLT[i + 1] ? (
                          <>
                            <div
                              key={`incomeTax-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`incomeTax${i}`}
                                id={`incomeTax${i}-label`}
                              >
                                Imposto de Renda {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`incomeTax${i}`}
                                id={`incomeTax${i}`}
                                value={Number(incomeInfo[`incomeTax${i + 1}`])}
                                onChange={(e) =>
                                  handleInputChange(
                                    `incomeTax${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`publicPension-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`publicPension${i}`}
                                id={`publicPension${i}-label`}
                              >
                                Previdência Pública {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`publicPension${i}`}
                                id={`publicPension${i}`}
                                value={incomeInfo[`publicPension${i + 1}`]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `publicPension${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`otherDeductions-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`otherDeductions${i}`}
                                id={`otherDeductions${i}-label`}
                              >
                                Outras Deduções {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`otherDeductions${i}`}
                                id={`otherDeductions${i}`}
                                value={Number(
                                  incomeInfo[`otherDeductions${i + 1}`]
                                )}
                                onChange={(e) =>
                                  handleInputChange(
                                    `otherDeductions${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                          </>
                        ) : (
                          ''
                        )}
                        <div>
                          <div
                            key={`foodAllowanceValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`foodAllowanceValue${i}`}
                              id={`foodAllowanceValue${i}-label`}
                            >
                              Auxílio Alimentação {i + 1}
                            </label>
                            <br />
                            <input
                              type="text"
                              name={`foodAllowanceValue${i}`}
                              id={`foodAllowanceValue${i}`}
                              value={incomeInfo[`foodAllowanceValue${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `foodAllowanceValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`transportAllowanceValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`transportAllowanceValue${i}`}
                              id={`transportAllowanceValue${i}-label`}
                            >
                              Auxílio Transporte {i + 1}
                            </label>
                            <br />
                            <input
                              type="text"
                              name={`transportAllowanceValue${i}`}
                              id={`transportAllowanceValue${i}`}
                              value={
                                incomeInfo[`transportAllowanceValue${i + 1}`]
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  `transportAllowanceValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`expenseReimbursementValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`expenseReimbursementValue${i}`}
                              id={`expenseReimbursementValue${i}-label`}
                            >
                              Diárias e reembolsos de despesas {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`expenseReimbursementValue${i}`}
                              id={`expenseReimbursementValue${i}`}
                              value={
                                incomeInfo[`expenseReimbursementValue${i + 1}`]
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  `expenseReimbursementValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`advancePaymentValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`advancePaymentValue${i}`}
                              style={{
                                fontSize: "12px",
                                display: "block",
                                width: "80%",
                              }}
                              id={`advancePaymentValue${i}-label`}
                            >
                              Adiantamentos, Antecipações, Estornos e
                              Compensações referentes a períodos anteriores{" "}
                              {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`advancePaymentValue${i}`}
                              id={`advancePaymentValue${i}`}
                              value={incomeInfo[`advancePaymentValue${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `advancePaymentValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`reversalValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`reversalValue${i}`}
                              style={{
                                fontSize: "12px",
                                display: "block",
                                width: "80%",
                              }}
                              id={`reversalValue${i}-label`}
                            >
                              Indenizações decorrentes de contratos de seguros e
                              por força de decisão judicial {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`reversalValue${i}`}
                              id={`reversalValue${i}`}
                              value={incomeInfo[`reversalValue${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `reversalValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`compensationValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`compensationValue${i}`}
                              style={{
                                fontSize: "12px",
                                display: "block",
                                width: "80%",
                              }}
                              id={`compensationValue${i}-label`}
                            >
                              Rendimentos percebidos no âmbito de programas
                              governamentais {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`compensationValue${i}`}
                              id={`compensationValue${i}`}
                              value={incomeInfo[`compensationValue${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `compensationValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`judicialPensionValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`judicialPensionValue${i}`}
                              id={`judicialPensionValue${i}-label`}
                            >
                              Pensão alimentícia, exclusivamente no caso de
                              decisão judicial {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`judicialPensionValue${i}`}
                              id={`judicialPensionValue${i}`}
                              value={incomeInfo[`judicialPensionValue${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `judicialPensionValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                        </div>
                        ''
                      </>
                    ))}
                  </div>
                ) : (
                  <div>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <>
                        <div key={`month-${i}`} className="survey-box">
                          <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`month${i}`}
                            id={`month${i}`}
                            value={incomeInfo[`month${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(`month${i + 1}`, e.target.value)
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`year-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label htmlFor={`year${i}`} id={`year${i}-label`}>
                            Ano {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`year${i}`}
                            id={`year${i}`}
                            value={incomeInfo[`year${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(`year${i + 1}`, e.target.value)
                            }
                            className="survey-control"
                          />
                        </div>
                        <div
                          key={`grossAmount-${i}`}
                          className="survey-box survey-renda"
                          id="survey-input"
                        >
                          <label
                            htmlFor={`grossAmount${i}`}
                            id={`grossAmount${i}-label`}
                          >
                            Valor Bruto {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`grossAmount${i}`}
                            id={`grossAmount${i}`}
                            value={incomeInfo[`grossAmount${i + 1}`]}
                            onChange={(e) =>
                              handleInputChange(
                                `grossAmount${i + 1}`,
                                e.target.value
                              )
                            }
                            className="survey-control"
                          />
                        </div>
                        {/*<!-- Teve deduções ? -->*/}
                        <div
                          class="survey-box survey-renda"
                          key={`deductions-${i + 1}`}
                        >
                          <label for="deductions" id="deductions-label">
                            {" "}
                            No valor informado, teve deduções ?{" "}
                          </label>
                          <br />
                          <input
                            type="checkbox"
                            name="deductions"
                            value={deductionsCLT[i + 1]}
                            onChange={() => handleDeductionsCLT(i + 1)}
                            id="deductions"
                            class="survey-control"
                          />
                        </div>
                        {deductionsCLT[i + 1] ? (
                          <>
                            <div
                              key={`incomeTax-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`incomeTax${i}`}
                                id={`incomeTax${i}-label`}
                              >
                                Imposto de Renda {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`incomeTax${i}`}
                                id={`incomeTax${i}`}
                                value={incomeInfo[`incomeTax${i + 1}`]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `incomeTax${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`publicPension-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`publicPension${i}`}
                                id={`publicPension${i}-label`}
                              >
                                Previdência Pública {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`publicPension${i}`}
                                id={`publicPension${i}`}
                                value={incomeInfo[`publicPension${i + 1}`]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `publicPension${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`otherDeductions-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`otherDeductions${i}`}
                                id={`otherDeductions${i}-label`}
                              >
                                Outras Deduções {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`otherDeductions${i}`}
                                id={`otherDeductions${i}`}
                                value={Number(incomeInfo[`otherDeductions${i + 1}`])}
                                onChange={(e) => handleInputChange(`otherDeductions${i + 1}`, e.target.value)}
                                className="survey-control"
                              />
                            </div>
                          </>
                        ) : (
                          ''
                        )}
                        <div key={`foodAllowanceValue-${i}`} className="survey-box">
                          <label htmlFor={`foodAllowanceValue${i}`} id={`foodAllowanceValue${i}-label`}>
                            Auxílio Alimentação {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`foodAllowanceValue${i}`}
                            id={`foodAllowanceValue${i}`}
                            value={incomeInfo[`foodAllowanceValue${i + 1}`]}
                            onChange={(e) => handleInputChange(`foodAllowanceValue${i + 1}`, e.target.value)}
                            className="survey-control"
                          />
                        </div>
                        <div key={`transportAllowanceValue-${i}`} className="survey-box">
                          <label htmlFor={`transportAllowanceValue${i}`} id={`transportAllowanceValue${i}-label`}>
                            Auxílio Transporte {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            name={`transportAllowanceValue${i}`}
                            id={`transportAllowanceValue${i}`}
                            value={incomeInfo[`transportAllowanceValue${i + 1}`]}
                            onChange={(e) => handleInputChange(`transportAllowanceValue${i + 1}`, e.target.value)}
                            className="survey-control"
                          />
                        </div>
                        <div key={`expenseReimbursementValue-${i}`} className="survey-box">
                          <label htmlFor={`expenseReimbursementValue${i}`} id={`expenseReimbursementValue${i}-label`}>
                            Reembolso de despesas {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`expenseReimbursementValue${i}`}
                            id={`expenseReimbursementValue${i}`}
                            value={incomeInfo[`expenseReimbursementValue${i + 1}`]}
                            onChange={(e) => handleInputChange(`expenseReimbursementValue${i + 1}`, e.target.value)}
                            className="survey-control"
                          />
                        </div>
                        <div key={`advancePaymentValue-${i}`} className="survey-box">
                          <label htmlFor={`advancePaymentValue${i}`} id={`advancePaymentValue${i}-label`}>
                            Adiantamento ou Antecipações  {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`advancePaymentValue${i}`}
                            id={`advancePaymentValue${i}`}
                            value={incomeInfo[`advancePaymentValue${i + 1}`]}
                            onChange={(e) => handleInputChange(`advancePaymentValue${i + 1}`, e.target.value)}
                            className="survey-control"
                          />
                        </div>
                        <div key={`reversalValue-${i}`} className="survey-box">
                          <label htmlFor={`reversalValue${i}`} id={`reversalValue${i}-label`}>
                            Estornos e Compensações {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`reversalValue${i}`}
                            id={`reversalValue${i}`}
                            value={incomeInfo[`reversalValue${i + 1}`]}
                            onChange={(e) => handleInputChange(`reversalValue${i + 1}`, e.target.value)}
                            className="survey-control"
                          />
                        </div>
                        <div key={`compensationValue-${i}`} className="survey-box">
                          <label htmlFor={`compensationValue${i}`} id={`compensationValue${i}-label`}>
                            Indenizações {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`compensationValue${i}`}
                            id={`compensationValue${i}`}
                            value={incomeInfo[`compensationValue${i + 1}`]}
                            onChange={(e) => handleInputChange(`compensationValue${i + 1}`, e.target.value)}
                            className="survey-control"
                          />
                        </div>
                        <div key={`judicialPensionValue-${i}`} className="survey-box">
                          <label htmlFor={`judicialPensionValue${i}`} id={`judicialPensionValue${i}-label`}>
                            Pensão Judicial {i + 1}
                          </label>
                          <br />
                          <input
                            type="number"
                            name={`judicialPensionValue${i}`}
                            id={`judicialPensionValue${i}`}
                            value={incomeInfo[`judicialPensionValue${i + 1}`]}
                            onChange={(e) => handleInputChange(`judicialPensionValue${i + 1}`, e.target.value)}
                            className="survey-control"
                          />
                        </div>
                      </>

                    ))}
                  </div>
                )}
              </div>

              <div class="survey-box">
                <button type="submit" onClick={(e) => handleRegisterIncome(e, 'Retired')} id="submit-button">Salvar Informações</button>
              </div>

            </>
          )
          }
          {/* Pensioner */}
          {member.incomeSource.includes('Pensioner') &&
            (
              <>
                {/*<!-- Data de Admissão -->*/}
                <div class="survey-box">
                  <label for="admissionDate" id="admissionDate-label">Data de Admissão</label>
                  <br />
                  <input type="date" name="admissionDate" value={CLTInfo.admissionDate} onChange={handleCLTInputChange} id="admissionDate" class="survey-control" />
                </div>
                {/*<!-- Cargo -->*/}
                <div class="survey-box">
                  <label for="position" id="position-label">Cargo</label>
                  <br />
                  <input type="text" name="position" value={CLTInfo.position} onChange={handleCLTInputChange} id="position" class="survey-control" />
                </div>
                {/*<!-- Fonte Pagadora( Empresa/Governo/ Pessoa Física) -->*/}
                <div class="survey-box">
                  <label for="payingSource" id="payingSource-label">Fonte Pagadora</label>
                  <br />
                  <input type="text" name="payingSource" value={CLTInfo.payingSource} onChange={handleCLTInputChange} id="payingSource" class="survey-control" />
                </div>
                {/*<!-- Telefone da Fonte Pagadora -->*/}
                <div class="survey-box">
                  <label for="payingSourcePhone" id="payingSourcePhone-label">Telefone da Fonte Pagadora</label>
                  <br />
                  <input type="text" name="payingSourcePhone" value={CLTInfo.payingSourcePhone} onChange={handleCLTInputChange} id="payingSourcePhone" class="survey-control" />
                </div>
                {/*<!-- Recebe Gratificação ? -->*/}
                <div class="survey-box">
                  <label for="gratification" id="gratification-label"> Recebe horas extras, premiação ou gratificação ? </label>
                  <br />
                  <input type="checkbox" name="gratification" value={gratificationAutonomous} onChange={handleGratificationAutonomous} id="gratification" class="survey-control" />
                </div>

                <div>
                  {gratificationAutonomous ? (
                    <div>
                      {Array.from({ length: 6 }).map((_, i) => (
                        <>
                          <div key={`month-${i}`} className="survey-box">
                            <label htmlFor={`month${i}`} id={`month${i}-label`}>
                              Mês {i + 1}
                            </label>
                            <br />
                            <input
                              type="text"
                              name={`month${i}`}
                              id={`month${i}`}
                              value={incomeInfo[`month${i + 1}`]}
                              onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
                              className="survey-control"
                            />
                          </div>
                          <div key={`year-${i}`} className="survey-box">
                            <label htmlFor={`year${i}`} id={`year${i}-label`}>
                              Ano {i + 1}
                            </label>
                            <br />
                            <input
                              type="text"
                              name={`year${i}`}
                              id={`year${i}`}
                              value={incomeInfo[`year${i + 1}`]}
                              onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                              className="survey-control"
                            />
                          </div>
                          <div key={`grossAmount-${i}`} className="survey-box">
                            <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                              Valor Bruto {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`grossAmount${i}`}
                              id={`grossAmount${i}`}
                              value={incomeInfo[`grossAmount${i + 1}`]}
                              onChange={(e) => handleInputChange(`grossAmount${i + 1}`, e.target.value)}
                              className="survey-control"
                            />
                          </div>
                          {/*<!-- Teve deduções ? -->*/}
                          <div class="survey-box" key={`deductions-${i + 1}`}>
                            <label for="deductions" id="deductions-label"> No valor informado, teve deduções ? </label>
                            <br />
                            <input type="checkbox" name="deductions" value={deductionsCLT[i + 1]} onChange={() => handleDeductionsCLT(i + 1)} id="deductions" class="survey-control" />
                          </div>
                          {deductionsCLT[i + 1] ? (<div>
                            <div key={`incomeTax-${i}`} className="survey-box">
                              <label htmlFor={`incomeTax${i}`} id={`incomeTax${i}-label`}>
                                Imposto de Renda {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`incomeTax${i}`}
                                id={`incomeTax${i}`}
                                value={Number(incomeInfo[`incomeTax${i + 1}`])}
                                onChange={(e) =>
                                  handleInputChange(
                                    `incomeTax${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`publicPension-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`publicPension${i}`}
                                id={`publicPension${i}-label`}
                              >
                                Previdência Pública {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`publicPension${i}`}
                                id={`publicPension${i}`}
                                value={incomeInfo[`publicPension${i + 1}`]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `publicPension${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`otherDeductions-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`otherDeductions${i}`}
                                id={`otherDeductions${i}-label`}
                              >
                                Outras Deduções {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`otherDeductions${i}`}
                                id={`otherDeductions${i}`}
                                value={Number(
                                  incomeInfo[`otherDeductions${i + 1}`]
                                )}
                                onChange={(e) =>
                                  handleInputChange(
                                    `otherDeductions${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                          </div>
                          ) : (
                            ''
                          )}
                          <div>
                            <div
                              key={`foodAllowanceValue-${i}`}
                              className="survey-box"
                            >
                              <label
                                htmlFor={`foodAllowanceValue${i}`}
                                id={`foodAllowanceValue${i}-label`}
                              >
                                Auxílio Alimentação {i + 1}
                              </label>
                              <br />
                              <input
                                type="text"
                                name={`foodAllowanceValue${i}`}
                                id={`foodAllowanceValue${i}`}
                                value={incomeInfo[`foodAllowanceValue${i + 1}`]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `foodAllowanceValue${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`transportAllowanceValue-${i}`}
                              className="survey-box"
                            >
                              <label
                                htmlFor={`transportAllowanceValue${i}`}
                                id={`transportAllowanceValue${i}-label`}
                              >
                                Auxílio Transporte {i + 1}
                              </label>
                              <br />
                              <input
                                type="text"
                                name={`transportAllowanceValue${i}`}
                                id={`transportAllowanceValue${i}`}
                                value={
                                  incomeInfo[`transportAllowanceValue${i + 1}`]
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    `transportAllowanceValue${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`expenseReimbursementValue-${i}`}
                              className="survey-box"
                            >
                              <label
                                htmlFor={`expenseReimbursementValue${i}`}
                                id={`expenseReimbursementValue${i}-label`}
                              >
                                Diárias e reembolsos de despesas {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`expenseReimbursementValue${i}`}
                                id={`expenseReimbursementValue${i}`}
                                value={
                                  incomeInfo[`expenseReimbursementValue${i + 1}`]
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    `expenseReimbursementValue${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`advancePaymentValue-${i}`}
                              className="survey-box"
                            >
                              <label
                                htmlFor={`advancePaymentValue${i}`}
                                style={{
                                  fontSize: "12px",
                                  display: "block",
                                  width: "80%",
                                }}
                                id={`advancePaymentValue${i}-label`}
                              >
                                Adiantamentos, Antecipações, Estornos e
                                Compensações referentes a períodos anteriores{" "}
                                {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`advancePaymentValue${i}`}
                                id={`advancePaymentValue${i}`}
                                value={incomeInfo[`advancePaymentValue${i + 1}`]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `advancePaymentValue${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`reversalValue-${i}`}
                              className="survey-box"
                            >
                              <label
                                htmlFor={`reversalValue${i}`}
                                style={{
                                  fontSize: "12px",
                                  display: "block",
                                  width: "80%",
                                }}
                                id={`reversalValue${i}-label`}
                              >
                                Indenizações decorrentes de contratos de seguros e
                                por força de decisão judicial {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`reversalValue${i}`}
                                id={`reversalValue${i}`}
                                value={incomeInfo[`reversalValue${i + 1}`]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `reversalValue${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`compensationValue-${i}`}
                              className="survey-box"
                            >
                              <label
                                htmlFor={`compensationValue${i}`}
                                style={{
                                  fontSize: "12px",
                                  display: "block",
                                  width: "80%",
                                }}
                                id={`compensationValue${i}-label`}
                              >
                                Rendimentos percebidos no âmbito de programas
                                governamentais {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`compensationValue${i}`}
                                id={`compensationValue${i}`}
                                value={incomeInfo[`compensationValue${i + 1}`]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `compensationValue${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`judicialPensionValue-${i}`}
                              className="survey-box"
                            >
                              <label
                                htmlFor={`judicialPensionValue${i}`}
                                id={`judicialPensionValue${i}-label`}
                              >
                                Pensão alimentícia, exclusivamente no caso de
                                decisão judicial {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`judicialPensionValue${i}`}
                                id={`judicialPensionValue${i}`}
                                value={incomeInfo[`judicialPensionValue${i + 1}`]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `judicialPensionValue${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                          </div>
                          ''
                        </>
                      ))}
                    </div>
                  ) : (
                    <div>
                      {Array.from({ length: 3 }).map((_, i) => (
                        <>
                          <div key={`month-${i}`} className="survey-box">
                            <label htmlFor={`month${i}`} id={`month${i}-label`}>
                              Mês {i + 1}
                            </label>
                            <br />
                            <input
                              type="text"
                              name={`month${i}`}
                              id={`month${i}`}
                              value={incomeInfo[`month${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(`month${i + 1}`, e.target.value)
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`year-${i}`}
                            className="survey-box survey-renda"
                            id="survey-input"
                          >
                            <label htmlFor={`year${i}`} id={`year${i}-label`}>
                              Ano {i + 1}
                            </label>
                            <br />
                            <input
                              type="text"
                              name={`year${i}`}
                              id={`year${i}`}
                              value={incomeInfo[`year${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(`year${i + 1}`, e.target.value)
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`grossAmount-${i}`}
                            className="survey-box survey-renda"
                            id="survey-input"
                          >
                            <label
                              htmlFor={`grossAmount${i}`}
                              id={`grossAmount${i}-label`}
                            >
                              Valor Bruto {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`grossAmount${i}`}
                              id={`grossAmount${i}`}
                              value={incomeInfo[`grossAmount${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `grossAmount${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          {/*<!-- Teve deduções ? -->*/}
                          <div
                            class="survey-box survey-renda"
                            key={`deductions-${i + 1}`}
                          >
                            <label for="deductions" id="deductions-label">
                              {" "}
                              No valor informado, teve deduções ?{" "}
                            </label>
                            <br />
                            <input
                              type="checkbox"
                              name="deductions"
                              value={deductionsCLT[i + 1]}
                              onChange={() => handleDeductionsCLT(i + 1)}
                              id="deductions"
                              class="survey-control"
                            />
                          </div>
                          {deductionsCLT[i + 1] ? (
                            <>
                              <div
                                key={`incomeTax-${i}`}
                                className="survey-box survey-renda"
                                id="survey-input"
                              >
                                <label
                                  htmlFor={`incomeTax${i}`}
                                  id={`incomeTax${i}-label`}
                                >
                                  Imposto de Renda {i + 1}
                                </label>
                                <br />
                                <input
                                  type="number"
                                  name={`incomeTax${i}`}
                                  id={`incomeTax${i}`}
                                  value={incomeInfo[`incomeTax${i + 1}`]}
                                  onChange={(e) =>
                                    handleInputChange(
                                      `incomeTax${i + 1}`,
                                      e.target.value
                                    )
                                  }
                                  className="survey-control"
                                />
                              </div>
                              <div
                                key={`publicPension-${i}`}
                                className="survey-box survey-renda"
                                id="survey-input"
                              >
                                <label
                                  htmlFor={`publicPension${i}`}
                                  id={`publicPension${i}-label`}
                                >
                                  Previdência Pública {i + 1}
                                </label>
                                <br />
                                <input
                                  type="number"
                                  name={`publicPension${i}`}
                                  id={`publicPension${i}`}
                                  value={incomeInfo[`publicPension${i + 1}`]}
                                  onChange={(e) =>
                                    handleInputChange(
                                      `publicPension${i + 1}`,
                                      e.target.value
                                    )
                                  }
                                  className="survey-control"
                                />
                              </div>
                              <div
                                key={`otherDeductions-${i}`}
                                className="survey-box survey-renda"
                                id="survey-input"
                              >
                                <label
                                  htmlFor={`otherDeductions${i}`}
                                  id={`otherDeductions${i}-label`}
                                >
                                  Outras Deduções {i + 1}
                                </label>
                                <br />
                                <input
                                  type="number"
                                  name={`otherDeductions${i}`}
                                  id={`otherDeductions${i}`}
                                  value={Number(incomeInfo[`otherDeductions${i + 1}`])}
                                  onChange={(e) => handleInputChange(`otherDeductions${i + 1}`, e.target.value)}
                                  className="survey-control"
                                />
                              </div>
                            </>
                          ) : (
                            ''
                          )}
                          <div key={`foodAllowanceValue-${i}`} className="survey-box">
                            <label htmlFor={`foodAllowanceValue${i}`} id={`foodAllowanceValue${i}-label`}>
                              Auxílio Alimentação {i + 1}
                            </label>
                            <br />
                            <input
                              type="text"
                              name={`foodAllowanceValue${i}`}
                              id={`foodAllowanceValue${i}`}
                              value={incomeInfo[`foodAllowanceValue${i + 1}`]}
                              onChange={(e) => handleInputChange(`foodAllowanceValue${i + 1}`, e.target.value)}
                              className="survey-control"
                            />
                          </div>
                          <div key={`transportAllowanceValue-${i}`} className="survey-box">
                            <label htmlFor={`transportAllowanceValue${i}`} id={`transportAllowanceValue${i}-label`}>
                              Auxílio Transporte {i + 1}
                            </label>
                            <br />
                            <input
                              type="text"
                              name={`transportAllowanceValue${i}`}
                              id={`transportAllowanceValue${i}`}
                              value={incomeInfo[`transportAllowanceValue${i + 1}`]}
                              onChange={(e) => handleInputChange(`transportAllowanceValue${i + 1}`, e.target.value)}
                              className="survey-control"
                            />
                          </div>
                          <div key={`expenseReimbursementValue-${i}`} className="survey-box">
                            <label htmlFor={`expenseReimbursementValue${i}`} id={`expenseReimbursementValue${i}-label`}>
                              Reembolso de despesas {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`expenseReimbursementValue${i}`}
                              id={`expenseReimbursementValue${i}`}
                              value={incomeInfo[`expenseReimbursementValue${i + 1}`]}
                              onChange={(e) => handleInputChange(`expenseReimbursementValue${i + 1}`, e.target.value)}
                              className="survey-control"
                            />
                          </div>
                          <div key={`advancePaymentValue-${i}`} className="survey-box">
                            <label htmlFor={`advancePaymentValue${i}`} id={`advancePaymentValue${i}-label`}>
                              Adiantamento ou Antecipações  {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`advancePaymentValue${i}`}
                              id={`advancePaymentValue${i}`}
                              value={incomeInfo[`advancePaymentValue${i + 1}`]}
                              onChange={(e) => handleInputChange(`advancePaymentValue${i + 1}`, e.target.value)}
                              className="survey-control"
                            />
                          </div>
                          <div key={`reversalValue-${i}`} className="survey-box">
                            <label htmlFor={`reversalValue${i}`} id={`reversalValue${i}-label`}>
                              Estornos e Compensações {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`reversalValue${i}`}
                              id={`reversalValue${i}`}
                              value={incomeInfo[`reversalValue${i + 1}`]}
                              onChange={(e) => handleInputChange(`reversalValue${i + 1}`, e.target.value)}
                              className="survey-control"
                            />
                          </div>
                          <div key={`compensationValue-${i}`} className="survey-box">
                            <label htmlFor={`compensationValue${i}`} id={`compensationValue${i}-label`}>
                              Indenizações {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`compensationValue${i}`}
                              id={`compensationValue${i}`}
                              value={incomeInfo[`compensationValue${i + 1}`]}
                              onChange={(e) => handleInputChange(`compensationValue${i + 1}`, e.target.value)}
                              className="survey-control"
                            />
                          </div>
                          <div key={`judicialPensionValue-${i}`} className="survey-box">
                            <label htmlFor={`judicialPensionValue${i}`} id={`judicialPensionValue${i}-label`}>
                              Pensão Judicial {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`judicialPensionValue${i}`}
                              id={`judicialPensionValue${i}`}
                              value={incomeInfo[`judicialPensionValue${i + 1}`]}
                              onChange={(e) => handleInputChange(`judicialPensionValue${i + 1}`, e.target.value)}
                              className="survey-control"
                            />
                          </div>
                        </>

                      ))}
                    </div>
                  )}
                </div>

                <div class="survey-box">
                  <button type="submit" onClick={(e) => handleRegisterIncome(e, 'Pensioner')} id="submit-button">Salvar Informações</button>
                </div>

              </>
            )
          }
          {/* TemporaryDisabilityBenefit */}
          {member.incomeSource.includes('TemporaryDisabilityBenefit') &&
            (
              <>
                {/*<!-- Data de Admissão -->*/}
                <div class="survey-box">
                  <label for="admissionDate" id="admissionDate-label">Data de Admissão</label>
                  <br />
                  <input type="date" name="admissionDate" value={CLTInfo.admissionDate} onChange={handleCLTInputChange} id="admissionDate" class="survey-control" />
                </div>
                {/*<!-- Cargo -->*/}
                <div class="survey-box">
                  <label for="position" id="position-label">Cargo</label>
                  <br />
                  <input type="text" name="position" value={CLTInfo.position} onChange={handleCLTInputChange} id="position" class="survey-control" />
                </div>
                {/*<!-- Fonte Pagadora( Empresa/Governo/ Pessoa Física) -->*/}
                <div class="survey-box">
                  <label for="payingSource" id="payingSource-label">Fonte Pagadora</label>
                  <br />
                  <input type="text" name="payingSource" value={CLTInfo.payingSource} onChange={handleCLTInputChange} id="payingSource" class="survey-control" />
                </div>
                {/*<!-- Telefone da Fonte Pagadora -->*/}
                <div class="survey-box">
                  <label for="payingSourcePhone" id="payingSourcePhone-label">Telefone da Fonte Pagadora</label>
                  <br />
                  <input type="text" name="payingSourcePhone" value={CLTInfo.payingSourcePhone} onChange={handleCLTInputChange} id="payingSourcePhone" class="survey-control" />
                </div>
                {/*<!-- Recebe Gratificação ? -->*/}
                <div class="survey-box">
                  <label for="gratification" id="gratification-label"> Recebe horas extras, premiação ou gratificação ? </label>
                  <br />
                  <input type="checkbox" name="gratification" value={gratificationAutonomous} onChange={handleGratificationAutonomous} id="gratification" class="survey-control" />
                </div>

                <div>
                  {gratificationAutonomous ? (
                    <div className="mes-ano-box">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <>
                          <div
                            key={`month-${i}`}
                            className="survey-box survey-renda"
                            id="survey-input"
                          >
                            <label htmlFor={`month${i}`} id={`month${i}-label`}>
                              Mês {i + 1}
                            </label>
                            <br />
                            <input
                              type="text"
                              name={`month${i}`}
                              id={`month${i}`}
                              value={incomeInfo[`month${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(`month${i + 1}`, e.target.value)
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`year-${i}`}
                            className="survey-box survey-renda"
                            id="survey-input"
                          >
                            <label htmlFor={`year${i}`} id={`year${i}-label`}>
                              Ano {i + 1}
                            </label>
                            <br />
                            <input
                              type="text"
                              name={`year${i}`}
                              id={`year${i}`}
                              value={incomeInfo[`year${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(`year${i + 1}`, e.target.value)
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`grossAmount-${i}`}
                            className="survey-box survey-renda"
                            id="survey-input"
                          >
                            <label
                              htmlFor={`grossAmount${i}`}
                              id={`grossAmount${i}-label`}
                            >
                              Valor Bruto {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`grossAmount${i}`}
                              id={`grossAmount${i}`}
                              value={incomeInfo[`grossAmount${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `grossAmount${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          {/*<!-- Teve deduções ? -->*/}
                          <div
                            class="survey-box survey-renda"
                            key={`deductions-${i + 1}`}
                          >
                            <label for="deductions" id="deductions-label">
                              {" "}
                              No valor informado, teve deduções ?{" "}
                            </label>
                            <br />
                            <input
                              type="checkbox"
                              name="deductions"
                              value={deductionsCLT[i + 1]}
                              onChange={() => handleDeductionsCLT(i + 1)}
                              id="deductions"
                              class="survey-control"
                            />
                          </div>
                          {deductionsCLT[i + 1] ? (
                            <>
                              <div
                                key={`incomeTax-${i}`}
                                className="survey-box survey-renda"
                                id="survey-input"
                              >
                                <label
                                  htmlFor={`incomeTax${i}`}
                                  id={`incomeTax${i}-label`}
                                >
                                  Imposto de Renda {i + 1}
                                </label>
                                <br />
                                <input
                                  type="number"
                                  name={`incomeTax${i}`}
                                  id={`incomeTax${i}`}
                                  value={Number(incomeInfo[`incomeTax${i + 1}`])}
                                  onChange={(e) =>
                                    handleInputChange(
                                      `incomeTax${i + 1}`,
                                      e.target.value
                                    )
                                  }
                                  className="survey-control"
                                />
                              </div>
                              <div
                                key={`publicPension-${i}`}
                                className="survey-box survey-renda"
                                id="survey-input"
                              >
                                <label
                                  htmlFor={`publicPension${i}`}
                                  id={`publicPension${i}-label`}
                                >
                                  Previdência Pública {i + 1}
                                </label>
                                <br />
                                <input
                                  type="number"
                                  name={`publicPension${i}`}
                                  id={`publicPension${i}`}
                                  value={incomeInfo[`publicPension${i + 1}`]}
                                  onChange={(e) =>
                                    handleInputChange(
                                      `publicPension${i + 1}`,
                                      e.target.value
                                    )
                                  }
                                  className="survey-control"
                                />
                              </div>
                              <div
                                key={`otherDeductions-${i}`}
                                className="survey-box survey-renda"
                                id="survey-input"
                              >
                                <label
                                  htmlFor={`otherDeductions${i}`}
                                  id={`otherDeductions${i}-label`}
                                >
                                  Outras Deduções {i + 1}
                                </label>
                                <br />
                                <input
                                  type="number"
                                  name={`otherDeductions${i}`}
                                  id={`otherDeductions${i}`}
                                  value={Number(
                                    incomeInfo[`otherDeductions${i + 1}`]
                                  )}
                                  onChange={(e) =>
                                    handleInputChange(
                                      `otherDeductions${i + 1}`,
                                      e.target.value
                                    )
                                  }
                                  className="survey-control"
                                />
                              </div>
                            </>
                          ) : (
                            ''
                          )}
                          <div>
                            <div
                              key={`foodAllowanceValue-${i}`}
                              className="survey-box"
                            >
                              <label
                                htmlFor={`foodAllowanceValue${i}`}
                                id={`foodAllowanceValue${i}-label`}
                              >
                                Auxílio Alimentação {i + 1}
                              </label>
                              <br />
                              <input
                                type="text"
                                name={`foodAllowanceValue${i}`}
                                id={`foodAllowanceValue${i}`}
                                value={incomeInfo[`foodAllowanceValue${i + 1}`]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `foodAllowanceValue${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`transportAllowanceValue-${i}`}
                              className="survey-box"
                            >
                              <label
                                htmlFor={`transportAllowanceValue${i}`}
                                id={`transportAllowanceValue${i}-label`}
                              >
                                Auxílio Transporte {i + 1}
                              </label>
                              <br />
                              <input
                                type="text"
                                name={`transportAllowanceValue${i}`}
                                id={`transportAllowanceValue${i}`}
                                value={
                                  incomeInfo[`transportAllowanceValue${i + 1}`]
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    `transportAllowanceValue${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`expenseReimbursementValue-${i}`}
                              className="survey-box"
                            >
                              <label
                                htmlFor={`expenseReimbursementValue${i}`}
                                id={`expenseReimbursementValue${i}-label`}
                              >
                                Diárias e reembolsos de despesas {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`expenseReimbursementValue${i}`}
                                id={`expenseReimbursementValue${i}`}
                                value={
                                  incomeInfo[`expenseReimbursementValue${i + 1}`]
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    `expenseReimbursementValue${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`advancePaymentValue-${i}`}
                              className="survey-box"
                            >
                              <label
                                htmlFor={`advancePaymentValue${i}`}
                                style={{
                                  fontSize: "12px",
                                  display: "block",
                                  width: "80%",
                                }}
                                id={`advancePaymentValue${i}-label`}
                              >
                                Adiantamentos, Antecipações, Estornos e
                                Compensações referentes a períodos anteriores{" "}
                                {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`advancePaymentValue${i}`}
                                id={`advancePaymentValue${i}`}
                                value={incomeInfo[`advancePaymentValue${i + 1}`]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `advancePaymentValue${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`reversalValue-${i}`}
                              className="survey-box"
                            >
                              <label
                                htmlFor={`reversalValue${i}`}
                                style={{
                                  fontSize: "12px",
                                  display: "block",
                                  width: "80%",
                                }}
                                id={`reversalValue${i}-label`}
                              >
                                Indenizações decorrentes de contratos de seguros e
                                por força de decisão judicial {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`reversalValue${i}`}
                                id={`reversalValue${i}`}
                                value={incomeInfo[`reversalValue${i + 1}`]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `reversalValue${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`compensationValue-${i}`}
                              className="survey-box"
                            >
                              <label
                                htmlFor={`compensationValue${i}`}
                                style={{
                                  fontSize: "12px",
                                  display: "block",
                                  width: "80%",
                                }}
                                id={`compensationValue${i}-label`}
                              >
                                Rendimentos percebidos no âmbito de programas
                                governamentais {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`compensationValue${i}`}
                                id={`compensationValue${i}`}
                                value={incomeInfo[`compensationValue${i + 1}`]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `compensationValue${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`judicialPensionValue-${i}`}
                              className="survey-box"
                            >
                              <label
                                htmlFor={`judicialPensionValue${i}`}
                                id={`judicialPensionValue${i}-label`}
                              >
                                Pensão alimentícia, exclusivamente no caso de
                                decisão judicial {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`judicialPensionValue${i}`}
                                id={`judicialPensionValue${i}`}
                                value={incomeInfo[`judicialPensionValue${i + 1}`]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `judicialPensionValue${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                          </div>
                          ''
                        </>
                      ))}
                    </div>
                  ) : (
                    <div className="mes-ano-box">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <>
                          <div
                            key={`month-${i}`}
                            className="survey-box survey-renda"
                            id="survey-input"
                          >
                            <label htmlFor={`month${i}`} id={`month${i}-label`}>
                              Mês {i + 1}
                            </label>
                            <br />
                            <input
                              type="text"
                              name={`month${i}`}
                              id={`month${i}`}
                              value={incomeInfo[`month${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(`month${i + 1}`, e.target.value)
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`year-${i}`}
                            className="survey-box survey-renda"
                            id="survey-input"
                          >
                            <label htmlFor={`year${i}`} id={`year${i}-label`}>
                              Ano {i + 1}
                            </label>
                            <br />
                            <input
                              type="text"
                              name={`year${i}`}
                              id={`year${i}`}
                              value={incomeInfo[`year${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(`year${i + 1}`, e.target.value)
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`grossAmount-${i}`}
                            className="survey-box survey-renda"
                            id="survey-input"
                          >
                            <label
                              htmlFor={`grossAmount${i}`}
                              id={`grossAmount${i}-label`}
                            >
                              Valor Bruto {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`grossAmount${i}`}
                              id={`grossAmount${i}`}
                              value={incomeInfo[`grossAmount${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `grossAmount${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          {/*<!-- Teve deduções ? -->*/}
                          <div
                            class="survey-box survey-renda"
                            key={`deductions-${i + 1}`}
                          >
                            <label for="deductions" id="deductions-label">
                              {" "}
                              No valor informado, teve deduções ?{" "}
                            </label>
                            <br />
                            <input
                              type="checkbox"
                              name="deductions"
                              value={deductionsCLT[i + 1]}
                              onChange={() => handleDeductionsCLT(i + 1)}
                              id="deductions"
                              class="survey-control"
                            />
                          </div>
                          {deductionsCLT[i + 1] ? (
                            <>
                              <div
                                key={`incomeTax-${i}`}
                                className="survey-box survey-renda"
                                id="survey-input"
                              >
                                <label
                                  htmlFor={`incomeTax${i}`}
                                  id={`incomeTax${i}-label`}
                                >
                                  Imposto de Renda {i + 1}
                                </label>
                                <br />
                                <input
                                  type="number"
                                  name={`incomeTax${i}`}
                                  id={`incomeTax${i}`}
                                  value={incomeInfo[`incomeTax${i + 1}`]}
                                  onChange={(e) =>
                                    handleInputChange(
                                      `incomeTax${i + 1}`,
                                      e.target.value
                                    )
                                  }
                                  className="survey-control"
                                />
                              </div>
                              <div
                                key={`publicPension-${i}`}
                                className="survey-box survey-renda"
                                id="survey-input"
                              >
                                <label
                                  htmlFor={`publicPension${i}`}
                                  id={`publicPension${i}-label`}
                                >
                                  Previdência Pública {i + 1}
                                </label>
                                <br />
                                <input
                                  type="number"
                                  name={`publicPension${i}`}
                                  id={`publicPension${i}`}
                                  value={incomeInfo[`publicPension${i + 1}`]}
                                  onChange={(e) =>
                                    handleInputChange(
                                      `publicPension${i + 1}`,
                                      e.target.value
                                    )
                                  }
                                  className="survey-control"
                                />
                              </div>
                              <div
                                key={`otherDeductions-${i}`}
                                className="survey-box survey-renda"
                                id="survey-input"
                              >
                                <label
                                  htmlFor={`otherDeductions${i}`}
                                  id={`otherDeductions${i}-label`}
                                >
                                  Outras Deduções {i + 1}
                                </label>
                                <br />
                                <input
                                  type="number"
                                  name={`otherDeductions${i}`}
                                  id={`otherDeductions${i}`}
                                  value={Number(
                                    incomeInfo[`otherDeductions${i + 1}`]
                                  )}
                                  onChange={(e) =>
                                    handleInputChange(
                                      `otherDeductions${i + 1}`,
                                      e.target.value
                                    )
                                  }
                                  className="survey-control"
                                />
                              </div>
                            </>
                          ) : (
                            ''
                          )}
                          <div
                            key={`foodAllowanceValue-${i}`}
                            className="survey-box survey-renda"
                            id="survey-input"
                          >
                            <label
                              htmlFor={`foodAllowanceValue${i}`}
                              id={`foodAllowanceValue${i}-label`}
                            >
                              Auxílio Alimentação {i + 1}
                            </label>
                            <br />
                            <input
                              type="text"
                              name={`foodAllowanceValue${i}`}
                              id={`foodAllowanceValue${i}`}
                              value={incomeInfo[`foodAllowanceValue${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `foodAllowanceValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`transportAllowanceValue-${i}`}
                            className="survey-box survey-renda"
                            id="survey-input"
                          >
                            <label
                              htmlFor={`transportAllowanceValue${i}`}
                              id={`transportAllowanceValue${i}-label`}
                            >
                              Auxílio Transporte {i + 1}
                            </label>
                            <br />
                            <input
                              type="text"
                              name={`transportAllowanceValue${i}`}
                              id={`transportAllowanceValue${i}`}
                              value={
                                incomeInfo[`transportAllowanceValue${i + 1}`]
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  `transportAllowanceValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`expenseReimbursementValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`expenseReimbursementValue${i}`}
                              id={`expenseReimbursementValue${i}-label`}
                            >
                              Diárias e reembolsos de despesas {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`expenseReimbursementValue${i}`}
                              id={`expenseReimbursementValue${i}`}
                              value={
                                incomeInfo[`expenseReimbursementValue${i + 1}`]
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  `expenseReimbursementValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`advancePaymentValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`advancePaymentValue${i}`}
                              style={{
                                fontSize: "12px",
                                display: "block",
                                width: "80%",
                              }}
                              id={`advancePaymentValue${i}-label`}
                            >
                              Adiantamentos, Antecipações, Estornos e Compensações
                              referentes a períodos anteriores {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`advancePaymentValue${i}`}
                              id={`advancePaymentValue${i}`}
                              value={incomeInfo[`advancePaymentValue${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `advancePaymentValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div key={`reversalValue-${i}`} className="survey-box">
                            <label
                              htmlFor={`reversalValue${i}`}
                              style={{
                                fontSize: "12px",
                                display: "block",
                                width: "80%",
                              }}
                              id={`reversalValue${i}-label`}
                            >
                              Indenizações decorrentes de contratos de seguros e
                              por força de decisão judicial {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`reversalValue${i}`}
                              id={`reversalValue${i}`}
                              value={incomeInfo[`reversalValue${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `reversalValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`compensationValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`compensationValue${i}`}
                              style={{
                                fontSize: "12px",
                                display: "block",
                                width: "80%",
                              }}
                              id={`compensationValue${i}-label`}
                            >
                              Rendimentos percebidos no âmbito de programas
                              governamentais {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`compensationValue${i}`}
                              id={`compensationValue${i}`}
                              value={incomeInfo[`compensationValue${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `compensationValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`judicialPensionValue-${i}`}
                            className="survey-box"
                          >
                            <label
                              htmlFor={`judicialPensionValue${i}`}
                              id={`judicialPensionValue${i}-label`}
                            >
                              Pensão alimentícia, exclusivamente no caso de
                              decisão judicial {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`judicialPensionValue${i}`}
                              id={`judicialPensionValue${i}`}
                              value={incomeInfo[`judicialPensionValue${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `judicialPensionValue${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                        </>
                      ))}
                    </div>
                  )}
                </div>

                <div class="survey-box">
                  <button type="submit" onClick={(e) => handleRegisterIncome(e, 'TemporaryDisabilityBenefit')} id="submit-button">Salvar Informações</button>
                </div>

              </>
            )
          }

          {/* Apprentice */}
          {member.incomeSource.includes('Apprentice') &&
            (
              <>
                {/*<!-- Data de Admissão -->*/}
                <div class="survey-box">
                  <label for="admissionDate" id="admissionDate-label">Data de Admissão</label>
                  <br />
                  <input type="date" name="admissionDate" value={CLTInfo.admissionDate} onChange={handleCLTInputChange} id="admissionDate" class="survey-control" />
                </div>
                {/*<!-- Cargo -->*/}
                <div class="survey-box">
                  <label for="position" id="position-label">Cargo</label>
                  <br />
                  <input type="text" name="position" value={CLTInfo.position} onChange={handleCLTInputChange} id="position" class="survey-control" />
                </div>
                {/*<!-- Fonte Pagadora( Empresa/Governo/ Pessoa Física) -->*/}
                <div class="survey-box">
                  <label for="payingSource" id="payingSource-label">Fonte Pagadora</label>
                  <br />
                  <input type="text" name="payingSource" value={CLTInfo.payingSource} onChange={handleCLTInputChange} id="payingSource" class="survey-control" />
                </div>
                {/*<!-- Telefone da Fonte Pagadora -->*/}
                <div class="survey-box">
                  <label for="payingSourcePhone" id="payingSourcePhone-label">Telefone da Fonte Pagadora</label>
                  <br />
                  <input type="text" name="payingSourcePhone" value={CLTInfo.payingSourcePhone} onChange={handleCLTInputChange} id="payingSourcePhone" class="survey-control" />
                </div>
                {/*<!-- Recebe Gratificação ? -->*/}
                <div class="survey-box">
                  <label for="gratification" id="gratification-label"> Recebe horas extras, premiação ou gratificação ? </label>
                  <br />
                  <input type="checkbox" name="gratification" value={gratificationAutonomous} onChange={handleGratificationAutonomous} id="gratification" class="survey-control" />
                </div>

                <div>
                  {gratificationAutonomous ? (
                    <div>
                      {Array.from({ length: 6 }).map((_, i) => (
                        <>
                          <div key={`month-${i}`} className="survey-box">
                            <label htmlFor={`month${i}`} id={`month${i}-label`}>
                              Mês {i + 1}
                            </label>
                            <br />
                            <input
                              type="text"
                              name={`month${i}`}
                              id={`month${i}`}
                              value={incomeInfo[`month${i + 1}`]}
                              onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
                              className="survey-control"
                            />
                          </div>
                          <div key={`year-${i}`} className="survey-box">
                            <label htmlFor={`year${i}`} id={`year${i}-label`}>
                              Ano {i + 1}
                            </label>
                            <br />
                            <input
                              type="text"
                              name={`year${i}`}
                              id={`year${i}`}
                              value={incomeInfo[`year${i + 1}`]}
                              onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                              className="survey-control"
                            />
                          </div>
                          <div key={`grossAmount-${i}`} className="survey-box">
                            <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                              Valor Bruto {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`grossAmount${i}`}
                              id={`grossAmount${i}`}
                              value={incomeInfo[`grossAmount${i + 1}`]}
                              onChange={(e) => handleInputChange(`grossAmount${i + 1}`, e.target.value)}
                              className="survey-control"
                            />
                          </div>
                          {/*<!-- Teve deduções ? -->*/}
                          <div class="survey-box" key={`deductions-${i + 1}`}>
                            <label for="deductions" id="deductions-label"> No valor informado, teve deduções ? </label>
                            <br />
                            <input type="checkbox" name="deductions" value={deductionsCLT[i + 1]} onChange={() => handleDeductionsCLT(i + 1)} id="deductions" class="survey-control" />
                          </div>
                          {deductionsCLT[i + 1] ? (<div>
                            <div key={`incomeTax-${i}`} className="survey-box">
                              <label htmlFor={`incomeTax${i}`} id={`incomeTax${i}-label`}>
                                Imposto de Renda {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`incomeTax${i}`}
                                id={`incomeTax${i}`}
                                value={Number(incomeInfo[`incomeTax${i + 1}`])}
                                onChange={(e) =>
                                  handleInputChange(
                                    `incomeTax${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`publicPension-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`publicPension${i}`}
                                id={`publicPension${i}-label`}
                              >
                                Previdência Pública {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`publicPension${i}`}
                                id={`publicPension${i}`}
                                value={incomeInfo[`publicPension${i + 1}`]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `publicPension${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`otherDeductions-${i}`}
                              className="survey-box survey-renda"
                              id="survey-input"
                            >
                              <label
                                htmlFor={`otherDeductions${i}`}
                                id={`otherDeductions${i}-label`}
                              >
                                Outras Deduções {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`otherDeductions${i}`}
                                id={`otherDeductions${i}`}
                                value={Number(
                                  incomeInfo[`otherDeductions${i + 1}`]
                                )}
                                onChange={(e) =>
                                  handleInputChange(
                                    `otherDeductions${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                          </div>
                          ) : (
                            ''
                          )}
                          <div>
                            <div
                              key={`foodAllowanceValue-${i}`}
                              className="survey-box"
                            >
                              <label
                                htmlFor={`foodAllowanceValue${i}`}
                                id={`foodAllowanceValue${i}-label`}
                              >
                                Auxílio Alimentação {i + 1}
                              </label>
                              <br />
                              <input
                                type="text"
                                name={`foodAllowanceValue${i}`}
                                id={`foodAllowanceValue${i}`}
                                value={incomeInfo[`foodAllowanceValue${i + 1}`]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `foodAllowanceValue${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`transportAllowanceValue-${i}`}
                              className="survey-box"
                            >
                              <label
                                htmlFor={`transportAllowanceValue${i}`}
                                id={`transportAllowanceValue${i}-label`}
                              >
                                Auxílio Transporte {i + 1}
                              </label>
                              <br />
                              <input
                                type="text"
                                name={`transportAllowanceValue${i}`}
                                id={`transportAllowanceValue${i}`}
                                value={
                                  incomeInfo[`transportAllowanceValue${i + 1}`]
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    `transportAllowanceValue${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`expenseReimbursementValue-${i}`}
                              className="survey-box"
                            >
                              <label
                                htmlFor={`expenseReimbursementValue${i}`}
                                id={`expenseReimbursementValue${i}-label`}
                              >
                                Diárias e reembolsos de despesas {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`expenseReimbursementValue${i}`}
                                id={`expenseReimbursementValue${i}`}
                                value={
                                  incomeInfo[`expenseReimbursementValue${i + 1}`]
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    `expenseReimbursementValue${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`advancePaymentValue-${i}`}
                              className="survey-box"
                            >
                              <label
                                htmlFor={`advancePaymentValue${i}`}
                                style={{
                                  fontSize: "12px",
                                  display: "block",
                                  width: "80%",
                                }}
                                id={`advancePaymentValue${i}-label`}
                              >
                                Adiantamentos, Antecipações, Estornos e
                                Compensações referentes a períodos anteriores{" "}
                                {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`advancePaymentValue${i}`}
                                id={`advancePaymentValue${i}`}
                                value={incomeInfo[`advancePaymentValue${i + 1}`]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `advancePaymentValue${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`reversalValue-${i}`}
                              className="survey-box"
                            >
                              <label
                                htmlFor={`reversalValue${i}`}
                                style={{
                                  fontSize: "12px",
                                  display: "block",
                                  width: "80%",
                                }}
                                id={`reversalValue${i}-label`}
                              >
                                Indenizações decorrentes de contratos de seguros e
                                por força de decisão judicial {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`reversalValue${i}`}
                                id={`reversalValue${i}`}
                                value={incomeInfo[`reversalValue${i + 1}`]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `reversalValue${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`compensationValue-${i}`}
                              className="survey-box"
                            >
                              <label
                                htmlFor={`compensationValue${i}`}
                                style={{
                                  fontSize: "12px",
                                  display: "block",
                                  width: "80%",
                                }}
                                id={`compensationValue${i}-label`}
                              >
                                Rendimentos percebidos no âmbito de programas
                                governamentais {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`compensationValue${i}`}
                                id={`compensationValue${i}`}
                                value={incomeInfo[`compensationValue${i + 1}`]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `compensationValue${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                            <div
                              key={`judicialPensionValue-${i}`}
                              className="survey-box"
                            >
                              <label
                                htmlFor={`judicialPensionValue${i}`}
                                id={`judicialPensionValue${i}-label`}
                              >
                                Pensão alimentícia, exclusivamente no caso de
                                decisão judicial {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                name={`judicialPensionValue${i}`}
                                id={`judicialPensionValue${i}`}
                                value={incomeInfo[`judicialPensionValue${i + 1}`]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `judicialPensionValue${i + 1}`,
                                    e.target.value
                                  )
                                }
                                className="survey-control"
                              />
                            </div>
                          </div>
                          ''
                        </>
                      ))}
                    </div>
                  ) : (
                    <div>
                      {Array.from({ length: 3 }).map((_, i) => (
                        <>
                          <div key={`month-${i}`} className="survey-box">
                            <label htmlFor={`month${i}`} id={`month${i}-label`}>
                              Mês {i + 1}
                            </label>
                            <br />
                            <input
                              type="text"
                              name={`month${i}`}
                              id={`month${i}`}
                              value={incomeInfo[`month${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(`month${i + 1}`, e.target.value)
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`year-${i}`}
                            className="survey-box survey-renda"
                            id="survey-input"
                          >
                            <label htmlFor={`year${i}`} id={`year${i}-label`}>
                              Ano {i + 1}
                            </label>
                            <br />
                            <input
                              type="text"
                              name={`year${i}`}
                              id={`year${i}`}
                              value={incomeInfo[`year${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(`year${i + 1}`, e.target.value)
                              }
                              className="survey-control"
                            />
                          </div>
                          <div
                            key={`grossAmount-${i}`}
                            className="survey-box survey-renda"
                            id="survey-input"
                          >
                            <label
                              htmlFor={`grossAmount${i}`}
                              id={`grossAmount${i}-label`}
                            >
                              Valor Bruto {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`grossAmount${i}`}
                              id={`grossAmount${i}`}
                              value={incomeInfo[`grossAmount${i + 1}`]}
                              onChange={(e) =>
                                handleInputChange(
                                  `grossAmount${i + 1}`,
                                  e.target.value
                                )
                              }
                              className="survey-control"
                            />
                          </div>
                          {/*<!-- Teve deduções ? -->*/}
                          <div
                            class="survey-box survey-renda"
                            key={`deductions-${i + 1}`}
                          >
                            <label for="deductions" id="deductions-label">
                              {" "}
                              No valor informado, teve deduções ?{" "}
                            </label>
                            <br />
                            <input
                              type="checkbox"
                              name="deductions"
                              value={deductionsCLT[i + 1]}
                              onChange={() => handleDeductionsCLT(i + 1)}
                              id="deductions"
                              class="survey-control"
                            />
                          </div>
                          {deductionsCLT[i + 1] ? (
                            <>
                              <div
                                key={`incomeTax-${i}`}
                                className="survey-box survey-renda"
                                id="survey-input"
                              >
                                <label
                                  htmlFor={`incomeTax${i}`}
                                  id={`incomeTax${i}-label`}
                                >
                                  Imposto de Renda {i + 1}
                                </label>
                                <br />
                                <input
                                  type="number"
                                  name={`incomeTax${i}`}
                                  id={`incomeTax${i}`}
                                  value={incomeInfo[`incomeTax${i + 1}`]}
                                  onChange={(e) =>
                                    handleInputChange(
                                      `incomeTax${i + 1}`,
                                      e.target.value
                                    )
                                  }
                                  className="survey-control"
                                />
                              </div>
                              <div
                                key={`publicPension-${i}`}
                                className="survey-box survey-renda"
                                id="survey-input"
                              >
                                <label
                                  htmlFor={`publicPension${i}`}
                                  id={`publicPension${i}-label`}
                                >
                                  Previdência Pública {i + 1}
                                </label>
                                <br />
                                <input
                                  type="number"
                                  name={`publicPension${i}`}
                                  id={`publicPension${i}`}
                                  value={incomeInfo[`publicPension${i + 1}`]}
                                  onChange={(e) =>
                                    handleInputChange(
                                      `publicPension${i + 1}`,
                                      e.target.value
                                    )
                                  }
                                  className="survey-control"
                                />
                              </div>
                              <div
                                key={`otherDeductions-${i}`}
                                className="survey-box survey-renda"
                                id="survey-input"
                              >
                                <label
                                  htmlFor={`otherDeductions${i}`}
                                  id={`otherDeductions${i}-label`}
                                >
                                  Outras Deduções {i + 1}
                                </label>
                                <br />
                                <input
                                  type="number"
                                  name={`otherDeductions${i}`}
                                  id={`otherDeductions${i}`}
                                  value={Number(incomeInfo[`otherDeductions${i + 1}`])}
                                  onChange={(e) => handleInputChange(`otherDeductions${i + 1}`, e.target.value)}
                                  className="survey-control"
                                />
                              </div>
                            </>
                          ) : (
                            ''
                          )}
                          <div key={`foodAllowanceValue-${i}`} className="survey-box">
                            <label htmlFor={`foodAllowanceValue${i}`} id={`foodAllowanceValue${i}-label`}>
                              Auxílio Alimentação {i + 1}
                            </label>
                            <br />
                            <input
                              type="text"
                              name={`foodAllowanceValue${i}`}
                              id={`foodAllowanceValue${i}`}
                              value={incomeInfo[`foodAllowanceValue${i + 1}`]}
                              onChange={(e) => handleInputChange(`foodAllowanceValue${i + 1}`, e.target.value)}
                              className="survey-control"
                            />
                          </div>
                          <div key={`transportAllowanceValue-${i}`} className="survey-box">
                            <label htmlFor={`transportAllowanceValue${i}`} id={`transportAllowanceValue${i}-label`}>
                              Auxílio Transporte {i + 1}
                            </label>
                            <br />
                            <input
                              type="text"
                              name={`transportAllowanceValue${i}`}
                              id={`transportAllowanceValue${i}`}
                              value={incomeInfo[`transportAllowanceValue${i + 1}`]}
                              onChange={(e) => handleInputChange(`transportAllowanceValue${i + 1}`, e.target.value)}
                              className="survey-control"
                            />
                          </div>
                          <div key={`expenseReimbursementValue-${i}`} className="survey-box">
                            <label htmlFor={`expenseReimbursementValue${i}`} id={`expenseReimbursementValue${i}-label`}>
                              Reembolso de despesas {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`expenseReimbursementValue${i}`}
                              id={`expenseReimbursementValue${i}`}
                              value={incomeInfo[`expenseReimbursementValue${i + 1}`]}
                              onChange={(e) => handleInputChange(`expenseReimbursementValue${i + 1}`, e.target.value)}
                              className="survey-control"
                            />
                          </div>
                          <div key={`advancePaymentValue-${i}`} className="survey-box">
                            <label htmlFor={`advancePaymentValue${i}`} id={`advancePaymentValue${i}-label`}>
                              Adiantamento ou Antecipações  {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`advancePaymentValue${i}`}
                              id={`advancePaymentValue${i}`}
                              value={incomeInfo[`advancePaymentValue${i + 1}`]}
                              onChange={(e) => handleInputChange(`advancePaymentValue${i + 1}`, e.target.value)}
                              className="survey-control"
                            />
                          </div>
                          <div key={`reversalValue-${i}`} className="survey-box">
                            <label htmlFor={`reversalValue${i}`} id={`reversalValue${i}-label`}>
                              Estornos e Compensações {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`reversalValue${i}`}
                              id={`reversalValue${i}`}
                              value={incomeInfo[`reversalValue${i + 1}`]}
                              onChange={(e) => handleInputChange(`reversalValue${i + 1}`, e.target.value)}
                              className="survey-control"
                            />
                          </div>
                          <div key={`compensationValue-${i}`} className="survey-box">
                            <label htmlFor={`compensationValue${i}`} id={`compensationValue${i}-label`}>
                              Indenizações {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`compensationValue${i}`}
                              id={`compensationValue${i}`}
                              value={incomeInfo[`compensationValue${i + 1}`]}
                              onChange={(e) => handleInputChange(`compensationValue${i + 1}`, e.target.value)}
                              className="survey-control"
                            />
                          </div>
                          <div key={`judicialPensionValue-${i}`} className="survey-box">
                            <label htmlFor={`judicialPensionValue${i}`} id={`judicialPensionValue${i}-label`}>
                              Pensão Judicial {i + 1}
                            </label>
                            <br />
                            <input
                              type="number"
                              name={`judicialPensionValue${i}`}
                              id={`judicialPensionValue${i}`}
                              value={incomeInfo[`judicialPensionValue${i + 1}`]}
                              onChange={(e) => handleInputChange(`judicialPensionValue${i + 1}`, e.target.value)}
                              className="survey-control"
                            />
                          </div>
                        </>

                      ))}
                    </div>
                  )}
                </div>

                <div class="survey-box">
                  <button type="submit" onClick={(e) => handleRegisterIncome(e, 'Apprentice')} id="submit-button">Salvar Informações</button>
                </div>

              </>
            )
          }

        </form>
      </div></div>

  )
}
