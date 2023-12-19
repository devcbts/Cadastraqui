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
export const VerSaude = ({  member  }) => {
    const [monthlyIncomes, setMonthlyIncomes] = useState([]);
    console.log(member);
     
    const [healthInfo, setHealthInfo] = useState({
      disease: '',
      specificDisease: '',
      hasMedicalReport: false,
      medicationName: '',
      obtainedPublicly: false,
      specificMedicationPublicly: ''
    });   

      const [loading, setLoading] = useState (true)
      
      useEffect(() => {
        async function getHealthInfo() {
          try{
            const token = localStorage.getItem("token")
            const response = await api.get(`/candidates/health-info/family-member/${member.id}`, {
              headers: {
                  'authorization': `Bearer ${token}`,
              }
          })
          console.log(response)
          
          setLoading(false)
          } catch(err) {
            console.log(err)
          }
        }
        getHealthInfo()
      },[])

    return (
        <div><div className="fill-box">
            <form id="survey-form">
                <h4>Saúde do {member.fullName} ({member.relationship})</h4>
                {/* Informações de Saúde */}
                {member.incomeSource.includes('IndividualEntrepreneur') && 
                (<>
                <h4>Informações Gerais</h4>
                    {/*<!-- Doença -->*/}
                    <div class="survey-box">
                        <label for="disease" id="disease-label">Doença</label>
                        <br />
                        <input disabled type="text" name="disease" value={loading ? '' : healthInfo.disease}  id="disease" class="survey-control" />
                    </div>
                    {/*<!-- Doença Específica -->*/}
                    <div class="survey-box">
                        <label for="specificDisease" id="specificDisease-label">Doença Específica</label>
                        <br />
                        <input disabled type="text" name="specificDisease" value={loading ? '' : healthInfo.specificDisease}  id="specificDisease" class="survey-control" />
                    </div>
                    {/*<!-- Relatório Médico -->*/}
                    <div class="survey-box">
                        <label for="hasMedicalReport" id="hasMedicalReport-label">Tem Relatório Médico ?</label>
                        <br />
                        <input disabled type="checkbox" name="hasMedicalReport" value={loading ? '' : healthInfo.hasMedicalReport}  id="hasMedicalReport" class="survey-control" />
                    </div>
                    <h4>Uso de medicamento contínuo e/ou controlado:</h4>
                   {/*<!-- Nome do medicamento -->*/}
                   <div class="survey-box">
                        <label for="medicationName" id="medicationName-label">Nome do Medicamento</label>
                        <br />
                        <input disabled type="text" name="medicationName" value={loading ? '' : healthInfo.medicationName}  id="medicationName" class="survey-control" />
                    </div>
                    {/*<!-- Obtém atraves da rede Pública -->*/}
                   <div class="survey-box">
                        <label for="obtainedPublicly" id="obtainedPublicly-label">Obtém atraves da Rede Pública ?</label>
                        <br />
                        <input disabled type="checkbox" name="obtainedPublicly" value={loading ? '' : healthInfo.obtainedPublicly}  id="obtainedPublicly" class="survey-control" />
                    </div>
                    {/*<!-- Medicações obtidas na Rede Pública -->*/}
                   <div class="survey-box">
                        <label for="specificMedicationPublicly" id="specificMedicationPublicly-label"> Medicações obtidas na Rede Pública</label>
                        <br />
                        <input disabled type="text" name="specificMedicationPublicly" value={loading ? '' : healthInfo.specificMedicationPublicly}  id="specificMedicationPublicly" class="survey-control" />
                    </div>
                </>
                )
                }

            </form>
        </div></div>
        
    )
}
