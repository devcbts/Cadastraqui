import React, { useState } from "react";
import NavBarAssistente from "../../Components/navBarAssistente";
import MultiStep from "react-multistep";
import { UilCheckSquare } from "@iconscout/react-unicons";
import { UilSquareFull } from "@iconscout/react-unicons";
import "./geralCadastrado.css";
import Comment from "../../Components/comment";

export default function GeralCadastrado() {
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
      <div className="fill-container">
        <h1>4</h1>
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
          </MultiStep>
        </div>
      </div>
    </div>
  );
}
