import React, { useState } from 'react';
import './Familia/cadastroFamiliar.css'
import { api } from '../services/axios';

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

export const CadastroSaude = ({  member  }) => {
  const [healthInfo, setHealthInfo] = useState({
    disease:'',
    specificDisease: '',
    hasMedicalReport: false
  })
  const [medicationInfo, setMedicationInfo] = useState({
    medicationName:'',
    obtainedPublicly: false,
    specificMedicationPublicly: ''
  })
  
  const [diseaseSpecific, setDiseaseSpecific] = useState(false)
  const [controlledMedication, setControlledMedication] = useState(false)

  console.log(member)
    const handleHealthChange = (e) => {
      const target = e.target;
      const name = target.name;
      if (e.target.multiple) {
          const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
          setHealthInfo(prevState => ({
              ...prevState,
              [name]: selectedOptions
          }));
          if(e.target.multiple && e.target.name ==='disease' ) {
            console.log(e.target.value)
            if(e.target.value.includes('RARE_DISEASE') || e.target.value.includes( 'OTHER_HIGH_COST_DISEASE')) {
              setDiseaseSpecific(true)
            } else{
              setDiseaseSpecific(false)
            }
          }
      } else {
        setHealthInfo({ ...healthInfo, [e.target.name]: e.target.value });
        console.log(healthInfo)
      }
      
    };

    const handleMedicationChange = (e) => {
      const target = e.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
          setMedicationInfo(prevState => ({
              ...prevState,
              [name]: value
          }));
      
    };

    function handleControlledMedication() {
      if(controlledMedication === true) {
        setControlledMedication(false)
      }
      if(controlledMedication === false) {
        setControlledMedication(true)
      }
    }

    async function handleRegisterHealth() {
      const data = {
        disease:healthInfo.disease,
        specificDisease: healthInfo.specificDisease,
        hasMedicalReport: healthInfo.hasMedicalReport
      }
      try {
        const token = localStorage.getItem("token")
        const response = await api.post(`/candidates/health-info/${member.id}`, data, {
          headers: {
              'authorization': `Bearer ${token}`,
          }
      })
      console.log(response)
      } catch(err) {
        console.log(err)
          alert(err.response.data.message);
      }
    }

    async function handleRegisterMedication() {
      const data = {
        medicationName:medicationInfo.medicationName,
      obtainedPublicly: medicationInfo.obtainedPublicly,
      specificMedicationPublicly: medicationInfo.specificMedicationPublicly
      }
      try {
        const token = localStorage.getItem("token")
        const response = await api.post(`/candidates/medication-info/${member.id}`, data, {
          headers: {
              'authorization': `Bearer ${token}`,
          }
      })
      console.log(response)
      } catch(err) {
        console.log(err)
          alert(err.response.data.message);
      }
    }
    

    return (
        <div className="fill-box">
            <form id='survey-form'>
              <div class="survey-box">
                <label> 
                        Doença:
                    </label>
                    <br />
                    <select name="disease" multiple value={healthInfo.disease} onChange={handleHealthChange} required>
                        {Disease.map((status) => <option value={status.value}>{status.label}</option>)}
                    </select>
              </div>
              {diseaseSpecific && (
              <div class="survey-box">
                  <label for="specificDisease" id="specificDisease-label">Especifique a Doença</label>
                  <br />
                  <input type="text" name="specificDisease" value={healthInfo.specificDisease} onChange={handleHealthChange} id="specificDisease" class="survey-control" />
              </div>
                    )}
                <div class="survey-box">
                  <label for="hasMedicalReport" id="hasMedicalReport-label">Possui atestado médico ?</label>
                  <br />
                  <input type="checkbox" name="hasMedicalReport" value={healthInfo.hasMedicalReport} onChange={handleHealthChange} id="hasMedicalReport" class="survey-control" />
              </div>

              <div class="survey-box">
                  <button type="submit" onClick={handleRegisterHealth}  id="submit-button">Salvar Informações</button>
              </div>

              <div class="survey-box">
                  <label for="ControlledMedication" id="ControlledMedication-label">Toma Remédio Controlado?</label>
                  <br />
                  <input type="checkbox" name="ControlledMedication" value={controlledMedication} onChange={handleControlledMedication} id="ControlledMedication" class="survey-control" />
              </div>
              {controlledMedication && (
                <>
                  <div class="survey-box">
                    <label for="medicationName" id="medicationName-label">Nome do Medicamento</label>
                    <br />
                    <input type="text" name="medicationName" value={medicationInfo.medicationName} onChange={handleMedicationChange} id="medicationName" class="survey-control" />
                  </div>
                  <div class="survey-box">
                    <label for="obtainedPublicly" id="obtainedPublicly-label">Obtêm através da Rede Pública ?</label>
                    <br />
                    <input type="checkbox" name="obtainedPublicly" value={medicationInfo.obtainedPublicly} onChange={handleMedicationChange} id="obtainedPublicly" class="survey-control" />
                  </div>
                  {medicationInfo.obtainedPublicly && (
                    <div class="survey-box">
                    <label for="specificMedicationPublicly" id="specificMedicationPublicly-label">Informe Quais:</label>
                    <br />
                    <input type="text" name="specificMedicationPublicly" value={medicationInfo.specificMedicationPublicly} onChange={handleMedicationChange} id="specificMedicationPublicly" class="survey-control" />
                  </div>
                  )}
                  <div class="survey-box">
                    <button type="submit" onClick={handleRegisterMedication}  id="submit-button">Salvar Informações</button>
                  </div>
                </>
              )}
            </form>
        </div>

    );
};

