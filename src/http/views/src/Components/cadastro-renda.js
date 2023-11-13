import React, { useEffect } from 'react'
import './Familia/cadastroFamiliar.css'
import { useState } from 'react';
import { api } from '../services/axios';
import FamilyMember from './family-member';


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
export default function CadastroRenda() {

    const [familyMemberIncome, setFamilyMemberIncome] = useState({
        relationship: '', // deve ser inicializado com um dos valores do enum Relationship
        otherRelationship: '',
        fullName: '',
        socialName: '',
        birthDate: '',
        gender: '', // deve ser inicializado com um dos valores do enum GENDER
        nationality: '',
        natural_city: '',
        natural_UF: '', // deve ser inicializado com um dos valores do enum COUNTRY
        CPF: '',
        RG: '',
        rgIssuingAuthority: '',
        rgIssuingState: '', // deve ser inicializado com um dos valores do enum COUNTRY
        documentType: '', // deve ser inicializado com um dos valores do enum DOCUMENT_TYPE ou null
        documentNumber: '',
        documentValidity: '',
        numberOfBirthRegister: '',
        bookOfBirthRegister: '',
        pageOfBirthRegister: '',
        maritalStatus: '', // deve ser inicializado com um dos valores do enum MARITAL_STATUS
        skinColor: '', // deve ser inicializado com um dos valores do enum SkinColor
        religion: '', // deve ser inicializado com um dos valores do enum RELIGION
        educationLevel: '', // deve ser inicializado com um dos valores do enum SCHOLARSHIP
        specialNeeds: false,
        specialNeedsDescription: '',
        hasMedicalReport: false,
        landlinePhone: '',
        workPhone: '',
        contactNameForMessage: '',
        email: '',
        address: '',
        city: '',
        UF: '', // deve ser inicializado com um dos valores do enum COUNTRY
        CEP: '',
        neighborhood: '',
        addressNumber: 0, // Iniciar com um número inteiro
        profession: '',
        enrolledGovernmentProgram: false,
        NIS: '',
        educationPlace: 'Public', // Iniciar como null ou um dos valores do enum Institution_Type
        institutionName: 'car',
        coursingEducationLevel: 'asa', // Iniciar como null ou um dos valores do enum Education_Type
        cycleOfEducation: '322',
        turnOfEducation: 'Matutino', // Iniciar como null ou um dos valores do enum SHIFT
        hasScholarship: false,
        percentageOfScholarship: '300',
        monthlyAmount: '500',
        incomeSource: []
    });

    function handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        if (event.target.multiple) {
            const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
            setFamilyMemberIncome(prevState => ({
                ...prevState,
                [name]: selectedOptions
            }));
        } else {
          setFamilyMemberIncome(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
        console.log('====================================');
        console.log(familyMemberIncome);
        console.log('====================================');
    }

    const [familyMembers, setFamilyMembers] = useState()
    const [showRegisterFields,setShowRegisterFields] = useState()

    function handleShowRegisterFields() {
      if(showRegisterFields === 'show') {
        setShowRegisterFields('hide')
      } else if(showRegisterFields === 'hide') {
        setShowRegisterFields('show')
      }
    }

    useEffect(() => {
      async function getFamilyMembers() {
        try{
          const token = localStorage.getItem('token')
          const response = await api.get('/candidates/family-member', {
            headers: {
                'authorization': `Bearer ${token}`,
            }
        })
        console.log(response.data.familyMembers)
        setFamilyMembers(response.data.familyMembers)

        } catch(err) {
          console.log(err)
        }
      }
      getFamilyMembers()
    },[])

    async function RegisterFamilyMemberIncome(e) {
        e.preventDefault()
        const token = localStorage.getItem('token');
        const data = {
            relationship: familyMemberIncome.relationship, // deve ser inicializado com um dos valores do enum Relationship
            otherRelationship: familyMemberIncome.otherRelationship ||'Vô',
            fullName: familyMemberIncome.fullName,
            socialName: familyMemberIncome.socialName,
            birthDate: familyMemberIncome.birthDate,
            gender: familyMemberIncome.gender, // deve ser inicializado com um dos valores do enum GENDER
            nationality: familyMemberIncome.nationality,
            natural_city: familyMemberIncome.natural_city,
            natural_UF: familyMemberIncome.natural_UF, // deve ser inicializado com um dos valores do enum COUNTRY
            CPF: familyMemberIncome.CPF, // deve ser inicializado com um,
            RG: familyMemberIncome.RG, // deve ser inicializ,
            rgIssuingAuthority: familyMemberIncome.rgIssuingAuthority,
            rgIssuingState: familyMemberIncome.rgIssuingState, // deve ser inicializado com um dos valores do enum COUNTRY
            documentType: familyMemberIncome.documentType || 'DriversLicense', // deve ser inicializado com um dos valores do enum DOCUMENT_TYPE ou null
            documentNumber: familyMemberIncome.documentNumber || '222',
            documentValidity: familyMemberIncome.documentValidity || '2003-06-18', // deve ser in
            numberOfBirthRegister: familyMemberIncome.numberOfBirthRegister || '222',
            bookOfBirthRegister: familyMemberIncome.bookOfBirthRegister || '212',
            pageOfBirthRegister: familyMemberIncome.pageOfBirthRegister || '1231',
            maritalStatus: familyMemberIncome.maritalStatus, // deve ser inicializado com um dos valores do enum MARITAL_STATUS
            skinColor: familyMemberIncome.skinColor, // deve ser inicializado com um dos valores do enum SkinColor
            religion: familyMemberIncome.religion, // deve ser inicializado com um dos valores do enum RELIGION
            educationLevel: familyMemberIncome.educationLevel, // deve ser inicializado com um dos valores do enum SCHOLARSHIP
            specialNeeds: familyMemberIncome.specialNeeds,
            specialNeedsDescription: familyMemberIncome.specialNeedsDescription,
            hasMedicalReport: familyMemberIncome.hasMedicalReport,
            landlinePhone: familyMemberIncome.landlinePhone,
            workPhone: familyMemberIncome.workPhone,
            contactNameForMessage: familyMemberIncome.contactNameForMessage,
            email: familyMemberIncome.email,
            address: familyMemberIncome.address,
            city: familyMemberIncome.city,
            UF: familyMemberIncome.UF, // deve ser inicializado com um dos valores do enum COUNTRY
            CEP: familyMemberIncome.CEP,
            neighborhood: familyMemberIncome.neighborhood,
            addressNumber: familyMemberIncome.addressNumber, // Iniciar com um número inteiro
            profession: familyMemberIncome.profession,
            enrolledGovernmentProgram: familyMemberIncome.enrolledGovernmentProgram,
            NIS: familyMemberIncome.NIS,
            educationPlace: 'null9oo', // Iniciar como null ou um dos valores do enum Institution_Type
            institutionName: 'nullooo',
            coursingEducationLevel: 'Alfabetizacao', // Iniciar como null ou um dos valores do enum Education_Type
            cycleOfEducation: '332',
            turnOfEducation: 'Matutino', // Iniciar como null ou um dos valores do enum SHIFT
            hasScholarship: false,
            percentageOfScholarship: '500',
            monthlyAmount: '544',
            incomeSource: familyMemberIncome.incomeSource
        }

        console.log(data)

        try {
            const response = await api.post('/candidates/family-member', {
                relationship: familyMemberIncome.relationship, // deve ser inicializado com um dos valores do enum Relationship
                otherRelationship: familyMemberIncome.otherRelationship ||'Vô',
                fullName: familyMemberIncome.fullName,
                socialName: familyMemberIncome.socialName,
                birthDate: familyMemberIncome.birthDate,
                gender: familyMemberIncome.gender, // deve ser inicializado com um dos valores do enum GENDER
                nationality: familyMemberIncome.nationality,
                natural_city: familyMemberIncome.natural_city,
                natural_UF: familyMemberIncome.natural_UF, // deve ser inicializado com um dos valores do enum COUNTRY
                CPF: familyMemberIncome.CPF, // deve ser inicializado com um,
                RG: familyMemberIncome.RG, // deve ser inicializ,
                rgIssuingAuthority: familyMemberIncome.rgIssuingAuthority,
                rgIssuingState: familyMemberIncome.rgIssuingState, // deve ser inicializado com um dos valores do enum COUNTRY
                documentType: familyMemberIncome.documentType || 'DriversLicense', // deve ser inicializado com um dos valores do enum DOCUMENT_TYPE ou null
                documentNumber: familyMemberIncome.documentNumber || '222',
                documentValidity: familyMemberIncome.documentValidity || '2003-06-18', // deve ser in
                numberOfBirthRegister: familyMemberIncome.numberOfBirthRegister || '222',
                bookOfBirthRegister: familyMemberIncome.bookOfBirthRegister || '212',
                pageOfBirthRegister: familyMemberIncome.pageOfBirthRegister || '1231',
                maritalStatus: familyMemberIncome.maritalStatus, // deve ser inicializado com um dos valores do enum MARITAL_STATUS
                skinColor: familyMemberIncome.skinColor, // deve ser inicializado com um dos valores do enum SkinColor
                religion: familyMemberIncome.religion, // deve ser inicializado com um dos valores do enum RELIGION
                educationLevel: familyMemberIncome.educationLevel, // deve ser inicializado com um dos valores do enum SCHOLARSHIP
                specialNeeds: familyMemberIncome.specialNeeds,
                specialNeedsDescription: familyMemberIncome.specialNeedsDescription,
                hasMedicalReport: familyMemberIncome.hasMedicalReport,
                landlinePhone: familyMemberIncome.landlinePhone,
                workPhone: familyMemberIncome.workPhone,
                contactNameForMessage: familyMemberIncome.contactNameForMessage,
                email: familyMemberIncome.email,
                address: familyMemberIncome.address,
                city: familyMemberIncome.city,
                UF: familyMemberIncome.UF, // deve ser inicializado com um dos valores do enum COUNTRY
                CEP: familyMemberIncome.CEP,
                neighborhood: familyMemberIncome.neighborhood,
                addressNumber: Number(familyMemberIncome.addressNumber), // Iniciar com um número inteiro
                profession: familyMemberIncome.profession,
                enrolledGovernmentProgram: familyMemberIncome.enrolledGovernmentProgram,
                NIS: familyMemberIncome.NIS,
                incomeSource: familyMemberIncome.incomeSource
            }, {
                headers: {
                    'authorization': `Bearer ${token}`,
                }
            })
            console.log('====================================');
            console.log(response.status);
            console.log('====================================');
        }
        catch (error) {
            alert(error.issues);
        }
    }

    return (
      <div> Teste
      {familyMembers && familyMembers.length > 0 ? familyMembers.map((familyMember) => {
        return (
        <div className='container-info'>
          <FamilyMember name={familyMember.fullName} relationship={familyMember.relationship} key={familyMember.id}/>
          <button type='button' onClick={handleShowRegisterFields}>Cadastrar Renda</button>
        </div>
        )
      }) : ""}
      
      </div>
    )
}

