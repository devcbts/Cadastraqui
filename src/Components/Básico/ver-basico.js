import React from "react";
import "../Familia/cadastroFamiliar.css";
import { useState } from "react";
import { api } from "../../services/axios";
import "./cadastro-basico.css";
import Select from 'react-select'
import { handleSuccess } from "../../ErrorHandling/handleSuceess";
import { handleAuthError } from "../../ErrorHandling/handleError";
import { formatCPF } from "../../utils/format-cpf";
import { formatRG } from "../../utils/format-rg";
import InputCheckbox from "../Inputs/InputCheckbox";
import useForm from "../../hooks/useForm";
import ValidationComposite from "../../validation/composites/validation-composite";
import ValidationBuilder from "../../validation/builders/validation-builder";
import Input from "../Inputs/FormInput";
import candidateInfoValidations from "./validations/candidate-info-validation";
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

export default function VerBasico({ candidate, basic, role }) {
  const [[candidateInfo], handleCandidateInfo, candidateInfoErrors,] = useForm(candidate);
  // Estado para controlar o modo de edição
  const [isEditing, setIsEditing] = useState(false);

  function handleCheckboxChange(event) {
    const { name, checked } = event.target;
    handleCandidateInfo({ target: { name, value: checked } })
  }

  function toggleEdit() {
    setIsEditing(!isEditing); // Alterna o estado de edição
  }

  async function saveCandidateInfoData() {
    // Aqui você implementaria o código para enviar os dados para o backend
    // Exemplo:
    const token = localStorage.getItem("token");
    try {
      const response = await api.patch(
        "/candidates/identity-info",
        candidateInfo,
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
      handleAuthError(error)
    }
    console.log("Dados salvos", candidateInfo);
    setIsEditing(false); // Desabilita o modo de edição após salvar
  }


  function handleInputChangeSelect(selectedOptions) {
    // Com react-select, selectedOptions é um array de objetos { value, label } ou null
    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
    handleCandidateInfo({ target: { name: 'incomeSource', value: values } });

  }

  return (
    <div>
      <div className="fill-box">
        <form id="survey-form">
          {/* Nome Completo */}
          <Input
            fieldName='fullName'
            label='Nome Completo'
            type='text'
            required
            disabled={!isEditing}
            value={candidateInfo.fullName}
            onChange={handleCandidateInfo}
            error={candidateInfoErrors}
          />
          {/* Nome Social */}
          <Input
            fieldName='socialName'
            label='Nome Social'
            type='text'
            disabled={!isEditing}
            value={candidateInfo.socialName}
            onChange={handleCandidateInfo}
            error={candidateInfoErrors}
          />

          {/* Data de Nascimento */}
          <Input
            fieldName='birthDate'
            label='Data de Nascimento'
            type='date'
            required
            disabled={!isEditing}
            value={candidateInfo?.birthDate?.split("T")[0]}
            onChange={handleCandidateInfo}
            error={candidateInfoErrors}
          />

          {/* Sexo */}

          <div class="survey-box">
            <label for="gender" id="gender-label">
              Sexo:
            </label>
            <br />
            <select
              name="gender"
              id="gender"
              value={candidateInfo.gender}
              disabled={!isEditing}
              onChange={handleCandidateInfo}
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
          <Input
            fieldName='nationality'
            label='Nacionalidade'
            type='text'
            required
            disabled={!isEditing}
            value={candidateInfo?.nationality}
            onChange={handleCandidateInfo}
            error={candidateInfoErrors}
          />

          {/* Cidade de Nascimento */}
          <Input
            fieldName='natural_city'
            label='Cidade Natal'
            type='text'
            required
            disabled={!isEditing}
            value={candidateInfo?.birthDate?.split("T")[0]}
            onChange={handleCandidateInfo}
            error={candidateInfoErrors}
          />

          {/* Estado de nascimento */}

          <div class="survey-box">
            <label for="natural_UF" id="natural_UF-label">
              Unidade Federativa:
            </label>
            <br />
            <select
              name="natural_UF"
              disabled={!isEditing}
              onChange={handleCandidateInfo}
              value={candidateInfo.natural_UF}
              id="natural_UF"
              class="select-data"
            >
              <option value="undefined">Escolha o Estado</option>
              {COUNTRY.map((type) => (
                <option value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          {/* CPF */}
          <Input
            fieldName='CPF'
            label='CPF'
            type='text'
            required
            disabled
            value={formatCPF(basic.CPF)}
            onChange={handleCandidateInfo}
            error={candidateInfoErrors}
          />


          {/* RG */}
          <Input
            fieldName='RG'
            label='RG'
            type='text'
            required
            disabled={!isEditing}
            value={formatRG(candidateInfo.RG)}
            onChange={handleCandidateInfo}
            error={candidateInfoErrors}
          />

          {/* Orgão Emissor do RG */}
          <Input
            fieldName='rgIssuingAuthority'
            label='Órgão Emissor do RG'
            type='text'
            required
            disabled={!isEditing}
            value={candidateInfo.rgIssuingAuthority}
            onChange={handleCandidateInfo}
            error={candidateInfoErrors}
          />

          {/* Estado do RG emitido */}
          <div class="survey-box">
            <label for="rgIssuingState" id="rgIssuingState-label">
              Estado do Órgão Emissor do RG:
            </label>
            <br />
            <select
              name="rgIssuingState"
              value={candidateInfo.rgIssuingState}
              disabled={!isEditing}
              onChange={handleCandidateInfo}
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
          {!candidateInfo.RG && (
            <div>
              {/* Tipo do documento adicional */}
              <div class="survey-box">
                <label for="documentType" id="documentType-label">
                  Tipo de Documento Adicional:
                </label>
                <br />
                <select
                  name="documentType"
                  disabled={!isEditing}
                  onChange={handleCandidateInfo}
                  value={candidateInfo.documentType}
                  id="documentType"
                  class="select-data"
                >
                  {DOCUMENT_TYPE.map((type) => (
                    <option value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              {/* Número do documento adicional */}
              <Input
                fieldName='documentNumber'
                label='Número do Documento'
                type='text'
                disabled={!isEditing}
                value={candidateInfo.documentNumber}
                onChange={handleCandidateInfo}
                error={candidateInfoErrors}
              />

              {/* Validade do documento adicional */}
              <Input
                fieldName='documentValidity'
                label='Data de Validade'
                type='date'
                required
                disabled={!isEditing}
                value={candidateInfo.documentValidity}
                onChange={handleCandidateInfo}
                error={candidateInfoErrors}
              />


              {/*<!-- Número do Registro de Nascimento -->*/}
              <Input
                fieldName='numberOfBirthRegister'
                label='Nº do Registro de Nascimento'
                type='text'
                required
                disabled={!isEditing}
                value={candidateInfo.numberOfBirthRegister}
                onChange={handleCandidateInfo}
                error={candidateInfoErrors}
              />


              {/*<!-- Livro do Registro de Nascimento -->*/}
              <Input
                fieldName='bookOfBirthRegister'
                label='Livro do Registro de Nascimento'
                type='text'
                required
                disabled={!isEditing}
                value={candidateInfo.bookOfBirthRegister}
                onChange={handleCandidateInfo}
                error={candidateInfoErrors}
              />


              {/*<!-- Página do Registro de Nascimento -->*/}
              <Input
                fieldName='pageOfBirthRegister'
                label='Página do Registro de Nascimento'
                type='text'
                required
                disabled={!isEditing}
                value={candidateInfo.pageOfBirthRegister}
                onChange={handleCandidateInfo}
                error={candidateInfoErrors}
              />

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
              value={candidateInfo.maritalStatus}
              disabled={!isEditing}
              onChange={handleCandidateInfo}
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
              disabled={!isEditing}
              onChange={handleCandidateInfo}
              value={candidateInfo.skinColor}
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
              value={candidateInfo.religion}
              disabled={!isEditing}
              onChange={handleCandidateInfo}
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
              disabled={!isEditing}
              onChange={handleCandidateInfo}
              value={candidateInfo.educationLevel}
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
          <div class="survey-box survey-check">
            <label for="specialNeeds" id="specialNeeds-label">
              Necessidades Especiais:
            </label>
            <br />
            <InputCheckbox
              type="checkbox"
              name="specialNeeds"
              disabled={!isEditing}
              onChange={handleCheckboxChange}
              value={candidateInfo.specialNeeds}
              id="specialNeeds"
              class="survey-control"
            />
          </div>
          {candidateInfo.specialNeeds && (
            <>
              {/*<!-- Descrição das Necessidades Especiais -->*/}
              <Input
                fieldName='specialNeedsDescription'
                label='Descrição das Necessidades Especiais'
                type='text'
                disabled={!isEditing}
                value={candidateInfo.specialNeedsDescription}
                onChange={handleCandidateInfo}
                error={candidateInfoErrors}
              />


              {/*<!-- Tem relatório médico -->*/}

              <div class="survey-box">
                <label for="hasMedicalReport" id="hasMedicalReport-label">
                  Possui relatório médico:
                </label>
                <br />
                <InputCheckbox
                  type="checkbox"
                  name="hasMedicalReport"
                  disabled={!isEditing}
                  onChange={handleCheckboxChange}
                  value={candidateInfo.hasMedicalReport}
                  id="hasMedicalReport"
                  class="survey-control"
                />
              </div>
            </>
          )}

          {/*<!-- Telefone Fixo -->*/}
          <Input
            fieldName='landlinePhone'
            label='Telefone Fixo'
            type='text'
            disabled={!isEditing}
            value={candidateInfo.landlinePhone}
            onChange={handleCandidateInfo}
            error={candidateInfoErrors}
          />


          {/*<!-- Telefone de Trabalho -->*/}
          <Input
            fieldName='workPhone'
            label='Telefone de trabalho/recado'
            type='text'
            disabled={!isEditing}
            value={candidateInfo.workPhone}
            onChange={handleCandidateInfo}
            error={candidateInfoErrors}
          />


          {/*<!-- Nome para Contato -->*/}
          <Input
            fieldName='contactNameForMessage'
            label='Nome para contato'
            type='text'
            disabled={!isEditing}
            value={candidateInfo.contactNameForMessage}
            onChange={handleCandidateInfo}
            error={candidateInfoErrors}
          />

          {/*<!-- Email -->*/}
          <Input
            fieldName='email'
            label='E-mail'
            type='text'
            required
            disabled
            value={basic.email}
            onChange={handleCandidateInfo}
          />

          {/*<!-- Endereço -->*/}
          <Input
            fieldName='address'
            label='Endereço'
            type='text'
            required
            disabled
            value={basic.address}
            onChange={handleCandidateInfo}
          />


          {/*<!-- Cidade -->*/}
          <Input
            fieldName='city'
            label='Cidade'
            type='text'
            required
            disabled
            value={basic.city}
            onChange={handleCandidateInfo}
          />


          {/*<!-- Unidade Federativa -->*/}

          <div class="survey-box">
            <label for="UF" id="UF-label">Unidade Federativa:</label>
            <br />
            <select name="UF" id="UF" value={basic.UF} disabled onChange={handleCandidateInfo} class="select-data">
              {COUNTRY.map((type) => <option value={type.value}>{type.label}</option>)}


            </select>
          </div>

          {/*<!-- CEP -->*/}
          <Input
            fieldName='CEP'
            label='CEP'
            type='text'
            required
            disabled
            value={basic.CEP}
            onChange={handleCandidateInfo}
          />

          {/*<!-- Bairro -->*/}
          <Input
            fieldName='neighborhood'
            label='Bairro'
            type='text'
            required
            disabled
            value={basic.neighborhood}
            onChange={handleCandidateInfo}
          />


          {/*<!-- Número de Endereço -->*/}
          <Input
            fieldName='addressNumber'
            label='Número do Endereço'
            type='number'
            required
            disabled
            value={basic.addressNumber}
            onChange={handleCandidateInfo}
          />



          {/*<!-- Profissão -->*/}
          <Input
            fieldName='profession'
            label='Profissão'
            type='text'
            required
            disabled={!isEditing}
            value={candidateInfo.profession}
            onChange={handleCandidateInfo}
            error={candidateInfoErrors}
          />


          {/*<!-- Inscrito em Programa Governamental -->*/}
          <div class="survey-box survey-check">
            <label
              for="enrolledGovernmentProgram"
              id="enrolledGovernmentProgram-label"
            >
              Inscrito em Programa Governamental:
            </label>
            <br />
            <InputCheckbox
              type="checkbox"
              name="enrolledGovernmentProgram"
              value={candidateInfo.enrolledGovernmentProgram}
              disabled={!isEditing}
              onChange={handleCheckboxChange}
              id="enrolledGovernmentProgram"
              class="survey-control"
            />
          </div>

          {candidateInfo.enrolledGovernmentProgram === true && (
            <div>
              {/*<!-- NIS -->*/}
              <Input
                fieldName='NIS'
                label='NIS'
                type='text'
                disabled={!isEditing}
                value={candidateInfo.NIS}
                onChange={handleCandidateInfo}
                error={candidateInfoErrors}
              />

            </div>
          )}
          {/* Fonte de Renda  */}
          {/* <div class="survey-box">
            <label for="incomeSource" id="incomeSource-label">
              Fonte(s) de renda:
            </label>
            <br />
            <Select
              name="incomeSource"
              isMulti
              isDisabled={!isEditing}
              onChange={handleInputChangeSelect}
              options={IncomeSource}
              value={IncomeSource.filter(obj => candidateInfo.incomeSource.includes(obj.value))}
              id="incomeSource"
              class="select-data"
            />
          </div> */}

          {/*<!-- Mora Sozinho ? -->*/}
          <div class="survey-box  survey-check">
            <label for="livesAlone" id="livesAlone-label">
              Mora Sozinho ?
            </label>
            <br />
            <InputCheckbox
              type="checkbox"
              name="livesAlone"
              value={candidateInfo.livesAlone}
              disabled={!isEditing}
              onChange={handleCheckboxChange}
              id="livesAlone"
              class="survey-control"
            />
          </div>
          <div class="survey-box survey-check">
            <label for="livesAlone" id="livesAlone-label">
              Familia registrada no Cadastro Único?
            </label>
            <br />
            <InputCheckbox
              type="checkbox"
              name="CadUnico"
              checked={candidateInfo.CadUnico}
              disabled={!isEditing}
              onChange={handleCheckboxChange}
              id="CadUnico"
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
            <InputCheckbox
              type="checkbox"
              name="intendsToGetScholarship"
              value={candidateInfo.intendsToGetScholarship}
              disabled={!isEditing}
              onChange={handleCheckboxChange}
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
            <InputCheckbox
              type="checkbox"
              name="attendedPublicHighSchool"
              value={candidateInfo.attendedPublicHighSchool}
              disabled={!isEditing}
              onChange={handleCheckboxChange}
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
            <InputCheckbox
              type="checkbox"
              name="benefitedFromCebasScholarship_basic"
              value={candidateInfo.benefitedFromCebasScholarship_basic}
              disabled={!isEditing}
              onChange={handleCheckboxChange}
              id="benefitedFromCebasScholarship_basic"
              class="survey-control"
              required
            />
          </div>

          {candidateInfo.benefitedFromCebasScholarship_basic && (
            <>
              <Input
                fieldName='yearsBenefitedFromCebas_basic'
                label='Anos em que recebeu bolsa CEBAS'
                type='text'
                disabled={!isEditing}
                value={candidateInfo.yearsBenefitedFromCebas_basic}
                onChange={handleCandidateInfo}
                error={candidateInfoErrors}
              />

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
                  disabled={!isEditing}
                  onChange={handleCandidateInfo}
                  value={candidateInfo.scholarshipType_basic}
                  id="scholarshipType_basic"
                  class="select-data"
                >
                  {ScholarshipType.map((type) => (
                    <option value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              {/*<!-- Nome da Instituição (Básica): -->*/}
              <Input
                fieldName='institutionName_basic'
                label='Nome da Instituição'
                type='text'
                required
                disabled={!isEditing}
                value={candidateInfo.institutionName_basic}
                onChange={handleCandidateInfo}
                error={candidateInfoErrors}
              />


              {/*<!-- CNPJ da Instituição (Básica):-->*/}
              <Input
                fieldName='institutionCNPJ_basic'
                label='CNPJ da Instituição'
                type='number'
                required
                disabled={!isEditing}
                value={candidateInfo.institutionCNPJ_basic}
                onChange={handleCandidateInfo}
                error={candidateInfoErrors}
              />

            </>
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
            <InputCheckbox
              type="checkbox"
              name="benefitedFromCebasScholarship_professional"
              value={candidateInfo.benefitedFromCebasScholarship_professional}
              disabled={!isEditing}
              onChange={handleCheckboxChange}
              id="benefitedFromCebasScholarship_professional"
              class="survey-control"
              required
            />
          </div>
          {candidateInfo.benefitedFromCebasScholarship_professional && (
            <>

              <Input
                fieldName='lastYearBenefitedFromCebas_professional'
                label='Último ano que recebeu bolsa CEBAS'
                type='text'
                disabled={!isEditing}
                value={candidateInfo.lastYearBenefitedFromCebas_professional}
                onChange={handleCandidateInfo}
                error={candidateInfoErrors}
              />


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
                  disabled={!isEditing}
                  onChange={handleCandidateInfo}
                  value={candidateInfo.scholarshipType_professional}
                  id="scholarshipType_basic"
                  class="select-data"
                >
                  {ScholarshipType.map((type) => (
                    <option value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              {/*<!-- Nome da Instituição (Profissional): -->*/}
              <Input
                fieldName='institutionName_professional'
                label='E-mail'
                type='text'
                required
                disabled={!isEditing}
                value={candidateInfo.institutionName_professional}
                onChange={handleCandidateInfo}
                error={candidateInfoErrors}
              />


              {/*<!-- CNPJ da Instituição (Profissional):-->*/}
              <Input
                fieldName='institutionCNPJ_professional'
                label='CNPJ da Instituição'
                type='number'
                required
                disabled={!isEditing}
                value={candidateInfo.institutionCNPJ_professional}
                onChange={handleCandidateInfo}
                error={candidateInfoErrors}
              />

              {/*<!-- Nome do Curso (Profissional):-->*/}
              <Input
                fieldName='nameOfScholarshipCourse_professional'
                label='Nome do Curso'
                type='text'
                required
                disabled={!isEditing}
                value={candidateInfo.nameOfScholarshipCourse_professional}
                onChange={handleCandidateInfo}
                error={candidateInfoErrors}
              />

            </>
          )}

          {role !== 'Assistant' && <div className="survey-box">
            {!isEditing ? (
              <button
                className="over-button"
                type="button"
                onClick={toggleEdit}
              >
                Editar
              </button>
            ) : (
              <>
                <button
                  className="over-button"
                  type="button"
                  onClick={saveCandidateInfoData}
                >
                  Salvar Dados
                </button>
                <button
                  className="over-button"
                  type="button"
                  onClick={toggleEdit}
                >
                  Cancelar
                </button>
              </>
            )}
          </div>}
        </form>
      </div>
    </div>
  );
}
