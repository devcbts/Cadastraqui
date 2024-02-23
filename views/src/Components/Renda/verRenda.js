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
    function translateRelationship(relationshipValue) {
        const relationship = Relationship.find(
          (r) => r.value === relationshipValue
        );
        return relationship ? relationship.label : "Não especificado";
      }

      function calculateAverageIncome(arrayDeObjetos) {
        const { soma, contador } = arrayDeObjetos.reduce((acumulador, objeto) => {
          if (objeto.averageIncome !== null) {
            acumulador.soma += parseFloat(objeto.averageIncome);
            acumulador.contador++;
          }
          return acumulador;
        }, { soma: 0, contador: 0 });
      
        const averageIncome = contador > 0 ? soma / contador : 0;
      
        return averageIncome
      }
     
    const [entepreneurInfo, setEntepreneurInfo] = useState({
        startDate:'',
        socialReason: '',
        fantasyName: '',
        CNPJ: '',
        averageIncome: '0.0'
    })

    const [unemployedInfo, setUnemployedInfo] = useState({
        receivesUnemployment: false,
        parcels:0,
        firstParcelDate: '',
        parcelValue:0,
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
        averageIncome: '0.0',
      admissionDate: '',
      position:'',
      payingSource:'',
      payingSourcePhone: ''
  })
    

      const [publicEmployeeInfo, setPublicEmployeeInfo] = useState({
        averageIncome: '0.0',
        admissionDate: '',
        position:'',
        payingSource:'',
        payingSourcePhone: ''
    })
    const [domesticEmployeeInfo, setDomesticEmployeeInfo] = useState({
        averageIncome: '0.0',
      admissionDate: '',
      position:'',
      payingSource:'',
      payingSourcePhone: ''
  })
  const [retiredInfo, setRetiredInfo] = useState({
    averageIncome: '0.0',
    admissionDate: '',
    position:'',
    payingSource:'',
    payingSourcePhone: ''
})
  
  const [temporaryRuralEmployeeInfo, setTemporaryRuralEmployeeInfo] = useState({
    averageIncome: '0.0',
    admissionDate: '',
    position:'',
    payingSource:'',
    payingSourcePhone: ''
})
const [pensionerInfo, setPensionerInfo] = useState({
    averageIncome: '0.0',
  admissionDate: '',
  position:'',
  payingSource:'',
  payingSourcePhone: ''
})

const [temporaryDisabilityBenefitInfo, setTemporaryDisabilityBenefitInfo] = useState({
    averageIncome: '0.0',
  admissionDate: '',
  position:'',
  payingSource:'',
  payingSourcePhone: ''
})
const [apprenticeInfo, setApprenticeInfo] = useState({
    averageIncome: '0.0',
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
          console.log(response)
          if(member.incomeSource.includes('IndividualEntrepreneur')) {
            const MEIIncomeInfo = response.data.familyMemberIncomeInfo.filter(data => data.employmentType === 'IndividualEntrepreneur')
            const startDate = MEIIncomeInfo[0].startDate;
            const CNPJ = MEIIncomeInfo[0].CNPJ;
            const averageIncome = calculateAverageIncome(MEIIncomeInfo)

            setMEIInfo({
                startDate,
                CNPJ,
                averageIncome
            })

            console.log(MEIInfo)
          }

          if(member.incomeSource.includes('Autonomous')) {
            const AutonomousInfo = response.data.familyMemberIncomeInfo.filter(data => data.employmentType === 'Autonomous')
            const averageIncome = calculateAverageIncome(AutonomousInfo)
            setAutonomousInfo({ averageIncome })
            console.log(autonomousInfo)
          }

          if(member.incomeSource.includes('Unemployed')) {
            const UnemployedInfo = response.data.familyMemberIncomeInfo.filter(data => data.employmentType === 'Unemployed')
            const firstParcelDate = UnemployedInfo[0].firstParcelDate
            const parcelValue = UnemployedInfo[0].parcelValue
            const parcels = UnemployedInfo[0].parcels
            const receivesUnemployment = UnemployedInfo[0].receivesUnemployment

            setUnemployedInfo({
                receivesUnemployment,
                parcels,
                firstParcelDate,
                parcelValue,
            })

            console.log(unemployedInfo)
          }
          if(member.incomeSource.includes('InformalWorker')) {
            const InformalWorkerInfo = response.data.familyMemberIncomeInfo.filter(data => data.employmentType === 'InformalWorker')
            const averageIncome = calculateAverageIncome(InformalWorkerInfo)
            setInformalWorkerInfo({ averageIncome })
            console.log(informalWorkerInfo)
          }
          if(member.incomeSource.includes('RentalIncome')) {
            const RentalIncomeInfo = response.data.familyMemberIncomeInfo.filter(data => data.employmentType === 'RentalIncome')
            const averageIncome = calculateAverageIncome(RentalIncomeInfo)
            setRentalIncomeInfo({ averageIncome })
            console.log(rentalIncomeInfo)
          }
          if(member.incomeSource.includes('LiberalProfessional')) {
            const LiberalProfessionalInfo = response.data.familyMemberIncomeInfo.filter(data => data.employmentType === 'LiberalProfessional')
            const averageIncome = calculateAverageIncome(LiberalProfessionalInfo)
            setLiberalProfessionalInfo({ averageIncome })
            console.log(liberalProfessionalInfo)
          }
          if(member.incomeSource.includes('PrivatePension')) {
            const PrivatePensionInfo = response.data.familyMemberIncomeInfo.filter(data => data.employmentType === 'PrivatePension')
            const averageIncome = calculateAverageIncome(PrivatePensionInfo)
            setPrivatePensionInfo({ averageIncome })
            console.log(privatePensionInfo)
          }
          if(member.incomeSource.includes('FinancialHelpFromOthers')) {
            const FinancialHelpFromOthersInfo = response.data.familyMemberIncomeInfo.filter(data => data.employmentType === 'FinancialHelpFromOthers')
            const averageIncome = calculateAverageIncome(FinancialHelpFromOthersInfo)
            const financialAssistantCPF = FinancialHelpFromOthersInfo[0].financialAssistantCPF

            setFinancialHelpFromOthersInfo({
                averageIncome,
                financialAssistantCPF
            })

            console.log(financialHelpFromOthersInfo)
          }
          if(member.incomeSource.includes('Entepreneur')) {
            const EntepreneurInfo = response.data.familyMemberIncomeInfo.filter(data => data.employmentType === 'Entepreneur')
            const averageIncome = calculateAverageIncome(EntepreneurInfo)
            const CNPJ = EntepreneurInfo[0].CNPJ
            const fantasyName = EntepreneurInfo[0].fantasyName
            const startDate = EntepreneurInfo[0].startDate
            const socialReason = EntepreneurInfo[0].socialReason

            setEntepreneurInfo({
                startDate,
                socialReason,
                fantasyName,
                CNPJ,
                averageIncome
            })
            console.log(entepreneurInfo)
          }
          if(member.incomeSource.includes('PrivateEmployee')) {
            const PrivateEmployeeInfo = response.data.familyMemberIncomeInfo.filter(data => data.employmentType === 'PrivateEmployee')
            const averageIncome = calculateAverageIncome(PrivateEmployeeInfo)
            const admissionDate = PrivateEmployeeInfo[0].admissionDate
            const payingSource = PrivateEmployeeInfo[0].payingSource
            const payingSourcePhone  = PrivateEmployeeInfo[0].payingSourcePhone
            const position = PrivateEmployeeInfo[0].position
            
            setprivateEmployeeInfo({
                admissionDate,
                position,
                payingSource,
                payingSourcePhone,
                averageIncome
            })
            console.log(privateEmployeeInfo)
          }
          if(member.incomeSource.includes('PublicEmployee')) {
            const PublicEmployeeInfo = response.data.familyMemberIncomeInfo.filter(data => data.employmentType === 'PublicEmployee')
            const averageIncome = calculateAverageIncome(PublicEmployeeInfo)
            const admissionDate = PublicEmployeeInfo[0].admissionDate
            const payingSource = PublicEmployeeInfo[0].payingSource
            const payingSourcePhone  = PublicEmployeeInfo[0].payingSourcePhone
            const position = PublicEmployeeInfo[0].position
            
            setPublicEmployeeInfo({
                admissionDate,
                position,
                payingSource,
                payingSourcePhone,
                averageIncome
            })
            console.log(publicEmployeeInfo)
          }
          if(member.incomeSource.includes('DomesticEmployee')) {
            const DomesticEmployeeInfo = response.data.familyMemberIncomeInfo.filter(data => data.employmentType === 'DomesticEmployee')
            const averageIncome = calculateAverageIncome(DomesticEmployeeInfo)
            const admissionDate = DomesticEmployeeInfo[0].admissionDate
            const payingSource = DomesticEmployeeInfo[0].payingSource
            const payingSourcePhone  = DomesticEmployeeInfo[0].payingSourcePhone
            const position = DomesticEmployeeInfo[0].position
            
            setDomesticEmployeeInfo({
                admissionDate,
                position,
                payingSource,
                payingSourcePhone,
                averageIncome
            })
            console.log(domesticEmployeeInfo)
          }
          if(member.incomeSource.includes('TemporaryRuralEmployee')) {
            const TemporaryRuralEmployeeInfo = response.data.familyMemberIncomeInfo.filter(data => data.employmentType === 'TemporaryRuralEmployee')
            const averageIncome = calculateAverageIncome(TemporaryRuralEmployeeInfo)
            const admissionDate = TemporaryRuralEmployeeInfo[0].admissionDate
            const payingSource = TemporaryRuralEmployeeInfo[0].payingSource
            const payingSourcePhone  = TemporaryRuralEmployeeInfo[0].payingSourcePhone
            const position = TemporaryRuralEmployeeInfo[0].position
            
            setTemporaryRuralEmployeeInfo({
                admissionDate,
                position,
                payingSource,
                payingSourcePhone,
                averageIncome
            })
            console.log(temporaryRuralEmployeeInfo)
          }
          if(member.incomeSource.includes('Retired')) {
            const RetiredInfo = response.data.familyMemberIncomeInfo.filter(data => data.employmentType === 'Retired')
            const averageIncome = calculateAverageIncome(RetiredInfo)
            const admissionDate = RetiredInfo[0].admissionDate
            const payingSource = RetiredInfo[0].payingSource
            const payingSourcePhone  = RetiredInfo[0].payingSourcePhone
            const position = RetiredInfo[0].position
            
            setRetiredInfo({
                admissionDate,
                position,
                payingSource,
                payingSourcePhone,
                averageIncome
            })
            console.log(retiredInfo)
          }
          if(member.incomeSource.includes('Pensioner')) {
            const PensionerInfo = response.data.familyMemberIncomeInfo.filter(data => data.employmentType === 'Pensioner')
            const averageIncome = calculateAverageIncome(PensionerInfo)
            const admissionDate = PensionerInfo[0].admissionDate
            const payingSource = PensionerInfo[0].payingSource
            const payingSourcePhone  = PensionerInfo[0].payingSourcePhone
            const position = PensionerInfo[0].position
            
            setPensionerInfo({
                admissionDate,
                position,
                payingSource,
                payingSourcePhone,
                averageIncome
            })
            console.log(pensionerInfo)
          }
          if(member.incomeSource.includes('TemporaryDisabilityBenefit')) {
            const TemporaryDisabilityBenefitInfo = response.data.familyMemberIncomeInfo.filter(data => data.employmentType === 'TemporaryDisabilityBenefit')
            const averageIncome = calculateAverageIncome(TemporaryDisabilityBenefitInfo)
            const admissionDate = TemporaryDisabilityBenefitInfo[0].admissionDate
            const payingSource = TemporaryDisabilityBenefitInfo[0].payingSource
            const payingSourcePhone  = TemporaryDisabilityBenefitInfo[0].payingSourcePhone
            const position = TemporaryDisabilityBenefitInfo[0].position
            
            setTemporaryDisabilityBenefitInfo({
                admissionDate,
                position,
                payingSource,
                payingSourcePhone,
                averageIncome
            })
            console.log(temporaryDisabilityBenefitInfo)
          }
          if(member.incomeSource.includes('Apprentice')) {
            const ApprenticeInfo = response.data.familyMemberIncomeInfo.filter(data => data.employmentType === 'Apprentice')
            const averageIncome = calculateAverageIncome(ApprenticeInfo)
            const admissionDate = ApprenticeInfo[0].admissionDate
            const payingSource = ApprenticeInfo[0].payingSource
            const payingSourcePhone  = ApprenticeInfo[0].payingSourcePhone
            const position = ApprenticeInfo[0].position
            
            setApprenticeInfo({
                admissionDate,
                position,
                payingSource,
                payingSourcePhone,
                averageIncome
            })
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
                <h4>Renda do {member.fullName} ({translateRelationship(member.relationship)})</h4>
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
