import React from "react";
import { useState } from "react";
import "./acceptEdital.css";

export default function AcceptEdital() {
  return (
    <div className="section-fill-edital">
      <h1>INSCRIÇÃO EM PROCESSO SELETIVO</h1>
      <h4 className="subtitle-subscription">
        Compromisso em comunicar eventual alteração no tamanho do grupo familiar
        e/ou renda.
      </h4>
      <h4 className="text-subscription">
        Tenho ciência de que devo comunicar o(a) assistente social da entidade
        beneficente sobre nascimento ou falecimento de membro do meu grupo
        familiar, desde que morem na mesma residência, bem como sobre eventual
        rescisão de contrato de trabalho, encerramento de atividade que gere
        renda ou sobre início em novo emprego ou atividade que gere renda para
        um dos membros, pois altera a aferição realizada e o benefício em
        decorrência da nova renda familiar bruta mensal pode ser ampliado,
        reduzido ou mesmo cancelado, após análise por profissional de serviço
        social.
      </h4>
      <h4 className="subtitle-subscription">
        Inteira responsabilidade pelas informações contidas neste cadastro.{" "}
      </h4>
      <h4 className="text-subscription">
        Estou ciente e assumo, inteira responsabilidade pelas informações
        contidas neste cadastro e em relação as informações prestadas no
        decorrer do preenchimento deste formulário eletrônico e documentos
        anexados, estando consciente que a falsidade nas informações implicará
        nas penalidades cabíveis, previstas nos artigos 298 e 299 do Código
        Penal Brasileiro, bem como sobre a condição prevista no caput e § 2º do
        art. 26 da Lei Complementar nº 187, de 16 de dezembro de 2021.
      </h4>

      <div className="select-candidato">
        <h4>Candidato (a)</h4>
        <select>
          <option>João Silva</option>
          <option>Marcelo</option>
        </select>
      </div>

      <div className="select-course">
        <h4>Inscrição no curso pretendido</h4>
        <div className="select-fields">
          <div>
            <h4>Cidade</h4>
            <select>
              <option>São Paulo</option>
              <option>Itajubá</option>
              <option>Itabira</option>
            </select>
          </div>
          <div>
            <h4>Instituição</h4>
            <select>
              <option>USP</option>
              <option>UNESP</option>
            </select>
          </div>
          <div>
            <h4>Edital</h4>
            <select>
              <option>2024.1</option>
              <option>2024.2</option>
            </select>
          </div>
        </div>
      </div>

      <div className="select-course">
        <h4>Ensino superior</h4>
        <div className="select-fields">
          <div>
            <h4>Tipo </h4>
            <select>
              <option>Bacharelado</option>
              <option>Pós-graduação</option>
            </select>
          </div>
          <div>
            <h4>Curso</h4>
            <select>
              <option>Medicina</option>
              <option>Engenharia</option>
            </select>
          </div>
          <div>
            <h4>Semestre</h4>
            <select>
              <option>Primeiro</option>
              <option>Segundo</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
