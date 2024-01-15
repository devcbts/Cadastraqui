import React from 'react'
import './AcoesPosteriores.css'
export default function VerAcoesPosteriores({ applications }) {
  return (
    <div className="fill-container general-info">
      <h1 id="title-action">
        *Informações posteriores à conclusão da análise referente ao processo
        de matrícula
      </h1>
      <div class="container-form">
        <div class="row">
          <form id="survey-form">
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
                  required
                  style={{marginTop: '0px'}}
                ></input>
              </div>
              
            </div>
            <div className="form-row" style={{ display: 'flex', alignItems: 'center' }}>
              <div className="form-group col-md-4">
               <h1> Benefícios - tipo 1:</h1>
              </div>
              <div className="form-group col-md-4">
               
                <div style={{ display: 'flex', flexDirection: 'row' , gap:'15px'}}>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="1" id="materialDidatico" />
                    <label className="form-check-label" htmlFor="materialDidatico">
                      Material didático
                    </label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="2" id="uniforme" />
                    <label className="form-check-label" htmlFor="uniforme">
                      Uniforme
                    </label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="3" id="transporteEscolar" />
                    <label className="form-check-label" htmlFor="transporteEscolar">
                      Transporte escolar
                    </label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="4" id="alimentacao" />
                    <label className="form-check-label" htmlFor="alimentacao">
                      Alimentação
                    </label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="5" id="moradia" />
                    <label className="form-check-label" htmlFor="moradia">
                      Moradia
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-md-12">
                <textarea
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
                <label for="email" id="email-label" style={{ marginTop: '20px' }}>
                  Código de Identificação do bolsista:
                </label>
                <input
                  type="email"
                  class="survey-control"
                  id="email"
                  placeholder=""
                  required
                ></input>
              </div>
            <a className="btn-cadastro">Salvar</a>
          </form>
        </div>
      </div>
    </div>
  )
}

