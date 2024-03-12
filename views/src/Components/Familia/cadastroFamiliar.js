import React from "react";
import "./cadastroFamiliar.css";
import { useState } from "react";
import Select from "react-select";
import { handleSuccess } from "../../ErrorHandling/handleSuceess";
import { handleAuthError } from "../../ErrorHandling/handleError";
import "./cadastroFamiliar.css";
import { api } from "../../services/axios";
import { formatCPF } from "../../utils/format-cpf";

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
  const [familyMember, setFamilyMember] = useState({
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
    address: "",
    city: "",
    UF: "AC", // deve ser inicializado com um dos valores do enum COUNTRY
    CEP: "",
    neighborhood: "",
    addressNumber: "", // Iniciar com um número inteiro
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
    incomeSource: [],
  });

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "CPF") {
      const formattedCPF = formatCPF(value);
      // Atualiza o valor no estado com o CPF formatado
      setFamilyMember({ ...familyMember, CPF: formattedCPF });
  } else {
      // Para outros campos, apenas atualiza o valor
      setFamilyMember({ ...familyMember, [name]: value });
  }
  }

  function handleInputChangeSelect(selectedOptions) {
    // Com react-select, selectedOptions é um array de objetos { value, label } ou null
    const values = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setFamilyMember((prevState) => ({
      ...prevState,
      incomeSource: values,
    }));
    console.log(familyMember);
  }

  async function RegisterFamilyMember(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await api.post(
        "/candidates/family-member",
        {
          relationship: familyMember.relationship, // deve ser inicializado com um dos valores do enum Relationship
          otherRelationship: familyMember.otherRelationship || undefined,
          fullName: familyMember.fullName,
          socialName: familyMember.socialName || undefined,
          birthDate: familyMember.birthDate,
          gender: familyMember.gender, // deve ser inicializado com um dos valores do enum GENDER
          nationality: familyMember.nationality,
          natural_city: familyMember.natural_city,
          natural_UF: familyMember.natural_UF, // deve ser inicializado com um dos valores do enum COUNTRY
          CPF: familyMember.CPF, // deve ser inicializado com um,
          RG: familyMember.RG, // deve ser inicializ,
          rgIssuingAuthority: familyMember.rgIssuingAuthority,
          rgIssuingState: familyMember.rgIssuingState, // deve ser inicializado com um dos valores do enum COUNTRY
          documentType: familyMember.documentType || undefined, // deve ser inicializado com um dos valores do enum DOCUMENT_TYPE ou null
          documentNumber: familyMember.documentNumber || undefined,
          documentValidity: familyMember.documentValidity || undefined, // deve ser in
          numberOfBirthRegister:
            familyMember.numberOfBirthRegister || undefined,
          bookOfBirthRegister: familyMember.bookOfBirthRegister || undefined,
          pageOfBirthRegister: familyMember.pageOfBirthRegister || undefined,
          maritalStatus: familyMember.maritalStatus, // deve ser inicializado com um dos valores do enum MARITAL_STATUS
          skinColor: familyMember.skinColor, // deve ser inicializado com um dos valores do enum SkinColor
          religion: familyMember.religion, // deve ser inicializado com um dos valores do enum RELIGION
          educationLevel: familyMember.educationLevel, // deve ser inicializado com um dos valores do enum SCHOLARSHIP
          specialNeeds: familyMember.specialNeeds,
          specialNeedsDescription:
            familyMember.specialNeedsDescription || undefined,
          hasMedicalReport: familyMember.hasMedicalReport,
          landlinePhone: familyMember.landlinePhone || undefined,
          workPhone: familyMember.workPhone || undefined,
          contactNameForMessage:
            familyMember.contactNameForMessage || undefined,
          email: familyMember.email || undefined,
          address: familyMember.address,
          city: familyMember.city,
          UF: familyMember.UF, // deve ser inicializado com um dos valores do enum COUNTRY
          CEP: familyMember.CEP,
          neighborhood: familyMember.neighborhood,
          addressNumber:familyMember.addressNumber, // Iniciar com um número inteiro
          profession: familyMember.profession,
          enrolledGovernmentProgram: familyMember.enrolledGovernmentProgram,
          NIS: familyMember.NIS || undefined,
          incomeSource: familyMember.incomeSource,
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
          <div class="survey-box">
            <label for="relationship" id="relationship-label">
              Relação:
            </label>
            <br />
            <select
              name="relationship"
              value={familyMember.relationship}
              onChange={handleInputChange}
              id="relationship"
              class="select-data"
            >
              {Relationship.map((type) => (
                <option value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          {familyMember.relationship === "Other" && (
            <div class="survey-box">
              <label for="otherRelationship" id="otherRelationship-label">
                Tipo de Relação:
              </label>
              <br />
              <input
                type="text"
                name="otherRelationship"
                value={familyMember.otherRelationship}
                onChange={handleInputChange}
                id="otherRelationship"
                class="survey-control"
                required
              />
            </div>
          )}
          <div class="survey-box">
            <label for="fullName" id="fullName-label">
              Nome Civil Completo:
            </label>
            <br />
            <input
              type="text"
              name="fullName"
              value={familyMember.fullName}
              onChange={handleInputChange}
              id="fullName"
              class="survey-control"
              required
            />
          </div>

          <div class="survey-box">
            <label for="socialName" id="socialName-label">
              Nome Social, quando aplicável:
            </label>
            <br />
            <input
              type="text"
              name="socialName"
              value={familyMember.socialName}
              onChange={handleInputChange}
              id="socialName"
              class="survey-control"
            />
          </div>

          <div class="survey-box">
            <label for="birthDate" id="birthDate-label">
              Data de Nascimento:
            </label>
            <br />
            <input
              type="date"
              name="birthDate"
              value={familyMember.birthDate}
              onChange={handleInputChange}
              id="birthDate"
              class="survey-control"
              required
            />
          </div>

          <div class="survey-box">
            <label for="gender" id="gender-label">
              Sexo:
            </label>
            <br />
            <select
              name="gender"
              id="gender"
              value={familyMember.gender}
              onChange={handleInputChange}
              class="select-data"
              required
            >
              {GENDER.map((type) => (
                <option value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div class="survey-box">
            <label for="nationality" id="nationality-label">
              Nacionalidade:
            </label>
            <br />
            <input
              type="text"
              name="nationality"
              onChange={handleInputChange}
              value={familyMember.nationality}
              id="nationality"
              class="survey-control"
              required
            />
          </div>

          <div class="survey-box">
            <label for="natural_city" id="natural_city-label">
              Cidade Natal:
            </label>
            <br />
            <input
              type="text"
              name="natural_city"
              value={familyMember.natural_city}
              onChange={handleInputChange}
              id="natural_city"
              class="survey-control"
              required
            />
          </div>

          <div class="survey-box">
            <label for="natural_UF" id="natural_UF-label">
              Unidade Federativa:
            </label>
            <br />
            <select
              name="natural_UF"
              onChange={handleInputChange}
              value={familyMember.natural_UF}
              id="natural_UF"
              class="select-data"
            >
              {COUNTRY.map((type) => (
                <option value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div class="survey-box">
            <label for="CPF" id="CPF-label">
              CPF:
            </label>
            <br />
            <input

              type="text"
              name="CPF"
              value={formatCPF(familyMember.CPF)}
              onChange={handleInputChange}
              id="CPF"
              class="survey-control"
              required
            />
          </div>

          <div class="survey-box">
            <label for="RG" id="RG-label">
              Nº de RG:
            </label>
            <br />
            <input
              type="text"
              name="RG"
              value={familyMember.RG}
              onChange={handleInputChange}
              id="RG"
              class="survey-control"
              required
            />
          </div>

          <div class="survey-box">
            <label for="rgIssuingAuthority" id="rgIssuingAuthority-label">
              Órgão Emissor do RG:
            </label>
            <br />
            <input
              type="text"
              name="rgIssuingAuthority"
              value={familyMember.rgIssuingAuthority}
              onChange={handleInputChange}
              id="rgIssuingAuthority"
              class="survey-control"
              required
            />
          </div>

          <div class="survey-box">
            <label for="rgIssuingState" id="rgIssuingState-label">
              Estado do Órgão Emissor do RG:
            </label>
            <br />
            <select
              name="rgIssuingState"
              value={familyMember.rgIssuingState}
              onChange={handleInputChange}
              id="rgIssuingState"
              class="select-data"
            >
              {COUNTRY.map((type) => (
                <option value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          {!familyMember.RG && (
            <div>
              <div class="survey-box">
                <label for="documentType" id="documentType-label">
                  Tipo de Documento Adicional:
                </label>
                <br />
                <select
                  name="documentType"
                  onChange={handleInputChange}
                  value={familyMember.documentType}
                  id="documentType"
                  class="select-data"
                >
                  {DOCUMENT_TYPE.map((type) => (
                    <option value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div class="survey-box">
                <label for="documentNumber" id="documentNumber-label">
                  Número do Documento:
                </label>
                <br />
                <input
                  type="text"
                  name="documentNumber"
                  value={familyMember.documentNumber}
                  onChange={handleInputChange}
                  id="documentNumber"
                  class="survey-control"
                />
              </div>

              <div class="survey-box">
                <label for="documentValidity" id="documentValidity-label">
                  Data de Validade:
                </label>
                <br />
                <input
                  type="date"
                  name="documentValidity"
                  value={familyMember.documentValidity}
                  onChange={handleInputChange}
                  id="documentValidity"
                  class="survey-control"
                />
              </div>

              {/*<!-- Número do Registro de Nascimento -->*/}
              <div class="survey-box">
                <label
                  for="numberOfBirthRegister"
                  id="numberOfBirthRegister-label"
                >
                  Nº do Registro de Nascimento:
                </label>
                <br />
                <input
                  type="text"
                  name="numberOfBirthRegister"
                  onChange={handleInputChange}
                  value={familyMember.numberOfBirthRegister}
                  id="numberOfBirthRegister"
                  class="survey-control"
                  required
                />
              </div>

              {/*<!-- Livro do Registro de Nascimento -->*/}
              <div class="survey-box">
                <label for="bookOfBirthRegister" id="bookOfBirthRegister-label">
                  Livro do Registro de Nascimento:
                </label>
                <br />
                <input
                  type="text"
                  name="bookOfBirthRegister"
                  onChange={handleInputChange}
                  value={familyMember.bookOfBirthRegister}
                  id="bookOfBirthRegister"
                  class="survey-control"
                  required
                />
              </div>

              {/*<!-- Página do Registro de Nascimento -->*/}
              <div class="survey-box">
                <label for="pageOfBirthRegister" id="pageOfBirthRegister-label">
                  Página do Registro de Nascimento:
                </label>
                <br />
                <input
                  type="text"
                  name="pageOfBirthRegister"
                  onChange={handleInputChange}
                  value={familyMember.pageOfBirthRegister}
                  id="pageOfBirthRegister"
                  class="survey-control"
                  required
                />
              </div>
            </div>
          )}
          <h2>Dados básicos</h2>
          {/*<!-- Estado Civil -->*/}
          <div class="survey-box">
            <label for="maritalStatus" id="maritalStatus-label">
              Estado Civil:
            </label>
            <br />
            <select
              name="maritalStatus"
              value={familyMember.maritalStatus}
              onChange={handleInputChange}
              id="maritalStatus"
              class="select-data"
            >
              {MARITAL_STATUS.map((type) => (
                <option value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/*<!-- Cor da Pele -->*/}
          <div class="survey-box">
            <label for="skinColor" id="skinColor-label">
              Cor ou Raça:
            </label>
            <br />
            <select
              name="skinColor"
              onChange={handleInputChange}
              value={familyMember.skinColor}
              id="skinColor"
              class="select-data"
            >
              <option value="">Selecione</option>
              {SkinColor.map((type) => (
                <option value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/*<!-- Religião -->*/}
          <div class="survey-box">
            <label for="religion" id="religion-label">
              Religião:
            </label>
            <br />
            <select
              name="religion"
              value={familyMember.religion}
              onChange={handleInputChange}
              id="religion"
              class="select-data"
            >
              {RELIGION.map((type) => (
                <option value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/*<!-- Nível de Educação -->*/}
          <div class="survey-box">
            <label for="educationLevel" id="educationLevel-label">
              Nível de Educação:
            </label>
            <br />
            <select
              name="educationLevel"
              onChange={handleInputChange}
              value={familyMember.educationLevel}
              id="educationLevel"
              class="select-data"
            >
              {SCHOLARSHIP.map((type) => (
                <option value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/*<!-- Necessidades Especiais -->*/}
          <div class="survey-box survey-checkbox">
            <label for="specialNeeds" id="specialNeeds-label">
              Necessidades Especiais:
            </label>
            <br />
            <input
              type="checkbox"
              name="specialNeeds"
              onChange={handleInputChange}
              value={familyMember.specialNeeds}
              id="specialNeeds"
              class="survey-control"
            />
          </div>
          {familyMember.specialNeeds && (
            <div>
              {/*<!-- Descrição das Necessidades Especiais -->*/}
              <div class="survey-box">
                <label
                  for="specialNeedsDescription"
                  id="specialNeedsDescription-label"
                >
                  Descrição das Necessidades Especiais:
                </label>
                <br />
                <input
                  type="text"
                  name="specialNeedsDescription"
                  onChange={handleInputChange}
                  value={familyMember.specialNeedsDescription}
                  id="specialNeedsDescription"
                  class="survey-control"
                />
              </div>

              {/*<!-- Tem relatório médico -->*/}
              <div class="survey-box">
                <label for="hasMedicalReport" id="hasMedicalReport-label">
                  Possui relatório médico:
                </label>
                <br />
                <input
                  type="checkbox"
                  name="hasMedicalReport"
                  onChange={handleInputChange}
                  value={familyMember.hasMedicalReport}
                  id="hasMedicalReport"
                  class="survey-control"
                />
              </div>
            </div>
          )}

          {/*<!-- Telefone Fixo -->*/}
          <div class="survey-box">
            <label for="landlinePhone" id="landlinePhone-label">
              Telefone Fixo:
            </label>
            <br />
            <input
              type="text"
              name="landlinePhone"
              onChange={handleInputChange}
              value={familyMember.landlinePhone}
              id="landlinePhone"
              class="survey-control"
            />
          </div>

          {/*<!-- Telefone de Trabalho -->*/}
          <div class="survey-box">
            <label for="workPhone" id="workPhone-label">
              {" "}
              Telefone de trabalho/recado:
            </label>
            <br />
            <input
              type="text"
              name="workPhone"
              onChange={handleInputChange}
              value={familyMember.workPhone}
              id="workPhone"
              class="survey-control"
            />
          </div>

          {/*<!-- Nome para Contato -->*/}
          <div class="survey-box">
            <label for="contactNameForMessage" id="contactNameForMessage-label">
              Nome para Contato:
            </label>
            <br />
            <input
              type="text"
              name="contactNameForMessage"
              onChange={handleInputChange}
              value={familyMember.contactNameForMessage}
              id="contactNameForMessage"
              class="survey-control"
            />
          </div>

          {/*<!-- Email -->*/}
          <div class="survey-box">
            <label for="email" id="email-label">
              Email:
            </label>
            <br />
            <input
              type="email"
              name="email"
              value={familyMember.email}
              onChange={handleInputChange}
              id="email"
              class="survey-control"
              required
            />
          </div>

          {/*<!-- Endereço -->*/}
          <div class="survey-box">
            <label for="address" id="address-label">
              Endereço:
            </label>
            <br />
            <input
              type="text"
              name="address"
              value={familyMember.address}
              onChange={handleInputChange}
              id="address"
              class="survey-control"
              required
            />
          </div>

          {/*<!-- Cidade -->*/}
          <div class="survey-box">
            <label for="city" id="city-label">
              Cidade:
            </label>
            <br />
            <input
              type="text"
              name="city"
              value={familyMember.city}
              onChange={handleInputChange}
              id="city"
              class="survey-control"
              required
            />
          </div>

          {/*<!-- Unidade Federativa -->*/}
          <div class="survey-box">
            <label for="UF" id="UF-label">
              Unidade Federativa:
            </label>
            <br />
            <select
              name="UF"
              id="UF"
              value={familyMember.UF}
              onChange={handleInputChange}
              class="select-data"
            >
              {COUNTRY.map((type) => (
                <option value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/*<!-- CEP -->*/}
          <div class="survey-box">
            <label for="CEP" id="CEP-label">
              CEP:
            </label>
            <br />
            <input
              type="text"
              name="CEP"
              value={familyMember.CEP}
              onChange={handleInputChange}
              id="CEP"
              class="survey-control"
              required
            />
          </div>

          {/*<!-- Bairro -->*/}
          <div class="survey-box">
            <label for="neighborhood" id="neighborhood-label">
              Bairro:
            </label>
            <br />
            <input
              type="text"
              name="neighborhood"
              value={familyMember.neighborhood}
              onChange={handleInputChange}
              id="neighborhood"
              class="survey-control"
              required
            />
          </div>

          {/*<!-- Número de Endereço -->*/}
          <div class="survey-box">
            <label for="addressNumber" id="addressNumber-label">
              Número de Endereço / Complemento:
            </label>
            <br />
            <input
              type="text"
              name="addressNumber"
              value={familyMember.addressNumber}
              onChange={handleInputChange}
              id="addressNumber"
              class="survey-control"
              required
            />
          </div>

          {/*<!-- Profissão -->*/}
          <div class="survey-box">
            <label for="profession" id="profession-label">
              Profissão:
            </label>
            <br />
            <input
              type="text"
              name="profession"
              value={familyMember.profession}
              onChange={handleInputChange}
              id="profession"
              class="survey-control"
              required
            />
          </div>

          {/*<!-- Inscrito em Programa Governamental -->*/}
          <div class="survey-box">
            <label
              for="enrolledGovernmentProgram"
              id="enrolledGovernmentProgram-label"
            >
              Inscrito em Programa Governamental:
            </label>
            <br />
            <input
              type="checkbox"
              name="enrolledGovernmentProgram"
              value={familyMember.enrolledGovernmentProgram}
              onChange={handleInputChange}
              id="enrolledGovernmentProgram"
              class="survey-control"
            />
          </div>

          {familyMember.enrolledGovernmentProgram === true && (
            <div>
              {/*<!-- NIS -->*/}
              <div class="survey-box">
                <label for="NIS" id="NIS-label">
                  NIS:
                </label>
                <br />
                <input
                  type="text"
                  name="NIS"
                  value={familyMember.NIS}
                  onChange={handleInputChange}
                  id="NIS"
                  class="survey-control"
                />
              </div>
            </div>
          )}
          <div class="survey-box">
            <label for="incomeSource" id="incomeSource-label">
              Fonte(s) de renda:
            </label>
            <br />

            <Select
              name="incomeSource"
              isMulti
              onChange={handleInputChangeSelect}
              value={IncomeSource.filter((obj) =>
                familyMember.incomeSource.includes(obj.value)
              )}
              options={IncomeSource}
              className="select-data"
              id="incomeSource"
              // Se você quiser que o campo seja desabilitado, mantenha a próxima linha
              isDisabled={false} // Se for verdadeiro, o campo estará desabilitado
            />
          </div>

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
