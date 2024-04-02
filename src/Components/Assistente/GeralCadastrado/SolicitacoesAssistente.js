import React from "react";
import { useState, useEffect } from "react";
import { UilTimesSquare } from "@iconscout/react-unicons";
import Comment from "../../comment";
import VerSolicitacoesAssistente from "./verSolicitacoesAssistente";
import { api } from "../../../services/axios";
import "./SolicitacoesAssistente.css";

export default function SolicitacoesAssistente({
  application_id,
  announcement_id,
}) {
  const [descricao, setDescricao] = useState("");
  const [selectedValue, setSelectedValue] = useState("Document");
  const [deadLine, setDeadLine] = useState(null);
  const handleSubmitButton = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        `assistant/solicitation/${application_id}`,
        {
          description: descricao,
          solicitation: selectedValue,
          deadLine: deadLine,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setDescricao("");
    } catch (error) {
      alert("erro ao criar solicitação");
    }
  };

  return (
    <div className="fill-container general-info solicitacoes-assistente">
      <div className="upper-sections">
        <div>
          <h2>Comentários</h2>
          <h3>João da Silva</h3>
        </div>
        
      </div>
      <div className="create-comment">
        <h2>Adicionar comentario de seção</h2>
        <textarea
          className="text-fixed"
          onChange={(e) => setDescricao(e.target.value)}
        ></textarea>
        <div className="send-comment">
          <div class="box">
            <select
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
            >
              <option value="Document">Documento</option>
              <option value="Interview">Entrevista</option>
              <option value="Visit">Visita Domiciliar</option>
            </select>
          </div>
          {selectedValue === "Document" ? (
            <div class="box">
              <select
                value={deadLine ? deadLine : 1}
                onChange={(e) => setDeadLine(e.target.value)}
              >
                <option value="1">1 dia</option>
                <option value="2">2 dias</option>
                <option value="3">3 dias</option>
                <option value="4">4 dias</option>
                <option value="5">5 dias</option>
                <option value="6">6 dias</option>
                <option value="7">7 dias</option>
              </select>
            </div>
          ) : (
            ""
          )}
          <button className="btn-send" onClick={handleSubmitButton}>
            Enviar
          </button>
        </div>
      </div>
      <div className="comments-box">
        <VerSolicitacoesAssistente
          application_id={application_id}
          announcement_id={announcement_id}
        />
      </div>
    </div>
  );
}
