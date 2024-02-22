import React from 'react'
import '../Familia/cadastroFamiliar.css'
import { useState } from 'react';
import { api } from '../../services/axios';


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

const ScholarshipType = [
    { value: 'integralScholarchip', label: 'Tempo Integral' },
    { value: 'halfScholarchip', label: 'Meio Período' },
]

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

export default function VerBasico({ candidate }) {

    const [candidateInfo, setCandidateInfo] = useState(candidate);
    // Estado para controlar o modo de edição
    const [isEditing, setIsEditing] = useState(false);

    function handleInputChange(event) {
        const { name, value, type, checked } = event.target;
        setCandidateInfo(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    }

    function toggleEdit() {
        setIsEditing(!isEditing); // Alterna o estado de edição
    }

    async function saveCandidateInfoData() {
        // Aqui você implementaria o código para enviar os dados para o backend
        // Exemplo:
        const token =  localStorage.getItem('token');
        try {
            const response = await api.patch("/candidates/identity-info", candidateInfo, {
              headers: {
                authorization: `Bearer ${token}`,
              },
            });
            console.log("====================================");
            console.log(response.status);
            console.log("====================================");
            alert("Dados cadastrados com sucesso!");
          } catch (error) {
            console.log(error);
            alert(error.response.data.message);
          }
        console.log('Dados salvos', candidateInfo);
        setIsEditing(false); // Desabilita o modo de edição após salvar
    }

    async function RegisterCandidateInfoBasicInfo(e) {
        /*
        e.preventDefault()
        const token = localStorage.getItem('token');
        const data = {
          fullName: candidateInfo.fullName,
          socialName: candidateInfo.socialName,
          birthDate: candidateInfo.birthDate,
          gender: candidateInfo.gender,
          nationality: candidateInfo.nationality,
          natural_city: candidateInfo.natural_city,
          natural_UF: candidateInfo.natural_UF,
          RG: candidateInfo.RG,
          rgIssuingAuthority: candidateInfo.rgIssuingAuthority,
          rgIssuingState: candidateInfo.rgIssuingState,
          documentType: candidateInfo.documentType || undefined,
          documentNumber: candidateInfo.documentNumber|| undefined,
          documentValidity: candidateInfo.documentValidity|| undefined,
          maritalStatus: candidateInfo.maritalStatus,
          skinColor: candidateInfo.skinColor,
          religion: candidateInfo.religion,
          educationLevel: candidateInfo.educationLevel,
          specialNeeds: candidateInfo.specialNeeds,
          specialNeedsDescription: candidateInfo.specialNeedsDescription,
          hasMedicalReport: candidateInfo.hasMedicalReport,
          landlinePhone: candidateInfo.landlinePhone,
          workPhone: candidateInfo.workPhone,
          contactNameForMessage: candidateInfo.contactNameForMessage,
          profession: candidateInfo.profession,
          enrolledGovernmentProgram: candidateInfo.enrolledGovernmentProgram,
          NIS: candidateInfo.NIS,
          incomeSource: candidateInfo.incomeSource,
          livesAlone: candidateInfo.livesAlone,
          intendsToGetScholarship: candidateInfo.intendsToGetScholarship,
          attendedPublicHighSchool: candidateInfo.attendedPublicHighSchool,
          benefitedFromCebasScholarship_basic: candidateInfo.benefitedFromCebasScholarship_basic,
          yearsBenefitedFromCebas_basic: candidateInfo.yearsBenefitedFromCebas_basic,
          scholarshipType_basic: candidateInfo.scholarshipType_basic|| undefined,
          institutionName_basic: candidateInfo.institutionName_basic,
          institutionCNPJ_basic: candidateInfo.institutionCNPJ_basic,
          benefitedFromCebasScholarship_professional: candidateInfo.benefitedFromCebasScholarship_professional,
          lastYearBenefitedFromCebas_professional: candidateInfo.lastYearBenefitedFromCebas_professional,
          scholarshipType_professional: candidateInfo.scholarshipType_professional|| undefined,
          institutionName_professional: candidateInfo.institutionName_professional,
          institutionCNPJ_professional: candidateInfo.institutionCNPJ_professional,
          nameOfScholarshipCourse_professional: candidateInfo.nameOfScholarshipCourse_professional|| undefined,
        };

        console.log(data)

        try {
            const response = await api.post('/candidateInfos/identity-info', data, {
                headers: {
                    'authorization': `Bearer ${token}`,
                }
            })
            console.log('====================================');
            console.log(response.status);
            console.log('====================================');
        }
        catch (error) {
          console.log(error)
          alert(error.response.data.message);
        }*/
    }

    return (
        <div><div className="fill-box">
            <form id="survey-form">
                {/* Nome Completo */}
                <div class="survey-box">
                    <label for="fullName" id="fullName-label">Nome Completo:</label>
                    <br />
                    <input type="text" name="fullName" value={candidateInfo.fullName} disabled={!isEditing} onChange={handleInputChange} id="fullName" class="survey-control" required />
                </div>
                {/* Nome Social */}
                <div class="survey-box">
                    <label for="socialName" id="socialName-label">Nome Social:</label>
                    <br />
                    <input type="text" name="socialName" value={candidateInfo.socialName} disabled={!isEditing} onChange={handleInputChange} id="socialName" class="survey-control" />
                </div>
                {/* Data de Nascimento */}
                <div class="survey-box">
                    <label for="birthDate" id="birthDate-label">Data de Nascimento:</label>
                    <br />
                    <input type="date" name="birthDate" value={candidateInfo.birthDate.split('T')[0]} disabled={!isEditing} onChange={handleInputChange} id="birthDate" class="survey-control" required />
                </div>
                {/* Sexo */}
                <div class="survey-box">
                    <label for="gender" id="gender-label">Sexo:</label>
                    <br />
                    <select name="gender" id="gender" value={candidateInfo.gender} disabled={!isEditing} onChange={handleInputChange} class="select-data" required>
                        <option value="undefined">Escolha o Sexo</option>
                        {GENDER.map((type) => <option value={type.value}>{type.label}</option>)}
                    </select>
                </div>
                {/* Nacionalidade */}
                <div class="survey-box">
                    <label for="nationality" id="nationality-label">Nacionalidade:</label>
                    <br />
                    <input type="text" name="nationality" disabled={!isEditing} onChange={handleInputChange} value={candidateInfo.nationality} id="nationality" class="survey-control" required />
                </div>
                {/* Cidade de Nascimento */}
                <div class="survey-box">
                    <label for="natural_city" id="natural_city-label">Cidade Natal:</label>
                    <br />
                    <input type="text" name="natural_city" value={candidateInfo.natural_city} disabled={!isEditing} onChange={handleInputChange} id="natural_city" class="survey-control" required />
                </div>
                {/* Estado de nascimento */}
                <div class="survey-box">
                    <label for="natural_UF" id="natural_UF-label">Unidade Federativa:</label>
                    <br />
                    <select name="natural_UF" disabled={!isEditing} onChange={handleInputChange} value={candidateInfo.natural_UF} id="natural_UF" class="select-data">
                        <option value="undefined">Escolha o Estado</option>
                        {COUNTRY.map((type) => <option value={type.value}>{type.label}</option>)}
                    </select>
                </div>
                {/* RG */}
                <div class="survey-box">
                    <label for="RG" id="RG-label">RG:</label>
                    <br />
                    <input type="text" name="RG" value={candidateInfo.RG} disabled={!isEditing} onChange={handleInputChange} id="RG" class="survey-control" required />
                </div>
                {/* Orgão Emissor do RG */}
                <div class="survey-box">
                    <label for="rgIssuingAuthority" id="rgIssuingAuthority-label">Órgão Emissor do RG:</label>
                    <br />
                    <input type="text" name="rgIssuingAuthority" value={candidateInfo.rgIssuingAuthority} disabled={!isEditing} onChange={handleInputChange} id="rgIssuingAuthority" class="survey-control" required />
                </div>
                {/* Estado do RG emitido */}
                <div class="survey-box">
                    <label for="rgIssuingState" id="rgIssuingState-label">Estado do Órgão Emissor do RG:</label>
                    <br />
                    <select name="rgIssuingState" value={candidateInfo.rgIssuingState} disabled={!isEditing} onChange={handleInputChange} id="rgIssuingState" class="select-data">
                        <option value="undefined">Estado do RG</option>
                        {COUNTRY.map((type) => <option value={type.value}>{type.label}</option>)}
                    </select>
                </div>
                {/* Documento Adicional */}
                {!candidateInfo.RG && <div>
                    {/* Tipo do documento adicional */}
                    <div class="survey-box">
                        <label for="documentType" id="documentType-label">Tipo de Documento Adicional:</label>
                        <br />
                        <select name="documentType" disabled={!isEditing} onChange={handleInputChange} value={candidateInfo.documentType} id="documentType" class="select-data">
                            {DOCUMENT_TYPE.map((type) => <option value={type.value}>{type.label}</option>)}
                        </select>
                    </div>
                    {/* Número do documento adicional */}
                    <div class="survey-box">
                        <label for="documentNumber" id="documentNumber-label">Número do Documento:</label>
                        <br />
                        <input type="text" name="documentNumber" value={candidateInfo.documentNumber} disabled={!isEditing} onChange={handleInputChange} id="documentNumber" class="survey-control" />
                    </div>
                    {/* Validade do documento adicional */}
                    <div class="survey-box">
                        <label for="documentValidity" id="documentValidity-label">Data de Validade:</label>
                        <br />
                        <input type="date" name="documentValidity" value={candidateInfo.documentValidity} disabled={!isEditing} onChange={handleInputChange} id="documentValidity" class="survey-control" />
                    </div>




                    {/*<!-- Número do Registro de Nascimento -->*/}
                    <div class="survey-box">
                        <label for="numberOfBirthRegister" id="numberOfBirthRegister-label">Nº do Registro de Nascimento:</label>
                        <br />
                        <input type="text" name="numberOfBirthRegister" disabled={!isEditing} onChange={handleInputChange} value={candidateInfo.numberOfBirthRegister} id="numberOfBirthRegister" class="survey-control" required />
                    </div>

                    {/*<!-- Livro do Registro de Nascimento -->*/}
                    <div class="survey-box">
                        <label for="bookOfBirthRegister" id="bookOfBirthRegister-label">Livro do Registro de Nascimento:</label>
                        <br />
                        <input type="text" name="bookOfBirthRegister" disabled={!isEditing} onChange={handleInputChange} value={candidateInfo.bookOfBirthRegister} id="bookOfBirthRegister" class="survey-control" required />
                    </div>

                    {/*<!-- Página do Registro de Nascimento -->*/}
                    <div class="survey-box">
                        <label for="pageOfBirthRegister" id="pageOfBirthRegister-label">Página do Registro de Nascimento:</label>
                        <br />
                        <input type="text" name="pageOfBirthRegister" disabled={!isEditing} onChange={handleInputChange} value={candidateInfo.pageOfBirthRegister} id="pageOfBirthRegister" class="survey-control" required />
                    </div>

                </div>}
                {/*<!-- Estado Civil -->*/}
                <div class="survey-box">
                    <label for="maritalStatus" id="maritalStatus-label">Estado Civil:</label>
                    <br />
                    <select name="maritalStatus" value={candidateInfo.maritalStatus} disabled={!isEditing} onChange={handleInputChange} id="maritalStatus" class="select-data">
                        <option value="undefined">Escolha o Estado Civil</option>
                        {MARITAL_STATUS.map((type) => <option value={type.value}>{type.label}</option>)}
                    </select>
                </div>

                {/*<!-- Cor da Pele -->*/}
                <div class="survey-box">
                    <label for="skinColor" id="skinColor-label">Cor da Pele:</label>
                    <br />
                    <select name="skinColor" disabled={!isEditing} onChange={handleInputChange} value={candidateInfo.skinColor} id="skinColor" class="select-data">
                        <option value="undefined">Escolha a Cor de Pele</option>
                        {SkinColor.map((type) => <option value={type.value}>{type.label}</option>)}
                    </select>
                </div>

                {/*<!-- Religião -->*/}
                <div class="survey-box">
                    <label for="religion" id="religion-label">Religião:</label>
                    <br />
                    <select name="religion" value={candidateInfo.religion} disabled={!isEditing} onChange={handleInputChange} id="religion" class="select-data">
                        <option value="undefined">Escolha sua Religião</option>
                        {RELIGION.map((type) => <option value={type.value}>{type.label}</option>)}
                    </select>
                </div>

                {/*<!-- Nível de Educação -->*/}
                <div class="survey-box">
                    <label for="educationLevel" id="educationLevel-label">Nível de Educação:</label>
                    <br />
                    <select name="educationLevel" disabled={!isEditing} onChange={handleInputChange} value={candidateInfo.educationLevel} id="educationLevel" class="select-data">
                        <option value="undefined">Escolha seu nível de Educação</option>
                        {SCHOLARSHIP.map((type) => <option value={type.value}>{type.label}</option>)}
                    </select>
                </div>

                {/*<!-- Necessidades Especiais -->*/}
                <div class="survey-box">
                    <label for="specialNeeds" id="specialNeeds-label">Necessidades Especiais:</label>
                    <br />
                    <input type="checkbox" name="specialNeeds" disabled={!isEditing} onChange={handleInputChange} value={candidateInfo.specialNeeds} id="specialNeeds" class="survey-control" />
                </div>
                {candidateInfo.specialNeeds && <div>
                    {/*<!-- Descrição das Necessidades Especiais -->*/}
                    <div class="survey-box">
                        <label for="specialNeedsDescription" id="specialNeedsDescription-label">Descrição das Necessidades Especiais:</label>
                        <br />
                        <input type="text" name="specialNeedsDescription" disabled={!isEditing} onChange={handleInputChange} value={candidateInfo.specialNeedsDescription} id="specialNeedsDescription" class="survey-control" />
                    </div>


                    {/*<!-- Tem relatório médico -->*/}
                    <div class="survey-box">
                        <label for="hasMedicalReport" id="hasMedicalReport-label">Possui relatório médico:</label>
                        <br />
                        <input type="checkbox" name="hasMedicalReport" disabled={!isEditing} onChange={handleInputChange} value={candidateInfo.hasMedicalReport} id="hasMedicalReport" class="survey-control" />
                    </div>
                </div>}

                {/*<!-- Telefone Fixo -->*/}
                <div class="survey-box">
                    <label for="landlinePhone" id="landlinePhone-label">Telefone Fixo:</label>
                    <br />
                    <input type="text" name="landlinePhone" disabled={!isEditing} onChange={handleInputChange} value={candidateInfo.landlinePhone} id="landlinePhone" class="survey-control" />
                </div>

                {/*<!-- Telefone de Trabalho -->*/}
                <div class="survey-box">
                    <label for="workPhone" id="workPhone-label">Telefone de Trabalho:</label>
                    <br />
                    <input type="text" name="workPhone" disabled={!isEditing} onChange={handleInputChange} value={candidateInfo.workPhone} id="workPhone" class="survey-control" />
                </div>

                {/*<!-- Nome para Contato -->*/}
                <div class="survey-box">
                    <label for="contactNameForMessage" id="contactNameForMessage-label">Nome para Contato:</label>
                    <br />
                    <input type="text" name="contactNameForMessage" disabled={!isEditing} onChange={handleInputChange} value={candidateInfo.contactNameForMessage} id="contactNameForMessage" class="survey-control" />
                </div>

                {/*<!-- Profissão -->*/}
                <div class="survey-box">
                    <label for="profession" id="profession-label">Profissão:</label>
                    <br />
                    <input type="text" name="profession" value={candidateInfo.profession} disabled={!isEditing} onChange={handleInputChange} id="profession" class="survey-control" required />
                </div>

                {/*<!-- Inscrito em Programa Governamental -->*/}
                <div class="survey-box">
                    <label for="enrolledGovernmentProgram" id="enrolledGovernmentProgram-label">Inscrito em Programa Governamental:</label>
                    <br />
                    <input type="checkbox" name="enrolledGovernmentProgram" value={candidateInfo.enrolledGovernmentProgram} disabled={!isEditing} onChange={handleInputChange} id="enrolledGovernmentProgram" class="survey-control" />
                </div>

                {candidateInfo.enrolledGovernmentProgram === true && <div>
                    {/*<!-- NIS -->*/}
                    <div class="survey-box">
                        <label for="NIS" id="NIS-label">NIS:</label>
                        <br />
                        <input type="text" name="NIS" value={candidateInfo.NIS} disabled={!isEditing} onChange={handleInputChange} id="NIS" class="survey-control" />
                    </div>

                </div>}
                {/* Fonte de Renda  */}
                <div class="survey-box">
                    <label for="incomeSource" id="incomeSource-label">Fonte(s) de renda:</label>
                    <br />
                    <select name="incomeSource" multiple disabled={!isEditing} onChange={handleInputChange} value={candidateInfo.incomeSource} id="incomeSource" class="select-data">
                        {IncomeSource.map((type) => <option value={type.value}>{type.label}</option>)}
                    </select>
                </div>

                {/*<!-- Mora Sozinho ? -->*/}
                <div class="survey-box">
                    <label for="livesAlone" id="livesAlone-label">Mora Sozinho ?</label>
                    <br />
                    <input type="checkbox" name="livesAlone" value={candidateInfo.livesAlone} disabled={!isEditing} onChange={handleInputChange} id="livesAlone" class="survey-control" />
                </div>
                <div class="survey-box">
                    <label for="livesAlone" id="livesAlone-label">Familia registrada no Cadastro Único?</label>
                    <br />
                    <input type="checkbox" name="CadUnico" checked={candidateInfo.CadUnico} disabled={!isEditing} onChange={handleInputChange} id="livesAlone" class="survey-control" />
                </div>
                {/*<!-- Deseja Obter Bolsa Escolar ? -->*/}
                <div class="survey-box">
                    <label for="intendsToGetScholarship" id="intendsToGetScholarship-label">Deseja obter bolsa Escolar ?</label>
                    <br />
                    <input type="checkbox" name="intendsToGetScholarship" value={candidateInfo.intendsToGetScholarship} disabled={!isEditing} onChange={handleInputChange} id="intendsToGetScholarship" class="survey-control" />
                </div>

                {/*<!-- Estudou em Instituição Pública ? -->*/}
                <div class="survey-box">
                    <label for="attendedPublicHighSchool" id="attendedPublicHighSchool-label">Estudou em Instituição Pública ?</label>
                    <br />
                    <input type="checkbox" name="attendedPublicHighSchool" value={candidateInfo.attendedPublicHighSchool} disabled={!isEditing} onChange={handleInputChange} id="attendedPublicHighSchool" class="survey-control" required />
                </div>

                {/*<!-- Já recebeu bolsa CEBAS para educação Básica ? -->*/}
                <div class="survey-box">
                    <label for="benefitedFromCebasScholarship_basic" id="benefitedFromCebasScholarship_basic-label">Já recebeu bolsa CEBAS para Educação Básica ?</label>
                    <br />
                    <input type="checkbox" name="benefitedFromCebasScholarship_basic" value={candidateInfo.benefitedFromCebasScholarship_basic} disabled={!isEditing} onChange={handleInputChange} id="benefitedFromCebasScholarship_basic" class="survey-control" required />
                </div>

                {candidateInfo.benefitedFromCebasScholarship_basic && <div>
                    <div class="survey-box">
                        <label for="yearsBenefitedFromCebas_basic" id="yearsBenefitedFromCebas_basic-label">Anos em que recebeu bolsa CEBAS:</label>
                        <br />
                        <input type="text" name="yearsBenefitedFromCebas_basic" value={candidateInfo.yearsBenefitedFromCebas_basic} disabled={!isEditing} onChange={handleInputChange} id="yearsBenefitedFromCebas_basic" class="survey-control" />
                    </div>
                    {/*<!-- Tipo de Escolaridade (Básica) -->*/}
                    <div class="survey-box">
                        <label for="scholarshipType_basic" id="scholarshipType_basic-label">Tipo de Educação Básica:</label>
                        <br />
                        <select name="scholarshipType_basic" disabled={!isEditing} onChange={handleInputChange} value={candidateInfo.scholarshipType_basic} id="scholarshipType_basic" class="select-data">
                            {ScholarshipType.map((type) => <option value={type.value}>{type.label}</option>)}
                        </select>
                    </div>
                    {/*<!-- Nome da Instituição (Básica): -->*/}
                    <div class="survey-box">
                        <label for="institutionName_basic" id="institutionName_basic-label">Nome da Instituição:</label>
                        <br />
                        <input type="text" name="institutionName_basic" value={candidateInfo.institutionName_basic} disabled={!isEditing} onChange={handleInputChange} id="institutionName_basic" class="survey-control" required />
                    </div>

                    {/*<!-- CNPJ da Instituição (Básica):-->*/}
                    <div class="survey-box">
                        <label for="institutionCNPJ_basic" id="institutionCNPJ_basic-label">CNPJ da Instituição:</label>
                        <br />
                        <input type="text" name="institutionCNPJ_basic" value={candidateInfo.institutionCNPJ_basic} disabled={!isEditing} onChange={handleInputChange} id="institutionCNPJ_basic" class="survey-control" required />
                    </div>
                </div>
                }

                {/*<!-- Já recebeu bolsa CEBAS para educação profissional ? -->*/}
                <div class="survey-box">
                    <label for="benefitedFromCebasScholarship_professional" id="benefitedFromCebasScholarship_professional-label">Já recebeu bolsa CEBAS para Educação Profissional ?</label>
                    <br />
                    <input type="checkbox" name="benefitedFromCebasScholarship_professional" value={candidateInfo.benefitedFromCebasScholarship_professional} disabled={!isEditing} onChange={handleInputChange} id="benefitedFromCebasScholarship_basic" class="survey-control" required />
                </div>
                {candidateInfo.benefitedFromCebasScholarship_professional && <div>
                    <div class="survey-box">
                        <label for="lastYearBenefitedFromCebas_professional" id="lastYearBenefitedFromCebas_professional-label">Último ano que recebu bolsa CEBAS:</label>
                        <br />
                        <input type="text" name="lastYearBenefitedFromCebas_professional" value={candidateInfo.lastYearBenefitedFromCebas_professional} disabled={!isEditing} onChange={handleInputChange} id="lastYearBenefitedFromCebas_professional" class="survey-control" />
                    </div>

                    {/*<!-- Tipo de Escolaridade (Profissional) -->*/}
                    <div class="survey-box">
                        <label for="scholarshipType_professional" id="scholarshipType_professional-label">Tipo de Educação Profissional:</label>
                        <br />
                        <select name="scholarshipType_professional" disabled={!isEditing} onChange={handleInputChange} value={candidateInfo.scholarshipType_professional} id="scholarshipType_basic" class="select-data">
                            {ScholarshipType.map((type) => <option value={type.value}>{type.label}</option>)}
                        </select>
                    </div>
                    {/*<!-- Nome da Instituição (Profissional): -->*/}
                    <div class="survey-box">
                        <label for="institutionName_professional" id="institutionName_professional-label">Nome da Instituição:</label>
                        <br />
                        <input type="text" name="institutionName_professional" value={candidateInfo.institutionName_professional} disabled={!isEditing} onChange={handleInputChange} id="institutionName_professional" class="survey-control" required />
                    </div>

                    {/*<!-- CNPJ da Instituição (Profissional):-->*/}
                    <div class="survey-box">
                        <label for="institutionCNPJ_professional" id="institutionCNPJ_professional-label">CNPJ da Instituição:</label>
                        <br />
                        <input type="text" name="institutionCNPJ_professional" value={candidateInfo.institutionCNPJ_professional} disabled={!isEditing} onChange={handleInputChange} id="institutionCNPJ_professional" class="survey-control" required />
                    </div>
                    {/*<!-- Nome do Curso (Profissional):-->*/}
                    <div class="survey-box">
                        <label for="nameOfScholarshipCourse_professional" id="nameOfScholarshipCourse_professional-label">Nome do Curso:</label>
                        <br />
                        <input type="text" name="nameOfScholarshipCourse_professional" value={candidateInfo.nameOfScholarshipCourse_professional} disabled={!isEditing} onChange={handleInputChange} id="nameOfScholarshipCourse_professional" class="survey-control" required />
                    </div>
                </div>

                }

                <div className="survey-box">
                    {!isEditing ? (
                        <button className="over-button" type="button" onClick={toggleEdit}>Editar</button>
                    ) : (
                        <>
                            <button className="over-button" type="button" onClick={saveCandidateInfoData}>Salvar Dados</button>
                            <button  className="over-button"type="button" onClick={toggleEdit}>Cancelar</button>
                        </>
                    )}
                </div>


            </form>
        </div></div>
    )
}

