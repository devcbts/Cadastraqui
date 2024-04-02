import React from "react";
import "./AcoesPosteriores.css";

const types1Options = [
  { value: "UNIFORM", label: "Uniforme" },
  { value: "TRANSPORT", label: "Transporte" },
  { value: "FOOD", label: "Alimentação" },
  { value: "HOUSING", label: "Moradia" },
  { value: "STUDY_MATERIAL", label: "Material Didático" },
];

export default function VerAcoesPosteriores({ announcement, application }) {
  console.log(announcement);
  return (
    <div className="fill-container general-info acoes-posteriores">

      <h1 id="title-action">
        *Informações posteriores à conclusão da análise referente ao processo de
        matrícula
      </h1>

      <div class="container-form">
        {application.status === 'Approved' ?
          <div class="row" style={{width:'70%'}}>
            <form id="survey-form-next">
              <div class="form-row">
                <div class="form-group">
                  <label for="name" id="name-label">
                    Candidato{"(a)"} desistiu da bolsa de estudo ou não efetuou a
                    matrícula:
                  </label>
                  <input
                    type="checkbox"
                    class="form-control"
                    id="name"
                    placeholder="Enter your name"
                    required
                    style={{ marginTop: "0px" }}
                  ></input>
                </div>
              </div>
              <div
                className="form-row"
                style={{ display: "flex", alignItems: "center", width: '85%' }}
              >
                <div className="form-group col-md-4">
                  <h1> Benefícios - Tipo 1:</h1>
                </div>
                <div className="form-group col-md-8" style={{width: '50%'}}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: "15px",
                    }}
                  >
                    {announcement.types1.map((benefitValue) => {
                      const benefitOption = types1Options.find(
                        (option) => option.value === benefitValue
                      );
                      return (
                        <div className="form-check" key={benefitValue}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value={benefitValue}
                            id={benefitValue}
                            disabled
                            checked
                          />
                          <label
                            className="form-check-label"
                            htmlFor={benefitValue}
                          >
                            {benefitOption ? benefitOption.label : "Desconhecido"}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="form-row" style={{ display: "flex", alignItems: "center",  width: '85%' }}
              >

                <div className="form-group col-md-4">
                  <h1>Beneficios - Tipo 2:</h1>
                </div>
                <div className="form-group col-md-8">

                  <input

                    className="survey-control"
                    placeholder=""
                    disabled
                    value={announcement.type2 ? announcement.type2 : 'Não há'}
                  ></input>
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
                aluno bolsista, abaixo será disponibilizado no perfil do candidato
                para que o mesmo ou seu responsável legal assine e providencie a
                entrega na entidade
              </h2>

              <div class="form-group">
                <label for="email" id="email-label" style={{ marginTop: "20px" }}>
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
          : <div>
            <h1>Sessão disponível apenas após o deferimento da candidatura na sessão do Parecer!</h1>
          </div>
        }

      </div>
    </div>
  );
}
