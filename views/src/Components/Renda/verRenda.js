import React, { useEffect } from 'react'
import '../Familia/cadastroFamiliar.css'
import { useState } from 'react';
import { api } from '../../services/axios';

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
export const VerRenda = ({  member  }) => {
    const [monthlyIncomes, setMonthlyIncomes] = useState([]);
    console.log(member);
     
    const [entepreneurInfo, setEntepreneurInfo] = useState({
        startDate:'',
        socialReason: '',
        fantasyName: '',
        CNPJ: ''
    })

    const [unemployedInfo, setUnemployedInfo] = useState({
        receivesUnemployment: false,
        parcels:0,
        firstParcelDate: '',
        parcelValue:0
    })

    const [informalWorkerInfo, setInformalWorkerInfo] = useState({
      averageIncome: '0.0'
    })
    const [rentalIncomeInfo, setRentalIncomeInfo] = useState({
      averageIncome: '0.0'
    })
    

    const [autonomousInfo, setAutonomousInfo] = useState({
      averageIncome: '0.0'
  })
  const [liberalProfessionalInfo, setLiberalProfessionalInfo] = useState({
    averageIncome: '0.0'
})
  const [privatePensionInfo, setPrivatePensionInfo] = useState({
  averageIncome: '0.0'
})
  const [financialHelpFromOthersInfo, setFinancialHelpFromOthersInfo] = useState({
  averageIncome: '0.0',
  financialAssistantCPF: ''
})

    const [dependentInfo, setDependentInfo] = useState({
        financialAssistantCPF: '',
        employmentType: 'FinancialHelpFromOthers'
    })

    const [privateEmployeeInfo, setprivateEmployeeInfo] = useState({
      admissionDate: '',
      position:'',
      payingSource:'',
      payingSourcePhone: ''
  })
    

      const [publicEmployeeInfo, setPublicEmployeeInfo] = useState({
        admissionDate: '',
        position:'',
        payingSource:'',
        payingSourcePhone: ''
    })
    const [domesticEmployeeInfo, setDomesticEmployeeInfo] = useState({
      admissionDate: '',
      position:'',
      payingSource:'',
      payingSourcePhone: ''
  })
  const [retiredInfo, setRetiredInfo] = useState({
    admissionDate: '',
    position:'',
    payingSource:'',
    payingSourcePhone: ''
})
  
  const [temporaryRuralEmployeeInfo, setTemporaryRuralEmployeeInfo] = useState({
    admissionDate: '',
    position:'',
    payingSource:'',
    payingSourcePhone: ''
})
const [pensionerInfo, setPensionerInfo] = useState({
  admissionDate: '',
  position:'',
  payingSource:'',
  payingSourcePhone: ''
})

const [temporaryDisabilityBenefitInfo, setTemporaryDisabilityBenefitInfo] = useState({
  admissionDate: '',
  position:'',
  payingSource:'',
  payingSourcePhone: ''
})
const [apprenticeInfo, setApprenticeInfo] = useState({
  admissionDate: '',
  position:'',
  payingSource:'',
  payingSourcePhone: ''
})

    const [MEIInfo,setMEIInfo] = useState({
      startDate: '',
      CNPJ: '',
      averageIncome: '0.0'
    })    

      const [loading, setLoading] = useState (true)
      
      useEffect(() => {
        async function getIncomeInfo() {
          try{
            const token = localStorage.getItem("token")
            const response = await api.get(`/candidates/family-member/income/${member.id}`, {
              headers: {
                  'authorization': `Bearer ${token}`,
              }
          })
          if(member.incomeSource.includes('IndividualEntrepreneur')) {
            console.log(response.data.familyMemberIncomeInfo)
            const MEIIncomeInfo = response.data.familyMemberIncomeInfo.filter(data => data.employmentType === 'IndividualEntrepreneur')
            console.log(MEIIncomeInfo)
            MEIInfo.startDate = MEIIncomeInfo[0].startDate;
            MEIInfo.CNPJ = MEIIncomeInfo[0].CNPJ;
            MEIInfo.averageIncome = MEIIncomeInfo[0].averageIncome;
            console.log(MEIInfo)
          }

          if(member.incomeSource.includes('Autonomous')) {
            const AutonomousInfo = response.data.filter(data => data.employmentType === 'Autonomous')
            autonomousInfo.averageIncome = response.data.AutonomousInfo.averageIncome;
            console.log(autonomousInfo)
          }

          if(member.incomeSource.includes('Unemployed')) {
            const UnemployedInfo = response.data.filter(data => data.employmentType === 'Unemployed')
            unemployedInfo.firstParcelDate = response.data.UnemployedInfo.firstParcelDate
            unemployedInfo.parcelValue = response.data.UnemployedInfo.parcelValue
            unemployedInfo.parcels = response.data.UnemployedInfo.parcels
            unemployedInfo.receivesUnemployment = response.data.UnemployedInfo.receivesUnemployment
            console.log(unemployedInfo)
          }
          if(member.incomeSource.includes('InformalWorker')) {
            const InformalWorkerInfo = response.data.filter(data => data.employmentType === 'InformalWorker')
            informalWorkerInfo.averageIncome = response.data.InformalWorkerInfo.averageIncome;
            console.log(informalWorkerInfo)
          }
          if(member.incomeSource.includes('RentalIncome')) {
            const RentalIncomeInfo = response.data.filter(data => data.employmentType === 'RentalIncome')
            rentalIncomeInfo.averageIncome = response.data.RentalIncomeInfo.averageIncome;
            console.log(rentalIncomeInfo)
          }
          if(member.incomeSource.includes('LiberalProfessional')) {
            const LiberalProfessionalInfo = response.data.filter(data => data.employmentType === 'LiberalProfessional')
            liberalProfessionalInfo.averageIncome = response.data.LiberalProfessionalInfo.averageIncome;
            console.log(liberalProfessionalInfo)
          }
          if(member.incomeSource.includes('PrivatePension')) {
            const PrivatePensionInfo = response.data.filter(data => data.employmentType === 'PrivatePension')
            privatePensionInfo.averageIncome = response.data.PrivatePensionInfo.averageIncome;
            console.log(privatePensionInfo)
          }
          if(member.incomeSource.includes('FinancialHelpFromOthers')) {
            const FinancialHelpFromOthersInfo = response.data.filter(data => data.employmentType === 'FinancialHelpFromOthers')
            financialHelpFromOthersInfo.averageIncome = response.data.FinancialHelpFromOthersInfo.averageIncome;
            financialHelpFromOthersInfo.financialAssistantCPF = response.data.FinancialHelpFromOthersInfo.financialAssistantCPF;
            console.log(financialHelpFromOthersInfo)
          }
          if(member.incomeSource.includes('Entepreneur')) {
            const EntepreneurInfo = response.data.filter(data => data.employmentType === 'Entepreneur')
            entepreneurInfo.averageIncome = response.data.EntepreneurInfo.averageIncome;
            entepreneurInfo.CNPJ = response.data.EntepreneurInfo.CNPJ
            entepreneurInfo.fantasyName = response.data.EntepreneurInfo.fantasyName
            entepreneurInfo.startDate = response.data.EntepreneurInfo.startDate
            entepreneurInfo.socialReason = response.data.EntepreneurInfo.socialReason
            console.log(entepreneurInfo)
          }
          if(member.incomeSource.includes('PrivateEmployee')) {
            const PrivateEmployeeInfo = response.data.filter(data => data.employmentType === 'PrivateEmployee')
            privateEmployeeInfo.averageIncome = response.data.PrivateEmployeeInfo.averageIncome;
            privateEmployeeInfo.admissionDate = response.data.PrivateEmployeeInfo.admissionDate;
            privateEmployeeInfo.payingSource = response.data.PrivateEmployeeInfo.payingSource
            privateEmployeeInfo.payingSourcePhone  = response.data.PrivateEmployeeInfo.payingSourcePhone
            privateEmployeeInfo.position = response.data.PrivateEmployeeInfo.position
            console.log(privateEmployeeInfo)
            console.log(reponse)
          }
          if(member.incomeSource.includes('PublicEmployee')) {
            const PublicEmployeeInfo = response.data.filter(data => data.employmentType === 'PublicEmployee')
            publicEmployeeInfo.averageIncome = response.data.PublicEmployeeInfo.averageIncome;
            publicEmployeeInfo.admissionDate = response.data.PublicEmployeeInfo.admissionDate;
            publicEmployeeInfo.payingSource = response.data.PublicEmployeeInfo.payingSource
            publicEmployeeInfo.payingSourcePhone  = response.data.PublicEmployeeInfo.payingSourcePhone
            publicEmployeeInfo.position = response.data.PublicEmployeeInfo.position
            console.log(publicEmployeeInfo)
          }
          if(member.incomeSource.includes('DomesticEmployee')) {
            const DomesticEmployeeInfo = response.data.filter(data => data.employmentType === 'DomesticEmployee')
            domesticEmployeeInfo.averageIncome = response.data.DomesticEmployeeInfo.averageIncome;
            domesticEmployeeInfo.admissionDate = response.data.DomesticEmployeeInfo.admissionDate;
            domesticEmployeeInfo.payingSource = response.data.DomesticEmployeeInfo.payingSource
            domesticEmployeeInfo.payingSourcePhone  = response.data.DomesticEmployeeInfo.payingSourcePhone
            domesticEmployeeInfo.position = response.data.DomesticEmployeeInfo.position
            console.log(domesticEmployeeInfo)
          }
          if(member.incomeSource.includes('TemporaryRuralEmployee')) {
            const TemporaryRuralEmployeeInfo = response.data.filter(data => data.employmentType === 'TemporaryRuralEmployee')
            temporaryRuralEmployeeInfo.averageIncome = response.data.TemporaryRuralEmployeeInfo.averageIncome;
            temporaryRuralEmployeeInfo.admissionDate = response.data.TemporaryRuralEmployeeInfo.admissionDate;
            temporaryRuralEmployeeInfo.payingSource = response.data.TemporaryRuralEmployeeInfo.payingSource
            temporaryRuralEmployeeInfo.payingSourcePhone  = response.data.TemporaryRuralEmployeeInfo.payingSourcePhone
            temporaryRuralEmployeeInfo.position = response.data.TemporaryRuralEmployeeInfo.position
            console.log(temporaryRuralEmployeeInfo)
          }
          if(member.incomeSource.includes('Retired')) {
            const RetiredInfo = response.data.filter(data => data.employmentType === 'Retired')
            retiredInfo.averageIncome = response.data.RetiredInfo.averageIncome;
            retiredInfo.admissionDate = response.data.RetiredInfo.admissionDate;
            retiredInfo.payingSource = response.data.RetiredInfo.payingSource
            retiredInfo.payingSourcePhone  = response.data.RetiredInfo.payingSourcePhone
            retiredInfo.position = response.data.RetiredInfo.position
            console.log(retiredInfo)
          }
          if(member.incomeSource.includes('Pensioner')) {
            const PensionerInfo = response.data.filter(data => data.employmentType === 'Pensioner')
            pensionerInfo.averageIncome = response.data.PensionerInfo.averageIncome;
            pensionerInfo.admissionDate = response.data.PensionerInfo.admissionDate;
            pensionerInfo.payingSource = response.data.PensionerInfo.payingSource
            pensionerInfo.payingSourcePhone  = response.data.PensionerInfo.payingSourcePhone
            pensionerInfo.position = response.data.PensionerInfo.position
            console.log(pensionerInfo)
          }
          if(member.incomeSource.includes('TemporaryDisabilityBenefit')) {
            const TemporaryDisabilityBenefitInfo = response.data.filter(data => data.employmentType === 'TemporaryDisabilityBenefit')
            temporaryDisabilityBenefitInfo.averageIncome = response.data.TemporaryDisabilityBenefitInfo.averageIncome;
            temporaryDisabilityBenefitInfo.admissionDate = response.data.TemporaryDisabilityBenefitInfo.admissionDate;
            temporaryDisabilityBenefitInfo.payingSource = response.data.TemporaryDisabilityBenefitInfo.payingSource
            temporaryDisabilityBenefitInfo.payingSourcePhone  = response.data.TemporaryDisabilityBenefitInfo.payingSourcePhone
            temporaryDisabilityBenefitInfo.position = response.data.TemporaryDisabilityBenefitInfo.position
            console.log(temporaryDisabilityBenefitInfo)
          }
          if(member.incomeSource.includes('Apprentice')) {
            const ApprenticeInfo = response.data.filter(data => data.employmentType === 'Apprentice')
            apprenticeInfo.averageIncome = response.data.ApprenticeInfo.averageIncome;
            apprenticeInfo.admissionDate = response.data.ApprenticeInfo.admissionDate;
            apprenticeInfo.payingSource = response.data.ApprenticeInfo.payingSource
            apprenticeInfo.payingSourcePhone  = response.data.ApprenticeInfo.payingSourcePhone
            apprenticeInfo.position = response.data.ApprenticeInfo.position
            console.log(apprenticeInfo)
          }
          
          setLoading(false)
          } catch(err) {
            console.log(err)
          }
        }
        getIncomeInfo()
      },[])

    return (
        <div><div className="fill-box">
            <form id="survey-form">
                <h4>Renda do {member.fullName} ({member.relationship})</h4>
                {/* MEI */}
                {member.incomeSource.includes('IndividualEntrepreneur') && 
                (<>
                <h4>Fonte de renda: MEI</h4>
                    {/*<!-- Data de Início -->*/}
                    <div class="survey-box">
                        <label for="startDate" id="startDate-label">Data de Início</label>
                        <br />
                        <input disabled type="date" name="startDate" value={loading ? '' : MEIInfo.startDate.split('T')[0]}  id="startDate" class="survey-control" />
                    </div>
                    {/*<!-- CNPJ -->*/}
                    <div class="survey-box">
                        <label for="CNPJ" id="CNPJ-label">CNPJ</label>
                        <br />
                        <input disabled type="text" name="CNPJ" value={loading ? '' : MEIInfo.CNPJ}  id="CNPJ" class="survey-control" />
                    </div>
                    {/*<!-- Renda Média -->*/}
                    <div class="survey-box">
                        <label for="averageIncome" id="averageIncome-label">Renda Média</label>
                        <br />
                        <input disabled type="text" name="averageIncome" value={loading ? '' : `R$ ${parseFloat(MEIInfo.averageIncome).toFixed(2)}`}  id="averageIncome" class="survey-control" />
                    </div>
                </>
                )
                }

                {/* Desempregado */}
                {member.incomeSource.includes('Unemployed')&& 
                (<>
                <h4>Fonte de renda: Desempregado</h4>
                    {/*<!-- Recebe Seguro Desemprego ? -->*/}
                    <div class="survey-box">
                        <label for="receivesUnemployment" id="receivesUnemployment-label">Recebe Seguro Desemprego ?</label>
                        <br />
                        <input disabled type="checkbox" name="receivesUnemployment" value={loading ? false : unemployedInfo.receivesUnemployment}  id="receivesUnemployment" class="survey-control" />
                    </div>
                    {/*<!-- Quantidade de Parcelas -->*/}
                    <div class="survey-box">
                        <label for="parcels" id="parcels-label">Quantidade de Parcelas</label>
                        <br />
                        <input disabled type="number" name="parcels" value={loading ? '' : unemployedInfo.parcels}  id="parcels" class="survey-control" />
                    </div>
                    {/*<!-- Data da primeira Parcela -->*/}
                    <div class="survey-box">
                        <label for="firstParcelDate" id="firstParcelDate-label">Data da primeira Parcela</label>
                        <br />
                        <input disabled type="date" name="firstParcelDate" value={loading ? '' : unemployedInfo.firstParcelDate.split('T')[0]}  id="firstParcelDate" class="survey-control" />
                    </div>
                    {/*<!-- Valor da Parcela -->*/}
                    <div class="survey-box">
                        <label for="parcelValue" id="parcelValue-label">Valor da Parcela</label>
                        <br />
                        <input disabled type="number" name="parcelValue" value={loading ? '' : unemployedInfo.parcels}  id="parcelValue" class="survey-control" />
                    </div>
                </>
                ) 
                }

                {/* Autônomo */}
                {(member.incomeSource.includes('Autonomous') 
                 ) && 
                (
                  <>
                  <h4>Fonte de renda: Autônomo</h4>
                    {/*<!-- Renda Média -->*/}
                    <div class="survey-box">
                        <label for="averageIncome" id="averageIncome-label">Renda Média</label>
                        <br />
                        <input disabled type="text" name="averageIncome" value={loading ? '' : `R$ ${parseFloat(MEIInfo.averageIncome).toFixed(2)}`}  id="averageIncome" class="survey-control" />
                    </div>
                  </>
                    )}

                {/* Trabalhador Informal */}
                {(member.incomeSource.includes('InformalWorker') 
                 ) && 
                (
                    <>
                    <h4>Fonte de renda: Trabalhador Informal</h4>
                    {/*<!-- Renda Média -->*/}
                    <div class="survey-box">
                        <label for="averageIncome" id="averageIncome-label">Renda Média</label>
                        <br />
                        <input disabled type="text" name="averageIncome" value={loading ? '' : `R$ ${parseFloat(informalWorkerInfo.averageIncome).toFixed(2)}`}  id="averageIncome" class="survey-control" />
                    </div>
                  </>
                
                ) 
                }

                {/* Renda de Aluguel... */}
                {(member.incomeSource.includes('RentalIncome') 
                 ) && 
                (
                    <>
                    <h4>Fonte de renda: Renda de Aluguel</h4>
                    {/*<!-- Renda Média -->*/}
                    <div class="survey-box">
                        <label for="averageIncome" id="averageIncome-label">Renda Média</label>
                        <br />
                        <input disabled type="text" name="averageIncome" value={loading ? '' : `R$ ${parseFloat(rentalIncomeInfo.averageIncome).toFixed(2)}`}  id="averageIncome" class="survey-control" />
                    </div>
                </>
                ) 
                }

                {/* Profissional Liberal */}
                {(member.incomeSource.includes('LiberalProfessional') 
                 ) && 
                (
                    <>
                    <h4>Fonte de renda: Profissional Liberal</h4>
                    {/*<!-- Renda Média -->*/}
                    <div class="survey-box">
                        <label for="averageIncome" id="averageIncome-label">Renda Média</label>
                        <br />
                        <input disabled type="text" name="averageIncome" value={loading ? '' : `R$ ${parseFloat(liberalProfessionalInfo.averageIncome).toFixed(2)}`}  id="averageIncome" class="survey-control" />
                    </div>
                </>
                ) 
                }

                {/* Pensão Privada */}
                {(member.incomeSource.includes('PrivatePension') 
                ) && 
               (
                   <>
                   <h4>Fonte de renda: Previdência Privada</h4>
                    {/*<!-- Renda Média -->*/}
                    <div class="survey-box">
                        <label for="averageIncome" id="averageIncome-label">Renda Média</label>
                        <br />
                        <input disabled type="text" name="averageIncome" value={loading ? '' : `R$ ${parseFloat(privatePensionInfo.averageIncome).toFixed(2)}`}  id="averageIncome" class="survey-control" />
                    </div>
               </>
               ) 
               }
                
                {/* Ajuda Financeira de Terceiros */}
                {member.incomeSource.includes('FinancialHelpFromOthers') &&
                (
                    <>
                    <h4>Fonte de renda: Ajuda Financeira de Terceiros</h4>
                    {/*<!-- CPF do ajudante -->*/}
                    <div class="survey-box">
                        <label for="financialAssistantCPF" id="financialAssistantCPF-label">CPF do Assistente Financeiro</label>
                        <br />
                        <input disabled type="text" name="financialAssistantCPF" value={loading ? '' : financialHelpFromOthersInfo.financialAssistantCPF}  id="averageIncome" class="survey-control" />
                    </div>
                    {/*<!-- Renda Média -->*/}
                    <div class="survey-box">
                        <label for="averageIncome" id="averageIncome-label">Renda Média</label>
                        <br />
                        <input disabled type="text" name="averageIncome" value={loading ? '' : `R$ ${parseFloat(financialHelpFromOthersInfo.averageIncome).toFixed(2)}`}  id="averageIncome" class="survey-control" />
                    </div>
                </>
                )
                }

                {/* Empresário */}
                {member.incomeSource.includes('Entepreneur') &&
                (
                    <>
                    <h4>Fonte de renda: Empresário</h4>
                   {/*<!-- Data de Início -->*/}
                   <div class="survey-box">
                       <label for="startDate" id="startDate-label">Data de Início</label>
                       <br />
                       <input disabled type="date" name="startDate" value={loading ? '': entepreneurInfo.startDate.split('T')[0]}  id="startDate" class="survey-control" />
                   </div>
                   {/*<!-- Razao Social -->*/}
                   <div class="survey-box">
                       <label for="socialReason" id="socialReason-label">Razão Social</label>
                       <br />
                       <input disabled type="text" name="socialReason" value={loading ? '': entepreneurInfo.socialReason}  id="socialReason" class="survey-control" />
                   </div>
                   {/*<!-- Nome Fantasia -->*/}
                   <div class="survey-box">
                       <label for="fantasyName" id="fantasyName-label">Nome Fantasia</label>
                       <br />
                       <input disabled type="date" name="fantasyName" value={loading ? '': entepreneurInfo.socialReason}  id="fantasyName" class="survey-control" />
                   </div>
                   {/*<!-- CNPJ -->*/}
                   <div class="survey-box">
                       <label for="CNPJ" id="CNPJ-label">CNPJ</label>
                       <br />
                       <input disabled type="text" name="CNPJ" value={loading ? '': entepreneurInfo.CNPJ}  id="CNPJ" class="survey-control" />
                   </div>
                   {/*<!-- Renda Média -->*/}
                   <div class="survey-box">
                        <label for="averageIncome" id="averageIncome-label">Renda Média</label>
                        <br />
                        <input disabled type="text" name="averageIncome" value={loading ? '' : `R$ ${parseFloat(entepreneurInfo.averageIncome).toFixed(2)}`}  id="averageIncome" class="survey-control" />
                    </div>
               </>
                ) 
                }

                {/* PrivateEmployee */}
                {member.incomeSource.includes('PrivateEmployee') &&
                (
                    <>
                    <h4>Fonte de renda: Empregado Privado</h4>
                   {/*<!-- Data de Admissão -->*/}
                   <div class="survey-box">
                       <label for="admissionDate" id="admissionDate-label">Data de Admissão</label>
                       <br />
                       <input disabled type="date" name="admissionDate" value={loading ? '': privateEmployeeInfo.admissionDate.split('T')[0]}  id="admissionDate" class="survey-control" />
                   </div>
                   {/*<!-- Cargo -->*/}
                   <div class="survey-box">
                       <label for="position" id="position-label">Cargo</label>
                       <br />
                       <input disabled type="text" name="position" value={loading ? '': privateEmployeeInfo.position}  id="position" class="survey-control" />
                   </div>
                   {/*<!-- Fonte Pagadora( Empresa/Governo/ Pessoa Física) -->*/}
                   <div class="survey-box">
                       <label for="payingSource" id="payingSource-label">Fonte Pagadora</label>
                       <br />
                       <input disabled type="text" name="payingSource" value={loading ? '': privateEmployeeInfo.payingSource}  id="payingSource" class="survey-control" />
                   </div>
                   {/*<!-- Telefone da Fonte Pagadora -->*/}
                   <div class="survey-box">
                       <label for="payingSourcePhone" id="payingSourcePhone-label">Telefone da Fonte Pagadora</label>
                       <br />
                       <input disabled type="text" name="payingSourcePhone" value={loading ? '': privateEmployeeInfo.payingSourcePhone}  id="payingSourcePhone" class="survey-control" />
                   </div>
                   {/*<!-- Renda Média -->*/}
                   <div class="survey-box">
                        <label for="averageIncome" id="averageIncome-label">Renda Média</label>
                        <br />
                        <input disabled type="text" name="averageIncome" value={loading ? '' : `R$ ${parseFloat(privateEmployeeInfo.averageIncome).toFixed(2)}`}  id="averageIncome" class="survey-control" />
                    </div>
                  </>
                )
                }

                {/* PublicEmployee */}
                {member.incomeSource.includes('PublicEmployee') &&
                (
                    <>
                     <h4>Fonte de renda: Empregado Público</h4>
                   {/*<!-- Data de Admissão -->*/}
                   <div class="survey-box">
                       <label for="admissionDate" id="admissionDate-label">Data de Admissão</label>
                       <br />
                       <input disabled type="date" name="admissionDate" value={loading ? '': publicEmployeeInfo.admissionDate.split('T')[0]}  id="admissionDate" class="survey-control" />
                   </div>
                   {/*<!-- Cargo -->*/}
                   <div class="survey-box">
                       <label for="position" id="position-label">Cargo</label>
                       <br />
                       <input disabled type="text" name="position" value={loading ? '': publicEmployeeInfo.position}  id="position" class="survey-control" />
                   </div>
                   {/*<!-- Fonte Pagadora( Empresa/Governo/ Pessoa Física) -->*/}
                   <div class="survey-box">
                       <label for="payingSource" id="payingSource-label">Fonte Pagadora</label>
                       <br />
                       <input disabled type="text" name="payingSource" value={loading ? '': publicEmployeeInfo.payingSource}  id="payingSource" class="survey-control" />
                   </div>
                   {/*<!-- Telefone da Fonte Pagadora -->*/}
                   <div class="survey-box">
                       <label for="payingSourcePhone" id="payingSourcePhone-label">Telefone da Fonte Pagadora</label>
                       <br />
                       <input disabled type="text" name="payingSourcePhone" value={loading ? '': publicEmployeeInfo.payingSourcePhone}  id="payingSourcePhone" class="survey-control" />
                   </div>
                   {/*<!-- Renda Média -->*/}
                   <div class="survey-box">
                        <label for="averageIncome" id="averageIncome-label">Renda Média</label>
                        <br />
                        <input disabled type="text" name="averageIncome" value={loading ? '' : `R$ ${parseFloat(publicEmployeeInfo.averageIncome).toFixed(2)}`}  id="averageIncome" class="survey-control" />
                    </div>
                   
               </>
                ) 
                }

                {/* DomesticEmployee */}
                {member.incomeSource.includes('DomesticEmployee') &&
                (
                    <>
                    <h4>Fonte de renda: Empregado Doméstico</h4>
                   {/*<!-- Data de Admissão -->*/}
                   <div class="survey-box">
                       <label for="admissionDate" id="admissionDate-label">Data de Admissão</label>
                       <br />
                       <input disabled type="date" name="admissionDate" value={loading ? '': domesticEmployeeInfo.admissionDate.split('T')[0]}  id="admissionDate" class="survey-control" />
                   </div>
                   {/*<!-- Cargo -->*/}
                   <div class="survey-box">
                       <label for="position" id="position-label">Cargo</label>
                       <br />
                       <input disabled type="text" name="position" value={loading ? '': domesticEmployeeInfo.position}  id="position" class="survey-control" />
                   </div>
                   {/*<!-- Fonte Pagadora( Empresa/Governo/ Pessoa Física) -->*/}
                   <div class="survey-box">
                       <label for="payingSource" id="payingSource-label">Fonte Pagadora</label>
                       <br />
                       <input disabled type="text" name="payingSource" value={loading ? '': domesticEmployeeInfo.payingSource}  id="payingSource" class="survey-control" />
                   </div>
                   {/*<!-- Telefone da Fonte Pagadora -->*/}
                   <div class="survey-box">
                       <label for="payingSourcePhone" id="payingSourcePhone-label">Telefone da Fonte Pagadora</label>
                       <br />
                       <input disabled type="text" name="payingSourcePhone" value={loading ? '': domesticEmployeeInfo.payingSourcePhone}  id="payingSourcePhone" class="survey-control" />
                   </div>
                   {/*<!-- Renda Média -->*/}
                   <div class="survey-box">
                        <label for="averageIncome" id="averageIncome-label">Renda Média</label>
                        <br />
                        <input disabled type="text" name="averageIncome" value={loading ? '' : `R$ ${parseFloat(domesticEmployeeInfo.averageIncome).toFixed(2)}`}  id="averageIncome" class="survey-control" />
                    </div>
                                    
               </>
                ) 
                }

                {/* TemporaryRuralEmployee */}
                {member.incomeSource.includes('TemporaryRuralEmployee') &&
                (
                    <>
                   <h4>Fonte de renda: Empregado temporário na área rural</h4>
                   {/*<!-- Data de Admissão -->*/}
                   <div class="survey-box">
                       <label for="admissionDate" id="admissionDate-label">Data de Admissão</label>
                       <br />
                       <input disabled type="date" name="admissionDate" value={loading ? '': temporaryRuralEmployeeInfo.admissionDate.split('T')[0]}  id="admissionDate" class="survey-control" />
                   </div>
                   {/*<!-- Cargo -->*/}
                   <div class="survey-box">
                       <label for="position" id="position-label">Cargo</label>
                       <br />
                       <input disabled type="text" name="position" value={loading ? '': temporaryRuralEmployeeInfo.position}  id="position" class="survey-control" />
                   </div>
                   {/*<!-- Fonte Pagadora( Empresa/Governo/ Pessoa Física) -->*/}
                   <div class="survey-box">
                       <label for="payingSource" id="payingSource-label">Fonte Pagadora</label>
                       <br />
                       <input disabled type="text" name="payingSource" value={loading ? '': temporaryRuralEmployeeInfo.payingSource}  id="payingSource" class="survey-control" />
                   </div>
                   {/*<!-- Telefone da Fonte Pagadora -->*/}
                   <div class="survey-box">
                       <label for="payingSourcePhone" id="payingSourcePhone-label">Telefone da Fonte Pagadora</label>
                       <br />
                       <input disabled type="text" name="payingSourcePhone" value={loading ? '': temporaryRuralEmployeeInfo.payingSourcePhone}  id="payingSourcePhone" class="survey-control" />
                   </div>
                   {/*<!-- Renda Média -->*/}
                   <div class="survey-box">
                        <label for="averageIncome" id="averageIncome-label">Renda Média</label>
                        <br />
                        <input disabled type="text" name="averageIncome" value={loading ? '' : `R$ ${parseFloat(temporaryRuralEmployeeInfo.averageIncome).toFixed(2)}`}  id="averageIncome" class="survey-control" />
                    </div>
               </>
                ) 
                }

                {/* Retired */}
                {member.incomeSource.includes('Retired') &&
                (
                    <>
                    
                    <h4>Fonte de renda: Aposentado</h4>
                   {/*<!-- Data de Admissão -->*/}
                   <div class="survey-box">
                       <label for="admissionDate" id="admissionDate-label">Data de Admissão</label>
                       <br />
                       <input disabled type="date" name="admissionDate" value={loading ? '': retiredInfo.admissionDate.split('T')[0]}  id="admissionDate" class="survey-control" />
                   </div>
                   {/*<!-- Cargo -->*/}
                   <div class="survey-box">
                       <label for="position" id="position-label">Cargo</label>
                       <br />
                       <input disabled type="text" name="position" value={loading ? '': retiredInfo.position}  id="position" class="survey-control" />
                   </div>
                   {/*<!-- Fonte Pagadora( Empresa/Governo/ Pessoa Física) -->*/}
                   <div class="survey-box">
                       <label for="payingSource" id="payingSource-label">Fonte Pagadora</label>
                       <br />
                       <input disabled type="text" name="payingSource" value={loading ? '': retiredInfo.payingSource}  id="payingSource" class="survey-control" />
                   </div>
                   {/*<!-- Telefone da Fonte Pagadora -->*/}
                   <div class="survey-box">
                       <label for="payingSourcePhone" id="payingSourcePhone-label">Telefone da Fonte Pagadora</label>
                       <br />
                       <input disabled type="text" name="payingSourcePhone" value={loading ? '': retiredInfo.payingSourcePhone}  id="payingSourcePhone" class="survey-control" />
                   </div>
                   {/*<!-- Renda Média -->*/}
                   <div class="survey-box">
                        <label for="averageIncome" id="averageIncome-label">Renda Média</label>
                        <br />
                        <input disabled type="text" name="averageIncome" value={loading ? '' : `R$ ${parseFloat(retiredInfo.averageIncome).toFixed(2)}`}  id="averageIncome" class="survey-control" />
                    </div>
               </>
                ) 
                }
                {/* Pensioner */}
                {member.incomeSource.includes('Pensioner') &&
                (
                    <>
                   <h4>Fonte de renda: Pensionista</h4>
                   {/*<!-- Data de Admissão -->*/}
                   <div class="survey-box">
                       <label for="admissionDate" id="admissionDate-label">Data de Admissão</label>
                       <br />
                       <input disabled type="date" name="admissionDate" value={loading ? '': pensionerInfo.admissionDate.split('T')[0]}  id="admissionDate" class="survey-control" />
                   </div>
                   {/*<!-- Cargo -->*/}
                   <div class="survey-box">
                       <label for="position" id="position-label">Cargo</label>
                       <br />
                       <input disabled type="text" name="position" value={loading ? '': pensionerInfo.position}  id="position" class="survey-control" />
                   </div>
                   {/*<!-- Fonte Pagadora( Empresa/Governo/ Pessoa Física) -->*/}
                   <div class="survey-box">
                       <label for="payingSource" id="payingSource-label">Fonte Pagadora</label>
                       <br />
                       <input disabled type="text" name="payingSource" value={loading ? '': pensionerInfo.payingSource}  id="payingSource" class="survey-control" />
                   </div>
                   {/*<!-- Telefone da Fonte Pagadora -->*/}
                   <div class="survey-box">
                       <label for="payingSourcePhone" id="payingSourcePhone-label">Telefone da Fonte Pagadora</label>
                       <br />
                       <input disabled type="text" name="payingSourcePhone" value={loading ? '': pensionerInfo.payingSourcePhone}  id="payingSourcePhone" class="survey-control" />
                   </div>
                   {/*<!-- Renda Média -->*/}
                   <div class="survey-box">
                        <label for="averageIncome" id="averageIncome-label">Renda Média</label>
                        <br />
                        <input disabled type="text" name="averageIncome" value={loading ? '' : `R$ ${parseFloat(pensionerInfo.averageIncome).toFixed(2)}`}  id="averageIncome" class="survey-control" />
                    </div>
                   </>
                   )
                }
                {/* TemporaryDisabilityBenefit */}
                {member.incomeSource.includes('TemporaryDisabilityBenefit') &&
                (
                    <>
                   <h4>Fonte de renda: benefício por Incapacidade Temporária (Auxílio-doença)</h4>
                   {/*<!-- Data de Admissão -->*/}
                   <div class="survey-box">
                       <label for="admissionDate" id="admissionDate-label">Data de Admissão</label>
                       <br />
                       <input disabled type="date" name="admissionDate" value={loading ? '': temporaryDisabilityBenefitInfo.admissionDate.split('T')[0]}  id="admissionDate" class="survey-control" />
                   </div>
                   {/*<!-- Cargo -->*/}
                   <div class="survey-box">
                       <label for="position" id="position-label">Cargo</label>
                       <br />
                       <input disabled type="text" name="position" value={loading ? '': temporaryDisabilityBenefitInfo.position}  id="position" class="survey-control" />
                   </div>
                   {/*<!-- Fonte Pagadora( Empresa/Governo/ Pessoa Física) -->*/}
                   <div class="survey-box">
                       <label for="payingSource" id="payingSource-label">Fonte Pagadora</label>
                       <br />
                       <input disabled type="text" name="payingSource" value={loading ? '': temporaryDisabilityBenefitInfo.payingSource}  id="payingSource" class="survey-control" />
                   </div>
                   {/*<!-- Telefone da Fonte Pagadora -->*/}
                   <div class="survey-box">
                       <label for="payingSourcePhone" id="payingSourcePhone-label">Telefone da Fonte Pagadora</label>
                       <br />
                       <input disabled type="text" name="payingSourcePhone" value={loading ? '': temporaryDisabilityBenefitInfo.payingSourcePhone}  id="payingSourcePhone" class="survey-control" />
                   </div>
                   {/*<!-- Renda Média -->*/}
                   <div class="survey-box">
                        <label for="averageIncome" id="averageIncome-label">Renda Média</label>
                        <br />
                        <input disabled type="text" name="averageIncome" value={loading ? '' : `R$ ${parseFloat(temporaryDisabilityBenefitInfo.averageIncome).toFixed(2)}`}  id="averageIncome" class="survey-control" />
                    </div>
                   
               </>
                ) 
                }
                
                {/* Aprendiz */}
                {member.incomeSource.includes('Apprentice') &&
                (
                    <>
                   <h4>Fonte de renda: Aprendiz</h4>
                   {/*<!-- Data de Admissão -->*/}
                   <div class="survey-box">
                       <label for="admissionDate" id="admissionDate-label">Data de Admissão</label>
                       <br />
                       <input disabled type="date" name="admissionDate" value={loading ? '': apprenticeInfo.admissionDate.split('T')[0]}  id="admissionDate" class="survey-control" />
                   </div>
                   {/*<!-- Cargo -->*/}
                   <div class="survey-box">
                       <label for="position" id="position-label">Cargo</label>
                       <br />
                       <input disabled type="text" name="position" value={loading ? '': apprenticeInfo.position}  id="position" class="survey-control" />
                   </div>
                   {/*<!-- Fonte Pagadora( Empresa/Governo/ Pessoa Física) -->*/}
                   <div class="survey-box">
                       <label for="payingSource" id="payingSource-label">Fonte Pagadora</label>
                       <br />
                       <input disabled type="text" name="payingSource" value={loading ? '': apprenticeInfo.payingSource}  id="payingSource" class="survey-control" />
                   </div>
                   {/*<!-- Telefone da Fonte Pagadora -->*/}
                   <div class="survey-box">
                       <label for="payingSourcePhone" id="payingSourcePhone-label">Telefone da Fonte Pagadora</label>
                       <br />
                       <input disabled type="text" name="payingSourcePhone" value={loading ? '': apprenticeInfo.payingSourcePhone}  id="payingSourcePhone" class="survey-control" />
                   </div>
                   {/*<!-- Renda Média -->*/}
                   <div class="survey-box">
                        <label for="averageIncome" id="averageIncome-label">Renda Média</label>
                        <br />
                        <input disabled type="text" name="averageIncome" value={loading ? '' : `R$ ${parseFloat(apprenticeInfo.averageIncome).toFixed(2)}`}  id="averageIncome" class="survey-control" />
                    </div>
               </>
                ) 
                }

            </form>
        </div></div>
        
    )
}
