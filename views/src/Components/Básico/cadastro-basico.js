import React from "react";
import "../Familia/cadastroFamiliar.css";
import { useState } from "react";
import { api } from "../../services/axios";
import "./cadastro-basico.css";
import Select from "react-select";
import { handleSuccess } from "../../ErrorHandling/handleSuceess";
import { handleAuthError } from "../../ErrorHandling/handleError";

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

const ScholarshipType = [
  { value: "integralScholarchip", label: "Tempo Integral" },
  { value: "halfScholarchip", label: "Meio Período" },
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

export default function CadastroBasico() {
  const [candidate, setCandidate] = useState({
    fullName: "",
    socialName: "",
    birthDate: "",
    gender: "",
    nationality: "",
    natural_city: "",
    natural_UF: "",
    RG: "",
    rgIssuingAuthority: "",
    rgIssuingState: "",
    documentType: null,
    documentNumber: "",
    documentValidity: null,
    maritalStatus: "",
    skinColor: "",
    religion: "",
    educationLevel: "",
    specialNeeds: false,
    specialNeedsDescription: "",
    hasMedicalReport: false,
    landlinePhone: "",
    workPhone: "",
    contactNameForMessage: "",
    profession: "",
    enrolledGovernmentProgram: false,
    NIS: "",
    incomeSource: [],
    livesAlone: false,
    intendsToGetScholarship: false,
    attendedPublicHighSchool: false,
    benefitedFromCebasScholarship_basic: false,
    yearsBenefitedFromCebas_basic: [],
    scholarshipType_basic: null,
    institutionName_basic: "",
    institutionCNPJ_basic: "",
    benefitedFromCebasScholarship_professional: false,
    lastYearBenefitedFromCebas_professional: "",
    scholarshipType_professional: null,
    institutionName_professional: "",
    institutionCNPJ_professional: "",
    nameOfScholarshipCourse_professional: null,
    CadUnico: false,
  });

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (event.target.multiple) {
      const selectedOptions = Array.from(
        event.target.selectedOptions,
        (option) => option.value
      );
      setCandidate((prevState) => ({
        ...prevState,
        [name]: selectedOptions,
      }));
    } else {
      setCandidate((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
    //console.log('====================================');
    //console.log(candidate);
    //console.log('====================================');
  }

  async function RegisterCandidateBasicInfo(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const data = {
      fullName: candidate.fullName,
      socialName: candidate.socialName,
      birthDate: candidate.birthDate,
      gender: candidate.gender,
      nationality: candidate.nationality,
      natural_city: candidate.natural_city,
      natural_UF: candidate.natural_UF,
      RG: candidate.RG,
      rgIssuingAuthority: candidate.rgIssuingAuthority,
      rgIssuingState: candidate.rgIssuingState,
      documentType: candidate.documentType || undefined,
      documentNumber: candidate.documentNumber || undefined,
      documentValidity: candidate.documentValidity || undefined,
      maritalStatus: candidate.maritalStatus,
      skinColor: candidate.skinColor,
      religion: candidate.religion,
      educationLevel: candidate.educationLevel,
      specialNeeds: candidate.specialNeeds,
      specialNeedsDescription: candidate.specialNeedsDescription,
      hasMedicalReport: candidate.hasMedicalReport,
      landlinePhone: candidate.landlinePhone,
      workPhone: candidate.workPhone,
      contactNameForMessage: candidate.contactNameForMessage,
      profession: candidate.profession,
      enrolledGovernmentProgram: candidate.enrolledGovernmentProgram,
      NIS: candidate.NIS,
      incomeSource: candidate.incomeSource,
      livesAlone: candidate.livesAlone,
      intendsToGetScholarship: candidate.intendsToGetScholarship,
      attendedPublicHighSchool: candidate.attendedPublicHighSchool,
      benefitedFromCebasScholarship_basic:
        candidate.benefitedFromCebasScholarship_basic,
      yearsBenefitedFromCebas_basic: candidate.yearsBenefitedFromCebas_basic,
      scholarshipType_basic: candidate.scholarshipType_basic || undefined,
      institutionName_basic: candidate.institutionName_basic,
      institutionCNPJ_basic: candidate.institutionCNPJ_basic,
      benefitedFromCebasScholarship_professional:
        candidate.benefitedFromCebasScholarship_professional,
      lastYearBenefitedFromCebas_professional:
        candidate.lastYearBenefitedFromCebas_professional,
      scholarshipType_professional:
        candidate.scholarshipType_professional || undefined,
      institutionName_professional: candidate.institutionName_professional,
      institutionCNPJ_professional: candidate.institutionCNPJ_professional,
      nameOfScholarshipCourse_professional:
        candidate.nameOfScholarshipCourse_professional || undefined,
      CadUnico: candidate.CadUnico,
    };

    console.log(data);

    try {
      const response = await api.post("/candidates/identity-info", data, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      console.log("====================================");
      console.log(response.status);
      console.log("====================================");
      handleSuccess(response, "Dados cadastrados com sucesso!");
    } catch (error) {
      handleAuthError(error);
    }
  }

  function handleInputChangeSelect(selectedOptions) {
    // Com react-select, selectedOptions é um array de objetos { value, label } ou null
    const values = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setCandidate((prevState) => ({
      ...prevState,
      incomeSource: values,
    }));
  }
  return (
    <div>
      <div className="fill-box">
        <form id="survey-form">
          {/* Nome Completo */}
          <div class="survey-box">
            <label for="fullName" id="fullName-label">
              Nome Civil Completo:
            </label>
            <br />
            <input
              type="text"
              name="fullName"
              value={candidate.fullName}
              onChange={handleInputChange}
              id="fullName"
              class="survey-control"
              required
            />
          </div>
          {/* Nome Social */}
          <div class="survey-box">
            <label for="socialName" id="socialName-label">
              Nome Social:
            </label>
            <br />
            <input
              type="text"
              name="socialName"
              value={candidate.socialName}
              onChange={handleInputChange}
              id="socialName"
              class="survey-control"
            />
          </div>
          {/* Data de Nascimento */}
          <div class="survey-box">
            <label for="birthDate" id="birthDate-label">
              Data de Nascimento:
            </label>
            <br />
            <input
              type="date"
              name="birthDate"
              value={candidate.birthDate}
              onChange={handleInputChange}
              id="birthDate"
              class="survey-control"
              required
            />
          </div>
          {/* Sexo */}
          <div class="survey-box">
            <label for="gender" id="gender-label">
              Sexo:
            </label>
            <br />
            <select
              name="gender"
              id="gender"
              value={candidate.gender}
              onChange={handleInputChange}
              class="select-data"
              required
            >
              <option value="undefined">Escolha o Sexo</option>
              {GENDER.map((type) => (
                <option value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          {/* Nacionalidade */}
          <div class="survey-box">
            <label for="nationality" id="nationality-label">
              Nacionalidade:
            </label>
            <br />
            <input
              type="text"
              name="nationality"
              onChange={handleInputChange}
              value={candidate.nationality}
              id="nationality"
              class="survey-control"
              required
            />
          </div>
          {/* Cidade de Nascimento */}
          <div class="survey-box">
            <label for="natural_city" id="natural_city-label">
              Cidade Natal:
            </label>
            <br />
            <input
              type="text"
              name="natural_city"
              value={candidate.natural_city}
              onChange={handleInputChange}
              id="natural_city"
              class="survey-control"
              required
            />
          </div>
          {/* Estado de nascimento */}
          <div class="survey-box">
            <label for="natural_UF" id="natural_UF-label">
              Unidade Federativa:
            </label>
            <br />
            <select
              name="natural_UF"
              onChange={handleInputChange}
              value={candidate.natural_UF}
              id="natural_UF"
              class="select-data"
            >
              <option value="undefined">Escolha o Estado</option>
              {COUNTRY.map((type) => (
                <option value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* RG */}
          <div class="survey-box">
            <label for="RG" id="RG-label">
              RG:
            </label>
            <br />
            <input
              type="text"
              name="RG"
              value={candidate.RG}
              onChange={handleInputChange}
              id="RG"
              class="survey-control"
              required
            />
          </div>
          {/* Orgão Emissor do RG */}
          <div class="survey-box">
            <label for="rgIssuingAuthority" id="rgIssuingAuthority-label">
              Órgão Emissor do RG:
            </label>
            <br />
            <input
              type="text"
              name="rgIssuingAuthority"
              value={candidate.rgIssuingAuthority}
              onChange={handleInputChange}
              id="rgIssuingAuthority"
              class="survey-control"
              required
            />
          </div>
          {/* Estado do RG emitido */}
          <div class="survey-box">
            <label for="rgIssuingState" id="rgIssuingState-label">
              Estado do Órgão Emissor do RG:
            </label>
            <br />
            <select
              name="rgIssuingState"
              value={candidate.rgIssuingState}
              onChange={handleInputChange}
              id="rgIssuingState"
              class="select-data"
            >
              <option value="undefined">Estado do RG</option>
              {COUNTRY.map((type) => (
                <option value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          {/* Documento Adicional */}
          {!candidate.RG && (
            <div>
              {/* Tipo do documento adicional */}
              <div class="survey-box">
                <label for="documentType" id="documentType-label">
                  Tipo de Documento Adicional:
                </label>
                <br />
                <select
                  name="documentType"
                  onChange={handleInputChange}
                  value={candidate.documentType}
                  id="documentType"
                  class="select-data"
                >
                  {DOCUMENT_TYPE.map((type) => (
                    <option value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              {/* Número do documento adicional */}
              <div class="survey-box">
                <label for="documentNumber" id="documentNumber-label">
                  Número do Documento:
                </label>
                <br />
                <input
                  type="text"
                  name="documentNumber"
                  value={candidate.documentNumber}
                  onChange={handleInputChange}
                  id="documentNumber"
                  class="survey-control"
                />
              </div>
              {/* Validade do documento adicional */}
              <div class="survey-box">
                <label for="documentValidity" id="documentValidity-label">
                  Data de Validade:
                </label>
                <br />
                <input
                  type="date"
                  name="documentValidity"
                  value={candidate.documentValidity}
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
                  value={candidate.numberOfBirthRegister}
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
                  value={candidate.bookOfBirthRegister}
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
                  value={candidate.pageOfBirthRegister}
                  id="pageOfBirthRegister"
                  class="survey-control"
                  required
                />
              </div>
            </div>
          )}
          {/*<!-- Estado Civil -->*/}
          <div class="survey-box">
            <label for="maritalStatus" id="maritalStatus-label">
              Estado Civil:
            </label>
            <br />
            <select
              name="maritalStatus"
              value={candidate.maritalStatus}
              onChange={handleInputChange}
              id="maritalStatus"
              class="select-data"
            >
              <option value="undefined">Escolha o Estado Civil</option>
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
              value={candidate.skinColor}
              id="skinColor"
              class="select-data"
            >
              <option value="undefined">Selecione</option>
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
              value={candidate.religion}
              onChange={handleInputChange}
              id="religion"
              class="select-data"
            >
              <option value="undefined">Escolha sua Religião</option>
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
              value={candidate.educationLevel}
              id="educationLevel"
              class="select-data"
            >
              <option value="undefined">Escolha seu nível de Educação</option>
              {SCHOLARSHIP.map((type) => (
                <option value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/*<!-- Necessidades Especiais -->*/}
          <div class="survey-box">
            <label for="specialNeeds" id="specialNeeds-label">
              Necessidades Especiais:
            </label>
            <br />
            <input
              type="checkbox"
              name="specialNeeds"
              onChange={handleInputChange}
              value={candidate.specialNeeds}
              id="specialNeeds"
              class="survey-control"
            />
          </div>
          {candidate.specialNeeds && (
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
                  value={candidate.specialNeedsDescription}
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
                  value={candidate.hasMedicalReport}
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
              value={candidate.landlinePhone}
              id="landlinePhone"
              class="survey-control"
            />
          </div>

          {/*<!-- Telefone de Trabalho -->*/}
          <div class="survey-box">
            <label for="workPhone" id="workPhone-label">
              Telefone de trabalho/recado:
            </label>
            <br />
            <input
              type="text"
              name="workPhone"
              onChange={handleInputChange}
              value={candidate.workPhone}
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
              value={candidate.contactNameForMessage}
              id="contactNameForMessage"
              class="survey-control"
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
              value={candidate.profession}
              onChange={handleInputChange}
              id="profession"
              class="survey-control"
              required
            />
          </div>

          {/*<!-- Inscrito em Programa Governamental -->*/}
          <div class="survey-box survey-check">
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
              value={candidate.enrolledGovernmentProgram}
              onChange={handleInputChange}
              id="enrolledGovernmentProgram"
              class="survey-control"
            />
          </div>

          {candidate.enrolledGovernmentProgram === true && (
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
                  value={candidate.NIS}
                  onChange={handleInputChange}
                  id="NIS"
                  class="survey-control"
                />
              </div>
            </div>
          )}
          {/* Fonte de Renda  */}
          <div class="survey-box">
            <label for="incomeSource" id="incomeSource-label">
              Fonte(s) de renda:
            </label>
            <br />
            <Select
              name="incomeSource"
              isMulti
              onChange={handleInputChangeSelect}
              options={IncomeSource}
              value={IncomeSource.filter((obj) =>
                candidate.incomeSource.includes(obj.value)
              )}
              id="incomeSource"
              class="select-data"
            />
          </div>

          {/*<!-- Mora Sozinho ? -->*/}
          <div class="survey-box">
            <label for="livesAlone" id="livesAlone-label">
              Mora Sozinho ?
            </label>
            <br />
            <input
              type="checkbox"
              name="livesAlone"
              value={candidate.livesAlone}
              onChange={handleInputChange}
              id="livesAlone"
              class="survey-control"
            />
          </div>

          <div class="survey-box survey-check">
            <label for="livesAlone" id="livesAlone-label">
              Familia registrada no Cadastro Único?
            </label>
            <br />
            <input
              type="checkbox"
              name="CadUnico"
              checked={candidate.CadUnico}
              onChange={handleInputChange}
              id="livesAlone"
              class="survey-control"
            />
          </div>
          {/*<!-- Deseja Obter Bolsa Escolar ? -->*/}
          <div class="survey-box survey-check">
            <label
              for="intendsToGetScholarship"
              id="intendsToGetScholarship-label"
            >
              Deseja obter bolsa Escolar ?
            </label>
            <br />
            <input
              type="checkbox"
              name="intendsToGetScholarship"
              value={candidate.intendsToGetScholarship}
              onChange={handleInputChange}
              id="intendsToGetScholarship"
              class="survey-control"
            />
          </div>

          {/*<!-- Estudou em Instituição Pública ? -->*/}
          <div class="survey-box survey-check">
            <label
              for="attendedPublicHighSchool"
              id="attendedPublicHighSchool-label"
            >
              Estudou em Instituição Pública ?
            </label>
            <br />
            <input
              type="checkbox"
              name="attendedPublicHighSchool"
              value={candidate.attendedPublicHighSchool}
              onChange={handleInputChange}
              id="attendedPublicHighSchool"
              class="survey-control"
              required
            />
          </div>

          {/*<!-- Já recebeu bolsa CEBAS para educação Básica ? -->*/}
          <div class="survey-box survey-check">
            <label
              for="benefitedFromCebasScholarship_basic"
              id="benefitedFromCebasScholarship_basic-label"
            >
              Já recebeu bolsa CEBAS para Educação Básica ?
            </label>
            <br />
            <input
              type="checkbox"
              name="benefitedFromCebasScholarship_basic"
              value={candidate.benefitedFromCebasScholarship_basic}
              onChange={handleInputChange}
              id="benefitedFromCebasScholarship_basic"
              class="survey-control"
              required
            />
          </div>

          {candidate.benefitedFromCebasScholarship_basic && (
            <div>
              <div class="survey-box">
                <label
                  for="yearsBenefitedFromCebas_basic"
                  id="yearsBenefitedFromCebas_basic-label"
                >
                  Anos em que recebeu bolsa CEBAS:
                </label>
                <br />
                <input
                  type="text"
                  name="yearsBenefitedFromCebas_basic"
                  value={candidate.yearsBenefitedFromCebas_basic}
                  onChange={handleInputChange}
                  id="yearsBenefitedFromCebas_basic"
                  class="survey-control"
                />
              </div>
              {/*<!-- Tipo de Escolaridade (Básica) -->*/}
              <div class="survey-box">
                <label
                  for="scholarshipType_basic"
                  id="scholarshipType_basic-label"
                >
                  Tipo de Educação Básica:
                </label>
                <br />
                <select
                  name="scholarshipType_basic"
                  onChange={handleInputChange}
                  value={candidate.scholarshipType_basic}
                  id="scholarshipType_basic"
                  class="select-data"
                >
                  {ScholarshipType.map((type) => (
                    <option value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              {/*<!-- Nome da Instituição (Básica): -->*/}
              <div class="survey-box">
                <label
                  for="institutionName_basic"
                  id="institutionName_basic-label"
                >
                  Nome da Instituição:
                </label>
                <br />
                <input
                  type="text"
                  name="institutionName_basic"
                  value={candidate.institutionName_basic}
                  onChange={handleInputChange}
                  id="institutionName_basic"
                  class="survey-control"
                  required
                />
              </div>

              {/*<!-- CNPJ da Instituição (Básica):-->*/}
              <div class="survey-box">
                <label
                  for="institutionCNPJ_basic"
                  id="institutionCNPJ_basic-label"
                >
                  CNPJ da Instituição:
                </label>
                <br />
                <input
                  type="text"
                  name="institutionCNPJ_basic"
                  value={candidate.institutionCNPJ_basic}
                  onChange={handleInputChange}
                  id="institutionCNPJ_basic"
                  class="survey-control"
                  required
                />
              </div>
            </div>
          )}

          {/*<!-- Já recebeu bolsa CEBAS para educação profissional ? -->*/}
          <div class="survey-box survey-check">
            <label
              for="benefitedFromCebasScholarship_professional"
              id="benefitedFromCebasScholarship_professional-label"
            >
              Já recebeu bolsa CEBAS para Educação Profissional ?
            </label>
            <br />
            <input
              type="checkbox"
              name="benefitedFromCebasScholarship_professional"
              value={candidate.benefitedFromCebasScholarship_professional}
              onChange={handleInputChange}
              id="benefitedFromCebasScholarship_basic"
              class="survey-control"
              required
            />
          </div>
          {candidate.benefitedFromCebasScholarship_professional && (
            <div>
              <div class="survey-box">
                <label
                  for="lastYearBenefitedFromCebas_professional"
                  id="lastYearBenefitedFromCebas_professional-label"
                >
                  Último ano que recebu bolsa CEBAS:
                </label>
                <br />
                <input
                  type="text"
                  name="lastYearBenefitedFromCebas_professional"
                  value={candidate.lastYearBenefitedFromCebas_professional}
                  onChange={handleInputChange}
                  id="lastYearBenefitedFromCebas_professional"
                  class="survey-control"
                />
              </div>

              {/*<!-- Tipo de Escolaridade (Profissional) -->*/}
              <div class="survey-box">
                <label
                  for="scholarshipType_professional"
                  id="scholarshipType_professional-label"
                >
                  Tipo de Educação Profissional:
                </label>
                <br />
                <select
                  name="scholarshipType_professional"
                  onChange={handleInputChange}
                  value={candidate.scholarshipType_professional}
                  id="scholarshipType_basic"
                  class="select-data"
                >
                  {ScholarshipType.map((type) => (
                    <option value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              {/*<!-- Nome da Instituição (Profissional): -->*/}
              <div class="survey-box">
                <label
                  for="institutionName_professional"
                  id="institutionName_professional-label"
                >
                  Nome da Instituição:
                </label>
                <br />
                <input
                  type="text"
                  name="institutionName_professional"
                  value={candidate.institutionName_professional}
                  onChange={handleInputChange}
                  id="institutionName_professional"
                  class="survey-control"
                  required
                />
              </div>

              {/*<!-- CNPJ da Instituição (Profissional):-->*/}
              <div class="survey-box">
                <label
                  for="institutionCNPJ_professional"
                  id="institutionCNPJ_professional-label"
                >
                  CNPJ da Instituição:
                </label>
                <br />
                <input
                  type="text"
                  name="institutionCNPJ_professional"
                  value={candidate.institutionCNPJ_professional}
                  onChange={handleInputChange}
                  id="institutionCNPJ_professional"
                  class="survey-control"
                  required
                />
              </div>
              {/*<!-- Nome do Curso (Profissional):-->*/}
              <div class="survey-box">
                <label
                  for="nameOfScholarshipCourse_professional"
                  id="nameOfScholarshipCourse_professional-label"
                >
                  Nome do Curso:
                </label>
                <br />
                <input
                  type="text"
                  name="nameOfScholarshipCourse_professional"
                  value={candidate.nameOfScholarshipCourse_professional}
                  onChange={handleInputChange}
                  id="nameOfScholarshipCourse_professional"
                  class="survey-control"
                  required
                />
              </div>
            </div>
          )}

          <div class="survey-box">
            <button
              type="submit"
              onClick={RegisterCandidateBasicInfo}
              id="submit-button"
              className="button-one"
            >
              Salvar Informações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
