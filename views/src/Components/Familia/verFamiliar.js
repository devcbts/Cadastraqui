import React, { useEffect } from 'react'
import './verFamiliar.css'
import { useState } from 'react';
import { api } from '../../services/axios';
import Select from 'react-select'
import { handleSuccess } from '../../ErrorHandling/handleSuceess';
import { handleAuthError } from '../../ErrorHandling/handleError';

const Relationship = [
    { value: 'Wife', label: 'Esposa' },
    { value: 'Husband', label: 'Marido' },
    { value: 'Father', label: 'Pai' },
    { value: 'Mother', label: 'Mãe' },
    { value: 'Stepfather', label: 'Padrasto' },
    { value: 'Stepmother', label: 'Madrasta' },
    { value: 'Sibling', label: 'Irmão/Irmã' },
    { value: 'Grandparent', label: 'Avô/Avó' },
    { value: 'Child', label: 'Filho/Filha' },
    { value: 'Other', label: 'Outro' },
];

const GENDER = [
    { value: 'MALE', label: 'Masculino' },
    { value: 'FEMALE', label: 'Feminino' }
];

const COUNTRY = [
    { value: 'AC', label: 'Acre' },
    { value: 'AL', label: 'Alagoas' },
    { value: 'AM', label: 'Amazonas' },
    { value: 'AP', label: 'Amapá' },
    { value: 'BA', label: 'Bahia' },
    { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'PI', label: 'Piauí' },
    { value: 'PR', label: 'Paraná' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SE', label: 'Sergipe' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'TO', label: 'Tocantins' },
];

const DOCUMENT_TYPE = [
    { value: 'DriversLicense', label: 'Carteira de Motorista' },
    { value: 'FunctionalCard', label: 'Carteira Funcional' },
    { value: 'MilitaryID', label: 'Identidade Militar' },
    { value: 'ForeignerRegistration', label: 'Registro de Estrangeiro' },
    { value: 'Passport', label: 'Passaporte' },
    { value: 'WorkCard', label: 'Carteira de Trabalho' },
];

const MARITAL_STATUS = [
    { value: 'Single', label: 'Solteiro(a)' },
    { value: 'Married', label: 'Casado(a)' },
    { value: 'Separated', label: 'Separado(a)' },
    { value: 'Divorced', label: 'Divorciado(a)' },
    { value: 'Widowed', label: 'Viúvo(a)' },
    { value: 'StableUnion', label: 'União Estável' },
];

const SkinColor = [
    { value: 'Yellow', label: 'Amarela' },
    { value: 'White', label: 'Branca' },
    { value: 'Indigenous', label: 'Indígena' },
    { value: 'Brown', label: 'Parda' },
    { value: 'Black', label: 'Preta' },
    { value: 'NotDeclared', label: 'Não Declarado' },
];

const RELIGION = [
    { value: 'Catholic', label: 'Católica' },
    { value: 'Evangelical', label: 'Evangélica' },
    { value: 'Spiritist', label: 'Espírita' },
    { value: 'Atheist', label: 'Ateia' },
    { value: 'Other', label: 'Outra' },
    { value: 'NotDeclared', label: 'Não Declarada' },
];

const SCHOLARSHIP = [
    { value: 'Illiterate', label: 'Analfabeto' },
    { value: 'ElementarySchool', label: 'Ensino Fundamental' },
    { value: 'HighSchool', label: 'Ensino Médio' },
    { value: 'CollegeGraduate', label: 'Graduação' },
    { value: 'CollegeUndergraduate', label: 'Graduação Incompleta' },
    { value: 'Postgraduate', label: 'Pós-Graduação' },
    { value: 'Masters', label: 'Mestrado' },
    { value: 'Doctorate', label: 'Doutorado' },
    { value: 'PostDoctorate', label: 'Pós-Doutorado' },
];

const Institution_Type = [
    { value: 'Public', label: 'Pública' },
    { value: 'Private', label: 'Privada' }
];

const Education_Type = [
    { value: 'Alfabetizacao', label: 'Alfabetização' },
    { value: 'Ensino_Medio', label: 'Ensino Médio' },
    { value: 'Ensino_Tecnico', label: 'Ensino Técnico' },
    { value: 'Ensino_Superior', label: 'Ensino Superior' },
];

const SHIFT = [
    { value: 'Morning', label: 'Matutino' },
    { value: 'Afternoon', label: 'Vespertino' },
    { value: 'Evening', label: 'Noturno' },
    { value: 'FullTime', label: 'Integral' }
];

const IncomeSource = [
    { value: 'PrivateEmployee', label: 'Empregado Privado' },
    { value: 'PublicEmployee', label: 'Empregado Público' },
    { value: 'DomesticEmployee', label: 'Empregado Doméstico' },
    { value: 'TemporaryRuralEmployee', label: 'Empregado Rural Temporário' },
    { value: 'BusinessOwnerSimplifiedTax', label: 'Empresário - Regime Simples' },
    { value: 'BusinessOwner', label: 'Empresário' },
    { value: 'IndividualEntrepreneur', label: 'Empreendedor Individual' },
    { value: 'SelfEmployed', label: 'Autônomo' },
    { value: 'Retired', label: 'Aposentado' },
    { value: 'Pensioner', label: 'Pensionista' },
    { value: 'Apprentice', label: 'Aprendiz' },
    { value: 'Volunteer', label: 'Voluntário' },
    { value: 'RentalIncome', label: 'Renda de Aluguel' },
    { value: 'Student', label: 'Estudante' },
    { value: 'InformalWorker', label: 'Trabalhador Informal' },
    { value: 'Unemployed', label: 'Desempregado' },
    { value: 'TemporaryDisabilityBenefit', label: 'Benefício por Incapacidade Temporária' },
    { value: 'LiberalProfessional', label: 'Profissional Liberal' },
    { value: 'FinancialHelpFromOthers', label: 'Ajuda Financeira de Terceiros' },
    { value: 'Alimony', label: 'Pensão Alimentícia' },
    { value: 'PrivatePension', label: 'Previdência Privada' },
];
export default function VerFamiliar({ familyMember }) {

    const [familyMemberInfo, setFamilyMemberInfo] = useState(familyMember)
    const [isEditing, setIsEditing] = useState(false);
    function toggleEdit() {
        setIsEditing(!isEditing); // Alterna o estado de edição
    }
    useEffect(() =>{
        setFamilyMemberInfo(familyMember)
    },[familyMember])
    function handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        setFamilyMemberInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    function handleInputChangeSelect(selectedOptions) {
        // Com react-select, selectedOptions é um array de objetos { value, label } ou null
        const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setFamilyMemberInfo(prevState => ({
            ...prevState,
            incomeSource: values
        }));
        console.log(familyMemberInfo)

    }

    async function saveFamilyMemberInfoData() {
        // Aqui você implementaria o código para enviar os dados para o backend
        // Exemplo:
        const token =  localStorage.getItem('token');
        try {
            const response = await api.patch(`/candidates/family-info/${familyMemberInfo.id}`, familyMemberInfo, {
              headers: {
                authorization: `Bearer ${token}`,
              },
            });
            console.log("====================================");
            console.log(response.status);
            console.log("====================================");
            handleSuccess(response,"Dados cadastrados com sucesso!");
          } catch (error) {
            console.log(error);
            handleAuthError(error)
          }
        console.log('Dados salvos', familyMemberInfo);
        setIsEditing(false); // Desabilita o modo de edição após salvar
    }
    return (
        <div><div className="fill-box">
            <form id="survey-form">
                <div class="survey-box">
                    <label for="relationship" id="relationship-label">Relação:</label>
                    <br />
                    <select name="relationship" value={familyMemberInfo.relationship} disabled={!isEditing} onChange={handleInputChange} id="relationship" class="select-data">
                        {Relationship.map((type) => <option value={type.value}>{type.label}</option>)}
                    </select>
                </div>
                {familyMemberInfo.relationship === 'Other' && <div class="survey-box">
                    <label for="otherRelationship" id="otherRelationship-label">Tipo de Relação:</label>
                    <br />
                    <input type="text" name="otherRelationship" value={familyMemberInfo.otherRelationship} disabled={!isEditing} onChange={handleInputChange} id="otherRelationship" class="survey-control" required />
                </div>}
                <div class="survey-box">
                    <label for="fullName" id="fullName-label">Nome Civil Completo:</label>
                    <br />
                    <input type="text" name="fullName" value={familyMemberInfo.fullName} disabled={!isEditing} onChange={handleInputChange} id="fullName" class="survey-control" required />
                </div>

                <div class="survey-box">
                    <label for="socialName" id="socialName-label">Nome Social, quando aplicável:</label>
                    <br />
                    <input type="text" name="socialName" value={familyMemberInfo.socialName} disabled={!isEditing} onChange={handleInputChange} id="socialName" class="survey-control" />
                </div>

                <div class="survey-box">
                    <label for="birthDate" id="birthDate-label">Data de Nascimento:</label>
                    <br />
                    <input type="date" name="birthDate" value={familyMemberInfo.birthDate.split('T')[0]} disabled={!isEditing} onChange={handleInputChange} id="birthDate" class="survey-control" required />
                </div>

                <div class="survey-box">
                    <label for="gender" id="gender-label">Sexo:</label>
                    <br />
                    <select name="gender" id="gender" value={familyMemberInfo.gender} disabled={!isEditing} onChange={handleInputChange} class="select-data" required>
                        {GENDER.map((type) => <option value={type.value}>{type.label}</option>)}

                    </select>
                </div>

                <div class="survey-box">
                    <label for="nationality" id="nationality-label">Nacionalidade:</label>
                    <br />
                    <input type="text" name="nationality" disabled={!isEditing} onChange={handleInputChange} value={familyMemberInfo.nationality} id="nationality" class="survey-control" required />
                </div>

                <div class="survey-box">
                    <label for="natural_city" id="natural_city-label">Cidade Natal:</label>
                    <br />
                    <input type="text" name="natural_city" value={familyMemberInfo.natural_city} disabled={!isEditing} onChange={handleInputChange} id="natural_city" class="survey-control" required />
                </div>



                <div class="survey-box">
                    <label for="natural_UF" id="natural_UF-label">Unidade Federativa:</label>
                    <br />
                    <select name="natural_UF" disabled={!isEditing} onChange={handleInputChange} value={familyMemberInfo.natural_UF} id="natural_UF" class="select-data">
                        {COUNTRY.map((type) => <option value={type.value}>{type.label}</option>)}

                    </select>
                </div>

                <div class="survey-box">
                    <label for="CPF" id="CPF-label">CPF:</label>
                    <br />
                    <input type="text" name="CPF" value={familyMemberInfo.CPF} disabled={!isEditing} onChange={handleInputChange} id="CPF" class="survey-control" required />
                </div>

                <div class="survey-box">
                    <label for="RG" id="RG-label">Nº de RG:</label>
                    <br />
                    <input type="text" name="RG" value={familyMemberInfo.RG} disabled={!isEditing} onChange={handleInputChange} id="RG" class="survey-control" required />
                </div>

                <div class="survey-box">
                    <label for="rgIssuingAuthority" id="rgIssuingAuthority-label">Órgão Emissor do RG:</label>
                    <br />
                    <input type="text" name="rgIssuingAuthority" value={familyMemberInfo.rgIssuingAuthority} disabled={!isEditing} onChange={handleInputChange} id="rgIssuingAuthority" class="survey-control" required />
                </div>

                <div class="survey-box">
                    <label for="rgIssuingState" id="rgIssuingState-label">Estado do Órgão Emissor do RG:</label>
                    <br />
                    <select name="rgIssuingState" value={familyMemberInfo.rgIssuingState} disabled={!isEditing} onChange={handleInputChange} id="rgIssuingState" class="select-data">
                        {COUNTRY.map((type) => <option value={type.value}>{type.label}</option>)}

                    </select>
                </div>
                {!familyMemberInfo.RG && <div>
                    <div class="survey-box">
                        <label for="documentType" id="documentType-label">Tipo de Documento Adicional:</label>
                        <br />
                        <select name="documentType" disabled={!isEditing} onChange={handleInputChange} value={familyMemberInfo.documentType} id="documentType" class="select-data">
                            {DOCUMENT_TYPE.map((type) => <option value={type.value}>{type.label}</option>)}

                        </select>
                    </div>

                    <div class="survey-box">
                        <label for="documentNumber" id="documentNumber-label">Número do Documento:</label>
                        <br />
                        <input type="text" name="documentNumber" value={familyMemberInfo.documentNumber} disabled={!isEditing} onChange={handleInputChange} id="documentNumber" class="survey-control" />
                    </div>

                    <div class="survey-box">
                        <label for="documentValidity" id="documentValidity-label">Data de Validade:</label>
                        <br />
                        <input type="date" name="documentValidity" value={familyMemberInfo.documentValidity} disabled={!isEditing} onChange={handleInputChange} id="documentValidity" class="survey-control" />
                    </div>




                    {/*<!-- Número do Registro de Nascimento -->*/}
                    <div class="survey-box">
                        <label for="numberOfBirthRegister" id="numberOfBirthRegister-label">Nº do Registro de Nascimento:</label>
                        <br />
                        <input type="text" name="numberOfBirthRegister" disabled={!isEditing} onChange={handleInputChange} value={familyMemberInfo.numberOfBirthRegister} id="numberOfBirthRegister" class="survey-control" required />
                    </div>

                    {/*<!-- Livro do Registro de Nascimento -->*/}
                    <div class="survey-box">
                        <label for="bookOfBirthRegister" id="bookOfBirthRegister-label">Livro do Registro de Nascimento:</label>
                        <br />
                        <input type="text" name="bookOfBirthRegister" disabled={!isEditing} onChange={handleInputChange} value={familyMemberInfo.bookOfBirthRegister} id="bookOfBirthRegister" class="survey-control" required />
                    </div>

                    {/*<!-- Página do Registro de Nascimento -->*/}
                    <div class="survey-box">
                        <label for="pageOfBirthRegister" id="pageOfBirthRegister-label">Página do Registro de Nascimento:</label>
                        <br />
                        <input type="text" name="pageOfBirthRegister" disabled={!isEditing} onChange={handleInputChange} value={familyMemberInfo.pageOfBirthRegister} id="pageOfBirthRegister" class="survey-control" required />
                    </div>

                </div>}
                <h2>Dados básicos</h2>
                {/*<!-- Estado Civil -->*/}
                <div class="survey-box">
                    <label for="maritalStatus" id="maritalStatus-label">Estado Civil:</label>
                    <br />
                    <select name="maritalStatus" value={familyMemberInfo.maritalStatus} disabled={!isEditing} onChange={handleInputChange} id="maritalStatus" class="select-data">
                        {MARITAL_STATUS.map((type) => <option value={type.value}>{type.label}</option>)}

                    </select>
                </div>

                {/*<!-- Cor da Pele -->*/}
                <div class="survey-box">
                    <label for="skinColor" id="skinColor-label">Cor ou Raça:</label>
                    <br />
                    <select name="skinColor" disabled={!isEditing} onChange={handleInputChange} value={familyMemberInfo.skinColor} id="skinColor" class="select-data">
                        {SkinColor.map((type) => <option value={type.value}>{type.label}</option>)}

                    </select>
                </div>

                {/*<!-- Religião -->*/}
                <div class="survey-box">
                    <label for="religion" id="religion-label">Religião:</label>
                    <br />
                    <select name="religion" value={familyMemberInfo.religion} disabled={!isEditing} onChange={handleInputChange} id="religion" class="select-data">
                        {RELIGION.map((type) => <option value={type.value}>{type.label}</option>)}

                    </select>
                </div>

                {/*<!-- Nível de Educação -->*/}
                <div class="survey-box">
                    <label for="educationLevel" id="educationLevel-label">Nível de Educação:</label>
                    <br />
                    <select name="educationLevel" disabled={!isEditing} onChange={handleInputChange} value={familyMemberInfo.educationLevel} id="educationLevel" class="select-data">
                        {SCHOLARSHIP.map((type) => <option value={type.value}>{type.label}</option>)}

                    </select>
                </div>

                {/*<!-- Necessidades Especiais -->*/}
                <div class="survey-box">
                    <label for="specialNeeds" id="specialNeeds-label">Necessidades Especiais:</label>
                    <br />
                    <input type="checkbox" name="specialNeeds" disabled={!isEditing} onChange={handleInputChange} value={familyMemberInfo.specialNeeds} id="specialNeeds" class="survey-control" />
                </div>
                {familyMemberInfo.specialNeeds && <div>
                    {/*<!-- Descrição das Necessidades Especiais -->*/}
                    <div class="survey-box">
                        <label for="specialNeedsDescription" id="specialNeedsDescription-label">Descrição das Necessidades Especiais:</label>
                        <br />
                        <input type="text" name="specialNeedsDescription" disabled={!isEditing} onChange={handleInputChange} value={familyMemberInfo.specialNeedsDescription} id="specialNeedsDescription" class="survey-control" />
                    </div>


                    {/*<!-- Tem relatório médico -->*/}
                    <div class="survey-box">
                        <label for="hasMedicalReport" id="hasMedicalReport-label">Possui relatório médico:</label>
                        <br />
                        <input type="checkbox" name="hasMedicalReport" disabled={!isEditing} onChange={handleInputChange} value={familyMemberInfo.hasMedicalReport} id="hasMedicalReport" class="survey-control" />
                    </div>
                </div>}

                {/*<!-- Telefone Fixo -->*/}
                <div class="survey-box">
                    <label for="landlinePhone" id="landlinePhone-label">Telefone Fixo:</label>
                    <br />
                    <input type="text" name="landlinePhone" disabled={!isEditing} onChange={handleInputChange} value={familyMemberInfo.landlinePhone} id="landlinePhone" class="survey-control" />
                </div>

                {/*<!-- Telefone de Trabalho -->*/}
                <div class="survey-box">
                    <label for="workPhone" id="workPhone-label">Telefone Alternativo/Recado:</label>
                    <br />
                    <input type="text" name="workPhone" disabled={!isEditing} onChange={handleInputChange} value={familyMemberInfo.workPhone} id="workPhone" class="survey-control" />
                </div>

                {/*<!-- Nome para Contato -->*/}
                <div class="survey-box">
                    <label for="contactNameForMessage" id="contactNameForMessage-label">Nome para Contato:</label>
                    <br />
                    <input type="text" name="contactNameForMessage" disabled={!isEditing} onChange={handleInputChange} value={familyMemberInfo.contactNameForMessage} id="contactNameForMessage" class="survey-control" />
                </div>

                {/*<!-- Email -->*/}
                <div class="survey-box">
                    <label for="email" id="email-label">Email:</label>
                    <br />
                    <input type="email" name="email" value={familyMemberInfo.email} disabled={!isEditing} onChange={handleInputChange} id="email" class="survey-control" required />
                </div>

                {/*<!-- Endereço -->*/}
                <div class="survey-box">
                    <label for="address" id="address-label">Endereço:</label>
                    <br />
                    <input type="text" name="address" value={familyMemberInfo.address} disabled={!isEditing} onChange={handleInputChange} id="address" class="survey-control" required />
                </div>

                {/*<!-- Cidade -->*/}
                <div class="survey-box">
                    <label for="city" id="city-label">Cidade:</label>
                    <br />
                    <input type="text" name="city" value={familyMemberInfo.city} disabled={!isEditing} onChange={handleInputChange} id="city" class="survey-control" required />
                </div>

                {/*<!-- Unidade Federativa -->*/}
                <div class="survey-box">
                    <label for="UF" id="UF-label">Unidade Federativa:</label>
                    <br />
                    <select name="UF" id="UF" value={familyMemberInfo.UF} disabled={!isEditing} onChange={handleInputChange} class="select-data">
                        {COUNTRY.map((type) => <option value={type.value}>{type.label}</option>)}


                    </select>
                </div>

                {/*<!-- CEP -->*/}
                <div class="survey-box">
                    <label for="CEP" id="CEP-label">CEP:</label>
                    <br />
                    <input type="text" name="CEP" value={familyMemberInfo.CEP} disabled={!isEditing} onChange={handleInputChange} id="CEP" class="survey-control" required />
                </div>

                {/*<!-- Bairro -->*/}
                <div class="survey-box">
                    <label for="neighborhood" id="neighborhood-label">Bairro:</label>
                    <br />
                    <input type="text" name="neighborhood" value={familyMemberInfo.neighborhood} disabled={!isEditing} onChange={handleInputChange} id="neighborhood" class="survey-control" required />
                </div>

                {/*<!-- Número de Endereço -->*/}
                <div class="survey-box">
                    <label for="addressNumber" id="addressNumber-label">Número de Endereço:</label>
                    <br />
                    <input type="number" name="addressNumber" value={familyMemberInfo.addressNumber} disabled={!isEditing} onChange={handleInputChange} id="addressNumber" class="survey-control" required />
                </div>

                {/*<!-- Profissão -->*/}
                <div class="survey-box">
                    <label for="profession" id="profession-label">Profissão:</label>
                    <br />
                    <input type="text" name="profession" value={familyMemberInfo.profession} disabled={!isEditing} onChange={handleInputChange} id="profession" class="survey-control" required />
                </div>

                {/*<!-- Inscrito em Programa Governamental -->*/}
                <div class="survey-box">
                    <label for="enrolledGovernmentProgram" id="enrolledGovernmentProgram-label">Inscrito em Programa Governamental:</label>
                    <br />
                    <input type="checkbox" name="enrolledGovernmentProgram" value={familyMemberInfo.enrolledGovernmentProgram} disabled={!isEditing} onChange={handleInputChange} id="enrolledGovernmentProgram" class="survey-control" />
                </div>

                {familyMemberInfo.enrolledGovernmentProgram === true && <div>
                    {/*<!-- NIS -->*/}
                    <div class="survey-box">
                        <label for="NIS" id="NIS-label">NIS:</label>
                        <br />
                        <input type="text" name="NIS" value={familyMemberInfo.NIS} disabled={!isEditing} onChange={handleInputChange} id="NIS" class="survey-control" />
                    </div>

                </div>}
                <div class="survey-box">
                    <label for="incomeSource" id="incomeSource-label">Fonte(s) de renda:</label>
                    <br />
                    <Select
                        name="incomeSource"
                        isMulti
                        isDisabled={!isEditing} // Remova esta linha se o campo não deve ser desabilitado
                        onChange={handleInputChangeSelect}
                        value={IncomeSource.filter(obj => familyMemberInfo.incomeSource.includes(obj.value))}
                        options={IncomeSource}
                        className="select-data"
                        id="incomeSource"
                    />
                </div>

                <div className="survey-box">
                    {!isEditing ? (
                        <button className="over-button" type="button" onClick={toggleEdit}>Editar</button>
                    ) : (
                        <>
                            <button className="over-button" type="button" onClick={saveFamilyMemberInfoData}>Salvar Dados</button>
                            <button  className="over-button"type="button" onClick={toggleEdit}>Cancelar</button>
                        </>
                    )}
                </div>


            </form>
        </div></div>
    )
}

