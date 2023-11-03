import React, { useState } from "react";
import NavBarAssistente from "../../Components/navBarAssistente";
import MultiStep from "react-multistep";
import { UilCheckSquare } from "@iconscout/react-unicons";
import { UilSquareFull } from "@iconscout/react-unicons";
import "./geralCadastrado.css";
import Comment from "../../Components/comment";

export default function GeralCadastrado() {
  const [formData, setFormData] = useState({
    dateAndTime: "",
    candidateName: "",
    rgId: "",
    rgIssuer: "",
    // ... (add other form fields as necessary)
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form Data Submitted:", formData);
    // You can process or display the filled out form here
  };

  function EditaisAnteriores() {
    return (
      <div className="fill-container general-info">
        <table>
          <thead>
            <tr>
              <th>Ano</th>
              <th>Edital</th>
              <th>Matriz/Filial</th>
              <th>Curso</th>
              <th>Turno</th>
              <th>Assistente Social</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>2023</strong>
              </td>
              <td>1</td>
              <td>Itajubá</td>
              <td>Administração</td>
              <td>Vespertino</td>
              <td>Luciene</td>
            </tr>
            <tr>
              <td>
                <strong>2023</strong>
              </td>
              <td>1</td>
              <td>Itajubá</td>
              <td>Administração</td>
              <td>Vespertino</td>
              <td>Luciene</td>
            </tr>
            <tr>
              <td>
                <strong>2023</strong>
              </td>
              <td>1</td>
              <td>Itajubá</td>
              <td>Administração</td>
              <td>Vespertino</td>
              <td>Luciene</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  function Extrato() {
    return (
      <div className="fill-container general-info">
        <h1>Integrantes do grupo familiar</h1>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Idade</th>
              <th>Parentesco</th>
              <th>Emprego</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Antônio</strong>
              </td>
              <td>123456789-09</td>
              <td>47</td>
              <td>Pai</td>
              <td>Advogado</td>
            </tr>
            <tr>
              <td>
                <strong>Antônio</strong>
              </td>
              <td>123456789-09</td>
              <td>47</td>
              <td>Pai</td>
              <td>Advogado</td>
            </tr>
            <tr>
              <td>
                <strong>Antônio</strong>
              </td>
              <td>123456789-09</td>
              <td>47</td>
              <td>Pai</td>
              <td>Advogado</td>
            </tr>
          </tbody>
        </table>
        <h1>Resumo dos dados relevantes</h1>
        <table>
          <thead>
            <tr>
              <th>Cód. Único</th>
              <th>Renda familiar bruta</th>
              <th>Soma das despesas</th>
              <th>Doença grave</th>
              <th>Distância da residência</th>
              <th>Situação da moradia</th>
              <th>Veículos discriminados</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sim</td>
              <td>R$3500,00</td>
              <td>R$3487,00</td>
              <td>Não</td>
              <td>2,4 km</td>
              <td>Casa própria</td>
              <td>0</td>
            </tr>
          </tbody>
        </table>
        <h1>Renda familiar bruta mensal compatível com:</h1>
        <div className="check-options">
          <ul>
            <li>
              <UilCheckSquare size="25" color="#1b4f73"></UilCheckSquare>
              Bolsa de estudo integral a aluno cuja renda mensal não exceda a
              1,5 salários mínimos per capita.
            </li>
            <li>
              <UilSquareFull size="25" color="#1b4f73"></UilSquareFull>
              Bolsa de estudo parcial.
            </li>
          </ul>
        </div>
      </div>
    );
  }

  function Solicitacoes() {
    return (
      <div className="fill-container general-info">
        <div className="upper-sections">
          <div>
            <h2>Solicitações</h2>
            <h3>Jean Carlo do Amaral</h3>
          </div>
        </div>
        <div className="create-comment">
          <h2>Adicionar comentario de seção</h2>
          <textarea className="text-fixed"></textarea>
          <div className="send-comment">
            <div class="box">
              <select>
                <option>Documento</option>
                <option>RG</option>
                <option>CPF</option>
                <option>Comprovante de residência</option>
                <option>...</option>
              </select>
            </div>
            <button className="btn-send">Enviar</button>
          </div>
        </div>
        <div className="comments-box">
          <Comment></Comment>
        </div>
      </div>
    );
  }

  function Parecer() {
    return (
      <div className="fill-container general-info">
        <h1>
          Em, {"02-11-2023"} o(a) candidato
          {"("}a{")"} {"Jean Carlo do Amaral"}, portador{"("}a{")"} da cédula de
          identidade RG número {"22.222.222"}
        </h1>
        <form onSubmit={handleSubmit}>
          <label>
            Date and Time of Completion:
            <input
              type="text"
              name="dateAndTime"
              value={formData.dateAndTime}
              onChange={handleChange}
            />
          </label>
          <label>
            Candidate Name:
            <input
              type="text"
              name="candidateName"
              value={formData.candidateName}
              onChange={handleChange}
            />
          </label>
          <label>
            RG ID Number:
            <input
              type="text"
              name="rgId"
              value={formData.rgId}
              onChange={handleChange}
            />
          </label>
          <label>
            RG Issuing Body:
            <input
              type="text"
              name="rgIssuer"
              value={formData.rgIssuer}
              onChange={handleChange}
            />
          </label>
          {/* Add other input fields as necessary */}
          <button type="submit">Submit</button>
        </form>

        <div>
          {/* Display the filled-out form (for demonstration purposes) */}
          <p>Date and Time: {formData.dateAndTime}</p>
          <p>Candidate Name: {formData.candidateName}</p>
          <p>RG ID: {formData.rgId}</p>
          <p>RG Issuer: {formData.rgIssuer}</p>
          {/* Display other filled out fields as necessary */}
        </div>
      </div>
    );
  }

  function Acoes() {
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
                  ></input>
                </div>
                <div class="form-group">
                  <label for="email" id="email-label">
                    Código de Identificação do bolsista:
                  </label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    placeholder=""
                    required
                  ></input>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-4">
                  <label for="exp" id="number-label">
                    A entidade irá conceder bolsa ao aluno?{" "}
                    {"(Responder sim ou não)"}
                  </label>
                  <input type="radio" name="bolsa" value="yes" />
                  Sim
                  <input type="radio" name="bolsa" value="no" />
                  Não
                </div>
                <div class="form-group col-md-4">
                  <label for="dropdown" id="dropdown-label">
                    Se sim, especifique quais:
                  </label>
                  <select id="dropdown" class="form-control" required>
                    <option value="">Escolher</option>
                    <option value="1">Material didático</option>
                    <option value="2">Uniforme</option>
                    <option value="3">Transporte escolar</option>
                    <option value="4">Alimentação</option>
                    <option value="5">Moradia</option>
                  </select>
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

              <a className="btn-cadastro">Enviar</a>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="section-nav">
        <NavBarAssistente></NavBarAssistente>
      </div>
      <div className="container-contas">
        <div className="upper-cadastrados">
          <h1>Editais - Unifei 2023.1</h1>
          <div className="btns-cadastro">
            <a className="btn-cadastro">{"< "}Voltar</a>
            <a className="btn-cadastro">Ver formulário</a>
          </div>
        </div>
        <div className="multistep-container">
          <MultiStep
            activeStep={0}
            className="multi-step"
            stepCustomStyle={{
              fontSize: 0.8 + "rem",
              margin: "auto",
              width: 100 + "%",
            }}
            showNavigation={false}
          >
            <EditaisAnteriores title="Editais anteriores"></EditaisAnteriores>
            <Extrato title="Extrato"></Extrato>
            <Solicitacoes title="Solicitacoes"></Solicitacoes>
            <Parecer title="Parecer"></Parecer>
            <Acoes title="Ações posteriores"></Acoes>
          </MultiStep>
        </div>
      </div>
    </div>
  );
}
