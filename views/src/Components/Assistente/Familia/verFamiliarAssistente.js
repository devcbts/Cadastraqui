import React from "react";
import "./verFamiliarAssistente.css";
import { useState } from "react";
import Select from "react-select";
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
export default function VerFamiliarAssistente({ familyMember }) {
  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
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
              disabled
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
                disabled
                onChange={handleInputChange}
                id="otherRelationship"
                class="survey-control"
                required
              />
            </div>
          )}
          <div class="survey-box">
            <label for="fullName" id="fullName-label">
              Nome Completo:
            </label>
            <br />
            <input
              type="text"
              name="fullName"
              value={familyMember.fullName}
              disabled
              onChange={handleInputChange}
              id="fullName"
              class="survey-control"
              required
            />
          </div>

          <div class="survey-box">
            <label for="socialName" id="socialName-label">
              Nome Social:
            </label>
            <br />
            <input
              type="text"
              name="socialName"
              value={familyMember.socialName}
              disabled
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
              value={familyMember.birthDate.split("T")[0]}
              disabled
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
              disabled
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
              disabled
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
              disabled
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
              disabled
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
              disabled
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
              disabled
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
              disabled
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
              disabled
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
                  disabled
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
                  disabled
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
                  disabled
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
                  disabled
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
                  disabled
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
                  disabled
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
              disabled
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
              Cor da Pele:
            </label>
            <br />
            <select
              name="skinColor"
              disabled
              onChange={handleInputChange}
              value={familyMember.skinColor}
              id="skinColor"
              class="select-data"
            >
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
              disabled
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
              disabled
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
          <div class="survey-box survey-check">
            <label for="specialNeeds" id="specialNeeds-label">
              Necessidades Especiais:
            </label>
            <br />
            <input
              type="checkbox"
              name="specialNeeds"
              disabled
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
                  disabled
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
                  disabled
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
              disabled
              onChange={handleInputChange}
              value={familyMember.landlinePhone}
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
              disabled
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
              disabled
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
              disabled
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
              disabled
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
              disabled
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
              disabled
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
              disabled
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
              disabled
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
              disabled
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
              disabled
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
              value={familyMember.enrolledGovernmentProgram}
              disabled
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
                  disabled
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
              isDisabled // Remova esta linha se o campo não deve ser desabilitado
              onChange={handleInputChange}
              value={IncomeSource.filter((obj) =>
                familyMember.incomeSource.includes(obj.value)
              )}
              options={IncomeSource}
              className="survey-select"
              id="incomeSource"
            />
          </div>

          <div class="survey-box">
            <button type="submit" id="submit-button">
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
