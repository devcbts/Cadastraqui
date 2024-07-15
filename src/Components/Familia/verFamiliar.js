import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import "./verFamiliar.css";
import { useState } from "react";
import { api } from "../../services/axios";
import Select from "react-select";
import { handleSuccess } from "../../ErrorHandling/handleSuceess";
import { handleAuthError } from "../../ErrorHandling/handleError";
import { formatCPF } from "../../utils/format-cpf";
import { formatRG } from "../../utils/format-rg";
import FormSelect from "../Inputs/FormSelect";
import Input from "../Inputs/FormInput";
import FormCheckbox from "../Inputs/FormCheckbox";
import familyMemberInfoValidation from "./validators/family-member-info-validation";
import useForm from "../../hooks/useForm";
import { formatTelephone } from "../../utils/format-telephone";
import Swal from "sweetalert2";

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
const VerFamiliar = forwardRef(({ familyMember, onDelete }, ref) => {
  const [[familyMemberInfo, setFamilyMember], handleFamilyMemberInfo, familyMemberInfoErrors, submitFamilyMember, resetForm] = useForm(familyMember, familyMemberInfoValidation);
  const [isEditing, setIsEditing] = useState(false);
  function toggleEdit() {
    resetForm()
    setIsEditing(!isEditing); // Alterna o estado de edição
  }
  useImperativeHandle(ref, () => {
    return { setInfo: setFamilyMember }
  })
  const handleSpecialNeedsChange = (e) => {
    const { checked } = e.target
    if (!checked) {
      setFamilyMember({ hasMedicalReport: false, specialNeedsDescription: '', })
    }
    handleFamilyMemberInfo(e)
  }
  const handleEnrollGovernmentProgram = (e) => {
    const { checked } = e.target
    if (!checked) {
      setFamilyMember({ NIS: '' })
    }
    handleFamilyMemberInfo(e)
  }

  const handleChangeRG = (e) => {
    const { value } = e.target
    if (!!value) {
      setFamilyMember({
        documentType: "DriversLicense",
        documentValidity: "",
        numberOfBirthRegister: "",
        bookOfBirthRegister: "",
        pageOfBirthRegister: "",
      })
    }
    handleFamilyMemberInfo(e)
  }


  async function saveFamilyMemberInfoData() {
    // Aqui você implementaria o código para enviar os dados para o backend
    // Exemplo:
    if (!submitFamilyMember()) {
      return
    }
    const token = localStorage.getItem("token");
    try {
      const response = await api.patch(
        `/candidates/family-info/${familyMemberInfo.id}`,
        familyMemberInfo,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      ;
      ;
      ;
      handleSuccess(response, "Dados cadastrados com sucesso!");
    } catch (error) {
      ;
      handleAuthError(error);
    }
    ;
    setIsEditing(false); // Desabilita o modo de edição após salvar
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
            disabled={!isEditing}
          />

          {familyMemberInfo.relationship === "Other" && (
            <Input
              name="otherRelationship"
              label="Tipo de Relação"
              value={familyMemberInfo.otherRelationship}
              onChange={handleFamilyMemberInfo}
              error={familyMemberInfoErrors}
              disabled={!isEditing}

            />
          )}

          <Input
            name="fullName"
            label="Nome Civil Completo"
            value={familyMemberInfo.fullName}
            onChange={handleFamilyMemberInfo}
            error={familyMemberInfoErrors}
            disabled={!isEditing}

          />
          <Input
            name="socialName"
            label="Nome Social (quando aplicável)"
            value={familyMemberInfo.socialName}
            onChange={handleFamilyMemberInfo}
            error={familyMemberInfoErrors}
            disabled={!isEditing}

          />
          <Input
            name="birthDate"
            label="Data de Nascimento"
            value={familyMemberInfo.birthDate?.split('T')[0]}
            onChange={handleFamilyMemberInfo}
            error={familyMemberInfoErrors}
            type="date"
            disabled={!isEditing}

          />
          <FormSelect
            label="Sexo"
            name="gender"
            value={familyMemberInfo.gender}
            onChange={handleFamilyMemberInfo}
            options={GENDER}
            error={familyMemberInfoErrors}
            disabled={!isEditing}

          />

          <Input
            name="nationality"
            label="Nacionalidade"
            value={familyMemberInfo.nationality}
            onChange={handleFamilyMemberInfo}
            error={familyMemberInfoErrors}
            disabled={!isEditing}

          />
          <Input
            name="natural_city"
            label="Cidade Natal"
            value={familyMemberInfo.natural_city}
            onChange={handleFamilyMemberInfo}
            error={familyMemberInfoErrors}
            disabled={!isEditing}

          />
          <FormSelect
            label="Unidade Federativa"
            name="natural_UF"
            value={familyMemberInfo.natural_UF}
            onChange={handleFamilyMemberInfo}
            options={COUNTRY}
            error={familyMemberInfoErrors}
            disabled={!isEditing}

          />

          <Input
            name="CPF"
            label="CPF"
            value={formatCPF(familyMemberInfo.CPF)}
            onChange={handleFamilyMemberInfo}
            error={familyMemberInfoErrors}
            disabled={!isEditing}

          />
          <Input
            name="RG"
            label="Nº de RG"
            value={formatRG(familyMemberInfo.RG)}
            onChange={handleChangeRG}
            error={familyMemberInfoErrors}
            disabled={!isEditing}

          />
          <Input
            name="rgIssuingAuthority"
            label="Órgão Emissor do RG"
            value={familyMemberInfo.rgIssuingAuthority}
            onChange={handleFamilyMemberInfo}
            error={familyMemberInfoErrors}
            disabled={!isEditing}

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
                disabled={!isEditing}

              />


              <Input
                name="documentNumber"
                label="Número do Documento"
                value={familyMemberInfo.documentNumber}
                onChange={handleFamilyMemberInfo}
                error={familyMemberInfoErrors}
                disabled={!isEditing}

              />
              <Input
                name="documentValidity"
                label="Data de Validade"
                value={familyMemberInfo.documentValidity}
                onChange={handleFamilyMemberInfo}
                error={familyMemberInfoErrors}
                type="date"
                disabled={!isEditing}

              />




              {/*<!-- Número do Registro de Nascimento -->*/}
              <Input
                name="numberOfBirthRegister"
                label="Nº do Registro de Nascimento"
                value={familyMemberInfo.numberOfBirthRegister}
                onChange={handleFamilyMemberInfo}
                error={familyMemberInfoErrors}
                disabled={!isEditing}

              />


              {/*<!-- Livro do Registro de Nascimento -->*/}
              <Input
                name="bookOfBirthRegister"
                label="Livro do Registro de Nascimento"
                value={familyMemberInfo.bookOfBirthRegister}
                onChange={handleFamilyMemberInfo}
                error={familyMemberInfoErrors}
                disabled={!isEditing}

              />


              {/*<!-- Página do Registro de Nascimento -->*/}
              <Input
                name="pageOfBirthRegister"
                label="Página do Registro de Nascimento"
                value={familyMemberInfo.pageOfBirthRegister}
                onChange={handleFamilyMemberInfo}
                error={familyMemberInfoErrors}
                disabled={!isEditing}

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
            disabled={!isEditing}

          />



          {/*<!-- Cor da Pele -->*/}
          <FormSelect
            label="Cor ou Raça"
            name="skinColor"
            value={familyMemberInfo.skinColor}
            onChange={handleFamilyMemberInfo}
            options={SkinColor}
            error={familyMemberInfoErrors}
            disabled={!isEditing}

          />


          {/*<!-- Religião -->*/}
          <FormSelect
            label="Religião"
            name="religion"
            value={familyMemberInfo.religion}
            onChange={handleFamilyMemberInfo}
            options={RELIGION}
            error={familyMemberInfoErrors}
            disabled={!isEditing}

          />


          {/*<!-- Nível de Educação -->*/}
          <FormSelect
            label="Nível de Educação"
            name="educationLevel"
            value={familyMemberInfo.educationLevel}
            onChange={handleFamilyMemberInfo}
            options={SCHOLARSHIP}
            error={familyMemberInfoErrors}
            disabled={!isEditing}

          />


          {/*<!-- Necessidades Especiais -->*/}
          <FormCheckbox
            label="Necessidades Especiais"
            name="specialNeeds"
            onChange={handleSpecialNeedsChange}
            value={familyMemberInfo.specialNeeds}
            disabled={!isEditing}

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
                disabled={!isEditing}

              />


              {/*<!-- Tem relatório médico -->*/}
              <FormCheckbox
                label="Possui relatório médico"
                name="hasMedicalReport"
                onChange={handleFamilyMemberInfo}
                value={familyMemberInfo.hasMedicalReport}
                disabled={!isEditing}

              />

            </>
          )}

          {/*<!-- Telefone Fixo -->*/}
          <Input
            name="landlinePhone"
            label="Telefone Fixo/Celular"
            value={formatTelephone(familyMemberInfo.landlinePhone)}
            onChange={handleFamilyMemberInfo}
            error={familyMemberInfoErrors}
            disabled={!isEditing}

          />


          {/*<!-- Telefone de Trabalho -->*/}
          <Input
            name="workPhone"
            label="Telefone de trabalho/recado"
            value={formatTelephone(familyMemberInfo.workPhone)}
            onChange={handleFamilyMemberInfo}
            error={familyMemberInfoErrors}
            disabled={!isEditing}

          />


          {/*<!-- Nome para Contato -->*/}
          <Input
            name="contactNameForMessage"
            label="Nome para Contato"
            value={familyMemberInfo.contactNameForMessage}
            onChange={handleFamilyMemberInfo}
            error={familyMemberInfoErrors}
            disabled={!isEditing}

          />


          {/*<!-- Email -->*/}
          <Input
            name="email"
            label="Email"
            value={familyMemberInfo.email}
            onChange={handleFamilyMemberInfo}
            error={familyMemberInfoErrors}
            type="email"
            disabled={!isEditing}

          />



          {/*<!-- Profissão -->*/}
          <Input
            name="profession"
            label="Profissão"
            value={familyMemberInfo.profession}
            onChange={handleFamilyMemberInfo}
            error={familyMemberInfoErrors}
            disabled={!isEditing}

          />


          {/*<!-- Inscrito em Programa Governamental -->*/}
          <FormCheckbox
            label="Inscrito em Programa Governamental"
            name="enrolledGovernmentProgram"
            onChange={handleEnrollGovernmentProgram}
            value={familyMemberInfo.enrolledGovernmentProgram}
            disabled={!isEditing}

          />


          {familyMemberInfo.enrolledGovernmentProgram === true && (
            <>
              {/*<!-- NIS -->*/}
              <Input
                name="NIS"
                label="NIS"
                maxLength={11}
                value={familyMemberInfo.NIS}
                onChange={handleFamilyMemberInfo}
                error={familyMemberInfoErrors}
                disabled={!isEditing}

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
              isDisabled={!isEditing}

            />
            {familyMemberInfoErrors["incomeSource"] && <label>{familyMemberInfoErrors["incomeSource"]}</label>}
          </div> */}

          <div className="survey-box">
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
                  onClick={saveFamilyMemberInfoData}
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
                <button
                  className="over-button"
                  type="button"
                  onClick={() => onDelete(familyMemberInfo.id)}
                >
                  Excluir
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
})
export default VerFamiliar
