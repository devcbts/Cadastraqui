import React, { useEffect } from "react";
import "./verRenda.css";
import { useState } from "react";
import { api } from "../../services/axios";
import { handleSuccess } from "../../ErrorHandling/handleSuceess";
import { handleAuthError } from "../../ErrorHandling/handleError";

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
export const VerRendaMensal = ({
  incomeSource,
  monthlyIncomesByType,
  id,
  role,
}) => {
  function translateRelationship(relationshipValue) {
    const relationship = IncomeSource.find(
      (r) => r.value === relationshipValue
    );
    return relationship ? relationship.label : "Não especificado";
  }

  const [isEditing, setIsEditing] = useState(false);

  function toggleEdit() {
    setIsEditing(!isEditing);
  }

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
    if (monthlyIncomesByType) {
      updateIncomeInfo(monthlyIncomesByType);
    }
  }, [monthlyIncomesByType]);

  const updateIncomeInfo = (monthlyIncomes) => {
    const updatedIncomeInfo = monthlyIncomes.reduce((acc, income, index) => {
      const num = index + 1; // Para corresponder à sua nomenclatura (1-indexado)

      acc[`month${num}`] = income.month || "";
      acc[`year${num}`] = income.year || "";
      acc[`grossAmount${num}`] = income.grossAmount || null;
      acc[`proLabore${num}`] = income.proLabore || 0;
      acc[`dividends${num}`] = income.dividends || 0;
      acc[`deductionValue${num}`] = income.deductionValue || 0;
      acc[`publicPension${num}`] = income.publicPension || 0;
      acc[`incomeTax${num}`] = income.incomeTax || 0;
      acc[`otherDeductions${num}`] = income.otherDeductions || 0;
      acc[`foodAllowanceValue${num}`] = income.foodAllowanceValue || 0;
      acc[`transportAllowanceValue${num}`] =
        income.transportAllowanceValue || 0;
      acc[`expenseReimbursementValue${num}`] =
        income.expenseReimbursementValue || 0;
      acc[`advancePaymentValue${num}`] = income.advancePaymentValue || 0;
      acc[`reversalValue${num}`] = income.reversalValue || 0;
      acc[`compensationValue${num}`] = income.compensationValue || 0;
      acc[`judicialPensionValue${num}`] = income.judicialPensionValue || 0;

      return acc;
    }, {});

    // Você pode querer manter outros valores no estado que não estão sendo atualizados.
    // Portanto, espalhe os valores atuais antes de aplicar os atualizados.
    setIncomeInfo((prev) => ({
      ...prev,
      ...updatedIncomeInfo,
      quantity: monthlyIncomes.length,
    }));
  };

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

  async function handleRegisterIncome(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const data = {
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

    
    console.log(data);

    try {
      const response = await api.post(
        `/candidates/family-member/income/${id}`,
        data,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("====================================");
      handleSuccess(response, "Dados Atualizados com sucesso");
      
  
      console.log("====================================");
      setIsEditing(false);
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
        <form className="form-ver-renda">
          {/* Fonte de Renda  */}
          <h4>Fonte de renda: {incomeSource ? translateRelationship(incomeSource)  : ''}</h4>

          {/* MEI */}
          {incomeSource.includes("IndividualEntrepreneur") && (
            <>
              {!fixIncomeMEI ? (
                <div className='mes-ano-box'>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <>
                      <div key={`month-${i}`} className="survey-box">
                        <label htmlFor={`month${i}`} id={`month${i}-label`}>
                          Mês {i + 1}
                        </label>
                        <br />
                        <input
                          type="text"
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
                <div className='mes-ano-box'>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <>
                      <div key={`month-${i}`} className="survey-box">
                        <label htmlFor={`month${i}`} id={`month${i}-label`}>
                          Mês {i + 1}
                        </label>
                        <br />
                        <input
                          type="text"
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
            </>
          )}

          {/* Desempregado */}
          {incomeSource.includes("Unemployed") && (
            <>
              {/*<!-- Recebe Seguro Desemprego ? -->*/}
              <div class="survey-box">
                <label
                  for="receivesUnemployment"
                  id="receivesUnemployment-label"
                >
                  Recebe Seguro Desemprego ?
                </label>
                <br />
                <input
                  type="checkbox"
                  disabled={!isEditing}
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
                  <div class="survey-box">
                    <label for="parcels" id="parcels-label">
                      Quantidade de Parcelas
                    </label>
                    <br />
                    <input
                      type="number"
                      disabled={!isEditing}
                      name="parcels"
                      value={unemployedInfo.parcels}
                      id="parcels"
                      class="survey-control"
                    />
                  </div>
                  {/*<!-- Data da primeira Parcela -->*/}
                  <div class="survey-box">
                    <label for="firstParcelDate" id="firstParcelDate-label">
                      Data da primeira Parcela
                    </label>
                    <br />
                    <input
                      type="date"
                      disabled={!isEditing}
                      name="firstParcelDate"
                      value={unemployedInfo.firstParcelDate}
                      onChange={handleInputUnemployedChange}
                      id="firstParcelDate"
                      class="survey-control"
                    />
                  </div>
                  {/*<!-- Valor da Parcela -->*/}
                  <div class="survey-box">
                    <label for="parcelValue" id="parcelValue-label">
                      Valor da Parcela
                    </label>
                    <br />
                    <input
                      type="number"
                      disabled={!isEditing}
                      name="parcelValue"
                      value={unemployedInfo.parcelValue}
                      onChange={handleInputUnemployedChange}
                      id="parcelValue"
                      class="survey-control"
                    />
                  </div>
                </>
              )}
            </>
          )}

          {/* Autônomo */}
          {incomeSource.includes("SelfEmployed") && (
            <>
              {/*<!-- Renda Fixa ? -->*/}
              <div class="survey-box">
                <label for="fixIncome" id="fixIncome-label">
                  Renda Fixa ?
                </label>
                <br />
                <input
                  type="checkbox"
                  disabled={!isEditing}
                  name="fixIncome"
                  value={fixIncomeAutonomous}
                  onChange={handleFixIncomeAutonomous}
                  id="fixIncome"
                  class="survey-control"
                />
              </div>
              {!fixIncomeAutonomous ? (
                <div className='mes-ano-box'>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <>
                      <div key={`month-${i}`} className="survey-box">
                        <label htmlFor={`month${i}`} id={`month${i}-label`}>
                          Mês {i + 1}
                        </label>
                        <br />
                        <input
                          type="text"
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
                <div className='mes-ano-box'>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <>
                      <div key={`month-${i}`} className="survey-box">
                        <label htmlFor={`month${i}`} id={`month${i}-label`}>
                          Mês {i + 1}
                        </label>
                        <br />
                        <input
                          type="text"
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
            </>
          )}

          {/* Trabalhador Informal */}
          {incomeSource.includes("InformalWorker") && (
            <>
              {/*<!-- Renda Fixa ? -->*/}
              <div class="survey-box">
                <label for="fixIncome" id="fixIncome-label">
                  Renda Fixa ?
                </label>
                <br />
                <input
                  type="checkbox"
                  disabled={!isEditing}
                  name="fixIncome"
                  value={fixIncomeInformalWorker}
                  onChange={handleFixIncomeInformalWorker}
                  id="fixIncome"
                  class="survey-control"
                />
              </div>
              {!fixIncomeInformalWorker ? (
                <div className='mes-ano-box'>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <>
                      <div key={`month-${i}`} className="survey-box">
                        <label htmlFor={`month${i}`} id={`month${i}-label`}>
                          Mês {i + 1}
                        </label>
                        <br />
                        <input
                          type="text"
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
                <div className='mes-ano-box'>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <>
                      <div key={`month-${i}`} className="survey-box">
                        <label htmlFor={`month${i}`} id={`month${i}-label`}>
                          Mês {i + 1}
                        </label>
                        <br />
                        <input
                          type="text"
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
            </>
          )}

          {/* Renda de Aluguel... */}
          {incomeSource.includes("RentalIncome") && (
            <>
              {/*<!-- Renda Fixa ? -->*/}
              <div class="survey-box">
                <label for="fixIncome" id="fixIncome-label">
                  Renda Fixa ?
                </label>
                <br />
                <input
                  type="checkbox"
                  disabled={!isEditing}
                  name="fixIncome"
                  value={fixIncomeRentalIncome}
                  onChange={handleFixIncomeRentalIncome}
                  id="fixIncome"
                  class="survey-control"
                />
              </div>
              {!fixIncomeRentalIncome ? (
                <div className='mes-ano-box'>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <>
                      <div key={`month-${i}`} className="survey-box">
                        <label htmlFor={`month${i}`} id={`month${i}-label`}>
                          Mês {i + 1}
                        </label>
                        <br />
                        <input
                          type="text"
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
                <div className='mes-ano-box'>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <>
                      <div key={`month-${i}`} className="survey-box">
                        <label htmlFor={`month${i}`} id={`month${i}-label`}>
                          Mês {i + 1}
                        </label>
                        <br />
                        <input
                          type="text"
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
            </>
          )}

          {/* Profissional Liberal */}
          {incomeSource.includes("LiberalProfessional") && (
            <>
              {/*<!-- Renda Fixa ? -->*/}
              <div class="survey-box">
                <label for="fixIncome" id="fixIncome-label">
                  Renda Fixa ?
                </label>
                <br />
                <input
                  type="checkbox"
                  disabled={!isEditing}
                  name="fixIncome"
                  value={fixIncomeLiberalProfessional}
                  onChange={handleFixIncomeLiberalProfessional}
                  id="fixIncome"
                  class="survey-control"
                />
              </div>
              {!fixIncomeLiberalProfessional ? (
                <div className='mes-ano-box'>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <>
                      <div key={`month-${i}`} className="survey-box">
                        <label htmlFor={`month${i}`} id={`month${i}-label`}>
                          Mês {i + 1}
                        </label>
                        <br />
                        <input
                          type="text"
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
                <div className='mes-ano-box'>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <>
                      <div key={`month-${i}`} className="survey-box">
                        <label htmlFor={`month${i}`} id={`month${i}-label`}>
                          Mês {i + 1}
                        </label>
                        <br />
                        <input
                          type="text"
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
            </>
          )}

          {/* Pensão Privada */}
          {incomeSource.includes("PrivatePension") && (
            <>
              {/*<!-- Renda Fixa ? -->*/}
              <div class="survey-box">
                <label for="fixIncome" id="fixIncome-label">
                  Renda Fixa ?
                </label>
                <br />
                <input
                  type="checkbox"
                  disabled={!isEditing}
                  name="fixIncome"
                  value={fixIncomePrivatePension}
                  onChange={handleFixIncomePrivatePension}
                  id="fixIncome"
                  class="survey-control"
                />
              </div>
              {!fixIncomePrivatePension ? (
                <div className='mes-ano-box'>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <>
                      <div key={`month-${i}`} className="survey-box">
                        <label htmlFor={`month${i}`} id={`month${i}-label`}>
                          Mês {i + 1}
                        </label>
                        <br />
                        <input
                          type="text"
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
                <div className='mes-ano-box'>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <>
                      <div key={`month-${i}`} className="survey-box">
                        <label htmlFor={`month${i}`} id={`month${i}-label`}>
                          Mês {i + 1}
                        </label>
                        <br />
                        <input
                          type="text"
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
            </>
          )}

          {/* Ajuda Financeira de Terceiros */}
          {incomeSource.includes("FinancialHelpFromOthers") && (
            <>
              {/*<!-- Renda Fixa ? -->*/}
              <div class="survey-box">
                <label for="fixIncome" id="fixIncome-label">
                  Renda Fixa ?
                </label>
                <br />
                <input
                  type="checkbox"
                  disabled={!isEditing}
                  name="fixIncome"
                  value={fixIncomeAutonomous}
                  onChange={handleFixIncomeAutonomous}
                  id="fixIncome"
                  class="survey-control"
                />
              </div>
              {!fixIncomeMEI ? (
                <div className='mes-ano-box'>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <>
                      <div key={`month-${i}`} className="survey-box">
                        <label htmlFor={`month${i}`} id={`month${i}-label`}>
                          Mês {i + 1}
                        </label>
                        <br />
                        <input
                          type="text"
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
                  <div className="survey-box">
                    <label
                      htmlFor={"financialAssistantCPF"}
                      id={"financialAssistantCPF"}
                    >
                      CPF do Ajudante Financeiro
                    </label>
                    <br />
                    <input
                    pattern="\d{3}\.\d{3}\.\d{3}-\d{2}" 
                      type="text"
                      disabled={!isEditing}
                      name={"financialAssistantCPF"}
                      id={"financialAssistantCPF"}
                      value={dependentInfo}
                      onChange={handleDependentInputChange}
                      className="survey-control"
                    />
                  </div>
                </div>
              ) : (
                <div className='mes-ano-box'>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <>
                      <div key={`month-${i}`} className="survey-box">
                        <label htmlFor={`month${i}`} id={`month${i}-label`}>
                          Mês {i + 1}
                        </label>
                        <br />
                        <input
                          type="text"
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
                  <div className="survey-box">
                    <label
                      htmlFor={"financialAssistantCPF"}
                      id={"financialAssistantCPF"}
                    >
                      CPF do Ajudante Financeiro
                    </label>
                    <br />
                    <input
                                        pattern="\d{3}\.\d{3}\.\d{3}-\d{2}" 

                      type="text"
                      disabled={!isEditing}
                      name={"financialAssistantCPF"}
                      id={"financialAssistantCPF"}
                      value={dependentInfo}
                      onChange={handleDependentInputChange}
                      className="survey-control"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Empresário */}
          {(incomeSource.includes("BusinessOwner") ||
            incomeSource.includes("BusinessOwnerSimplifiedTax")) && (
              <>
              
                <div className='mes-ano-box'>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <>
                      <div key={`month-${i}`} className="survey-box">
                        <label htmlFor={`month${i}`} id={`month${i}-label`}>
                          Mês {i + 1}
                        </label>
                        <br />
                        <input
                          type="text"
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
              </>
            )}

          {/* PrivateEmployee */}
          {incomeSource.includes("PrivateEmployee") && (
            <>
              {/*<!-- Recebe Gratificação ? -->*/}
              <div class="survey-box">
                <label for="gratification" id="gratification-label">
                  {" "}
                  Recebe horas extras, premiação ou gratificação ?{" "}
                </label>
                <br />
                <input
                  type="checkbox"
                  disabled={!isEditing}
                  name="gratification"
                  value={gratificationAutonomous}
                  onChange={handleGratificationAutonomous}
                  id="gratification"
                  class="survey-control"
                />
              </div>

              <div>
                {gratificationAutonomous ? (
                  <div className='mes-ano-box'>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <>
                        <div key={`month-${i}`} className="survey-box">
                          <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                        <div class="survey-box" key={`deductions-${i + 1}`}>
                          <label for="deductions" id="deductions-label">
                            {" "}
                            No valor informado, teve deduções ?{" "}
                          </label>
                          <br />
                          <input
                            type="checkbox"
                            disabled={!isEditing}
                            name="deductions"
                            value={deductionsCLT[i + 1]}
                            onChange={() => handleDeductionsCLT(i + 1)}
                            id="deductions"
                            class="survey-control"
                          />
                        </div>
                        {deductionsCLT[i + 1] ? (
                          <>
                            <div key={`incomeTax-${i}`} className="survey-box">
                              <label
                                htmlFor={`incomeTax${i}`}
                                id={`incomeTax${i}-label`}
                              >
                                Imposto de Renda {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                disabled={!isEditing}
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
                              className="survey-box"
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
                                disabled={!isEditing}
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
                              className="survey-box"
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
                                disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                  <div className='mes-ano-box'>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <>
                        <div key={`month-${i}`} className="survey-box">
                          <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                        <div class="survey-box" key={`deductions-${i + 1}`}>
                          <label for="deductions" id="deductions-label">
                            {" "}
                            No valor informado, teve deduções ?{" "}
                          </label>
                          <br />
                          <input
                            type="checkbox"
                            disabled={!isEditing}
                            name="deductions"
                            value={deductionsCLT[i + 1]}
                            onChange={() => handleDeductionsCLT(i + 1)}
                            id="deductions"
                            class="survey-control"
                          />
                        </div>
                        {deductionsCLT[i + 1] ? (
                          <>
                            <div key={`incomeTax-${i}`} className="survey-box">
                              <label
                                htmlFor={`incomeTax${i}`}
                                id={`incomeTax${i}-label`}
                              >
                                Imposto de Renda {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                disabled={!isEditing}
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
                              className="survey-box"
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
                                disabled={!isEditing}
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
                              className="survey-box"
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
                                disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
            </>
          )}

          {/* PublicEmployee */}
          {incomeSource.includes("PublicEmployee") && (
            <>
              {/*<!-- Recebe Gratificação ? -->*/}
              <div class="survey-box">
                <label for="gratification" id="gratification-label">
                  {" "}
                  Recebe horas extras, premiação ou gratificação ?{" "}
                </label>
                <br />
                <input
                  type="checkbox"
                  disabled={!isEditing}
                  name="gratification"
                  value={gratificationAutonomous}
                  onChange={handleGratificationAutonomous}
                  id="gratification"
                  class="survey-control"
                />
              </div>

              <div>
                {gratificationAutonomous ? (
                  <div className='mes-ano-box'>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <>
                        <div key={`month-${i}`} className="survey-box">
                          <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                        <div class="survey-box" key={`deductions-${i + 1}`}>
                          <label for="deductions" id="deductions-label">
                            {" "}
                            No valor informado, teve deduções ?{" "}
                          </label>
                          <br />
                          <input
                            type="checkbox"
                            disabled={!isEditing}
                            name="deductions"
                            value={deductionsCLT[i + 1]}
                            onChange={() => handleDeductionsCLT(i + 1)}
                            id="deductions"
                            class="survey-control"
                          />
                        </div>
                        {deductionsCLT[i + 1] ? (
                          <>
                            <div key={`incomeTax-${i}`} className="survey-box">
                              <label
                                htmlFor={`incomeTax${i}`}
                                id={`incomeTax${i}-label`}
                              >
                                Imposto de Renda {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                disabled={!isEditing}
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
                              className="survey-box"
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
                                disabled={!isEditing}
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
                              className="survey-box"
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
                                disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                  <div className='mes-ano-box'>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <>
                        <div key={`month-${i}`} className="survey-box">
                          <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                        <div class="survey-box" key={`deductions-${i + 1}`}>
                          <label for="deductions" id="deductions-label">
                            {" "}
                            No valor informado, teve deduções ?{" "}
                          </label>
                          <br />
                          <input
                            type="checkbox"
                            disabled={!isEditing}
                            name="deductions"
                            value={deductionsCLT[i + 1]}
                            onChange={() => handleDeductionsCLT(i + 1)}
                            id="deductions"
                            class="survey-control"
                          />
                        </div>
                        {deductionsCLT[i + 1] ? (
                          <>
                            <div key={`incomeTax-${i}`} className="survey-box">
                              <label
                                htmlFor={`incomeTax${i}`}
                                id={`incomeTax${i}-label`}
                              >
                                Imposto de Renda {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                disabled={!isEditing}
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
                              className="survey-box"
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
                                disabled={!isEditing}
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
                              className="survey-box"
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
                                disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
            </>
          )}

          {/* DomesticEmployee */}
          {incomeSource.includes("DomesticEmployee") && (
            <>
              {/*<!-- Recebe Gratificação ? -->*/}
              <div class="survey-box">
                <label for="gratification" id="gratification-label">
                  {" "}
                  Recebe horas extras, premiação ou gratificação ?{" "}
                </label>
                <br />
                <input
                  type="checkbox"
                  disabled={!isEditing}
                  name="gratification"
                  value={gratificationAutonomous}
                  onChange={handleGratificationAutonomous}
                  id="gratification"
                  class="survey-control"
                />
              </div>

              <div>
                {gratificationAutonomous ? (
                  <div className='mes-ano-box'>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <>
                        <div key={`month-${i}`} className="survey-box">
                          <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                        <div class="survey-box" key={`deductions-${i + 1}`}>
                          <label for="deductions" id="deductions-label">
                            {" "}
                            No valor informado, teve deduções ?{" "}
                          </label>
                          <br />
                          <input
                            type="checkbox"
                            disabled={!isEditing}
                            name="deductions"
                            value={deductionsCLT[i + 1]}
                            onChange={() => handleDeductionsCLT(i + 1)}
                            id="deductions"
                            class="survey-control"
                          />
                        </div>
                        {deductionsCLT[i + 1] ? (
                          <>
                            <div key={`incomeTax-${i}`} className="survey-box">
                              <label
                                htmlFor={`incomeTax${i}`}
                                id={`incomeTax${i}-label`}
                              >
                                Imposto de Renda {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                disabled={!isEditing}
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
                              className="survey-box"
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
                                disabled={!isEditing}
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
                              className="survey-box"
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
                                disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                  <div className='mes-ano-box'>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <>
                        <div key={`month-${i}`} className="survey-box">
                          <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                        <div class="survey-box" key={`deductions-${i + 1}`}>
                          <label for="deductions" id="deductions-label">
                            {" "}
                            No valor informado, teve deduções ?{" "}
                          </label>
                          <br />
                          <input
                            type="checkbox"
                            disabled={!isEditing}
                            name="deductions"
                            value={deductionsCLT[i + 1]}
                            onChange={() => handleDeductionsCLT(i + 1)}
                            id="deductions"
                            class="survey-control"
                          />
                        </div>
                        {deductionsCLT[i + 1] ? (
                          <>
                            <div key={`incomeTax-${i}`} className="survey-box">
                              <label
                                htmlFor={`incomeTax${i}`}
                                id={`incomeTax${i}-label`}
                              >
                                Imposto de Renda {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                disabled={!isEditing}
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
                              className="survey-box"
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
                                disabled={!isEditing}
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
                              className="survey-box"
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
                                disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
            </>
          )}

          {/* TemporaryRuralEmployee */}
          {incomeSource.includes("TemporaryRuralEmployee") && (
            <>
              {/*<!-- Recebe Gratificação ? -->*/}
              <div class="survey-box">
                <label for="gratification" id="gratification-label">
                  {" "}
                  Recebe horas extras, premiação ou gratificação ?{" "}
                </label>
                <br />
                <input
                  type="checkbox"
                  disabled={!isEditing}
                  name="gratification"
                  value={gratificationAutonomous}
                  onChange={handleGratificationAutonomous}
                  id="gratification"
                  class="survey-control"
                />
              </div>

              <div>
                {gratificationAutonomous ? (
                  <div className='mes-ano-box'>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <>
                        <div key={`month-${i}`} className="survey-box">
                          <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                        <div class="survey-box" key={`deductions-${i + 1}`}>
                          <label for="deductions" id="deductions-label">
                            {" "}
                            No valor informado, teve deduções ?{" "}
                          </label>
                          <br />
                          <input
                            type="checkbox"
                            disabled={!isEditing}
                            name="deductions"
                            value={deductionsCLT[i + 1]}
                            onChange={() => handleDeductionsCLT(i + 1)}
                            id="deductions"
                            class="survey-control"
                          />
                        </div>
                        {deductionsCLT[i + 1] ? (
                          <>
                            <div key={`incomeTax-${i}`} className="survey-box">
                              <label
                                htmlFor={`incomeTax${i}`}
                                id={`incomeTax${i}-label`}
                              >
                                Imposto de Renda {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                disabled={!isEditing}
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
                              className="survey-box"
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
                                disabled={!isEditing}
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
                              className="survey-box"
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
                                disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                  <div className='mes-ano-box'>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <>
                        <div key={`month-${i}`} className="survey-box">
                          <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                        <div class="survey-box" key={`deductions-${i + 1}`}>
                          <label for="deductions" id="deductions-label">
                            {" "}
                            No valor informado, teve deduções ?{" "}
                          </label>
                          <br />
                          <input
                            type="checkbox"
                            disabled={!isEditing}
                            name="deductions"
                            value={deductionsCLT[i + 1]}
                            onChange={() => handleDeductionsCLT(i + 1)}
                            id="deductions"
                            class="survey-control"
                          />
                        </div>
                        {deductionsCLT[i + 1] ? (
                          <>
                            <div key={`incomeTax-${i}`} className="survey-box">
                              <label
                                htmlFor={`incomeTax${i}`}
                                id={`incomeTax${i}-label`}
                              >
                                Imposto de Renda {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                disabled={!isEditing}
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
                              className="survey-box"
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
                                disabled={!isEditing}
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
                              className="survey-box"
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
                                disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
            </>
          )}

          {/* Retired */}
          {incomeSource.includes("Retired") && (
            <>
              {/*<!-- Recebe Gratificação ? -->*/}
              <div class="survey-box">
                <label for="gratification" id="gratification-label">
                  {" "}
                  Recebe horas extras, premiação ou gratificação ?{" "}
                </label>
                <br />
                <input
                  type="checkbox"
                  disabled={!isEditing}
                  name="gratification"
                  value={gratificationAutonomous}
                  onChange={handleGratificationAutonomous}
                  id="gratification"
                  class="survey-control"
                />
              </div>

              <div>
                {gratificationAutonomous ? (
                  <div className='mes-ano-box'>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <>
                        <div key={`month-${i}`} className="survey-box">
                          <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                        <div class="survey-box" key={`deductions-${i + 1}`}>
                          <label for="deductions" id="deductions-label">
                            {" "}
                            No valor informado, teve deduções ?{" "}
                          </label>
                          <br />
                          <input
                            type="checkbox"
                            disabled={!isEditing}
                            name="deductions"
                            value={deductionsCLT[i + 1]}
                            onChange={() => handleDeductionsCLT(i + 1)}
                            id="deductions"
                            class="survey-control"
                          />
                        </div>
                        {deductionsCLT[i + 1] ? (
                          <>
                            <div key={`incomeTax-${i}`} className="survey-box">
                              <label
                                htmlFor={`incomeTax${i}`}
                                id={`incomeTax${i}-label`}
                              >
                                Imposto de Renda {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                disabled={!isEditing}
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
                              className="survey-box"
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
                                disabled={!isEditing}
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
                              className="survey-box"
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
                                disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                  <div className='mes-ano-box'>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <>
                        <div key={`month-${i}`} className="survey-box">
                          <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                        <div class="survey-box" key={`deductions-${i + 1}`}>
                          <label for="deductions" id="deductions-label">
                            {" "}
                            No valor informado, teve deduções ?{" "}
                          </label>
                          <br />
                          <input
                            type="checkbox"
                            disabled={!isEditing}
                            name="deductions"
                            value={deductionsCLT[i + 1]}
                            onChange={() => handleDeductionsCLT(i + 1)}
                            id="deductions"
                            class="survey-control"
                          />
                        </div>
                        {deductionsCLT[i + 1] ? (
                          <>
                            <div key={`incomeTax-${i}`} className="survey-box">
                              <label
                                htmlFor={`incomeTax${i}`}
                                id={`incomeTax${i}-label`}
                              >
                                Imposto de Renda {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                disabled={!isEditing}
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
                              className="survey-box"
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
                                disabled={!isEditing}
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
                              className="survey-box"
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
                                disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
            </>
          )}
          {/* Pensioner */}
          {incomeSource.includes("Pensioner") && (
            <>
              {/*<!-- Recebe Gratificação ? -->*/}
              <div class="survey-box">
                <label for="gratification" id="gratification-label">
                  {" "}
                  Recebe horas extras, premiação ou gratificação ?{" "}
                </label>
                <br />
                <input
                  type="checkbox"
                  disabled={!isEditing}
                  name="gratification"
                  value={gratificationAutonomous}
                  onChange={handleGratificationAutonomous}
                  id="gratification"
                  class="survey-control"
                />
              </div>

              <div>
                {gratificationAutonomous ? (
                  <div className='mes-ano-box'>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <>
                        <div key={`month-${i}`} className="survey-box">
                          <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                        <div class="survey-box" key={`deductions-${i + 1}`}>
                          <label for="deductions" id="deductions-label">
                            {" "}
                            No valor informado, teve deduções ?{" "}
                          </label>
                          <br />
                          <input
                            type="checkbox"
                            disabled={!isEditing}
                            name="deductions"
                            value={deductionsCLT[i + 1]}
                            onChange={() => handleDeductionsCLT(i + 1)}
                            id="deductions"
                            class="survey-control"
                          />
                        </div>
                        {deductionsCLT[i + 1] ? (
                          <>
                            <div key={`incomeTax-${i}`} className="survey-box">
                              <label
                                htmlFor={`incomeTax${i}`}
                                id={`incomeTax${i}-label`}
                              >
                                Imposto de Renda {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                disabled={!isEditing}
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
                              className="survey-box"
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
                                disabled={!isEditing}
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
                              className="survey-box"
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
                                disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                  <div className='mes-ano-box'>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <>
                        <div key={`month-${i}`} className="survey-box">
                          <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                        <div class="survey-box" key={`deductions-${i + 1}`}>
                          <label for="deductions" id="deductions-label">
                            {" "}
                            No valor informado, teve deduções ?{" "}
                          </label>
                          <br />
                          <input
                            type="checkbox"
                            disabled={!isEditing}
                            name="deductions"
                            value={deductionsCLT[i + 1]}
                            onChange={() => handleDeductionsCLT(i + 1)}
                            id="deductions"
                            class="survey-control"
                          />
                        </div>
                        {deductionsCLT[i + 1] ? (
                          <>
                            <div key={`incomeTax-${i}`} className="survey-box">
                              <label
                                htmlFor={`incomeTax${i}`}
                                id={`incomeTax${i}-label`}
                              >
                                Imposto de Renda {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                disabled={!isEditing}
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
                              className="survey-box"
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
                                disabled={!isEditing}
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
                              className="survey-box"
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
                                disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
            </>
          )}
          {/* TemporaryDisabilityBenefit */}
          {incomeSource.includes("TemporaryDisabilityBenefit") && (
            <>
              {/*<!-- Recebe Gratificação ? -->*/}
              <div class="survey-box">
                <label for="gratification" id="gratification-label">
                  {" "}
                  Recebe horas extras, premiação ou gratificação ?{" "}
                </label>
                <br />
                <input
                  type="checkbox"
                  disabled={!isEditing}
                  name="gratification"
                  value={gratificationAutonomous}
                  onChange={handleGratificationAutonomous}
                  id="gratification"
                  class="survey-control"
                />
              </div>

              <div>
                {gratificationAutonomous ? (
                  <div className='mes-ano-box'>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <>
                        <div key={`month-${i}`} className="survey-box">
                          <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                        <div class="survey-box" key={`deductions-${i + 1}`}>
                          <label for="deductions" id="deductions-label">
                            {" "}
                            No valor informado, teve deduções ?{" "}
                          </label>
                          <br />
                          <input
                            type="checkbox"
                            disabled={!isEditing}
                            name="deductions"
                            value={deductionsCLT[i + 1]}
                            onChange={() => handleDeductionsCLT(i + 1)}
                            id="deductions"
                            class="survey-control"
                          />
                        </div>
                        {deductionsCLT[i + 1] ? (
                          <>
                            <div key={`incomeTax-${i}`} className="survey-box">
                              <label
                                htmlFor={`incomeTax${i}`}
                                id={`incomeTax${i}-label`}
                              >
                                Imposto de Renda {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                disabled={!isEditing}
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
                              className="survey-box"
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
                                disabled={!isEditing}
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
                              className="survey-box"
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
                                disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                  <div className='mes-ano-box'>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <>
                        <div key={`month-${i}`} className="survey-box">
                          <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                        <div class="survey-box" key={`deductions-${i + 1}`}>
                          <label for="deductions" id="deductions-label">
                            {" "}
                            No valor informado, teve deduções ?{" "}
                          </label>
                          <br />
                          <input
                            type="checkbox"
                            disabled={!isEditing}
                            name="deductions"
                            value={deductionsCLT[i + 1]}
                            onChange={() => handleDeductionsCLT(i + 1)}
                            id="deductions"
                            class="survey-control"
                          />
                        </div>
                        {deductionsCLT[i + 1] ? (
                          <>
                            <div key={`incomeTax-${i}`} className="survey-box">
                              <label
                                htmlFor={`incomeTax${i}`}
                                id={`incomeTax${i}-label`}
                              >
                                Imposto de Renda {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                disabled={!isEditing}
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
                              className="survey-box"
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
                                disabled={!isEditing}
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
                              className="survey-box"
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
                                disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
            </>
          )}

          {/* Apprentice */}
          {incomeSource.includes("Apprentice") && (
            <>
              {/*<!-- Recebe Gratificação ? -->*/}
              <div class="survey-box">
                <label for="gratification" id="gratification-label">
                  {" "}
                  Recebe horas extras, premiação ou gratificação ?{" "}
                </label>
                <br />
                <input
                  type="checkbox"
                  disabled={!isEditing}
                  name="gratification"
                  value={gratificationAutonomous}
                  onChange={handleGratificationAutonomous}
                  id="gratification"
                  class="survey-control"
                />
              </div>

              <div>
                {gratificationAutonomous ? (
                  <div className='mes-ano-box'>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <>
                        <div key={`month-${i}`} className="survey-box">
                          <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                        <div class="survey-box" key={`deductions-${i + 1}`}>
                          <label for="deductions" id="deductions-label">
                            {" "}
                            No valor informado, teve deduções ?{" "}
                          </label>
                          <br />
                          <input
                            type="checkbox"
                            disabled={!isEditing}
                            name="deductions"
                            value={deductionsCLT[i + 1]}
                            onChange={() => handleDeductionsCLT(i + 1)}
                            id="deductions"
                            class="survey-control"
                          />
                        </div>
                        {deductionsCLT[i + 1] ? (
                          <>
                            <div key={`incomeTax-${i}`} className="survey-box">
                              <label
                                htmlFor={`incomeTax${i}`}
                                id={`incomeTax${i}-label`}
                              >
                                Imposto de Renda {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                disabled={!isEditing}
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
                              className="survey-box"
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
                                disabled={!isEditing}
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
                              className="survey-box"
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
                                disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                  <div className='mes-ano-box'>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <>
                        <div key={`month-${i}`} className="survey-box">
                          <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                          </label>
                          <br />
                          <input
                            type="text"
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                        <div class="survey-box" key={`deductions-${i + 1}`}>
                          <label for="deductions" id="deductions-label">
                            {" "}
                            No valor informado, teve deduções ?{" "}
                          </label>
                          <br />
                          <input
                            type="checkbox"
                            disabled={!isEditing}
                            name="deductions"
                            value={deductionsCLT[i + 1]}
                            onChange={() => handleDeductionsCLT(i + 1)}
                            id="deductions"
                            class="survey-control"
                          />
                        </div>
                        {deductionsCLT[i + 1] ? (
                          <>
                            <div key={`incomeTax-${i}`} className="survey-box">
                              <label
                                htmlFor={`incomeTax${i}`}
                                id={`incomeTax${i}-label`}
                              >
                                Imposto de Renda {i + 1}
                              </label>
                              <br />
                              <input
                                type="number"
                                disabled={!isEditing}
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
                              className="survey-box"
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
                                disabled={!isEditing}
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
                              className="survey-box"
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
                                disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
            </>
          )}
          {role !== "Assistant" &&
          
            <div>
              {!isEditing ? (
                <button
                  type="button"
                  className="over-button"
                  onClick={toggleEdit}
                >
                  Editar
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="over-button"
                    onClick={handleRegisterIncome}
                  >
                    Salvar Dados
                  </button>
                  <button
                    type="button"
                    className="over-button"
                    onClick={toggleEdit}
                  >
                    Cancelar
                  </button>
                </>
              )}
              </div>
            }
          
        </form>
      </div>
    </div>
  );
};
