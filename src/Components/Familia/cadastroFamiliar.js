import React from "react";
import "./cadastroFamiliar.css";
import { useState } from "react";
import Select from "react-select";
import { handleSuccess } from "../../ErrorHandling/handleSuceess";
import { handleAuthError } from "../../ErrorHandling/handleError";
import "./cadastroFamiliar.css";
import { api } from "../../services/axios";
import { formatCPF } from "../../utils/format-cpf";
import { formatTelephone } from "../../utils/format-telephone";
import { formatRG } from "../../utils/format-rg";
import Input from "../Inputs/FormInput";
import useForm from "../../hooks/useForm";
import FormCheckbox from "../Inputs/FormCheckbox";
import familyMemberInfoValidation from "./validators/family-member-info-validation";
import FormSelect from "../Inputs/FormSelect";
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
  { value: "IndividualEntrepreneur", label: "MEI" },
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
export default function CadastroFamiliar() {


  const [[familyMemberInfo], handleFamilyMemberInfo, familyMemberInfoErrors, submitFamilyMember] = useForm({
    relationship: "Wife", // deve ser inicializado com um dos valores do enum Relationship
    otherRelationship: "",
    fullName: "",
    socialName: "",
    birthDate: "",
    gender: "MALE", // deve ser inicializado com um dos valores do enum GENDER
    nationality: "",
    natural_city: "",
    natural_UF: "AC", // deve ser inicializado com um dos valores do enum COUNTRY
    CPF: "",
    RG: "",
    rgIssuingAuthority: "",
    rgIssuingState: "AC", // deve ser inicializado com um dos valores do enum COUNTRY
    documentType: "", // deve ser inicializado com um dos valores do enum DOCUMENT_TYPE ou null
    documentNumber: "",
    documentValidity: "",
    numberOfBirthRegister: "",
    bookOfBirthRegister: "",
    pageOfBirthRegister: "",
    maritalStatus: "Single", // deve ser inicializado com um dos valores do enum MARITAL_STATUS
    skinColor: "Yellow", // deve ser inicializado com um dos valores do enum SkinColor
    religion: "Catholic", // deve ser inicializado com um dos valores do enum RELIGION
    educationLevel: "Illiterate", // deve ser inicializado com um dos valores do enum SCHOLARSHIP
    specialNeeds: false,
    specialNeedsDescription: "",
    hasMedicalReport: false,
    landlinePhone: "",
    workPhone: "",
    contactNameForMessage: "",
    email: "",
    profession: "",
    enrolledGovernmentProgram: false,
    NIS: "",
    educationPlace: "Public", // Iniciar como null ou um dos valores do enum Institution_Type
    institutionName: "car",
    coursingEducationLevel: "asa", // Iniciar como null ou um dos valores do enum Education_Type
    cycleOfEducation: "322",
    turnOfEducation: "Matutino", // Iniciar como null ou um dos valores do enum SHIFT
    hasScholarship: false,
    percentageOfScholarship: "300",
    monthlyAmount: "500",
    // incomeSource: [],
  }, familyMemberInfoValidation)



  function handleInputChangeSelect(selectedOptions) {
    // Com react-select, selectedOptions é um array de objetos { value, label } ou null
    const values = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    /* setFamilyMember((prevState) => ({
      ...prevState,
      incomeSource: values,
    })); */
  }

  async function RegisterFamilyMember(e) {
    e.preventDefault();
    if (!submitFamilyMember()) {
      return
    }
    const token = localStorage.getItem("token");
    try {
      const response = await api.post(
        "/candidates/family-member",
        {
          relationship: familyMemberInfo.relationship, // deve ser inicializado com um dos valores do enum Relationship
          otherRelationship: familyMemberInfo.otherRelationship || undefined,
          fullName: familyMemberInfo.fullName,
          socialName: familyMemberInfo.socialName || undefined,
          birthDate: familyMemberInfo.birthDate,
          gender: familyMemberInfo.gender, // deve ser inicializado com um dos valores do enum GENDER
          nationality: familyMemberInfo.nationality,
          natural_city: familyMemberInfo.natural_city,
          natural_UF: familyMemberInfo.natural_UF, // deve ser inicializado com um dos valores do enum COUNTRY
          CPF: familyMemberInfo.CPF, // deve ser inicializado com um,
          RG: familyMemberInfo.RG, // deve ser inicializ,
          rgIssuingAuthority: familyMemberInfo.rgIssuingAuthority,
          rgIssuingState: familyMemberInfo.rgIssuingState, // deve ser inicializado com um dos valores do enum COUNTRY
          documentType: familyMemberInfo.documentType || undefined, // deve ser inicializado com um dos valores do enum DOCUMENT_TYPE ou null
          documentNumber: familyMemberInfo.documentNumber || undefined,
          documentValidity: familyMemberInfo.documentValidity || undefined, // deve ser in
          numberOfBirthRegister:
            familyMemberInfo.numberOfBirthRegister || undefined,
          bookOfBirthRegister: familyMemberInfo.bookOfBirthRegister || undefined,
          pageOfBirthRegister: familyMemberInfo.pageOfBirthRegister || undefined,
          maritalStatus: familyMemberInfo.maritalStatus, // deve ser inicializado com um dos valores do enum MARITAL_STATUS
          skinColor: familyMemberInfo.skinColor, // deve ser inicializado com um dos valores do enum SkinColor
          religion: familyMemberInfo.religion, // deve ser inicializado com um dos valores do enum RELIGION
          educationLevel: familyMemberInfo.educationLevel, // deve ser inicializado com um dos valores do enum SCHOLARSHIP
          specialNeeds: familyMemberInfo.specialNeeds,
          specialNeedsDescription:
            familyMemberInfo.specialNeedsDescription || undefined,
          hasMedicalReport: familyMemberInfo.hasMedicalReport,
          landlinePhone: familyMemberInfo.landlinePhone || undefined,
          workPhone: familyMemberInfo.workPhone || undefined,
          contactNameForMessage:
            familyMemberInfo.contactNameForMessage || undefined,
          email: familyMemberInfo.email || undefined,
          /* address: familyMemberInfo.address,
          city: familyMemberInfo.city,
          UF: familyMemberInfo.UF, // deve ser inicializado com um dos valores do enum COUNTRY
          CEP: familyMemberInfo.CEP,
          neighborhood: familyMemberInfo.neighborhood,
          addressNumber: familyMemberInfo.addressNumber, // Iniciar com um número inteiro */
          profession: familyMemberInfo.profession,
          enrolledGovernmentProgram: familyMemberInfo.enrolledGovernmentProgram,
          NIS: familyMemberInfo.NIS || undefined,
          // incomeSource: familyMemberInfo.incomeSource,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("====================================");
      console.log(response.status);
      console.log("====================================");
      handleSuccess(response, "Dados cadastrados com sucesso!");
    } catch (error) {
      console.log(error);
      handleAuthError(error);
    }
  }

  return (
    <div>
      <div className="fill-box">
        <form id="survey-form">
          <FormSelect
            label="Relação"
            name="relationship"
            options={Relationship}
            value={familyMemberInfo.relationship}
            onChange={handleFamilyMemberInfo}
            error={familyMemberInfoErrors}
          />

          {familyMemberInfo.relationship === "Other" && (
            <Input
              name="otherRelationship"
              label="Tipo de Relação"
              value={familyMemberInfo.otherRelationship}
              onChange={handleFamilyMemberInfo}
              error={familyMemberInfoErrors}
            />
          )}

          <Input
            name="fullName"
            label="Nome Civil Completo"
            value={familyMemberInfo.fullName}
            onChange={handleFamilyMemberInfo}
            error={familyMemberInfoErrors}
          />
          <Input
            name="socialName"
            label="Nome Social (quando aplicável)"
            value={familyMemberInfo.socialName}
            onChange={handleFamilyMemberInfo}
            error={familyMemberInfoErrors}
          />
          <Input
            name="birthDate"
            label="Data de Nascimento"
            value={familyMemberInfo.birthDate}
            onChange={handleFamilyMemberInfo}
            error={familyMemberInfoErrors}
            type="date"
          />
          <FormSelect
            label="Sexo"
            name="gender"
            value={familyMemberInfo.gender}
            onChange={handleFamilyMemberInfo}
            options={GENDER}
            error={familyMemberInfoErrors}
          />

          <Input
            name="nationality"
            label="Nacionalidade"
            value={familyMemberInfo.nationality}
            onChange={handleFamilyMemberInfo}
            error={familyMemberInfoErrors}
          />
          <Input
            name="natural_city"
            label="Cidade Natal"
            value={familyMemberInfo.natural_city}
            onChange={handleFamilyMemberInfo}
            error={familyMemberInfoErrors}
          />
          <FormSelect
            label="Unidade Federativa"
            name="natural_UF"
            value={familyMemberInfo.natural_UF}
            onChange={handleFamilyMemberInfo}
            options={COUNTRY}
            error={familyMemberInfoErrors}
          />

          <Input
            name="CPF"
            label="CPF"
            value={formatCPF(familyMemberInfo.CPF)}
            onChange={handleFamilyMemberInfo}
            error={familyMemberInfoErrors}
          />
          <Input
            name="RG"
            label="Nº de RG"
            value={formatRG(familyMemberInfo.RG)}
            onChange={handleFamilyMemberInfo}
            error={familyMemberInfoErrors}
          />
          <Input
            name="rgIssuingAuthority"
            label="Órgão Emissor do RG"
            value={familyMemberInfo.rgIssuingAuthority}
            onChange={handleFamilyMemberInfo}
            error={familyMemberInfoErrors}
          />
          <FormSelect
            label="Estado do Órgão Emissor do RG"
            name="rgIssuingState"
            value={familyMemberInfo.rgIssuingState}
            onChange={handleFamilyMemberInfo}
            options={COUNTRY}
            error={familyMemberInfoErrors}
          />

          {!familyMemberInfo.RG && (
            <div>
              <FormSelect
                label="Tipo de Documento Adicional"
                name="documentType"
                value={familyMemberInfo.documentType}
                onChange={handleFamilyMemberInfo}
                options={DOCUMENT_TYPE}
                error={familyMemberInfoErrors}
              />


              <Input
                name="documentNumber"
                label="Número do Documento"
                value={familyMemberInfo.documentNumber}
                onChange={handleFamilyMemberInfo}
                error={familyMemberInfoErrors}
              />
              <Input
                name="documentValidity"
                label="Data de Validade"
                value={familyMemberInfo.documentValidity}
                onChange={handleFamilyMemberInfo}
                error={familyMemberInfoErrors}
                type="date"
              />




              {/*<!-- Número do Registro de Nascimento -->*/}
              <Input
                name="numberOfBirthRegister"
                label="Nº do Registro de Nascimento"
                value={familyMemberInfo.numberOfBirthRegister}
                onChange={handleFamilyMemberInfo}
                error={familyMemberInfoErrors}
              />


              {/*<!-- Livro do Registro de Nascimento -->*/}
              <Input
                name="bookOfBirthRegister"
                label="Livro do Registro de Nascimento"
                value={familyMemberInfo.bookOfBirthRegister}
                onChange={handleFamilyMemberInfo}
                error={familyMemberInfoErrors}
              />


              {/*<!-- Página do Registro de Nascimento -->*/}
              <Input
                name="pageOfBirthRegister"
                label="Página do Registro de Nascimento"
                value={familyMemberInfo.pageOfBirthRegister}
                onChange={handleFamilyMemberInfo}
                error={familyMemberInfoErrors}
              />

            </div>
          )}
          <h2>Dados básicos</h2>
          {/*<!-- Estado Civil -->*/}
          <FormSelect
            label="Estado Civil"
            name="maritalStatus"
            value={familyMemberInfo.maritalStatus}
            onChange={handleFamilyMemberInfo}
            options={MARITAL_STATUS}
            error={familyMemberInfoErrors}
          />



          {/*<!-- Cor da Pele -->*/}
          <FormSelect
            label="Cor ou Raça"
            name="skinColor"
            value={familyMemberInfo.skinColor}
            onChange={handleFamilyMemberInfo}
            options={SkinColor}
            error={familyMemberInfoErrors}
          />


          {/*<!-- Religião -->*/}
          <FormSelect
            label="Religião"
            name="religion"
            value={familyMemberInfo.religion}
            onChange={handleFamilyMemberInfo}
            options={RELIGION}
            error={familyMemberInfoErrors}
          />


          {/*<!-- Nível de Educação -->*/}
          <FormSelect
            label="Nível de Educação"
            name="educationLevel"
            value={familyMemberInfo.educationLevel}
            onChange={handleFamilyMemberInfo}
            options={SCHOLARSHIP}
            error={familyMemberInfoErrors}
          />


          {/*<!-- Necessidades Especiais -->*/}
          <FormCheckbox
            label="Necessidades Especiais"
            name="specialNeeds"
            onChange={handleFamilyMemberInfo}
            value={familyMemberInfo.specialNeeds}
          />

          {familyMemberInfo.specialNeeds && (
            <>
              {/*<!-- Descrição das Necessidades Especiais -->*/}
              <Input
                name="specialNeedsDescription"
                label="Descrição das Necessidades Especiais"
                value={familyMemberInfo.specialNeedsDescription}
                onChange={handleFamilyMemberInfo}
                error={familyMemberInfoErrors}
              />


              {/*<!-- Tem relatório médico -->*/}
              <FormCheckbox
                label="Possui relatório médico"
                name="hasMedicalReport"
                onChange={handleFamilyMemberInfo}
                value={familyMemberInfo.hasMedicalReport}
              />

            </>
          )}

          {/*<!-- Telefone Fixo -->*/}
          <Input
            name="landlinePhone"
            label="Telefone Fixo"
            value={formatTelephone(familyMemberInfo.landlinePhone)}
            onChange={handleFamilyMemberInfo}
            error={familyMemberInfoErrors}
          />


          {/*<!-- Telefone de Trabalho -->*/}
          <Input
            name="workPhone"
            label="Telefone de trabalho/recado"
            value={formatTelephone(familyMemberInfo.workPhone)}
            onChange={handleFamilyMemberInfo}
            error={familyMemberInfoErrors}
          />


          {/*<!-- Nome para Contato -->*/}
          <Input
            name="contactNameForMessage"
            label="Nome para Contato"
            value={familyMemberInfo.contactNameForMessage}
            onChange={handleFamilyMemberInfo}
            error={familyMemberInfoErrors}
          />


          {/*<!-- Email -->*/}
          <Input
            name="email"
            label="Email"
            value={familyMemberInfo.email}
            onChange={handleFamilyMemberInfo}
            error={familyMemberInfoErrors}
            type="email"
          />



          {/*<!-- Profissão -->*/}
          <Input
            name="profession"
            label="Profissão"
            value={familyMemberInfo.profession}
            onChange={handleFamilyMemberInfo}
            error={familyMemberInfoErrors}
          />


          {/*<!-- Inscrito em Programa Governamental -->*/}
          <FormCheckbox
            label="Inscrito em Programa Governamental"
            name="enrolledGovernmentProgram"
            onChange={handleFamilyMemberInfo}
            value={familyMemberInfo.enrolledGovernmentProgram}
          />


          {familyMemberInfo.enrolledGovernmentProgram === true && (
            <>
              {/*<!-- NIS -->*/}
              <Input
                name="NIS"
                label="NIS"
                type="text"
                maxLength={11}
                value={familyMemberInfo.NIS}
                onChange={handleFamilyMemberInfo}
                error={familyMemberInfoErrors}
              />

            </>
          )}
          {/* <div class="survey-box">
            <label for="incomeSource" id="incomeSource-label">
              Fonte(s) de renda:
            </label>
            <br />

            <Select
              name="incomeSource"
              isMulti
              onChange={(values) => handleFamilyMemberInfo({ target: { name: "incomeSource", value: values.map(e => e.value) } })}
              value={IncomeSource.filter((obj) =>
                familyMemberInfo.incomeSource.includes(obj.value)
              )}
              options={IncomeSource}
              className="select-data"
              id="incomeSource"
            />
            {familyMemberInfoErrors["incomeSource"] && <label>{familyMemberInfoErrors["incomeSource"]}</label>}
          </div> */}

          <div class="survey-box">
            <button
              type="submit"
              onClick={RegisterFamilyMember}
              id="submit-button"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
