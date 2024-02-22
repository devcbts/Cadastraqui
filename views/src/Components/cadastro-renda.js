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
export const CadastroRenda = ({  member  }) => {

    function translateRelationship(relationshipValue) {
        const relationship = Relationship.find(
          (r) => r.value === relationshipValue
        );
        return relationship ? relationship.label : "Não especificado";
      }

    function translateIncomeSource(incomeValue) {
        const incomeSource = IncomeSource.find((r) => r.value === incomeValue);
        return incomeSource ? incomeValue.label : "Não especificado";
    }

    const [monthlyIncomes, setMonthlyIncomes] = useState([]);
    console.log(member);
    console.log(member.incomeSource)

    const [incomeInfo, setIncomeInfo] = useState({
        month1: '',
    year1: '',
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

    month2: '',
    year2: '',
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

    month3: '',
    year3: '',
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

    month4: '',
    year4: '',
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

    month5: '',
    year5: '',
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

    month6: '',
    year6: '',
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
    })
    

    /*function handleInputChange(event) {
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

        if (name === 'incomeSource') {
            const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);

            // Verifica se "Empresário" está selecionado
            if (selectedOptions.includes('BusinessOwner')) {
                setIsEntepreneur(true);
            } else {
                setIsEntepreneur(false);
            }
            // Verifica se "Desempregado" está selecionado
            if (selectedOptions.includes('Unemployed')) {
                setIsUnemployed(true);
            } else {
                setIsUnemployed(false);
            }
            // Verifica se "Autônomo" está selecionado
            if (selectedOptions.includes('SelfEmployed')) {
                setIsAutonomous(true);
            } else {
                setIsAutonomous(false);
            }
            // Verifica se "MEI" está selecionado
            if (selectedOptions.includes('IndividualEntrepreneur')) {
                setIsMEI(true);
            } else {
                setIsMEI(false);
            }
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

    /*async function handleRegisterMEIIncome(e) {
        e.preventDefault()
        const token = localStorage.getItem('token');
        
        
        console.log(data)

        try {

            
                const response = await api.post('/canditexts/family-member/income', data, {
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
        }
    }

    /*async function RegisterFamilyMemberIncome(e) {
        e.preventDefault()
        const token = localStorage.getItem('token');
        const data = {
            relationship: familyMemberIncome.relationship, // deve ser inicializado com um dos valores do enum Relationship
            otherRelationship: familyMemberIncome.otherRelationship ||'Vô',
            fullName: familyMemberIncome.fullName,
            socialName: familyMemberIncome.socialName,
            birthtext: familyMemberIncome.birthDate,
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
    }*/
    const [MEIInfo, setMEIInfo] = useState({
        startDate:'',
        CNPJ: ''
    })
    const [entepreneurInfo, setEntepreneurInfo] = useState({
        startDate:'',
        socialReason: '',
        fantasyName: '',
        CNPJ: ''
    })

    const handleEntepreneurInputChange = (e) => {
        const { name, value } = e.target;
    
        setEntepreneurInfo((prevState) => ({
          ...prevState,
          [name]: value,
        }));
        console.log(entepreneurInfo)
      };

    const [unemployedInfo, setUnemployedInfo] = useState({
        receivesUnemployment: false,
        parcels:0,
        firstParcelDate: '',
        parcelValue:0
    })

    const handleInputChange = (fieldName, value) => {
        setIncomeInfo((prevData) => ({
          ...prevData,
          [fieldName]: value,
        }));
        console.log(incomeInfo)
      };

    function handleInputUnemployedChange(e) {
        const { name, value } = e.target;
    
        setUnemployedInfo((prevState) => ({
          ...prevState,
          [name]: value,
        }));
        console.log(unemployedInfo)
    }
    const [fixIncomeMEI, setFixIncomeMEI] = useState(false)

    function handleFixIncomeMEI() {
        if(fixIncomeMEI === true) {
            setFixIncomeMEI(false)
            handleInputChange('quantity', 6)
        } 
        if(fixIncomeMEI === false) {
            setFixIncomeMEI(true)
            handleInputChange('quantity', 3)
        } 
    }

    const [receivesUnemployment, setReceivesUnemployment] = useState(false)

    function handleReceivesUnemployment() {
        if(receivesUnemployment === true) {
            setReceivesUnemployment(false)
        } 
        if(receivesUnemployment === false) {
            setReceivesUnemployment(true)
        } 
    }

    const handleMEIInputChange = (e) => {
        const { name, value } = e.target;
    
        setMEIInfo((prevState) => ({
          ...prevState,
          [name]: value,
        }));
        console.log(MEIInfo)
      };

      async function handleRegisterIncome(e, incomeSource) {
        e.preventDefault()
        const token = localStorage.getItem('token');
        const data = {
            month1: incomeInfo.month1,
            year1: incomeInfo.year1,
            grossAmount1:  Number(incomeInfo.grossAmount1),
            proLabore1: incomeInfo.proLabore1,
            dividends1: incomeInfo.dividends1,
            deductionValue1: incomeInfo.deductionValue1,
            publicPension1: incomeInfo.publicPension1,
            incomeTax1: incomeInfo.incomeTax1,
            otherDeductions1: incomeInfo.otherDeductions1,
            foodAllowanceValue1: incomeInfo.foodAllowanceValue1,
            transportAllowanceValue1: incomeInfo.transportAllowanceValue1,
            expenseReimbursementValue1: incomeInfo.expenseReimbursementValue1,
            advancePaymentValue1: incomeInfo.advancePaymentValue1,
            reversalValue1: incomeInfo.reversalValue1,
            compensationValue1: incomeInfo.compensationValue1,
            judicialPensionValue1: incomeInfo.judicialPensionValue1,
        
            month2: incomeInfo.month2,
            year2: incomeInfo.year2,
            grossAmount2: Number(incomeInfo.grossAmount2),
            proLabore2: incomeInfo.proLabore2,
            dividends2: incomeInfo.dividends2,
            deductionValue2: incomeInfo.deductionValue2,
            publicPension2: incomeInfo.publicPension2,
            incomeTax2: incomeInfo.incomeTax2,
            otherDeductions2: incomeInfo.otherDeductions2,
            foodAllowanceValue2: incomeInfo.foodAllowanceValue2,
            transportAllowanceValue2: incomeInfo.transportAllowanceValue2,
            expenseReimbursementValue2: incomeInfo.expenseReimbursementValue2,
            advancePaymentValue2: incomeInfo.advancePaymentValue2,
            reversalValue2: incomeInfo.reversalValue2,
            compensationValue2: incomeInfo.compensationValue2,
            judicialPensionValue2: incomeInfo.judicialPensionValue2,

            month3: incomeInfo.month3,
            year3: incomeInfo.year3,
            grossAmount3: Number(incomeInfo.grossAmount3),
            proLabore3: incomeInfo.proLabore3,
            dividends3: incomeInfo.dividends3,
            deductionValue3: incomeInfo.deductionValue3,
            publicPension3: incomeInfo.publicPension3,
            incomeTax3: incomeInfo.incomeTax3,
            otherDeductions3: incomeInfo.otherDeductions3,
            foodAllowanceValue3: incomeInfo.foodAllowanceValue3,
            transportAllowanceValue3: incomeInfo.transportAllowanceValue3,
            expenseReimbursementValue3: incomeInfo.expenseReimbursementValue3,
            advancePaymentValue3: incomeInfo.advancePaymentValue3,
            reversalValue3: incomeInfo.reversalValue3,
            compensationValue3: incomeInfo.compensationValue3,
            judicialPensionValue3: incomeInfo.judicialPensionValue3,

            month4: incomeInfo.month4,
            year4: incomeInfo.year4,
            grossAmount4: Number(incomeInfo.grossAmount4),
            proLabore4: incomeInfo.proLabore4,
            dividends4: incomeInfo.dividends4,
            deductionValue4: incomeInfo.deductionValue4,
            publicPension4: incomeInfo.publicPension4,
            incomeTax4: incomeInfo.incomeTax4,
            otherDeductions4: incomeInfo.otherDeductions4,
            foodAllowanceValue4: incomeInfo.foodAllowanceValue4,
            transportAllowanceValue4: incomeInfo.transportAllowanceValue4,
            expenseReimbursementValue4: incomeInfo.expenseReimbursementValue4,
            advancePaymentValue4: incomeInfo.advancePaymentValue4,
            reversalValue4: incomeInfo.reversalValue4,
            compensationValue4: incomeInfo.compensationValue4,
            judicialPensionValue4: incomeInfo.judicialPensionValue4,

            month5: incomeInfo.month5,
            year5: incomeInfo.year5,
            grossAmount5: Number(incomeInfo.grossAmount5),
            proLabore5: incomeInfo.proLabore5,
            dividends5: incomeInfo.dividends5,
            deductionValue5: incomeInfo.deductionValue5,
            publicPension5: incomeInfo.publicPension5,
            incomeTax5: incomeInfo.incomeTax5,
            otherDeductions5: incomeInfo.otherDeductions5,
            foodAllowanceValue5: incomeInfo.foodAllowanceValue5,
            transportAllowanceValue5: incomeInfo.transportAllowanceValue5,
            expenseReimbursementValue5: incomeInfo.expenseReimbursementValue5,
            advancePaymentValue5: incomeInfo.advancePaymentValue5,
            reversalValue5: incomeInfo.reversalValue5,
            compensationValue5: incomeInfo.compensationValue5,
            judicialPensionValue5: incomeInfo.judicialPensionValue5,

            month6: incomeInfo.month6,
            year6: incomeInfo.year6,
            grossAmount6: Number(incomeInfo.grossAmount6),
            proLabore6: incomeInfo.proLabore6,
            dividends6: incomeInfo.dividends6,
            deductionValue6: incomeInfo.deductionValue6,
            publicPension6: incomeInfo.publicPension6,
            incomeTax6: incomeInfo.incomeTax6,
            otherDeductions6: incomeInfo.otherDeductions6,
            foodAllowanceValue6: incomeInfo.foodAllowanceValue6,
            transportAllowanceValue6: incomeInfo.transportAllowanceValue6,
            expenseReimbursementValue6: incomeInfo.expenseReimbursementValue6,
            advancePaymentValue6: incomeInfo.advancePaymentValue6,
            reversalValue6: incomeInfo.reversalValue6,
            compensationValue6: incomeInfo.compensationValue6,
            judicialPensionValue6: incomeInfo.judicialPensionValue6,

            quantity: incomeInfo.quantity,
          
        };
    

        setIncomeInfo({
            month1: '',
    year1: '',
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

    month2: '',
    year2: '',
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

    month3: '',
    year3: '',
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

    month4: '',
    year4: '',
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

    month5: '',
    year5: '',
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

    month6: '',
    year6: '',
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
        })

        console.log(data)

        try {
            const response = await api.post(`/candidates/family-member/income/${member.id}`, data, {
                headers: {
                    'authorization': `Bearer ${token}`,
                }
            })

            if(incomeSource ==='IndividualEntrepreneur') {
                const data2 = {
                    startDate : MEIInfo.startDate,
                    CNPJ: MEIInfo.CNPJ
                }
                await api.post(`/candidates/family-member/MEI/${member.id}`, data2, {
                    headers: {
                        'authorization': `Bearer ${token}`,
                    }
                })
            }

            if(incomeSource === 'FinancialHelpFromOthers') {
                const data2 = {
                    financialAssistantCPF : dependentInfo.financialAssistantCPF,
                    employmentType: incomeSource
                }
                await api.post(`/candidates/family-member/dependent-autonomous/${member.id}`, data2, {
                    headers: {
                        'authorization': `Bearer ${token}`,
                    }
                })
            }
            if(incomeSource === 'RentalIncome') {
                const data2 = {
                    employmentType: incomeSource
                }
                await api.post(`/candidates/family-member/dependent-autonomous/${member.id}`, data2, {
                    headers: {
                        'authorization': `Bearer ${token}`,
                    }
                })
            }
            if(incomeSource === 'InformalWorker') {
                const data2 = {
                    employmentType: incomeSource
                }
                await api.post(`/candidates/family-member/dependent-autonomous/${member.id}`, data2, {
                    headers: {
                        'authorization': `Bearer ${token}`,
                    }
                })
            }
            if(incomeSource === 'LiberalProfessional') {
                const data2 = {
                    employmentType: incomeSource
                }
                await api.post(`/candidates/family-member/dependent-autonomous/${member.id}`, data2, {
                    headers: {
                        'authorization': `Bearer ${token}`,
                    }
                })
            }
            if(incomeSource === 'Autonomous') {
                const data2 = {
                    employmentType: incomeSource
                }
                await api.post(`/candidates/family-member/dependent-autonomous/${member.id}`, data2, {
                    headers: {
                        'authorization': `Bearer ${token}`,
                    }
                })
            }
            if(incomeSource === 'PrivatePension') {
                const data2 = {
                    employmentType: incomeSource
                }
                await api.post(`/candidates/family-member/dependent-autonomous/${member.id}`, data2, {
                    headers: {
                        'authorization': `Bearer ${token}`,
                    }
                })
            }
            
            console.log('====================================');
            console.log(response.status);
            alert('Cadastro Realizado com Sucesso, prossiga para a próxima parte.');
            console.log('====================================');
        }
        catch (error) {
          console.log(error)
          alert(error.response.data.message);
        }
      }

    const [fixIncomeAutonomous, setFixIncomeAutonomous] = useState(false)

    function handleFixIncomeAutonomous() {
        if(fixIncomeAutonomous === true) {
            setFixIncomeAutonomous(false)
        } 
        if(fixIncomeAutonomous === false) {
            setFixIncomeAutonomous(true)
        } 
    }
    const [fixIncomeInformalWorker, setFixIncomeInformalWorker] = useState(false)

    function handleFixIncomeInformalWorker() {
        if(fixIncomeInformalWorker === true) {
            setFixIncomeInformalWorker(false)
        } 
        if(fixIncomeInformalWorker === false) {
            setFixIncomeInformalWorker(true)
        } 
    }
    const [fixIncomePrivatePension, setFixIncomePrivatePension] = useState(false)

    function handleFixIncomePrivatePension() {
        if(fixIncomePrivatePension === true) {
            setFixIncomePrivatePension(false)
        } 
        if(fixIncomePrivatePension === false) {
            setFixIncomePrivatePension(true)
        } 
    }

    const [fixIncomeLiberalProfessional, setFixIncomeLiberalProfessional] = useState(false)

    function handleFixIncomeLiberalProfessional() {
        if(fixIncomeLiberalProfessional === true) {
            setFixIncomeLiberalProfessional(false)
        } 
        if(fixIncomeLiberalProfessional === false) {
            setFixIncomeLiberalProfessional(true)
        } 
    }

    const [fixIncomeRentalIncome, setFixIncomeRentalIncome] = useState(false)

    function handleFixIncomeRentalIncome() {
        if(fixIncomeRentalIncome === true) {
            setFixIncomeRentalIncome(false)
        } 
        if(fixIncomeRentalIncome === false) {
            setFixIncomeRentalIncome(true)
        } 
    }
    const [gratificationAutonomous, setGratificationAutonomous] = useState(false)

    function handleGratificationAutonomous() {
        if(gratificationAutonomous === true) {
            setGratificationAutonomous(false)
        } 
        if(gratificationAutonomous === false) {
            setGratificationAutonomous(true)
        } 
    }

    

    

    const [dependentInfo, setDependentInfo] = useState({
        financialAssistantCPF: '',
        employmentType: 'FinancialHelpFromOthers'
    })

    const handleDependentInputChange = (e) => {
        const { name, value } = e.target;
    
        setDependentInfo((prevState) => ({
          ...prevState,
          [name]: value,
        }));
        console.log(dependentInfo)
      };

      const [CLTInfo, setCLTInfo] = useState({
        admissionDate: '',
        position:'',
        payingSource:'',
        payingSourcePhone: ''
    })

    const handleCLTInputChange = (e) => {
        const { name, value } = e.target;
    
        setCLTInfo((prevState) => ({
          ...prevState,
          [name]: value,
        }));
        console.log(CLTInfo)
      };

      // CheckBox de CLT
      const renderElementes = [
        { id: 'deduction-1', label: 'Elemento 1' },
        { id: 'deduction-2', label: 'Elemento 2' },
        { id: 'deduction-3', label: 'Elemento 3' },
        { id: 'deduction-4', label: 'Elemento 3' },
        { id: 'deduction-5', label: 'Elemento 3' },
        { id: 'deduction-6', label: 'Elemento 3' },
    
      ];
    
      // Estado para rastrear os valores do checkbox
      const [deductionsCLT, setDeductionsCLT] = useState([false,false,false,false,false,false,false]);
    
      // Função de manipulação para os checkboxes
      const handleDeductionsCLT = (index) => {
        setDeductionsCLT((prevDeductionsCLT) => {
            const updatedDeductionsCLT = [...prevDeductionsCLT];
            updatedDeductionsCLT[index] = !updatedDeductionsCLT[index]; // Inverte o valor do checkbox
            return updatedDeductionsCLT;
        });
    };

    return (
        <div><div className="fill-box">
            <form id="survey-form">
                <h4>Cadastro do {member.fullName} ( translateRelationship({member.relationship}) )</h4>
                {/* Fonte de Renda  */}
                <h4>Fonte de renda: {translateIncomeSource(member.incomeSource)}</h4>


                {/* MEI */}
                {member.incomeSource.includes('IndividualEntrepreneur') && 
                (<>
                    {/*<!-- Data de Início -->*/}
                    <div class="survey-box">
                        <label for="startDate" id="startDate-label">Data de Início</label>
                        <br />
                        <input type="date" name="startDate" value={MEIInfo.startDate} onChange={handleMEIInputChange} id="startDate" class="survey-control" />
                    </div>
                    {/*<!-- CNPJ -->*/}
                    <div class="survey-box">
                        <label for="CNPJ" id="CNPJ-label">CNPJ</label>
                        <br />
                        <input type="text" name="CNPJ" value={MEIInfo.CNPJ} onChange={handleMEIInputChange} id="CNPJ" class="survey-control" />
                    </div>
                    {/*<!-- Renda Fixa ? -->*/}
                    <div class="survey-box">
                        <label for="fixIncome" id="fixIncome-label">Renda Fixa ?</label>
                        <br />
                        <input type="checkbox" name="fixIncome" value={fixIncomeMEI} onChange={handleFixIncomeMEI} id="fixIncome" class="survey-control" />
                    </div>
                    {!fixIncomeMEI ? (<div>
                            {Array.from({ length: 6 }).map((_, i) => (
                            <>
                            <div key={`month-${i}`} className="survey-box">
                                <label htmlFor={`month${i}`} id={`month${i}-label`}>
                                Mês {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`month${i}`}
                                id={`month${i}`}
                                value={incomeInfo[`month${i+1}`]}
                                onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
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
                                name={`year${i}`}
                                id={`year${i}`}
                                value={incomeInfo[`year${i+1}`]}
                                onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`grossAmount-${i}`} className="survey-box">
                                <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                                Valor Bruto {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`grossAmount${i}`}
                                id={`grossAmount${i}`}
                                value={incomeInfo[`grossAmount${i+1}`]}
                                onChange={(e) => handleInputChange(`grossAmount${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            </>
                    ))}
                    </div>): (
                        <div>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <>
                        <div key={`month-${i}`} className="survey-box">
                            <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                         </label>
                            <br />
                            <input
                            type="text"
                            name={`month${i}`}
                            id={`month${i}`}
                            value={incomeInfo[`month${i+1}`]}
                            onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
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
                            name={`year${i}`}
                            id={`year${i}`}
                            value={incomeInfo[`year${i+1}`]}
                            onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                            className="survey-control"
                            />
                        </div>
                        <div key={`grossAmount-${i}`} className="survey-box">
                            <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                            Valor Bruto {i + 1}
                         </label>
                            <br />
                            <input
                            type="number"
                            name={`grossAmount${i}`}
                            id={`grossAmount${i}`}
                            value={incomeInfo[`grossAmount${i+1}`]}
                            onChange={(e) => handleInputChange(`grossAmount${i + 1}`, e.target.value)}
                            className="survey-control"
                            />
                        </div>
                        </>
                        
                ))}
                </div>
                    )}
                    <div class="survey-box">
                        <button type="submit" onClick={(e) => handleRegisterIncome(e,'IndividualEntrepreneur')}  id="submit-button">Salvar Informações</button>
                    </div>
                </>
                )
                }

                {/* Desempregado */}
                {member.incomeSource.includes('Unemployed')&& 
                (<>
                    {/*<!-- Recebe Seguro Desemprego ? -->*/}
                    <div class="survey-box">
                        <label for="receivesUnemployment" id="receivesUnemployment-label">Recebe Seguro Desemprego ?</label>
                        <br />
                        <input type="checkbox" name="receivesUnemployment" value={unemployedInfo.receivesUnemployment} onChange={handleReceivesUnemployment} id="receivesUnemployment" class="survey-control" />
                    </div>
                    {receivesUnemployment && (
                        <>
                        {/*<!-- Quantidade de Parcelas -->*/}
                    <div class="survey-box">
                        <label for="parcels" id="parcels-label">Quantidade de Parcelas</label>
                        <br />
                        <input type="number" name="parcels" value={unemployedInfo.parcels}  id="parcels" class="survey-control" />
                    </div>
                    {/*<!-- Data da primeira Parcela -->*/}
                    <div class="survey-box">
                        <label for="firstParcelDate" id="firstParcelDate-label">Data da primeira Parcela</label>
                        <br />
                        <input type="date" name="firstParcelDate" value={unemployedInfo.firstParcelDate} onChange={handleInputUnemployedChange} id="firstParcelDate" class="survey-control" />
                    </div>
                    {/*<!-- Valor da Parcela -->*/}
                    <div class="survey-box">
                        <label for="parcelValue" id="parcelValue-label">Valor da Parcela</label>
                        <br />
                        <input type="number" name="parcelValue" value={unemployedInfo.parcelValue} onChange={handleInputUnemployedChange} id="parcelValue" class="survey-control" />
                    </div>
                    <div class="survey-box">
                        <button type="submit" onClick={(e) => handleRegisterIncome(e,'Unemployed')}  id="submit-button">Salvar Informações</button>
                    </div>
                        </>
                    )}
                </>
                ) 
                }

                {/* Autônomo */}
                {(member.incomeSource.includes('Autonomous') 
                 ) && 
                (
                    <>
                    {/*<!-- Renda Fixa ? -->*/}
                    <div class="survey-box">
                        <label for="fixIncome" id="fixIncome-label">Renda Fixa ?</label>
                        <br />
                        <input type="checkbox" name="fixIncome" value={fixIncomeAutonomous} onChange={handleFixIncomeAutonomous} id="fixIncome" class="survey-control" />
                    </div>
                    {!fixIncomeAutonomous ? (<div>
                            {Array.from({ length: 6 }).map((_, i) => (
                            <>
                            <div key={`month-${i}`} className="survey-box">
                                <label htmlFor={`month${i}`} id={`month${i}-label`}>
                                Mês {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`month${i}`}
                                id={`month${i}`}
                                value={incomeInfo[`month${i+1}`]}
                                onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
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
                                name={`year${i}`}
                                id={`year${i}`}
                                value={incomeInfo[`year${i+1}`]}
                                onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`grossAmount-${i}`} className="survey-box">
                                <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                                Valor Bruto {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`grossAmount${i}`}
                                id={`grossAmount${i}`}
                                value={incomeInfo[`grossAmount${i+1}`]}
                                onChange={(e) => handleInputChange(`grossAmount${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            </>
                    ))}
                    </div>): (
                        <div>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <>
                        <div key={`month-${i}`} className="survey-box">
                            <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                         </label>
                            <br />
                            <input
                            type="text"
                            name={`month${i}`}
                            id={`month${i}`}
                            value={incomeInfo[`month${i+1}`]}
                            onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
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
                            name={`year${i}`}
                            id={`year${i}`}
                            value={incomeInfo[`year${i+1}`]}
                            onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                            className="survey-control"
                            />
                        </div>
                        <div key={`grossAmount-${i}`} className="survey-box">
                            <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                            Valor Bruto {i + 1}
                         </label>
                            <br />
                            <input
                            type="number"
                            name={`grossAmount${i}`}
                            id={`grossAmount${i}`}
                            value={incomeInfo[`grossAmount${i+1}`]}
                            onChange={(e) => handleInputChange(`grossAmount${i + 1}`, e.target.value)}
                            className="survey-control"
                            />
                        </div>
                        </>
                        
                ))}
                </div>
                    )}
                    <div class="survey-box">
                        <button type="submit" onClick={(e) => handleRegisterIncome(e,'Autonomous')}  id="submit-button">Salvar Informações</button>
                    </div>
                </>
                ) 
                }

                {/* Trabalhador Informal */}
                {(member.incomeSource.includes('InformalWorker') 
                 ) && 
                (
                    <>
                    {/*<!-- Renda Fixa ? -->*/}
                    <div class="survey-box">
                        <label for="fixIncome" id="fixIncome-label">Renda Fixa ?</label>
                        <br />
                        <input type="checkbox" name="fixIncome" value={fixIncomeInformalWorker} onChange={handleFixIncomeInformalWorker} id="fixIncome" class="survey-control" />
                    </div>
                    {!fixIncomeInformalWorker ? (<div>
                            {Array.from({ length: 6 }).map((_, i) => (
                            <>
                            <div key={`month-${i}`} className="survey-box">
                                <label htmlFor={`month${i}`} id={`month${i}-label`}>
                                Mês {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`month${i}`}
                                id={`month${i}`}
                                value={incomeInfo[`month${i+1}`]}
                                onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
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
                                name={`year${i}`}
                                id={`year${i}`}
                                value={incomeInfo[`year${i+1}`]}
                                onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`grossAmount-${i}`} className="survey-box">
                                <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                                Valor Bruto {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`grossAmount${i}`}
                                id={`grossAmount${i}`}
                                value={incomeInfo[`grossAmount${i+1}`]}
                                onChange={(e) => handleInputChange(`grossAmount${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            </>
                    ))}
                    </div>): (
                        <div>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <>
                        <div key={`month-${i}`} className="survey-box">
                            <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                         </label>
                            <br />
                            <input
                            type="text"
                            name={`month${i}`}
                            id={`month${i}`}
                            value={incomeInfo[`month${i+1}`]}
                            onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
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
                            name={`year${i}`}
                            id={`year${i}`}
                            value={incomeInfo[`year${i+1}`]}
                            onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                            className="survey-control"
                            />
                        </div>
                        <div key={`grossAmount-${i}`} className="survey-box">
                            <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                            Valor Bruto {i + 1}
                         </label>
                            <br />
                            <input
                            type="number"
                            name={`grossAmount${i}`}
                            id={`grossAmount${i}`}
                            value={incomeInfo[`grossAmount${i+1}`]}
                            onChange={(e) => handleInputChange(`grossAmount${i + 1}`, e.target.value)}
                            className="survey-control"
                            />
                        </div>
                        </>
                        
                ))}
                </div>
                    )}
                    <div class="survey-box">
                        <button type="submit" onClick={(e) => handleRegisterIncome(e,'InformalWorker')}  id="submit-button">Salvar Informações</button>
                    </div>
                </>
                ) 
                }

                {/* Renda de Aluguel... */}
                {(member.incomeSource.includes('RentalIncome') 
                 ) && 
                (
                    <>
                    {/*<!-- Renda Fixa ? -->*/}
                    <div class="survey-box">
                        <label for="fixIncome" id="fixIncome-label">Renda Fixa ?</label>
                        <br />
                        <input type="checkbox" name="fixIncome" value={fixIncomeRentalIncome} onChange={handleFixIncomeRentalIncome} id="fixIncome" class="survey-control" />
                    </div>
                    {!fixIncomeRentalIncome ? (<div>
                            {Array.from({ length: 6 }).map((_, i) => (
                            <>
                            <div key={`month-${i}`} className="survey-box">
                                <label htmlFor={`month${i}`} id={`month${i}-label`}>
                                Mês {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`month${i}`}
                                id={`month${i}`}
                                value={incomeInfo[`month${i+1}`]}
                                onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
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
                                name={`year${i}`}
                                id={`year${i}`}
                                value={incomeInfo[`year${i+1}`]}
                                onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`grossAmount-${i}`} className="survey-box">
                                <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                                Valor Bruto {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`grossAmount${i}`}
                                id={`grossAmount${i}`}
                                value={incomeInfo[`grossAmount${i+1}`]}
                                onChange={(e) => handleInputChange(`grossAmount${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            </>
                    ))}
                    </div>): (
                        <div>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <>
                        <div key={`month-${i}`} className="survey-box">
                            <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                         </label>
                            <br />
                            <input
                            type="text"
                            name={`month${i}`}
                            id={`month${i}`}
                            value={incomeInfo[`month${i+1}`]}
                            onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
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
                            name={`year${i}`}
                            id={`year${i}`}
                            value={incomeInfo[`year${i+1}`]}
                            onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                            className="survey-control"
                            />
                        </div>
                        <div key={`grossAmount-${i}`} className="survey-box">
                            <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                            Valor Bruto {i + 1}
                         </label>
                            <br />
                            <input
                            type="number"
                            name={`grossAmount${i}`}
                            id={`grossAmount${i}`}
                            value={incomeInfo[`grossAmount${i+1}`]}
                            onChange={(e) => handleInputChange(`grossAmount${i + 1}`, e.target.value)}
                            className="survey-control"
                            />
                        </div>
                        </>
                        
                ))}
                </div>
                    )}
                    <div class="survey-box">
                        <button type="submit" onClick={(e) => handleRegisterIncome(e,'RentalIncome')}  id="submit-button">Salvar Informações</button>
                    </div>
                </>
                ) 
                }

                {/* Profissional Liberal */}
                {(member.incomeSource.includes('LiberalProfessional') || member.incomeSource.includes('SelfEmployed') 
                 ) && 
                (
                    <>
                    {/*<!-- Renda Fixa ? -->*/}
                    <div class="survey-box">
                        <label for="fixIncome" id="fixIncome-label">Renda Fixa ?</label>
                        <br />
                        <input type="checkbox" name="fixIncome" value={fixIncomeLiberalProfessional} onChange={handleFixIncomeLiberalProfessional} id="fixIncome" class="survey-control" />
                    </div>
                    {!fixIncomeLiberalProfessional ? (<div>
                            {Array.from({ length: 6 }).map((_, i) => (
                            <>
                            <div key={`month-${i}`} className="survey-box">
                                <label htmlFor={`month${i}`} id={`month${i}-label`}>
                                Mês {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`month${i}`}
                                id={`month${i}`}
                                value={incomeInfo[`month${i+1}`]}
                                onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
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
                                name={`year${i}`}
                                id={`year${i}`}
                                value={incomeInfo[`year${i+1}`]}
                                onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`grossAmount-${i}`} className="survey-box">
                                <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                                Valor Bruto {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`grossAmount${i}`}
                                id={`grossAmount${i}`}
                                value={incomeInfo[`grossAmount${i+1}`]}
                                onChange={(e) => handleInputChange(`grossAmount${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            </>
                    ))}
                    </div>): (
                        <div>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <>
                        <div key={`month-${i}`} className="survey-box">
                            <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                         </label>
                            <br />
                            <input
                            type="text"
                            name={`month${i}`}
                            id={`month${i}`}
                            value={incomeInfo[`month${i+1}`]}
                            onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
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
                            name={`year${i}`}
                            id={`year${i}`}
                            value={incomeInfo[`year${i+1}`]}
                            onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                            className="survey-control"
                            />
                        </div>
                        <div key={`grossAmount-${i}`} className="survey-box">
                            <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                            Valor Bruto {i + 1}
                         </label>
                            <br />
                            <input
                            type="number"
                            name={`grossAmount${i}`}
                            id={`grossAmount${i}`}
                            value={incomeInfo[`grossAmount${i+1}`]}
                            onChange={(e) => handleInputChange(`grossAmount${i + 1}`, e.target.value)}
                            className="survey-control"
                            />
                        </div>
                        </>
                        
                ))}
                </div>
                    )}
                    <div class="survey-box">
                        <button type="submit" onClick={(e) => handleRegisterIncome(e,'LiberalProfessional')}  id="submit-button">Salvar Informações</button>
                    </div>
                </>
                ) 
                }

                {/* Pensão Privada */}
                {(member.incomeSource.includes('PrivatePension') 
                ) && 
               (
                   <>
                   {/*<!-- Renda Fixa ? -->*/}
                   <div class="survey-box">
                       <label for="fixIncome" id="fixIncome-label">Renda Fixa ?</label>
                       <br />
                       <input type="checkbox" name="fixIncome" value={fixIncomePrivatePension} onChange={handleFixIncomePrivatePension} id="fixIncome" class="survey-control" />
                   </div>
                   {!fixIncomePrivatePension ? (<div>
                           {Array.from({ length: 6 }).map((_, i) => (
                           <>
                           <div key={`month-${i}`} className="survey-box">
                               <label htmlFor={`month${i}`} id={`month${i}-label`}>
                               Mês {i + 1}
                            </label>
                               <br />
                               <input
                               type="text"
                               name={`month${i}`}
                               id={`month${i}`}
                               value={incomeInfo[`month${i+1}`]}
                               onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
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
                               name={`year${i}`}
                               id={`year${i}`}
                               value={incomeInfo[`year${i+1}`]}
                               onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                               className="survey-control"
                               />
                           </div>
                           <div key={`grossAmount-${i}`} className="survey-box">
                               <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                               Valor Bruto {i + 1}
                            </label>
                               <br />
                               <input
                               type="number"
                               name={`grossAmount${i}`}
                               id={`grossAmount${i}`}
                               value={incomeInfo[`grossAmount${i+1}`]}
                               onChange={(e) => handleInputChange(`grossAmount${i + 1}`, e.target.value)}
                               className="survey-control"
                               />
                           </div>
                           </>
                   ))}
                   </div>): (
                       <div>
                       {Array.from({ length: 3 }).map((_, i) => (
                           <>
                       <div key={`month-${i}`} className="survey-box">
                           <label htmlFor={`month${i}`} id={`month${i}-label`}>
                           Mês {i + 1}
                        </label>
                           <br />
                           <input
                           type="text"
                           name={`month${i}`}
                           id={`month${i}`}
                           value={incomeInfo[`month${i+1}`]}
                           onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
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
                           name={`year${i}`}
                           id={`year${i}`}
                           value={incomeInfo[`year${i+1}`]}
                           onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                           className="survey-control"
                           />
                       </div>
                       <div key={`grossAmount-${i}`} className="survey-box">
                           <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                           Valor Bruto {i + 1}
                        </label>
                           <br />
                           <input
                           type="number"
                           name={`grossAmount${i}`}
                           id={`grossAmount${i}`}
                           value={incomeInfo[`grossAmount${i+1}`]}
                           onChange={(e) => handleInputChange(`grossAmount${i + 1}`, e.target.value)}
                           className="survey-control"
                           />
                       </div>
                       </>
                       
               ))}
               </div>
                   )}
                   <div class="survey-box">
                       <button type="submit" onClick={(e) => handleRegisterIncome(e,'PrivatePension')}  id="submit-button">Salvar Informações</button>
                   </div>
               </>
               ) 
               }
                
                {/* Ajuda Financeira de Terceiros */}
                {member.incomeSource.includes('FinancialHelpFromOthers') &&
                (
                    <>
                    {/*<!-- Renda Fixa ? -->*/}
                    <div class="survey-box">
                        <label for="fixIncome" id="fixIncome-label">Renda Fixa ?</label>
                        <br />
                        <input type="checkbox" name="fixIncome" value={fixIncomeAutonomous} onChange={handleFixIncomeAutonomous} id="fixIncome" class="survey-control" />
                    </div>
                    {!fixIncomeMEI ? (<div>
                            {Array.from({ length: 6 }).map((_, i) => (
                            <>
                            <div key={`month-${i}`} className="survey-box">
                                <label htmlFor={`month${i}`} id={`month${i}-label`}>
                                Mês {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`month${i}`}
                                id={`month${i}`}
                                value={incomeInfo[`month${i+1}`]}
                                onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
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
                                name={`year${i}`}
                                id={`year${i}`}
                                value={incomeInfo[`year${i+1}`]}
                                onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`grossAmount-${i}`} className="survey-box">
                                <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                                Valor Bruto {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`grossAmount${i}`}
                                id={`grossAmount${i}`}
                                value={incomeInfo[`grossAmount${i+1}`]}
                                onChange={(e) => handleInputChange(`grossAmount${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            </>
                    ))}
                    <div  className="survey-box">
                            <label htmlFor={"financialAssistantCPF"} id={"financialAssistantCPF"}>
                            CPF do Ajudante Financeiro
                         </label>
                            <br />
                            <input
                            type="text"
                            name={"financialAssistantCPF"}
                            id={"financialAssistantCPF"}
                            value={dependentInfo}
                            onChange={handleDependentInputChange}
                            className="survey-control"
                            />
                        </div>
                    </div>): (
                        <div>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <>
                        <div key={`month-${i}`} className="survey-box">
                            <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                         </label>
                            <br />
                            <input
                            type="text"
                            name={`month${i}`}
                            id={`month${i}`}
                            value={incomeInfo[`month${i+1}`]}
                            onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
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
                            name={`year${i}`}
                            id={`year${i}`}
                            value={incomeInfo[`year${i+1}`]}
                            onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                            className="survey-control"
                            />
                        </div>
                        <div key={`grossAmount-${i}`} className="survey-box">
                            <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                            Valor Bruto {i + 1}
                         </label>
                            <br />
                            <input
                            type="number"
                            name={`grossAmount${i}`}
                            id={`grossAmount${i}`}
                            value={incomeInfo[`month${i+1}`]}
                            onChange={(e) => handleInputChange(`grossAmount${i+1}`, e.target.value)}
                            className="survey-control"
                            />
                        </div>
                        
                        </>

                        
                ))}
                <div  className="survey-box">
                            <label htmlFor={"financialAssistantCPF"} id={"financialAssistantCPF"}>
                            CPF do Ajudante Financeiro
                         </label>
                            <br />
                            <input
                            type="text"
                            name={"financialAssistantCPF"}
                            id={"financialAssistantCPF"}
                            value={dependentInfo}
                            onChange={handleDependentInputChange}
                            className="survey-control"
                            />
                        </div>
                </div>
                    )}
                    <div class="survey-box">
                        <button type="submit" onClick={(e) => handleRegisterIncome(e,'FinancialHelpFromOthers')}  id="submit-button">Salvar Informações</button>
                    </div>
                </>
                )
                }

                {/* Empresário */}
                {member.incomeSource.includes('Entepreneur') &&
                (
                    <>
                   {/*<!-- Data de Início -->*/}
                   <div class="survey-box">
                       <label for="startDate" id="startDate-label">Data de Início</label>
                       <br />
                       <input type="date" name="startDate" value={entepreneurInfo.startDate} onChange={handleEntepreneurInputChange} id="startDate" class="survey-control" />
                   </div>
                   {/*<!-- Razao Social -->*/}
                   <div class="survey-box">
                       <label for="socialReason" id="socialReason-label">Razão Social</label>
                       <br />
                       <input type="text" name="socialReason" value={entepreneurInfo.socialReason} onChange={handleEntepreneurInputChange} id="socialReason" class="survey-control" />
                   </div>
                   {/*<!-- Nome Fantasia -->*/}
                   <div class="survey-box">
                       <label for="fantasyName" id="fantasyName-label">Nome Fantasia</label>
                       <br />
                       <input type="date" name="fantasyName" value={entepreneurInfo.fantasyName} onChange={handleEntepreneurInputChange} id="fantasyName" class="survey-control" />
                   </div>
                   {/*<!-- CNPJ -->*/}
                   <div class="survey-box">
                       <label for="CNPJ" id="CNPJ-label">CNPJ</label>
                       <br />
                       <input type="text" name="CNPJ" value={entepreneurInfo.CNPJ} onChange={handleEntepreneurInputChange} id="CNPJ" class="survey-control" />
                   </div>
                   <div>
                           {Array.from({ length: 6 }).map((_, i) => (
                           <>
                           <div key={`month-${i}`} className="survey-box">
                               <label htmlFor={`month${i}`} id={`month${i}-label`}>
                               Mês {i + 1}
                            </label>
                               <br />
                               <input
                               type="text"
                               name={`month${i}`}
                               id={`month${i}`}
                               value={incomeInfo[`month${i+1}`]}
                               onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
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
                               name={`year${i}`}
                               id={`year${i}`}
                               value={incomeInfo[`year${i+1}`]}
                               onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                               className="survey-control"
                               />
                           </div>
                           <div key={`grossAmount-${i}`} className="survey-box">
                               <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                               Valor Bruto {i + 1}
                            </label>
                               <br />
                               <input
                               type="number"
                               name={`grossAmount${i}`}
                               id={`grossAmount${i}`}
                               value={incomeInfo[`grossAmount${i+1}`]}
                               onChange={(e) => handleInputChange(`grossAmount${i + 1}`, e.target.value)}
                               className="survey-control"
                               />
                           </div>
                           <div key={`proLabore-${i}`} className="survey-box">
                               <label htmlFor={`proLabore${i}`} id={`proLabore${i}-label`}>
                               Valor Do Pró-labore {i + 1}
                            </label>
                               <br />
                               <input
                               type="number"
                               name={`proLabore${i}`}
                               id={`proLabore${i}`}
                               value={incomeInfo[`proLabore${i+1}`]}
                               onChange={(e) => handleInputChange(`proLabore${i + 1}`, e.target.value)}
                               className="survey-control"
                               />
                           </div>
                           <div key={`dividends-${i}`} className="survey-box">
                               <label htmlFor={`dividends${i}`} id={`dividends${i}-label`}>
                               Valor dos Dividendos {i + 1}
                            </label>
                               <br />
                               <input
                               type="number"
                               name={`dividends${i}`}
                               id={`dividends${i}`}
                               value={incomeInfo[`dividends${i+1}`]}
                               onChange={(e) => handleInputChange(`dividends${i + 1}`, e.target.value)}
                               className="survey-control"
                               />
                           </div>
                           </>
                   ))}
                   </div>
                   <div class="survey-box">
                       <button type="submit" onClick={(e) => handleRegisterIncome(e,'Entepreneur')}  id="submit-button">Salvar Informações</button>
                   </div>
               </>
                ) 
                }

                {/* PrivateEmployee */}
                {member.incomeSource.includes('PrivateEmployee') &&
                (
                    <>
                   {/*<!-- Data de Admissão -->*/}
                   <div class="survey-box">
                       <label for="admissionDate" id="admissionDate-label">Data de Admissão</label>
                       <br />
                       <input type="date" name="admissionDate" value={CLTInfo.admissionDate} onChange={handleCLTInputChange} id="admissionDate" class="survey-control" />
                   </div>
                   {/*<!-- Cargo -->*/}
                   <div class="survey-box">
                       <label for="position" id="position-label">Cargo</label>
                       <br />
                       <input type="text" name="position" value={CLTInfo.position} onChange={handleCLTInputChange} id="position" class="survey-control" />
                   </div>
                   {/*<!-- Fonte Pagadora( Empresa/Governo/ Pessoa Física) -->*/}
                   <div class="survey-box">
                       <label for="payingSource" id="payingSource-label">Fonte Pagadora</label>
                       <br />
                       <input type="text" name="payingSource" value={CLTInfo.payingSource} onChange={handleCLTInputChange} id="payingSource" class="survey-control" />
                   </div>
                   {/*<!-- Telefone da Fonte Pagadora -->*/}
                   <div class="survey-box">
                       <label for="payingSourcePhone" id="payingSourcePhone-label">Telefone da Fonte Pagadora</label>
                       <br />
                       <input type="text" name="payingSourcePhone" value={CLTInfo.payingSourcePhone} onChange={handleCLTInputChange} id="payingSourcePhone" class="survey-control" />
                   </div>
                   {/*<!-- Recebe Gratificação ? -->*/}
                   <div class="survey-box">
                        <label for="gratification" id="gratification-label"> Recebe horas extras, premiação ou gratificação ? </label>
                        <br />
                        <input type="checkbox" name="gratification" value={gratificationAutonomous} onChange={handleGratificationAutonomous} id="gratification" class="survey-control" />
                   </div>

                   <div>
                        {gratificationAutonomous ? (
                    <div>
                            {Array.from({ length: 6 }).map((_, i) => (
                            <>
                            <div key={`month-${i}`} className="survey-box">
                                <label htmlFor={`month${i}`} id={`month${i}-label`}>
                                Mês {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`month${i}`}
                                id={`month${i}`}
                                value={incomeInfo[`month${i+1}`]}
                                onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
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
                                name={`year${i}`}
                                id={`year${i}`}
                                value={incomeInfo[`year${i+1}`]}
                                onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`grossAmount-${i}`} className="survey-box">
                                <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                                Valor Bruto {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`grossAmount${i}`}
                                id={`grossAmount${i}`}
                                value={incomeInfo[`grossAmount${i+1}`]}
                                onChange={(e) => handleInputChange(`grossAmount${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                                    {/*<!-- Teve deduções ? -->*/}
                   <div class="survey-box" key={`deductions-${i+1}`}>
                        <label for="deductions" id="deductions-label"> No valor informado, teve deduções ? </label>
                        <br />
                        <input type="checkbox" name="deductions" value={deductionsCLT[i+1]} onChange={() => handleDeductionsCLT(i+1)} id="deductions" class="survey-control" />
                    </div>
                    {deductionsCLT[i+1] ? ( <div>
                    <div key={`incomeTax-${i}`} className="survey-box">
                                <label htmlFor={`incomeTax${i}`} id={`incomeTax${i}-label`}>
                                Imposto de Renda {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`incomeTax${i}`}
                                id={`incomeTax${i}`}
                                value={incomeInfo[`incomeTax${i+1}`]}
                                onChange={(e) => handleInputChange(`incomeTax${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`publicPension-${i}`} className="survey-box">
                                <label htmlFor={`publicPension${i}`} id={`publicPension${i}-label`}>
                                Previdência Pública {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`publicPension${i}`}
                                id={`publicPension${i}`}
                                value={incomeInfo[`publicPension${i+1}`]}
                                onChange={(e) => handleInputChange(`publicPension${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                    </div>): ( <div></div> )}
                            <div>
                    <div key={`foodAllowanceValue-${i}`} className="survey-box">
                                <label htmlFor={`foodAllowanceValue${i}`} id={`foodAllowanceValue${i}-label`}>
                                Auxílio Alimentação {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`foodAllowanceValue${i}`}
                                id={`foodAllowanceValue${i}`}
                                value={incomeInfo[`foodAllowanceValue${i+1}`]}
                                onChange={(e) => handleInputChange(`foodAllowanceValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`transportAllowanceValue-${i}`} className="survey-box">
                                <label htmlFor={`transportAllowanceValue${i}`} id={`transportAllowanceValue${i}-label`}>
                                Auxílio Transporte {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`transportAllowanceValue${i}`}
                                id={`transportAllowanceValue${i}`}
                                value={incomeInfo[`transportAllowanceValue${i+1}`]}
                                onChange={(e) => handleInputChange(`transportAllowanceValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`expenseReimbursementValue-${i}`} className="survey-box">
                                <label htmlFor={`expenseReimbursementValue${i}`} id={`expenseReimbursementValue${i}-label`}>
                                Reembolso de despesas {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`expenseReimbursementValue${i}`}
                                id={`expenseReimbursementValue${i}`}
                                value={incomeInfo[`expenseReimbursementValue${i+1}`]}
                                onChange={(e) => handleInputChange(`expenseReimbursementValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`advancePaymentValue-${i}`} className="survey-box">
                                <label htmlFor={`advancePaymentValue${i}`} id={`advancePaymentValue${i}-label`}>
                                Adiantamento ou Antecipações  {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`advancePaymentValue${i}`}
                                id={`advancePaymentValue${i}`}
                                value={incomeInfo[`advancePaymentValue${i+1}`]}
                                onChange={(e) => handleInputChange(`advancePaymentValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`reversalValue-${i}`} className="survey-box">
                                <label htmlFor={`reversalValue${i}`} id={`reversalValue${i}-label`}>
                                Estornos e Compensações {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`reversalValue${i}`}
                                id={`reversalValue${i}`}
                                value={incomeInfo[`reversalValue${i+1}`]}
                                onChange={(e) => handleInputChange(`reversalValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`compensationValue-${i}`} className="survey-box">
                                <label htmlFor={`compensationValue${i}`} id={`compensationValue${i}-label`}>
                                    Indenizações {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`compensationValue${i}`}
                                id={`compensationValue${i}`}
                                value={incomeInfo[`compensationValue${i+1}`]}
                                onChange={(e) => handleInputChange(`compensationValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`judicialPensionValue-${i}`} className="survey-box">
                                <label htmlFor={`judicialPensionValue${i}`} id={`judicialPensionValue${i}-label`}>
                                Pensão Judicial {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`judicialPensionValue${i}`}
                                id={`judicialPensionValue${i}`}
                                value={incomeInfo[`judicialPensionValue${i+1}`]}
                                onChange={(e) => handleInputChange(`judicialPensionValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                    </div>
                   <div>
                   </div>
                            </>
                    ))}
                    </div>
                        ): (
                        <div>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <>
                        <div key={`month-${i}`} className="survey-box">
                            <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                         </label>
                            <br />
                            <input
                            type="text"
                            name={`month${i}`}
                            id={`month${i}`}
                            value={incomeInfo[`month${i+1}`]}
                            onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
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
                            name={`year${i}`}
                            id={`year${i}`}
                            value={incomeInfo[`year${i+1}`]}
                            onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                            className="survey-control"
                            />
                        </div>
                        <div key={`grossAmount-${i}`} className="survey-box">
                            <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                            Valor Bruto {i + 1}
                         </label>
                            <br />
                            <input
                            type="number"
                            name={`grossAmount${i}`}
                            id={`grossAmount${i}`}
                            value={incomeInfo[`month${i+1}`]}
                            onChange={(e) => handleInputChange(`grossAmount${i+1}`, e.target.value)}
                            className="survey-control"
                            />
                        </div>
                        {/*<!-- Teve deduções ? -->*/}
                        <div class="survey-box" key={`deductions-${i+1}`}>
                        <label for="deductions" id="deductions-label"> No valor informado, teve deduções ? </label>
                        <br />
                        <input type="checkbox" name="deductions" value={deductionsCLT[i + 1]} onChange={() => handleDeductionsCLT(i+1)} id="deductions" class="survey-control" />
                        </div>
                        {deductionsCLT[i + 1] ? ( 
                            <div>
                                <div key={`incomeTax-${i}`} className="survey-box">
                                    <label htmlFor={`incomeTax${i}`} id={`incomeTax${i}-label`}>
                                    Imposto de Renda {i + 1}
                                    </label>
                                    <br />
                                    <input
                                    type="text"
                                    name={`incomeTax${i}`}
                                    id={`incomeTax${i}`}
                                    value={incomeInfo[`incomeTax${i+1}`]}
                                    onChange={(e) => handleInputChange(`incomeTax${i + 1}`, e.target.value)}
                                    className="survey-control"
                                    />
                                </div>
                                <div key={`publicPension-${i}`} className="survey-box">
                                <label htmlFor={`publicPension${i}`} id={`publicPension${i}-label`}>
                                Previdência Pública {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`publicPension${i}`}
                                id={`publicPension${i}`}
                                value={incomeInfo[`publicPension${i+1}`]}
                                onChange={(e) => handleInputChange(`publicPension${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                                </div>
                            </div>
                        ): ( 
                        <div></div> 
                        )}
                        <div key={`foodAllowanceValue-${i}`} className="survey-box">
                                <label htmlFor={`foodAllowanceValue${i}`} id={`foodAllowanceValue${i}-label`}>
                                Auxílio Alimentação {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`foodAllowanceValue${i}`}
                                id={`foodAllowanceValue${i}`}
                                value={incomeInfo[`foodAllowanceValue${i+1}`]}
                                onChange={(e) => handleInputChange(`foodAllowanceValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                        </div>
                        <div key={`transportAllowanceValue-${i}`} className="survey-box">
                                <label htmlFor={`transportAllowanceValue${i}`} id={`transportAllowanceValue${i}-label`}>
                                Auxílio Transporte {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`transportAllowanceValue${i}`}
                                id={`transportAllowanceValue${i}`}
                                value={incomeInfo[`transportAllowanceValue${i+1}`]}
                                onChange={(e) => handleInputChange(`transportAllowanceValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                        </div>
                        <div key={`expenseReimbursementValue-${i}`} className="survey-box">
                                <label htmlFor={`expenseReimbursementValue${i}`} id={`expenseReimbursementValue${i}-label`}>
                                Reembolso de despesas {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`expenseReimbursementValue${i}`}
                                id={`expenseReimbursementValue${i}`}
                                value={incomeInfo[`expenseReimbursementValue${i+1}`]}
                                onChange={(e) => handleInputChange(`expenseReimbursementValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                        </div>
                        <div key={`advancePaymentValue-${i}`} className="survey-box">
                                <label htmlFor={`advancePaymentValue${i}`} id={`advancePaymentValue${i}-label`}>
                                Adiantamento ou Antecipações  {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`advancePaymentValue${i}`}
                                id={`advancePaymentValue${i}`}
                                value={incomeInfo[`advancePaymentValue${i+1}`]}
                                onChange={(e) => handleInputChange(`advancePaymentValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                        </div>
                        <div key={`reversalValue-${i}`} className="survey-box">
                                <label htmlFor={`reversalValue${i}`} id={`reversalValue${i}-label`}>
                                Estornos e Compensações {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`reversalValue${i}`}
                                id={`reversalValue${i}`}
                                value={incomeInfo[`reversalValue${i+1}`]}
                                onChange={(e) => handleInputChange(`reversalValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                        </div>
                        <div key={`compensationValue-${i}`} className="survey-box">
                                <label htmlFor={`compensationValue${i}`} id={`compensationValue${i}-label`}>
                                    Indenizações {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`compensationValue${i}`}
                                id={`compensationValue${i}`}
                                value={incomeInfo[`compensationValue${i+1}`]}
                                onChange={(e) => handleInputChange(`compensationValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                        </div>
                        <div key={`judicialPensionValue-${i}`} className="survey-box">
                                <label htmlFor={`judicialPensionValue${i}`} id={`judicialPensionValue${i}-label`}>
                                Pensão Judicial {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`judicialPensionValue${i}`}
                                id={`judicialPensionValue${i}`}
                                value={incomeInfo[`judicialPensionValue${i+1}`]}
                                onChange={(e) => handleInputChange(`judicialPensionValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                        </div>
                        </>

                ))}
                        </div>
                        )}
                    </div>

                   <div class="survey-box">
                       <button type="submit" onClick={(e) => handleRegisterIncome(e,'PrivateEmployee')}  id="submit-button">Salvar Informações</button>
                   </div>
                   
               </>
                ) 
                }

                {/* PublicEmployee */}
                {member.incomeSource.includes('PublicEmployee') &&
                (
                    <>
                   {/*<!-- Data de Admissão -->*/}
                   <div class="survey-box">
                       <label for="admissionDate" id="admissionDate-label">Data de Admissão</label>
                       <br />
                       <input type="date" name="admissionDate" value={CLTInfo.admissionDate} onChange={handleCLTInputChange} id="admissionDate" class="survey-control" />
                   </div>
                   {/*<!-- Cargo -->*/}
                   <div class="survey-box">
                       <label for="position" id="position-label">Cargo</label>
                       <br />
                       <input type="text" name="position" value={CLTInfo.position} onChange={handleCLTInputChange} id="position" class="survey-control" />
                   </div>
                   {/*<!-- Fonte Pagadora( Empresa/Governo/ Pessoa Física) -->*/}
                   <div class="survey-box">
                       <label for="payingSource" id="payingSource-label">Fonte Pagadora</label>
                       <br />
                       <input type="text" name="payingSource" value={CLTInfo.payingSource} onChange={handleCLTInputChange} id="payingSource" class="survey-control" />
                   </div>
                   {/*<!-- Telefone da Fonte Pagadora -->*/}
                   <div class="survey-box">
                       <label for="payingSourcePhone" id="payingSourcePhone-label">Telefone da Fonte Pagadora</label>
                       <br />
                       <input type="text" name="payingSourcePhone" value={CLTInfo.payingSourcePhone} onChange={handleCLTInputChange} id="payingSourcePhone" class="survey-control" />
                   </div>
                   {/*<!-- Recebe Gratificação ? -->*/}
                   <div class="survey-box">
                        <label for="gratification" id="gratification-label"> Recebe Gratificação ? </label>
                        <br />
                        <input type="checkbox" name="gratification" value={gratificationAutonomous} onChange={handleGratificationAutonomous} id="gratification" class="survey-control" />
                    </div>
                   <div>
                   {gratificationAutonomous ? (<div>
                            {Array.from({ length: 6 }).map((_, i) => (
                            <>
                            <div key={`month-${i}`} className="survey-box">
                                <label htmlFor={`month${i}`} id={`month${i}-label`}>
                                Mês {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`month${i}`}
                                id={`month${i}`}
                                value={incomeInfo[`month${i+1}`]}
                                onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
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
                                name={`year${i}`}
                                id={`year${i}`}
                                value={incomeInfo[`year${i+1}`]}
                                onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`grossAmount-${i}`} className="survey-box">
                                <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                                Valor Bruto {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`grossAmount${i}`}
                                id={`grossAmount${i}`}
                                value={incomeInfo[`grossAmount${i+1}`]}
                                onChange={(e) => handleInputChange(`grossAmount${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            {/*<!-- Teve deduções ? -->*/}
                   <div class="survey-box" key={`deductions-${i+1}`}>
                        <label for="deductions" id="deductions-label"> No valor informado, teve deduções ? </label>
                        <br />
                        <input type="checkbox" name="deductions" value={deductionsCLT} onChange={handleDeductionsCLT} id="deductions" class="survey-control" />
                    </div>
                   <div>
                   {deductionsCLT ? (<div>
                    <div key={`foodAllowanceValue-${i}`} className="survey-box">
                                <label htmlFor={`foodAllowanceValue${i}`} id={`foodAllowanceValue${i}-label`}>
                                Auxílio Alimentação {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`foodAllowanceValue${i}`}
                                id={`foodAllowanceValue${i}`}
                                value={incomeInfo[`foodAllowanceValue${i+1}`]}
                                onChange={(e) => handleInputChange(`foodAllowanceValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`transportAllowanceValue-${i}`} className="survey-box">
                                <label htmlFor={`transportAllowanceValue${i}`} id={`transportAllowanceValue${i}-label`}>
                                Auxílio Transporte {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`transportAllowanceValue${i}`}
                                id={`transportAllowanceValue${i}`}
                                value={incomeInfo[`transportAllowanceValue${i+1}`]}
                                onChange={(e) => handleInputChange(`transportAllowanceValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`expenseReimbursementValue-${i}`} className="survey-box">
                                <label htmlFor={`expenseReimbursementValue${i}`} id={`expenseReimbursementValue${i}-label`}>
                                Reembolso de despesas {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`expenseReimbursementValue${i}`}
                                id={`expenseReimbursementValue${i}`}
                                value={incomeInfo[`expenseReimbursementValue${i+1}`]}
                                onChange={(e) => handleInputChange(`expenseReimbursementValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`advancePaymentValue-${i}`} className="survey-box">
                                <label htmlFor={`advancePaymentValue${i}`} id={`advancePaymentValue${i}-label`}>
                                Adiantamento ou Antecipações  {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`advancePaymentValue${i}`}
                                id={`advancePaymentValue${i}`}
                                value={incomeInfo[`advancePaymentValue${i+1}`]}
                                onChange={(e) => handleInputChange(`advancePaymentValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`reversalValue-${i}`} className="survey-box">
                                <label htmlFor={`reversalValue${i}`} id={`reversalValue${i}-label`}>
                                Estornos e Compensações {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`reversalValue${i}`}
                                id={`reversalValue${i}`}
                                value={incomeInfo[`reversalValue${i+1}`]}
                                onChange={(e) => handleInputChange(`reversalValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`compensationValue-${i}`} className="survey-box">
                                <label htmlFor={`compensationValue${i}`} id={`compensationValue${i}-label`}>
                                    Indenizações {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`compensationValue${i}`}
                                id={`compensationValue${i}`}
                                value={incomeInfo[`compensationValue${i+1}`]}
                                onChange={(e) => handleInputChange(`compensationValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`judicialPensionValue-${i}`} className="survey-box">
                                <label htmlFor={`judicialPensionValue${i}`} id={`judicialPensionValue${i}-label`}>
                                Pensão Judicial {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`judicialPensionValue${i}`}
                                id={`judicialPensionValue${i}`}
                                value={incomeInfo[`judicialPensionValue${i+1}`]}
                                onChange={(e) => handleInputChange(`judicialPensionValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                        
                    
                    </div>): (
                        <div>
                        <div key={`foodAllowanceValue-${i}`} className="survey-box">
                                <label htmlFor={`foodAllowanceValue${i}`} id={`foodAllowanceValue${i}-label`}>
                                Auxílio Alimentação {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`foodAllowanceValue${i}`}
                                id={`foodAllowanceValue${i}`}
                                value={incomeInfo[`foodAllowanceValue${i+1}`]}
                                onChange={(e) => handleInputChange(`foodAllowanceValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`transportAllowanceValue-${i}`} className="survey-box">
                                <label htmlFor={`transportAllowanceValue${i}`} id={`transportAllowanceValue${i}-label`}>
                                Auxílio Transporte {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`transportAllowanceValue${i}`}
                                id={`transportAllowanceValue${i}`}
                                value={incomeInfo[`transportAllowanceValue${i+1}`]}
                                onChange={(e) => handleInputChange(`transportAllowanceValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`expenseReimbursementValue-${i}`} className="survey-box">
                                <label htmlFor={`expenseReimbursementValue${i}`} id={`expenseReimbursementValue${i}-label`}>
                                Reembolso de despesas {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`expenseReimbursementValue${i}`}
                                id={`expenseReimbursementValue${i}`}
                                value={incomeInfo[`expenseReimbursementValue${i+1}`]}
                                onChange={(e) => handleInputChange(`expenseReimbursementValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`advancePaymentValue-${i}`} className="survey-box">
                                <label htmlFor={`advancePaymentValue${i}`} id={`advancePaymentValue${i}-label`}>
                                Adiantamento ou Antecipações  {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`advancePaymentValue${i}`}
                                id={`advancePaymentValue${i}`}
                                value={incomeInfo[`advancePaymentValue${i+1}`]}
                                onChange={(e) => handleInputChange(`advancePaymentValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`reversalValue-${i}`} className="survey-box">
                                <label htmlFor={`reversalValue${i}`} id={`reversalValue${i}-label`}>
                                Estornos e Compensações {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`reversalValue${i}`}
                                id={`reversalValue${i}`}
                                value={incomeInfo[`reversalValue${i+1}`]}
                                onChange={(e) => handleInputChange(`reversalValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`compensationValue-${i}`} className="survey-box">
                                <label htmlFor={`compensationValue${i}`} id={`compensationValue${i}-label`}>
                                    Indenizações {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`compensationValue${i}`}
                                id={`compensationValue${i}`}
                                value={incomeInfo[`compensationValue${i+1}`]}
                                onChange={(e) => handleInputChange(`compensationValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`judicialPensionValue-${i}`} className="survey-box">
                                <label htmlFor={`judicialPensionValue${i}`} id={`judicialPensionValue${i}-label`}>
                                Pensão Judicial {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`judicialPensionValue${i}`}
                                id={`judicialPensionValue${i}`}
                                value={incomeInfo[`judicialPensionValue${i+1}`]}
                                onChange={(e) => handleInputChange(`judicialPensionValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                </div>
                    )}
                   </div>
                            </>
                    ))}
                    </div>): (
                        <div>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <>
                        <div key={`month-${i}`} className="survey-box">
                            <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                         </label>
                            <br />
                            <input
                            type="text"
                            name={`month${i}`}
                            id={`month${i}`}
                            value={incomeInfo[`month${i+1}`]}
                            onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
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
                            name={`year${i}`}
                            id={`year${i}`}
                            value={incomeInfo[`year${i+1}`]}
                            onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                            className="survey-control"
                            />
                        </div>
                        <div key={`grossAmount-${i}`} className="survey-box">
                            <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                            Valor Bruto {i + 1}
                         </label>
                            <br />
                            <input
                            type="number"
                            name={`grossAmount${i}`}
                            id={`grossAmount${i}`}
                            value={incomeInfo[`month${i+1}`]}
                            onChange={(e) => handleInputChange(`grossAmount${i+1}`, e.target.value)}
                            className="survey-control"
                            />
                        </div>
                        
                        </>

                        
                ))}
                </div>
                    )}
                           
                   </div>
                   <div class="survey-box">
                       <button type="submit" onClick={(e) => handleRegisterIncome(e,'PublicEmployee')}  id="submit-button">Salvar Informações</button>
                   </div>
                   
               </>
                ) 
                }

                {/* DomesticEmployee */}
                {member.incomeSource.includes('DomesticEmployee') &&
                (
                    <>
                   {/*<!-- Data de Admissão -->*/}
                   <div class="survey-box">
                       <label for="admissionDate" id="admissionDate-label">Data de Admissão</label>
                       <br />
                       <input type="date" name="admissionDate" value={CLTInfo.admissionDate} onChange={handleCLTInputChange} id="admissionDate" class="survey-control" />
                   </div>
                   {/*<!-- Cargo -->*/}
                   <div class="survey-box">
                       <label for="position" id="position-label">Cargo</label>
                       <br />
                       <input type="text" name="position" value={CLTInfo.position} onChange={handleCLTInputChange} id="position" class="survey-control" />
                   </div>
                   {/*<!-- Fonte Pagadora( Empresa/Governo/ Pessoa Física) -->*/}
                   <div class="survey-box">
                       <label for="payingSource" id="payingSource-label">Fonte Pagadora</label>
                       <br />
                       <input type="text" name="payingSource" value={CLTInfo.payingSource} onChange={handleCLTInputChange} id="payingSource" class="survey-control" />
                   </div>
                   {/*<!-- Telefone da Fonte Pagadora -->*/}
                   <div class="survey-box">
                       <label for="payingSourcePhone" id="payingSourcePhone-label">Telefone da Fonte Pagadora</label>
                       <br />
                       <input type="text" name="payingSourcePhone" value={CLTInfo.payingSourcePhone} onChange={handleCLTInputChange} id="payingSourcePhone" class="survey-control" />
                   </div>
                   {/*<!-- Recebe Gratificação ? -->*/}
                   <div class="survey-box">
                        <label for="gratification" id="gratification-label"> Recebe Gratificação ? </label>
                        <br />
                        <input type="checkbox" name="gratification" value={gratificationAutonomous} onChange={handleGratificationAutonomous} id="gratification" class="survey-control" />
                    </div>
                   <div>
                   {gratificationAutonomous ? (<div>
                            {Array.from({ length: 6 }).map((_, i) => (
                            <>
                            <div key={`month-${i}`} className="survey-box">
                                <label htmlFor={`month${i}`} id={`month${i}-label`}>
                                Mês {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`month${i}`}
                                id={`month${i}`}
                                value={incomeInfo[`month${i+1}`]}
                                onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
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
                                name={`year${i}`}
                                id={`year${i}`}
                                value={incomeInfo[`year${i+1}`]}
                                onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`grossAmount-${i}`} className="survey-box">
                                <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                                Valor Bruto {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`grossAmount${i}`}
                                id={`grossAmount${i}`}
                                value={incomeInfo[`grossAmount${i+1}`]}
                                onChange={(e) => handleInputChange(`grossAmount${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            {/*<!-- Teve deduções ? -->*/}
                   <div class="survey-box" key={`deductions-${i+1}`}>
                        <label for="deductions" id="deductions-label"> No valor informado, teve deduções ? </label>
                        <br />
                        <input type="checkbox" name="deductions" value={deductionsCLT} onChange={handleDeductionsCLT} id="deductions" class="survey-control" />
                    </div>
                   <div>
                   {deductionsCLT ? (<div>
                    <div key={`foodAllowanceValue-${i}`} className="survey-box">
                                <label htmlFor={`foodAllowanceValue${i}`} id={`foodAllowanceValue${i}-label`}>
                                Auxílio Alimentação {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`foodAllowanceValue${i}`}
                                id={`foodAllowanceValue${i}`}
                                value={incomeInfo[`foodAllowanceValue${i+1}`]}
                                onChange={(e) => handleInputChange(`foodAllowanceValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`transportAllowanceValue-${i}`} className="survey-box">
                                <label htmlFor={`transportAllowanceValue${i}`} id={`transportAllowanceValue${i}-label`}>
                                Auxílio Transporte {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`transportAllowanceValue${i}`}
                                id={`transportAllowanceValue${i}`}
                                value={incomeInfo[`transportAllowanceValue${i+1}`]}
                                onChange={(e) => handleInputChange(`transportAllowanceValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`expenseReimbursementValue-${i}`} className="survey-box">
                                <label htmlFor={`expenseReimbursementValue${i}`} id={`expenseReimbursementValue${i}-label`}>
                                Reembolso de despesas {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`expenseReimbursementValue${i}`}
                                id={`expenseReimbursementValue${i}`}
                                value={incomeInfo[`expenseReimbursementValue${i+1}`]}
                                onChange={(e) => handleInputChange(`expenseReimbursementValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`advancePaymentValue-${i}`} className="survey-box">
                                <label htmlFor={`advancePaymentValue${i}`} id={`advancePaymentValue${i}-label`}>
                                Adiantamento ou Antecipações  {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`advancePaymentValue${i}`}
                                id={`advancePaymentValue${i}`}
                                value={incomeInfo[`advancePaymentValue${i+1}`]}
                                onChange={(e) => handleInputChange(`advancePaymentValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`reversalValue-${i}`} className="survey-box">
                                <label htmlFor={`reversalValue${i}`} id={`reversalValue${i}-label`}>
                                Estornos e Compensações {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`reversalValue${i}`}
                                id={`reversalValue${i}`}
                                value={incomeInfo[`reversalValue${i+1}`]}
                                onChange={(e) => handleInputChange(`reversalValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`compensationValue-${i}`} className="survey-box">
                                <label htmlFor={`compensationValue${i}`} id={`compensationValue${i}-label`}>
                                    Indenizações {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`compensationValue${i}`}
                                id={`compensationValue${i}`}
                                value={incomeInfo[`compensationValue${i+1}`]}
                                onChange={(e) => handleInputChange(`compensationValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`judicialPensionValue-${i}`} className="survey-box">
                                <label htmlFor={`judicialPensionValue${i}`} id={`judicialPensionValue${i}-label`}>
                                Pensão Judicial {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`judicialPensionValue${i}`}
                                id={`judicialPensionValue${i}`}
                                value={incomeInfo[`judicialPensionValue${i+1}`]}
                                onChange={(e) => handleInputChange(`judicialPensionValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                        
                    
                    </div>): (
                        <div>
                        <div key={`foodAllowanceValue-${i}`} className="survey-box">
                                <label htmlFor={`foodAllowanceValue${i}`} id={`foodAllowanceValue${i}-label`}>
                                Auxílio Alimentação {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`foodAllowanceValue${i}`}
                                id={`foodAllowanceValue${i}`}
                                value={incomeInfo[`foodAllowanceValue${i+1}`]}
                                onChange={(e) => handleInputChange(`foodAllowanceValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`transportAllowanceValue-${i}`} className="survey-box">
                                <label htmlFor={`transportAllowanceValue${i}`} id={`transportAllowanceValue${i}-label`}>
                                Auxílio Transporte {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`transportAllowanceValue${i}`}
                                id={`transportAllowanceValue${i}`}
                                value={incomeInfo[`transportAllowanceValue${i+1}`]}
                                onChange={(e) => handleInputChange(`transportAllowanceValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`expenseReimbursementValue-${i}`} className="survey-box">
                                <label htmlFor={`expenseReimbursementValue${i}`} id={`expenseReimbursementValue${i}-label`}>
                                Reembolso de despesas {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`expenseReimbursementValue${i}`}
                                id={`expenseReimbursementValue${i}`}
                                value={incomeInfo[`expenseReimbursementValue${i+1}`]}
                                onChange={(e) => handleInputChange(`expenseReimbursementValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`advancePaymentValue-${i}`} className="survey-box">
                                <label htmlFor={`advancePaymentValue${i}`} id={`advancePaymentValue${i}-label`}>
                                Adiantamento ou Antecipações  {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`advancePaymentValue${i}`}
                                id={`advancePaymentValue${i}`}
                                value={incomeInfo[`advancePaymentValue${i+1}`]}
                                onChange={(e) => handleInputChange(`advancePaymentValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`reversalValue-${i}`} className="survey-box">
                                <label htmlFor={`reversalValue${i}`} id={`reversalValue${i}-label`}>
                                Estornos e Compensações {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`reversalValue${i}`}
                                id={`reversalValue${i}`}
                                value={incomeInfo[`reversalValue${i+1}`]}
                                onChange={(e) => handleInputChange(`reversalValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`compensationValue-${i}`} className="survey-box">
                                <label htmlFor={`compensationValue${i}`} id={`compensationValue${i}-label`}>
                                    Indenizações {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`compensationValue${i}`}
                                id={`compensationValue${i}`}
                                value={incomeInfo[`compensationValue${i+1}`]}
                                onChange={(e) => handleInputChange(`compensationValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`judicialPensionValue-${i}`} className="survey-box">
                                <label htmlFor={`judicialPensionValue${i}`} id={`judicialPensionValue${i}-label`}>
                                Pensão Judicial {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`judicialPensionValue${i}`}
                                id={`judicialPensionValue${i}`}
                                value={incomeInfo[`judicialPensionValue${i+1}`]}
                                onChange={(e) => handleInputChange(`judicialPensionValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                </div>
                    )}
                   </div>
                            </>
                    ))}
                    </div>): (
                        <div>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <>
                        <div key={`month-${i}`} className="survey-box">
                            <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                         </label>
                            <br />
                            <input
                            type="text"
                            name={`month${i}`}
                            id={`month${i}`}
                            value={incomeInfo[`month${i+1}`]}
                            onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
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
                            name={`year${i}`}
                            id={`year${i}`}
                            value={incomeInfo[`year${i+1}`]}
                            onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                            className="survey-control"
                            />
                        </div>
                        <div key={`grossAmount-${i}`} className="survey-box">
                            <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                            Valor Bruto {i + 1}
                         </label>
                            <br />
                            <input
                            type="number"
                            name={`grossAmount${i}`}
                            id={`grossAmount${i}`}
                            value={incomeInfo[`grossAmount${i+1}`]}
                            onChange={(e) => handleInputChange(`grossAmount${i+1}`, e.target.value)}
                            className="survey-control"
                            />
                        </div>
                        
                        </>

                        
                ))}
                </div>
                    )}
                           
                   </div>
                   <div class="survey-box">
                       <button type="submit" onClick={(e) => handleRegisterIncome(e,'DomesticEmployee')}  id="submit-button">Salvar Informações</button>
                   </div>
                   
               </>
                ) 
                }

                {/* TemporaryRuralEmployee */}
                {member.incomeSource.includes('TemporaryRuralEmployee') &&
                (
                    <>
                   {/*<!-- Data de Admissão -->*/}
                   <div class="survey-box">
                       <label for="admissionDate" id="admissionDate-label">Data de Admissão</label>
                       <br />
                       <input type="date" name="admissionDate" value={CLTInfo.admissionDate} onChange={handleCLTInputChange} id="admissionDate" class="survey-control" />
                   </div>
                   {/*<!-- Cargo -->*/}
                   <div class="survey-box">
                       <label for="position" id="position-label">Cargo</label>
                       <br />
                       <input type="text" name="position" value={CLTInfo.position} onChange={handleCLTInputChange} id="position" class="survey-control" />
                   </div>
                   {/*<!-- Fonte Pagadora( Empresa/Governo/ Pessoa Física) -->*/}
                   <div class="survey-box">
                       <label for="payingSource" id="payingSource-label">Fonte Pagadora</label>
                       <br />
                       <input type="text" name="payingSource" value={CLTInfo.payingSource} onChange={handleCLTInputChange} id="payingSource" class="survey-control" />
                   </div>
                   {/*<!-- Telefone da Fonte Pagadora -->*/}
                   <div class="survey-box">
                       <label for="payingSourcePhone" id="payingSourcePhone-label">Telefone da Fonte Pagadora</label>
                       <br />
                       <input type="text" name="payingSourcePhone" value={CLTInfo.payingSourcePhone} onChange={handleCLTInputChange} id="payingSourcePhone" class="survey-control" />
                   </div>
                   {/*<!-- Recebe Gratificação ? -->*/}
                   <div class="survey-box">
                        <label for="gratification" id="gratification-label"> Recebe Gratificação ? </label>
                        <br />
                        <input type="checkbox" name="gratification" value={gratificationAutonomous} onChange={handleGratificationAutonomous} id="gratification" class="survey-control" />
                    </div>
                   <div>
                   {gratificationAutonomous ? (<div>
                            {Array.from({ length: 6 }).map((_, i) => (
                            <>
                            <div key={`month-${i}`} className="survey-box">
                                <label htmlFor={`month${i}`} id={`month${i}-label`}>
                                Mês {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`month${i}`}
                                id={`month${i}`}
                                value={incomeInfo[`month${i+1}`]}
                                onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
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
                                name={`year${i}`}
                                id={`year${i}`}
                                value={incomeInfo[`year${i+1}`]}
                                onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`grossAmount-${i}`} className="survey-box">
                                <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                                Valor Bruto {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`grossAmount${i}`}
                                id={`grossAmount${i}`}
                                value={incomeInfo[`grossAmount${i+1}`]}
                                onChange={(e) => handleInputChange(`grossAmount${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            {/*<!-- Teve deduções ? -->*/}
                   <div class="survey-box" key={`deductions-${i+1}`}>
                        <label for="deductions" id="deductions-label"> No valor informado, teve deduções ? </label>
                        <br />
                        <input type="checkbox" name="deductions" value={deductionsCLT} onChange={handleDeductionsCLT} id="deductions" class="survey-control" />
                    </div>
                   <div>
                   {deductionsCLT ? (<div>
                    <div key={`foodAllowanceValue-${i}`} className="survey-box">
                                <label htmlFor={`foodAllowanceValue${i}`} id={`foodAllowanceValue${i}-label`}>
                                Auxílio Alimentação {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`foodAllowanceValue${i}`}
                                id={`foodAllowanceValue${i}`}
                                value={incomeInfo[`foodAllowanceValue${i+1}`]}
                                onChange={(e) => handleInputChange(`foodAllowanceValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`transportAllowanceValue-${i}`} className="survey-box">
                                <label htmlFor={`transportAllowanceValue${i}`} id={`transportAllowanceValue${i}-label`}>
                                Auxílio Transporte {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`transportAllowanceValue${i}`}
                                id={`transportAllowanceValue${i}`}
                                value={incomeInfo[`transportAllowanceValue${i+1}`]}
                                onChange={(e) => handleInputChange(`transportAllowanceValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`expenseReimbursementValue-${i}`} className="survey-box">
                                <label htmlFor={`expenseReimbursementValue${i}`} id={`expenseReimbursementValue${i}-label`}>
                                Reembolso de despesas {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`expenseReimbursementValue${i}`}
                                id={`expenseReimbursementValue${i}`}
                                value={incomeInfo[`expenseReimbursementValue${i+1}`]}
                                onChange={(e) => handleInputChange(`expenseReimbursementValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`advancePaymentValue-${i}`} className="survey-box">
                                <label htmlFor={`advancePaymentValue${i}`} id={`advancePaymentValue${i}-label`}>
                                Adiantamento ou Antecipações  {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`advancePaymentValue${i}`}
                                id={`advancePaymentValue${i}`}
                                value={incomeInfo[`advancePaymentValue${i+1}`]}
                                onChange={(e) => handleInputChange(`advancePaymentValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`reversalValue-${i}`} className="survey-box">
                                <label htmlFor={`reversalValue${i}`} id={`reversalValue${i}-label`}>
                                Estornos e Compensações {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`reversalValue${i}`}
                                id={`reversalValue${i}`}
                                value={incomeInfo[`reversalValue${i+1}`]}
                                onChange={(e) => handleInputChange(`reversalValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`compensationValue-${i}`} className="survey-box">
                                <label htmlFor={`compensationValue${i}`} id={`compensationValue${i}-label`}>
                                    Indenizações {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`compensationValue${i}`}
                                id={`compensationValue${i}`}
                                value={incomeInfo[`compensationValue${i+1}`]}
                                onChange={(e) => handleInputChange(`compensationValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`judicialPensionValue-${i}`} className="survey-box">
                                <label htmlFor={`judicialPensionValue${i}`} id={`judicialPensionValue${i}-label`}>
                                Pensão Judicial {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`judicialPensionValue${i}`}
                                id={`judicialPensionValue${i}`}
                                value={incomeInfo[`judicialPensionValue${i+1}`]}
                                onChange={(e) => handleInputChange(`judicialPensionValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                        
                    
                    </div>): (
                        <div>
                        <div key={`foodAllowanceValue-${i}`} className="survey-box">
                                <label htmlFor={`foodAllowanceValue${i}`} id={`foodAllowanceValue${i}-label`}>
                                Auxílio Alimentação {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`foodAllowanceValue${i}`}
                                id={`foodAllowanceValue${i}`}
                                value={incomeInfo[`foodAllowanceValue${i+1}`]}
                                onChange={(e) => handleInputChange(`foodAllowanceValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`transportAllowanceValue-${i}`} className="survey-box">
                                <label htmlFor={`transportAllowanceValue${i}`} id={`transportAllowanceValue${i}-label`}>
                                Auxílio Transporte {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`transportAllowanceValue${i}`}
                                id={`transportAllowanceValue${i}`}
                                value={incomeInfo[`transportAllowanceValue${i+1}`]}
                                onChange={(e) => handleInputChange(`transportAllowanceValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`expenseReimbursementValue-${i}`} className="survey-box">
                                <label htmlFor={`expenseReimbursementValue${i}`} id={`expenseReimbursementValue${i}-label`}>
                                Reembolso de despesas {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`expenseReimbursementValue${i}`}
                                id={`expenseReimbursementValue${i}`}
                                value={incomeInfo[`expenseReimbursementValue${i+1}`]}
                                onChange={(e) => handleInputChange(`expenseReimbursementValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`advancePaymentValue-${i}`} className="survey-box">
                                <label htmlFor={`advancePaymentValue${i}`} id={`advancePaymentValue${i}-label`}>
                                Adiantamento ou Antecipações  {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`advancePaymentValue${i}`}
                                id={`advancePaymentValue${i}`}
                                value={incomeInfo[`advancePaymentValue${i+1}`]}
                                onChange={(e) => handleInputChange(`advancePaymentValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`reversalValue-${i}`} className="survey-box">
                                <label htmlFor={`reversalValue${i}`} id={`reversalValue${i}-label`}>
                                Estornos e Compensações {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`reversalValue${i}`}
                                id={`reversalValue${i}`}
                                value={incomeInfo[`reversalValue${i+1}`]}
                                onChange={(e) => handleInputChange(`reversalValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`compensationValue-${i}`} className="survey-box">
                                <label htmlFor={`compensationValue${i}`} id={`compensationValue${i}-label`}>
                                    Indenizações {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`compensationValue${i}`}
                                id={`compensationValue${i}`}
                                value={incomeInfo[`compensationValue${i+1}`]}
                                onChange={(e) => handleInputChange(`compensationValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`judicialPensionValue-${i}`} className="survey-box">
                                <label htmlFor={`judicialPensionValue${i}`} id={`judicialPensionValue${i}-label`}>
                                Pensão Judicial {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`judicialPensionValue${i}`}
                                id={`judicialPensionValue${i}`}
                                value={incomeInfo[`judicialPensionValue${i+1}`]}
                                onChange={(e) => handleInputChange(`judicialPensionValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                </div>
                    )}
                   </div>
                            </>
                    ))}
                    </div>): (
                        <div>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <>
                        <div key={`month-${i}`} className="survey-box">
                            <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                         </label>
                            <br />
                            <input
                            type="text"
                            name={`month${i}`}
                            id={`month${i}`}
                            value={incomeInfo[`month${i+1}`]}
                            onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
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
                            name={`year${i}`}
                            id={`year${i}`}
                            value={incomeInfo[`year${i+1}`]}
                            onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                            className="survey-control"
                            />
                        </div>
                        <div key={`grossAmount-${i}`} className="survey-box">
                            <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                            Valor Bruto {i + 1}
                         </label>
                            <br />
                            <input
                            type="number"
                            name={`grossAmount${i}`}
                            id={`grossAmount${i}`}
                            value={incomeInfo[`month${i+1}`]}
                            onChange={(e) => handleInputChange(`grossAmount${i+1}`, e.target.value)}
                            className="survey-control"
                            />
                        </div>
                        
                        </>

                        
                ))}
                </div>
                    )}
                           
                   </div>
                   <div class="survey-box">
                       <button type="submit" onClick={(e) => handleRegisterIncome(e,'TemporaryRuralEmployee')}  id="submit-button">Salvar Informações</button>
                   </div>
                   
               </>
                ) 
                }

                {/* Retired */}
                {member.incomeSource.includes('Retired') &&
                (
                    <>
                   {/*<!-- Data de Admissão -->*/}
                   <div class="survey-box">
                       <label for="admissionDate" id="admissionDate-label">Data de Admissão</label>
                       <br />
                       <input type="date" name="admissionDate" value={CLTInfo.admissionDate} onChange={handleCLTInputChange} id="admissionDate" class="survey-control" />
                   </div>
                   {/*<!-- Cargo -->*/}
                   <div class="survey-box">
                       <label for="position" id="position-label">Cargo</label>
                       <br />
                       <input type="text" name="position" value={CLTInfo.position} onChange={handleCLTInputChange} id="position" class="survey-control" />
                   </div>
                   {/*<!-- Fonte Pagadora( Empresa/Governo/ Pessoa Física) -->*/}
                   <div class="survey-box">
                       <label for="payingSource" id="payingSource-label">Fonte Pagadora</label>
                       <br />
                       <input type="text" name="payingSource" value={CLTInfo.payingSource} onChange={handleCLTInputChange} id="payingSource" class="survey-control" />
                   </div>
                   {/*<!-- Telefone da Fonte Pagadora -->*/}
                   <div class="survey-box">
                       <label for="payingSourcePhone" id="payingSourcePhone-label">Telefone da Fonte Pagadora</label>
                       <br />
                       <input type="text" name="payingSourcePhone" value={CLTInfo.payingSourcePhone} onChange={handleCLTInputChange} id="payingSourcePhone" class="survey-control" />
                   </div>
                   {/*<!-- Recebe Gratificação ? -->*/}
                   <div class="survey-box">
                        <label for="gratification" id="gratification-label"> Recebe Gratificação ? </label>
                        <br />
                        <input type="checkbox" name="gratification" value={gratificationAutonomous} onChange={handleGratificationAutonomous} id="gratification" class="survey-control" />
                    </div>
                   <div>
                   {gratificationAutonomous ? (<div>
                            {Array.from({ length: 6 }).map((_, i) => (
                            <>
                            <div key={`month-${i}`} className="survey-box">
                                <label htmlFor={`month${i}`} id={`month${i}-label`}>
                                Mês {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`month${i}`}
                                id={`month${i}`}
                                value={incomeInfo[`month${i+1}`]}
                                onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
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
                                name={`year${i}`}
                                id={`year${i}`}
                                value={incomeInfo[`year${i+1}`]}
                                onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`grossAmount-${i}`} className="survey-box">
                                <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                                Valor Bruto {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`grossAmount${i}`}
                                id={`grossAmount${i}`}
                                value={incomeInfo[`grossAmount${i+1}`]}
                                onChange={(e) => handleInputChange(`grossAmount${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            {/*<!-- Teve deduções ? -->*/}
                   <div class="survey-box" key={`deductions-${i+1}`}>
                        <label for="deductions" id="deductions-label"> No valor informado, teve deduções ? </label>
                        <br />
                        <input type="checkbox" name="deductions" value={deductionsCLT} onChange={handleDeductionsCLT} id="deductions" class="survey-control" />
                    </div>
                   <div>
                   {deductionsCLT ? (<div>
                    <div key={`foodAllowanceValue-${i}`} className="survey-box">
                                <label htmlFor={`foodAllowanceValue${i}`} id={`foodAllowanceValue${i}-label`}>
                                Auxílio Alimentação {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`foodAllowanceValue${i}`}
                                id={`foodAllowanceValue${i}`}
                                value={incomeInfo[`foodAllowanceValue${i+1}`]}
                                onChange={(e) => handleInputChange(`foodAllowanceValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`transportAllowanceValue-${i}`} className="survey-box">
                                <label htmlFor={`transportAllowanceValue${i}`} id={`transportAllowanceValue${i}-label`}>
                                Auxílio Transporte {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`transportAllowanceValue${i}`}
                                id={`transportAllowanceValue${i}`}
                                value={incomeInfo[`transportAllowanceValue${i+1}`]}
                                onChange={(e) => handleInputChange(`transportAllowanceValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`expenseReimbursementValue-${i}`} className="survey-box">
                                <label htmlFor={`expenseReimbursementValue${i}`} id={`expenseReimbursementValue${i}-label`}>
                                Reembolso de despesas {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`expenseReimbursementValue${i}`}
                                id={`expenseReimbursementValue${i}`}
                                value={incomeInfo[`expenseReimbursementValue${i+1}`]}
                                onChange={(e) => handleInputChange(`expenseReimbursementValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`advancePaymentValue-${i}`} className="survey-box">
                                <label htmlFor={`advancePaymentValue${i}`} id={`advancePaymentValue${i}-label`}>
                                Adiantamento ou Antecipações  {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`advancePaymentValue${i}`}
                                id={`advancePaymentValue${i}`}
                                value={incomeInfo[`advancePaymentValue${i+1}`]}
                                onChange={(e) => handleInputChange(`advancePaymentValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`reversalValue-${i}`} className="survey-box">
                                <label htmlFor={`reversalValue${i}`} id={`reversalValue${i}-label`}>
                                Estornos e Compensações {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`reversalValue${i}`}
                                id={`reversalValue${i}`}
                                value={incomeInfo[`reversalValue${i+1}`]}
                                onChange={(e) => handleInputChange(`reversalValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`compensationValue-${i}`} className="survey-box">
                                <label htmlFor={`compensationValue${i}`} id={`compensationValue${i}-label`}>
                                    Indenizações {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`compensationValue${i}`}
                                id={`compensationValue${i}`}
                                value={incomeInfo[`compensationValue${i+1}`]}
                                onChange={(e) => handleInputChange(`compensationValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`judicialPensionValue-${i}`} className="survey-box">
                                <label htmlFor={`judicialPensionValue${i}`} id={`judicialPensionValue${i}-label`}>
                                Pensão Judicial {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`judicialPensionValue${i}`}
                                id={`judicialPensionValue${i}`}
                                value={incomeInfo[`judicialPensionValue${i+1}`]}
                                onChange={(e) => handleInputChange(`judicialPensionValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                        
                    
                    </div>): (
                        <div>
                        <div key={`foodAllowanceValue-${i}`} className="survey-box">
                                <label htmlFor={`foodAllowanceValue${i}`} id={`foodAllowanceValue${i}-label`}>
                                Auxílio Alimentação {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`foodAllowanceValue${i}`}
                                id={`foodAllowanceValue${i}`}
                                value={incomeInfo[`foodAllowanceValue${i+1}`]}
                                onChange={(e) => handleInputChange(`foodAllowanceValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`transportAllowanceValue-${i}`} className="survey-box">
                                <label htmlFor={`transportAllowanceValue${i}`} id={`transportAllowanceValue${i}-label`}>
                                Auxílio Transporte {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`transportAllowanceValue${i}`}
                                id={`transportAllowanceValue${i}`}
                                value={incomeInfo[`transportAllowanceValue${i+1}`]}
                                onChange={(e) => handleInputChange(`transportAllowanceValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`expenseReimbursementValue-${i}`} className="survey-box">
                                <label htmlFor={`expenseReimbursementValue${i}`} id={`expenseReimbursementValue${i}-label`}>
                                Reembolso de despesas {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`expenseReimbursementValue${i}`}
                                id={`expenseReimbursementValue${i}`}
                                value={incomeInfo[`expenseReimbursementValue${i+1}`]}
                                onChange={(e) => handleInputChange(`expenseReimbursementValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`advancePaymentValue-${i}`} className="survey-box">
                                <label htmlFor={`advancePaymentValue${i}`} id={`advancePaymentValue${i}-label`}>
                                Adiantamento ou Antecipações  {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`advancePaymentValue${i}`}
                                id={`advancePaymentValue${i}`}
                                value={incomeInfo[`advancePaymentValue${i+1}`]}
                                onChange={(e) => handleInputChange(`advancePaymentValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`reversalValue-${i}`} className="survey-box">
                                <label htmlFor={`reversalValue${i}`} id={`reversalValue${i}-label`}>
                                Estornos e Compensações {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`reversalValue${i}`}
                                id={`reversalValue${i}`}
                                value={incomeInfo[`reversalValue${i+1}`]}
                                onChange={(e) => handleInputChange(`reversalValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`compensationValue-${i}`} className="survey-box">
                                <label htmlFor={`compensationValue${i}`} id={`compensationValue${i}-label`}>
                                    Indenizações {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`compensationValue${i}`}
                                id={`compensationValue${i}`}
                                value={incomeInfo[`compensationValue${i+1}`]}
                                onChange={(e) => handleInputChange(`compensationValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`judicialPensionValue-${i}`} className="survey-box">
                                <label htmlFor={`judicialPensionValue${i}`} id={`judicialPensionValue${i}-label`}>
                                Pensão Judicial {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`judicialPensionValue${i}`}
                                id={`judicialPensionValue${i}`}
                                value={incomeInfo[`judicialPensionValue${i+1}`]}
                                onChange={(e) => handleInputChange(`judicialPensionValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                </div>
                    )}
                   </div>
                            </>
                    ))}
                    </div>): (
                        <div>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <>
                        <div key={`month-${i}`} className="survey-box">
                            <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                         </label>
                            <br />
                            <input
                            type="text"
                            name={`month${i}`}
                            id={`month${i}`}
                            value={incomeInfo[`month${i+1}`]}
                            onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
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
                            name={`year${i}`}
                            id={`year${i}`}
                            value={incomeInfo[`year${i+1}`]}
                            onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                            className="survey-control"
                            />
                        </div>
                        <div key={`grossAmount-${i}`} className="survey-box">
                            <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                            Valor Bruto {i + 1}
                         </label>
                            <br />
                            <input
                            type="number"
                            name={`grossAmount${i}`}
                            id={`grossAmount${i}`}
                            value={incomeInfo[`month${i+1}`]}
                            onChange={(e) => handleInputChange(`grossAmount${i+1}`, e.target.value)}
                            className="survey-control"
                            />
                        </div>
                        
                        </>

                        
                ))}
                </div>
                    )}
                           
                   </div>
                   <div class="survey-box">
                       <button type="submit" onClick={(e) => handleRegisterIncome(e,'Retired')}  id="submit-button">Salvar Informações</button>
                   </div>
                   
               </>
                ) 
                }
                {/* Pensioner */}
                {member.incomeSource.includes('Pensioner') &&
                (
                    <>
                   {/*<!-- Data de Admissão -->*/}
                   <div class="survey-box">
                       <label for="admissionDate" id="admissionDate-label">Data de Admissão</label>
                       <br />
                       <input type="date" name="admissionDate" value={CLTInfo.admissionDate} onChange={handleCLTInputChange} id="admissionDate" class="survey-control" />
                   </div>
                   {/*<!-- Cargo -->*/}
                   <div class="survey-box">
                       <label for="position" id="position-label">Cargo</label>
                       <br />
                       <input type="text" name="position" value={CLTInfo.position} onChange={handleCLTInputChange} id="position" class="survey-control" />
                   </div>
                   {/*<!-- Fonte Pagadora( Empresa/Governo/ Pessoa Física) -->*/}
                   <div class="survey-box">
                       <label for="payingSource" id="payingSource-label">Fonte Pagadora</label>
                       <br />
                       <input type="text" name="payingSource" value={CLTInfo.payingSource} onChange={handleCLTInputChange} id="payingSource" class="survey-control" />
                   </div>
                   {/*<!-- Telefone da Fonte Pagadora -->*/}
                   <div class="survey-box">
                       <label for="payingSourcePhone" id="payingSourcePhone-label">Telefone da Fonte Pagadora</label>
                       <br />
                       <input type="text" name="payingSourcePhone" value={CLTInfo.payingSourcePhone} onChange={handleCLTInputChange} id="payingSourcePhone" class="survey-control" />
                   </div>
                   {/*<!-- Recebe Gratificação ? -->*/}
                   <div class="survey-box">
                        <label for="gratification" id="gratification-label"> Recebe Gratificação ? </label>
                        <br />
                        <input type="checkbox" name="gratification" value={gratificationAutonomous} onChange={handleGratificationAutonomous} id="gratification" class="survey-control" />
                    </div>
                   <div>
                   {gratificationAutonomous ? (<div>
                            {Array.from({ length: 6 }).map((_, i) => (
                            <>
                            <div key={`month-${i}`} className="survey-box">
                                <label htmlFor={`month${i}`} id={`month${i}-label`}>
                                Mês {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`month${i}`}
                                id={`month${i}`}
                                value={incomeInfo[`month${i+1}`]}
                                onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
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
                                name={`year${i}`}
                                id={`year${i}`}
                                value={incomeInfo[`year${i+1}`]}
                                onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`grossAmount-${i}`} className="survey-box">
                                <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                                Valor Bruto {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`grossAmount${i}`}
                                id={`grossAmount${i}`}
                                value={incomeInfo[`grossAmount${i+1}`]}
                                onChange={(e) => handleInputChange(`grossAmount${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            {/*<!-- Teve deduções ? -->*/}
                   <div class="survey-box" key={`deductions-${i+1}`}>
                        <label for="deductions" id="deductions-label"> No valor informado, teve deduções ? </label>
                        <br />
                        <input type="checkbox" name="deductions" value={deductionsCLT} onChange={handleDeductionsCLT} id="deductions" class="survey-control" />
                    </div>
                   <div>
                   {deductionsCLT ? (<div>
                    <div key={`foodAllowanceValue-${i}`} className="survey-box">
                                <label htmlFor={`foodAllowanceValue${i}`} id={`foodAllowanceValue${i}-label`}>
                                Auxílio Alimentação {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`foodAllowanceValue${i}`}
                                id={`foodAllowanceValue${i}`}
                                value={incomeInfo[`foodAllowanceValue${i+1}`]}
                                onChange={(e) => handleInputChange(`foodAllowanceValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`transportAllowanceValue-${i}`} className="survey-box">
                                <label htmlFor={`transportAllowanceValue${i}`} id={`transportAllowanceValue${i}-label`}>
                                Auxílio Transporte {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`transportAllowanceValue${i}`}
                                id={`transportAllowanceValue${i}`}
                                value={incomeInfo[`transportAllowanceValue${i+1}`]}
                                onChange={(e) => handleInputChange(`transportAllowanceValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`expenseReimbursementValue-${i}`} className="survey-box">
                                <label htmlFor={`expenseReimbursementValue${i}`} id={`expenseReimbursementValue${i}-label`}>
                                Reembolso de despesas {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`expenseReimbursementValue${i}`}
                                id={`expenseReimbursementValue${i}`}
                                value={incomeInfo[`expenseReimbursementValue${i+1}`]}
                                onChange={(e) => handleInputChange(`expenseReimbursementValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`advancePaymentValue-${i}`} className="survey-box">
                                <label htmlFor={`advancePaymentValue${i}`} id={`advancePaymentValue${i}-label`}>
                                Adiantamento ou Antecipações  {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`advancePaymentValue${i}`}
                                id={`advancePaymentValue${i}`}
                                value={incomeInfo[`advancePaymentValue${i+1}`]}
                                onChange={(e) => handleInputChange(`advancePaymentValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`reversalValue-${i}`} className="survey-box">
                                <label htmlFor={`reversalValue${i}`} id={`reversalValue${i}-label`}>
                                Estornos e Compensações {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`reversalValue${i}`}
                                id={`reversalValue${i}`}
                                value={incomeInfo[`reversalValue${i+1}`]}
                                onChange={(e) => handleInputChange(`reversalValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`compensationValue-${i}`} className="survey-box">
                                <label htmlFor={`compensationValue${i}`} id={`compensationValue${i}-label`}>
                                    Indenizações {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`compensationValue${i}`}
                                id={`compensationValue${i}`}
                                value={incomeInfo[`compensationValue${i+1}`]}
                                onChange={(e) => handleInputChange(`compensationValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`judicialPensionValue-${i}`} className="survey-box">
                                <label htmlFor={`judicialPensionValue${i}`} id={`judicialPensionValue${i}-label`}>
                                Pensão Judicial {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`judicialPensionValue${i}`}
                                id={`judicialPensionValue${i}`}
                                value={incomeInfo[`judicialPensionValue${i+1}`]}
                                onChange={(e) => handleInputChange(`judicialPensionValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                        
                    
                    </div>): (
                        <div>
                        <div key={`foodAllowanceValue-${i}`} className="survey-box">
                                <label htmlFor={`foodAllowanceValue${i}`} id={`foodAllowanceValue${i}-label`}>
                                Auxílio Alimentação {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`foodAllowanceValue${i}`}
                                id={`foodAllowanceValue${i}`}
                                value={incomeInfo[`foodAllowanceValue${i+1}`]}
                                onChange={(e) => handleInputChange(`foodAllowanceValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`transportAllowanceValue-${i}`} className="survey-box">
                                <label htmlFor={`transportAllowanceValue${i}`} id={`transportAllowanceValue${i}-label`}>
                                Auxílio Transporte {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`transportAllowanceValue${i}`}
                                id={`transportAllowanceValue${i}`}
                                value={incomeInfo[`transportAllowanceValue${i+1}`]}
                                onChange={(e) => handleInputChange(`transportAllowanceValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`expenseReimbursementValue-${i}`} className="survey-box">
                                <label htmlFor={`expenseReimbursementValue${i}`} id={`expenseReimbursementValue${i}-label`}>
                                Reembolso de despesas {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`expenseReimbursementValue${i}`}
                                id={`expenseReimbursementValue${i}`}
                                value={incomeInfo[`expenseReimbursementValue${i+1}`]}
                                onChange={(e) => handleInputChange(`expenseReimbursementValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`advancePaymentValue-${i}`} className="survey-box">
                                <label htmlFor={`advancePaymentValue${i}`} id={`advancePaymentValue${i}-label`}>
                                Adiantamento ou Antecipações  {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`advancePaymentValue${i}`}
                                id={`advancePaymentValue${i}`}
                                value={incomeInfo[`advancePaymentValue${i+1}`]}
                                onChange={(e) => handleInputChange(`advancePaymentValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`reversalValue-${i}`} className="survey-box">
                                <label htmlFor={`reversalValue${i}`} id={`reversalValue${i}-label`}>
                                Estornos e Compensações {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`reversalValue${i}`}
                                id={`reversalValue${i}`}
                                value={incomeInfo[`reversalValue${i+1}`]}
                                onChange={(e) => handleInputChange(`reversalValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`compensationValue-${i}`} className="survey-box">
                                <label htmlFor={`compensationValue${i}`} id={`compensationValue${i}-label`}>
                                    Indenizações {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`compensationValue${i}`}
                                id={`compensationValue${i}`}
                                value={incomeInfo[`compensationValue${i+1}`]}
                                onChange={(e) => handleInputChange(`compensationValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`judicialPensionValue-${i}`} className="survey-box">
                                <label htmlFor={`judicialPensionValue${i}`} id={`judicialPensionValue${i}-label`}>
                                Pensão Judicial {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`judicialPensionValue${i}`}
                                id={`judicialPensionValue${i}`}
                                value={incomeInfo[`judicialPensionValue${i+1}`]}
                                onChange={(e) => handleInputChange(`judicialPensionValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                </div>
                    )}
                   </div>
                            </>
                    ))}
                    </div>): (
                        <div>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <>
                        <div key={`month-${i}`} className="survey-box">
                            <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                         </label>
                            <br />
                            <input
                            type="text"
                            name={`month${i}`}
                            id={`month${i}`}
                            value={incomeInfo[`month${i+1}`]}
                            onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
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
                            name={`year${i}`}
                            id={`year${i}`}
                            value={incomeInfo[`year${i+1}`]}
                            onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                            className="survey-control"
                            />
                        </div>
                        <div key={`grossAmount-${i}`} className="survey-box">
                            <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                            Valor Bruto {i + 1}
                         </label>
                            <br />
                            <input
                            type="number"
                            name={`grossAmount${i}`}
                            id={`grossAmount${i}`}
                            value={incomeInfo[`month${i+1}`]}
                            onChange={(e) => handleInputChange(`grossAmount${i+1}`, e.target.value)}
                            className="survey-control"
                            />
                        </div>
                        
                        </>

                        
                ))}
                </div>
                    )}
                           
                   </div>
                   <div class="survey-box">
                       <button type="submit" onClick={(e) => handleRegisterIncome(e,'Pensioner')}  id="submit-button">Salvar Informações</button>
                   </div>
                   
               </>
                ) 
                }
                {/* TemporaryDisabilityBenefit */}
                {member.incomeSource.includes('TemporaryDisabilityBenefit') &&
                (
                    <>
                   {/*<!-- Data de Admissão -->*/}
                   <div class="survey-box">
                       <label for="admissionDate" id="admissionDate-label">Data de Admissão</label>
                       <br />
                       <input type="date" name="admissionDate" value={CLTInfo.admissionDate} onChange={handleCLTInputChange} id="admissionDate" class="survey-control" />
                   </div>
                   {/*<!-- Cargo -->*/}
                   <div class="survey-box">
                       <label for="position" id="position-label">Cargo</label>
                       <br />
                       <input type="text" name="position" value={CLTInfo.position} onChange={handleCLTInputChange} id="position" class="survey-control" />
                   </div>
                   {/*<!-- Fonte Pagadora( Empresa/Governo/ Pessoa Física) -->*/}
                   <div class="survey-box">
                       <label for="payingSource" id="payingSource-label">Fonte Pagadora</label>
                       <br />
                       <input type="text" name="payingSource" value={CLTInfo.payingSource} onChange={handleCLTInputChange} id="payingSource" class="survey-control" />
                   </div>
                   {/*<!-- Telefone da Fonte Pagadora -->*/}
                   <div class="survey-box">
                       <label for="payingSourcePhone" id="payingSourcePhone-label">Telefone da Fonte Pagadora</label>
                       <br />
                       <input type="text" name="payingSourcePhone" value={CLTInfo.payingSourcePhone} onChange={handleCLTInputChange} id="payingSourcePhone" class="survey-control" />
                   </div>
                   {/*<!-- Recebe Gratificação ? -->*/}
                   <div class="survey-box">
                        <label for="gratification" id="gratification-label"> Recebe Gratificação ? </label>
                        <br />
                        <input type="checkbox" name="gratification" value={gratificationAutonomous} onChange={handleGratificationAutonomous} id="gratification" class="survey-control" />
                    </div>
                   <div>
                   {gratificationAutonomous ? (<div>
                            {Array.from({ length: 6 }).map((_, i) => (
                            <>
                            <div key={`month-${i}`} className="survey-box">
                                <label htmlFor={`month${i}`} id={`month${i}-label`}>
                                Mês {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`month${i}`}
                                id={`month${i}`}
                                value={incomeInfo[`month${i+1}`]}
                                onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
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
                                name={`year${i}`}
                                id={`year${i}`}
                                value={incomeInfo[`year${i+1}`]}
                                onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`grossAmount-${i}`} className="survey-box">
                                <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                                Valor Bruto {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`grossAmount${i}`}
                                id={`grossAmount${i}`}
                                value={incomeInfo[`grossAmount${i+1}`]}
                                onChange={(e) => handleInputChange(`grossAmount${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            {/*<!-- Teve deduções ? -->*/}
                   <div class="survey-box" key={`deductions-${i+1}`}>
                        <label for="deductions" id="deductions-label"> No valor informado, teve deduções ? </label>
                        <br />
                        <input type="checkbox" name="deductions" value={deductionsCLT} onChange={handleDeductionsCLT} id="deductions" class="survey-control" />
                    </div>
                   <div>
                   {deductionsCLT ? (<div>
                    <div key={`foodAllowanceValue-${i}`} className="survey-box">
                                <label htmlFor={`foodAllowanceValue${i}`} id={`foodAllowanceValue${i}-label`}>
                                Auxílio Alimentação {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`foodAllowanceValue${i}`}
                                id={`foodAllowanceValue${i}`}
                                value={incomeInfo[`foodAllowanceValue${i+1}`]}
                                onChange={(e) => handleInputChange(`foodAllowanceValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`transportAllowanceValue-${i}`} className="survey-box">
                                <label htmlFor={`transportAllowanceValue${i}`} id={`transportAllowanceValue${i}-label`}>
                                Auxílio Transporte {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`transportAllowanceValue${i}`}
                                id={`transportAllowanceValue${i}`}
                                value={incomeInfo[`transportAllowanceValue${i+1}`]}
                                onChange={(e) => handleInputChange(`transportAllowanceValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`expenseReimbursementValue-${i}`} className="survey-box">
                                <label htmlFor={`expenseReimbursementValue${i}`} id={`expenseReimbursementValue${i}-label`}>
                                Reembolso de despesas {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`expenseReimbursementValue${i}`}
                                id={`expenseReimbursementValue${i}`}
                                value={incomeInfo[`expenseReimbursementValue${i+1}`]}
                                onChange={(e) => handleInputChange(`expenseReimbursementValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`advancePaymentValue-${i}`} className="survey-box">
                                <label htmlFor={`advancePaymentValue${i}`} id={`advancePaymentValue${i}-label`}>
                                Adiantamento ou Antecipações  {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`advancePaymentValue${i}`}
                                id={`advancePaymentValue${i}`}
                                value={incomeInfo[`advancePaymentValue${i+1}`]}
                                onChange={(e) => handleInputChange(`advancePaymentValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`reversalValue-${i}`} className="survey-box">
                                <label htmlFor={`reversalValue${i}`} id={`reversalValue${i}-label`}>
                                Estornos e Compensações {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`reversalValue${i}`}
                                id={`reversalValue${i}`}
                                value={incomeInfo[`reversalValue${i+1}`]}
                                onChange={(e) => handleInputChange(`reversalValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`compensationValue-${i}`} className="survey-box">
                                <label htmlFor={`compensationValue${i}`} id={`compensationValue${i}-label`}>
                                    Indenizações {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`compensationValue${i}`}
                                id={`compensationValue${i}`}
                                value={incomeInfo[`compensationValue${i+1}`]}
                                onChange={(e) => handleInputChange(`compensationValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`judicialPensionValue-${i}`} className="survey-box">
                                <label htmlFor={`judicialPensionValue${i}`} id={`judicialPensionValue${i}-label`}>
                                Pensão Judicial {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`judicialPensionValue${i}`}
                                id={`judicialPensionValue${i}`}
                                value={incomeInfo[`judicialPensionValue${i+1}`]}
                                onChange={(e) => handleInputChange(`judicialPensionValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                        
                    
                    </div>): (
                        <div>
                        <div key={`foodAllowanceValue-${i}`} className="survey-box">
                                <label htmlFor={`foodAllowanceValue${i}`} id={`foodAllowanceValue${i}-label`}>
                                Auxílio Alimentação {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`foodAllowanceValue${i}`}
                                id={`foodAllowanceValue${i}`}
                                value={incomeInfo[`foodAllowanceValue${i+1}`]}
                                onChange={(e) => handleInputChange(`foodAllowanceValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`transportAllowanceValue-${i}`} className="survey-box">
                                <label htmlFor={`transportAllowanceValue${i}`} id={`transportAllowanceValue${i}-label`}>
                                Auxílio Transporte {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`transportAllowanceValue${i}`}
                                id={`transportAllowanceValue${i}`}
                                value={incomeInfo[`transportAllowanceValue${i+1}`]}
                                onChange={(e) => handleInputChange(`transportAllowanceValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`expenseReimbursementValue-${i}`} className="survey-box">
                                <label htmlFor={`expenseReimbursementValue${i}`} id={`expenseReimbursementValue${i}-label`}>
                                Reembolso de despesas {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`expenseReimbursementValue${i}`}
                                id={`expenseReimbursementValue${i}`}
                                value={incomeInfo[`expenseReimbursementValue${i+1}`]}
                                onChange={(e) => handleInputChange(`expenseReimbursementValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`advancePaymentValue-${i}`} className="survey-box">
                                <label htmlFor={`advancePaymentValue${i}`} id={`advancePaymentValue${i}-label`}>
                                Adiantamento ou Antecipações  {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`advancePaymentValue${i}`}
                                id={`advancePaymentValue${i}`}
                                value={incomeInfo[`advancePaymentValue${i+1}`]}
                                onChange={(e) => handleInputChange(`advancePaymentValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`reversalValue-${i}`} className="survey-box">
                                <label htmlFor={`reversalValue${i}`} id={`reversalValue${i}-label`}>
                                Estornos e Compensações {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`reversalValue${i}`}
                                id={`reversalValue${i}`}
                                value={incomeInfo[`reversalValue${i+1}`]}
                                onChange={(e) => handleInputChange(`reversalValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`compensationValue-${i}`} className="survey-box">
                                <label htmlFor={`compensationValue${i}`} id={`compensationValue${i}-label`}>
                                    Indenizações {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`compensationValue${i}`}
                                id={`compensationValue${i}`}
                                value={incomeInfo[`compensationValue${i+1}`]}
                                onChange={(e) => handleInputChange(`compensationValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`judicialPensionValue-${i}`} className="survey-box">
                                <label htmlFor={`judicialPensionValue${i}`} id={`judicialPensionValue${i}-label`}>
                                Pensão Judicial {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`judicialPensionValue${i}`}
                                id={`judicialPensionValue${i}`}
                                value={incomeInfo[`judicialPensionValue${i+1}`]}
                                onChange={(e) => handleInputChange(`judicialPensionValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                </div>
                    )}
                   </div>
                            </>
                    ))}
                    </div>): (
                        <div>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <>
                        <div key={`month-${i}`} className="survey-box">
                            <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                         </label>
                            <br />
                            <input
                            type="text"
                            name={`month${i}`}
                            id={`month${i}`}
                            value={incomeInfo[`month${i+1}`]}
                            onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
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
                            name={`year${i}`}
                            id={`year${i}`}
                            value={incomeInfo[`year${i+1}`]}
                            onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                            className="survey-control"
                            />
                        </div>
                        <div key={`grossAmount-${i}`} className="survey-box">
                            <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                            Valor Bruto {i + 1}
                         </label>
                            <br />
                            <input
                            type="number"
                            name={`grossAmount${i}`}
                            id={`grossAmount${i}`}
                            value={incomeInfo[`month${i+1}`]}
                            onChange={(e) => handleInputChange(`grossAmount${i+1}`, e.target.value)}
                            className="survey-control"
                            />
                        </div>
                        
                        </>

                        
                ))}
                </div>
                    )}
                           
                   </div>
                   <div class="survey-box">
                       <button type="submit" onClick={(e) => handleRegisterIncome(e,'TemporaryDisabilityBenefit')}  id="submit-button">Salvar Informações</button>
                   </div>
                   
               </>
                ) 
                }
                
                {/* Apprentice */}
                {member.incomeSource.includes('Apprentice') &&
                (
                    <>
                   {/*<!-- Data de Admissão -->*/}
                   <div class="survey-box">
                       <label for="admissionDate" id="admissionDate-label">Data de Admissão</label>
                       <br />
                       <input type="date" name="admissionDate" value={CLTInfo.admissionDate} onChange={handleCLTInputChange} id="admissionDate" class="survey-control" />
                   </div>
                   {/*<!-- Cargo -->*/}
                   <div class="survey-box">
                       <label for="position" id="position-label">Cargo</label>
                       <br />
                       <input type="text" name="position" value={CLTInfo.position} onChange={handleCLTInputChange} id="position" class="survey-control" />
                   </div>
                   {/*<!-- Fonte Pagadora( Empresa/Governo/ Pessoa Física) -->*/}
                   <div class="survey-box">
                       <label for="payingSource" id="payingSource-label">Fonte Pagadora</label>
                       <br />
                       <input type="text" name="payingSource" value={CLTInfo.payingSource} onChange={handleCLTInputChange} id="payingSource" class="survey-control" />
                   </div>
                   {/*<!-- Telefone da Fonte Pagadora -->*/}
                   <div class="survey-box">
                       <label for="payingSourcePhone" id="payingSourcePhone-label">Telefone da Fonte Pagadora</label>
                       <br />
                       <input type="text" name="payingSourcePhone" value={CLTInfo.payingSourcePhone} onChange={handleCLTInputChange} id="payingSourcePhone" class="survey-control" />
                   </div>
                   {/*<!-- Recebe Gratificação ? -->*/}
                   <div class="survey-box">
                        <label for="gratification" id="gratification-label"> Recebe Gratificação ? </label>
                        <br />
                        <input type="checkbox" name="gratification" value={gratificationAutonomous} onChange={handleGratificationAutonomous} id="gratification" class="survey-control" />
                    </div>
                   <div>
                   {gratificationAutonomous ? (<div>
                            {Array.from({ length: 6 }).map((_, i) => (
                            <>
                            <div key={`month-${i}`} className="survey-box">
                                <label htmlFor={`month${i}`} id={`month${i}-label`}>
                                Mês {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`month${i}`}
                                id={`month${i}`}
                                value={incomeInfo[`month${i+1}`]}
                                onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
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
                                name={`year${i}`}
                                id={`year${i}`}
                                value={incomeInfo[`year${i+1}`]}
                                onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`grossAmount-${i}`} className="survey-box">
                                <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                                Valor Bruto {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`grossAmount${i}`}
                                id={`grossAmount${i}`}
                                value={incomeInfo[`grossAmount${i+1}`]}
                                onChange={(e) => handleInputChange(`grossAmount${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            {/*<!-- Teve deduções ? -->*/}
                   <div class="survey-box" key={`deductions-${i+1}`}>
                        <label for="deductions" id="deductions-label"> No valor informado, teve deduções ? </label>
                        <br />
                        <input type="checkbox" name="deductions" value={deductionsCLT} onChange={handleDeductionsCLT} id="deductions" class="survey-control" />
                    </div>
                   <div>
                   {deductionsCLT ? (<div>
                    <div key={`foodAllowanceValue-${i}`} className="survey-box">
                                <label htmlFor={`foodAllowanceValue${i}`} id={`foodAllowanceValue${i}-label`}>
                                Auxílio Alimentação {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`foodAllowanceValue${i}`}
                                id={`foodAllowanceValue${i}`}
                                value={incomeInfo[`foodAllowanceValue${i+1}`]}
                                onChange={(e) => handleInputChange(`foodAllowanceValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`transportAllowanceValue-${i}`} className="survey-box">
                                <label htmlFor={`transportAllowanceValue${i}`} id={`transportAllowanceValue${i}-label`}>
                                Auxílio Transporte {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`transportAllowanceValue${i}`}
                                id={`transportAllowanceValue${i}`}
                                value={incomeInfo[`transportAllowanceValue${i+1}`]}
                                onChange={(e) => handleInputChange(`transportAllowanceValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`expenseReimbursementValue-${i}`} className="survey-box">
                                <label htmlFor={`expenseReimbursementValue${i}`} id={`expenseReimbursementValue${i}-label`}>
                                Reembolso de despesas {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`expenseReimbursementValue${i}`}
                                id={`expenseReimbursementValue${i}`}
                                value={incomeInfo[`expenseReimbursementValue${i+1}`]}
                                onChange={(e) => handleInputChange(`expenseReimbursementValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`advancePaymentValue-${i}`} className="survey-box">
                                <label htmlFor={`advancePaymentValue${i}`} id={`advancePaymentValue${i}-label`}>
                                Adiantamento ou Antecipações  {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`advancePaymentValue${i}`}
                                id={`advancePaymentValue${i}`}
                                value={incomeInfo[`advancePaymentValue${i+1}`]}
                                onChange={(e) => handleInputChange(`advancePaymentValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`reversalValue-${i}`} className="survey-box">
                                <label htmlFor={`reversalValue${i}`} id={`reversalValue${i}-label`}>
                                Estornos e Compensações {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`reversalValue${i}`}
                                id={`reversalValue${i}`}
                                value={incomeInfo[`reversalValue${i+1}`]}
                                onChange={(e) => handleInputChange(`reversalValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`compensationValue-${i}`} className="survey-box">
                                <label htmlFor={`compensationValue${i}`} id={`compensationValue${i}-label`}>
                                    Indenizações {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`compensationValue${i}`}
                                id={`compensationValue${i}`}
                                value={incomeInfo[`compensationValue${i+1}`]}
                                onChange={(e) => handleInputChange(`compensationValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`judicialPensionValue-${i}`} className="survey-box">
                                <label htmlFor={`judicialPensionValue${i}`} id={`judicialPensionValue${i}-label`}>
                                Pensão Judicial {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`judicialPensionValue${i}`}
                                id={`judicialPensionValue${i}`}
                                value={incomeInfo[`judicialPensionValue${i+1}`]}
                                onChange={(e) => handleInputChange(`judicialPensionValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                        
                    
                    </div>): (
                        <div>
                        <div key={`foodAllowanceValue-${i}`} className="survey-box">
                                <label htmlFor={`foodAllowanceValue${i}`} id={`foodAllowanceValue${i}-label`}>
                                Auxílio Alimentação {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`foodAllowanceValue${i}`}
                                id={`foodAllowanceValue${i}`}
                                value={incomeInfo[`foodAllowanceValue${i+1}`]}
                                onChange={(e) => handleInputChange(`foodAllowanceValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`transportAllowanceValue-${i}`} className="survey-box">
                                <label htmlFor={`transportAllowanceValue${i}`} id={`transportAllowanceValue${i}-label`}>
                                Auxílio Transporte {i + 1}
                             </label>
                                <br />
                                <input
                                type="text"
                                name={`transportAllowanceValue${i}`}
                                id={`transportAllowanceValue${i}`}
                                value={incomeInfo[`transportAllowanceValue${i+1}`]}
                                onChange={(e) => handleInputChange(`transportAllowanceValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`expenseReimbursementValue-${i}`} className="survey-box">
                                <label htmlFor={`expenseReimbursementValue${i}`} id={`expenseReimbursementValue${i}-label`}>
                                Reembolso de despesas {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`expenseReimbursementValue${i}`}
                                id={`expenseReimbursementValue${i}`}
                                value={incomeInfo[`expenseReimbursementValue${i+1}`]}
                                onChange={(e) => handleInputChange(`expenseReimbursementValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`advancePaymentValue-${i}`} className="survey-box">
                                <label htmlFor={`advancePaymentValue${i}`} id={`advancePaymentValue${i}-label`}>
                                Adiantamento ou Antecipações  {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`advancePaymentValue${i}`}
                                id={`advancePaymentValue${i}`}
                                value={incomeInfo[`advancePaymentValue${i+1}`]}
                                onChange={(e) => handleInputChange(`advancePaymentValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`reversalValue-${i}`} className="survey-box">
                                <label htmlFor={`reversalValue${i}`} id={`reversalValue${i}-label`}>
                                Estornos e Compensações {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`reversalValue${i}`}
                                id={`reversalValue${i}`}
                                value={incomeInfo[`reversalValue${i+1}`]}
                                onChange={(e) => handleInputChange(`reversalValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`compensationValue-${i}`} className="survey-box">
                                <label htmlFor={`compensationValue${i}`} id={`compensationValue${i}-label`}>
                                    Indenizações {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`compensationValue${i}`}
                                id={`compensationValue${i}`}
                                value={incomeInfo[`compensationValue${i+1}`]}
                                onChange={(e) => handleInputChange(`compensationValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                            <div key={`judicialPensionValue-${i}`} className="survey-box">
                                <label htmlFor={`judicialPensionValue${i}`} id={`judicialPensionValue${i}-label`}>
                                Pensão Judicial {i + 1}
                             </label>
                                <br />
                                <input
                                type="number"
                                name={`judicialPensionValue${i}`}
                                id={`judicialPensionValue${i}`}
                                value={incomeInfo[`judicialPensionValue${i+1}`]}
                                onChange={(e) => handleInputChange(`judicialPensionValue${i + 1}`, e.target.value)}
                                className="survey-control"
                                />
                            </div>
                </div>
                    )}
                   </div>
                            </>
                    ))}
                    </div>): (
                        <div>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <>
                        <div key={`month-${i}`} className="survey-box">
                            <label htmlFor={`month${i}`} id={`month${i}-label`}>
                            Mês {i + 1}
                         </label>
                            <br />
                            <input
                            type="text"
                            name={`month${i}`}
                            id={`month${i}`}
                            value={incomeInfo[`month${i+1}`]}
                            onChange={(e) => handleInputChange(`month${i + 1}`, e.target.value)}
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
                            name={`year${i}`}
                            id={`year${i}`}
                            value={incomeInfo[`year${i+1}`]}
                            onChange={(e) => handleInputChange(`year${i + 1}`, e.target.value)}
                            className="survey-control"
                            />
                        </div>
                        <div key={`grossAmount-${i}`} className="survey-box">
                            <label htmlFor={`grossAmount${i}`} id={`grossAmount${i}-label`}>
                            Valor Bruto {i + 1}
                         </label>
                            <br />
                            <input
                            type="number"
                            name={`grossAmount${i}`}
                            id={`grossAmount${i}`}
                            value={incomeInfo[`month${i+1}`]}
                            onChange={(e) => handleInputChange(`grossAmount${i+1}`, e.target.value)}
                            className="survey-control"
                            />
                        </div>
                        
                        </>

                        
                ))}
                </div>
                    )}
                           
                   </div>
                   <div class="survey-box">
                       <button type="submit" onClick={(e) => handleRegisterIncome(e,'Apprentice')}  id="submit-button">Salvar Informações</button>
                   </div>
                   
               </>
                ) 
                }

            </form>
        </div></div>
        
    )
}
