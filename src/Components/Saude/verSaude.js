import React, { useEffect } from 'react'
import '../Familia/cadastroFamiliar.css'
import { useState } from 'react';
import { api } from '../../services/axios';

const Disease = [
    { value: 'ALIENATION_MENTAL', label: 'Alienação Mental' },
    { value: 'CARDIOPATHY_SEVERE', label: 'Cardiopatia Grave' },
    { value: 'BLINDNESS', label: 'Cegueira' },
    { value: 'RADIATION_CONTAMINATION', label: 'Contaminação por Radiação' },
    { value: 'PARKINSONS_DISEASE', label: 'Doença de Parkinson' },
    { value: 'ANKYLOSING_SPONDYLITIS', label: 'Espondilite Anquilosante' },
    { value: 'PAGETS_DISEASE', label: 'Doença de Paget' },
    { value: 'HANSENS_DISEASE', label: 'Hanseníase (Lepra)' },
    { value: 'SEVERE_HEPATOPATHY', label: 'Hepatopatia Grave' },
    { value: 'SEVERE_NEPHROPATHY', label: 'Nefropatia Grave' },
    { value: 'PARALYSIS', label: 'Paralisia' },
    { value: 'ACTIVE_TUBERCULOSIS', label: 'Tuberculose Ativa' },
    { value: 'HIV_AIDS', label: 'HIV/AIDS' },
    { value: 'MALIGNANT_NEOPLASM', label: 'Neoplasma Maligno (Câncer)' },
    { value: 'TERMINAL_STAGE', label: 'Estágio Terminal' },
    { value: 'MICROCEPHALY', label: 'Microcefalia' },
    { value: 'AUTISM_SPECTRUM_DISORDER', label: 'Transtorno do Espectro Autista' },
    { value: 'RARE_DISEASE', label: 'Doença Rara' },
    { value: 'OTHER_HIGH_COST_DISEASE', label: 'Outra Doença de Alto Custo' }
]
export const VerSaude = ({ member }) => {
    const [monthlyIncomes, setMonthlyIncomes] = useState([]);
    ;

    const [healthInfo, setHealthInfo] = useState({
        diseases: '',
        specificDisease: '',
        hasMedicalReport: false,
        medicationName: '',
        obtainedPublicly: false,
        specificMedicationPublicly: ''
    });

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function getHealthInfo() {
            try {
                const token = localStorage.getItem("token")
                const response = await api.get(`/candidates/health-info/family-member/${member.id}`, {
                    headers: {
                        'authorization': `Bearer ${token}`,
                    }
                })
                setHealthInfo(response.data.healthInfo)

                setLoading(false)
            } catch (err) {

            }
        }
        getHealthInfo()
    }, [member])



    const getDiseaseValuesByLabels = (diseaseLabels) => {
        return diseaseLabels?.map(value => {
            const diseaseItem = Disease.find(item => item.value === value);
            return diseaseItem ? diseaseItem.label : '';
        }).filter(label => label !== ''); // Filtra quaisquer valores não encontrados (strings vazias)
    };

    return (
        <div><div className="fill-box">
            <form id="survey-form">
                <h4>Saúde do {member.fullName || member.name} ({member.relationship || 'Cadastrante'})</h4>
                {/* Informações de Saúde */}
                {!loading && healthInfo[0]?.diseases ? <>
                    <h4>Informações Gerais</h4>
                    {/*<!-- Doença -->*/}
                    <div class="survey-box">
                        <label for="disease" id="disease-label">Doença</label>
                        <br />
                        <input disabled type="text" name="disease" value={getDiseaseValuesByLabels(healthInfo[0]?.diseases).join(', ')} id="disease" class="survey-control" />
                    </div>
                    {/*<!-- Doença Específica -->*/}
                    <div class="survey-box">
                        <label for="specificDisease" id="specificDisease-label">Doença Específica</label>
                        <br />
                        <input disabled type="text" name="specificDisease" value={loading ? '' : healthInfo[0]?.specificDisease} id="specificDisease" class="survey-control" />
                    </div>
                    {/*<!-- Relatório Médico -->*/}
                    <div class="survey-box">
                        <label for="hasMedicalReport" id="hasMedicalReport-label">Tem Relatório Médico ?</label>
                        <br />
                        <input disabled type="checkbox" name="hasMedicalReport" checked={loading ? '' : healthInfo[0].hasMedicalReport ? true : false} id="hasMedicalReport" class="survey-control" />
                    </div>
                    <h4>Uso de medicamento contínuo e/ou controlado:</h4>
                    {/*<!-- Nome do medicamento -->*/}
                    <div class="survey-box">
                        <label for="medicationName" id="medicationName-label">Nome do Medicamento</label>
                        <br />
                        <input disabled type="text" name="medicationName" value={loading ? '' : healthInfo.medicationName} id="medicationName" class="survey-control" />
                    </div>
                    {/*<!-- Obtém atraves da rede Pública -->*/}
                    <div class="survey-box">
                        <label for="obtainedPublicly" id="obtainedPublicly-label">Obtém atraves da Rede Pública ?</label>
                        <br />
                        <input disabled type="checkbox" name="obtainedPublicly" value={loading ? '' : healthInfo.obtainedPublicly} id="obtainedPublicly" class="survey-control" />
                    </div>
                    {/*<!-- Medicações obtidas na Rede Pública -->*/}
                    <div class="survey-box">
                        <label for="specificMedicationPublicly" id="specificMedicationPublicly-label"> Medicações obtidas na Rede Pública</label>
                        <br />
                        <input disabled type="text" name="specificMedicationPublicly" value={loading ? '' : healthInfo.specificMedicationPublicly} id="specificMedicationPublicly" class="survey-control" />
                    </div>
                </>
                    : ''}


            </form>
        </div></div>

    )
}
