import React from 'react'
import { useState } from 'react';
import './AcoesPosteriores.css'
import { api } from '../../../services/axios';

const types1Options = [
  { value: 'UNIFORM', label: 'Uniforme' },
  { value: 'TRANSPORT', label: 'Transporte' },
  { value: 'FOOD', label: 'Alimentação' },
  { value: 'HOUSING', label: 'Moradia' },
  { value: 'STUDY_MATERIAL', label: 'Material Didático' },
];

export default function VerAcoesPosteriores({ announcement, application }) {


  const [gaveUp, setGaveUp] = useState(false);
  const [scholarshipCode, setScholarshipCode] = useState('');
  const [comments, setComments] = useState('');
  const [granted, setGranted] = useState(true); // Supondo que você quer capturar se foi concedida ou não a bolsa



  const handleSubmit = async (event) => {
    event.preventDefault();
    if (gaveUp) {
      setGranted(false)
    }
    try {
      
      const response = await api.post(`assistant/close/${announcement.id}/${application.id}`, {
        application_id: application.id,
        announcement_id: announcement.id,
        description: comments,
        gaveUp,
        granted,
        ScholarshipCode: scholarshipCode,
        types: announcement.types1,
      });
      console.log(response.data);
      // Aqui você pode lidar com a resposta da API, como mostrar um aviso de sucesso
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      // Aqui você pode lidar com erros de rede, mostrar um popup de erro, etc.
    }
  };


  return (
    <div className="fill-container general-info">
      <h1 id="title-action">
        *Informações posteriores à conclusão da análise referente ao processo
        de matrícula
      </h1>
      { application.status === "Approved" ? <div class="container-form">
        <div class="row">
          <form id="survey-form" onSubmit={handleSubmit}>
            <div class="form-row">
              <div class="form-group">
                <label for="name" id="name-label">
                  Candidato{"(a)"} desistiu da bolsa de estudo ou não efetuou
                  a matrícula:
                </label>
                <input
                  type="checkbox"
                  class="form-control"
                  id="name"
                  placeholder="Enter your name"
                  
                  style={{ marginTop: '0px' }}
                  onChange={(e) => {
                    setGaveUp(!gaveUp)
                  }}
                  checked={gaveUp}
                ></input>
              </div>

            </div>
            <div className="form-row" style={{ display: 'flex', alignItems: 'center' }}>
              <div className="form-group col-md-4">
                <h1> Benefícios - tipo 1:</h1>
              </div>
              <div className="form-group col-md-8">
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '15px' }}>
                  {announcement.types1.map((benefitValue) => {
                    const benefitOption = types1Options.find(option => option.value === benefitValue);
                    return (
                      <div className="form-check" key={benefitValue}>
                        <input className="form-check-input" type="checkbox" value={benefitValue} id={benefitValue} disabled checked />
                        <label className="form-check-label" htmlFor={benefitValue}>
                          {benefitOption ? benefitOption.label : 'Desconhecido'}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-md-12">
                <textarea
                onChange={(e) => setComments(e.target.value)}
                  class="form-control"
                  placeholder="Comentários adicionais"
                ></textarea>
              </div>
            </div>

            <h2 className="law-text">
              O Termo de Concessão de Benefícios - Tipo 1: Ações de apoio ao
              aluno bolsista, abaixo será disponibilizado no perfil do
              candidato para que o mesmo ou seu responsável legal assine e
              providencie a entrega na entidade
            </h2>

            <div class="form-group">
              <label for="text" id="email-label" style={{ marginTop: '20px' }}>
                Código de Identificação do bolsista:
              </label>
              <input
                type="text"
                class="survey-control"
                id="email"
                placeholder=""
                required
                onChange={(e) => setScholarshipCode(e.target.value)}
                value={scholarshipCode}
              ></input>
            </div>
            <button className="btn-cadastro" type="submit">Salvar</button>
          </form>
        </div>
      </div>: <div>
        <h1>Sessão Disponível apenas após o Deferimento da candidatura</h1>
      </div>
        }
    </div>
  )
}

