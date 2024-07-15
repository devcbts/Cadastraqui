import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { UilTimesSquare, UilLinkAdd } from "@iconscout/react-unicons";
import { api } from "../../../services/axios";
import "./verSolicitacoesAssistente.css";
export default function VerSolicitacoesAssistente({
  application_id,
  announcement_id,
}) {
  const [solicitations, setSolicitations] = useState(null);
  const [documentLinks, setDocumentLinks] = useState({}); // Estado para armazenar links dos documentos
  const [useEffectCount, setUseEffectCount] = useState(0);

  const visualizarDocumentos = async () => {
    try {
      const token = localStorage.getItem("token");
      solicitations.forEach(async (solicitation) => {
        if (solicitation.solicitation === "Document") {
          const response = await api.get(
            `/assistant/solicitationDocuments/${application_id}/${solicitation.id}`,
            {
              headers: { authorization: `Bearer ${token}` },
            }
          );
          setDocumentLinks((prevLinks) => ({
            ...prevLinks,
            [solicitation.id]: response.data.urls,
          }));
        }
      });
    } catch (error) {
      ;
    }
  };
  useEffect(() => {
    async function getSolicitations() {
      try {
        const token = localStorage.getItem("token");
        const solicitation = await api.get(
          `/assistant/solicitation/${application_id}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setSolicitations(solicitation.data.solicitations);
        ;
        ;
        ;
      } catch (err) {
        ;
      }
    }

    getSolicitations();
  }, [announcement_id]);

  useEffect(() => {
    visualizarDocumentos();
  }, [solicitations]);

  const [report, setReport] = useState(""); // Estado para armazenar o relatório

  // Função para lidar com a mudança no textarea
  const handleReportChange = (event) => {
    setReport(event.target.value);
  };

  // Função para salvar o relatório
  const saveReport = async (solicitationId) => {
    // Aqui você pode adicionar a lógica para enviar o relatório para o backend
    try {
      const token = localStorage.getItem("token");
      const response = await api.patch(
        `/assistant/solicitation/${solicitationId}`,
        {
          report: report,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      ;
    } catch (error) {
      ;
    }
    // Exemplo: api.post('URL_PARA_SALVAR_RELATORIO', { id: solicitationId, report: report });
  };

  return (
    <div className="container-solicitacoes conteiner-solicitacoes-assistente">
      <div className="main-content">
        {solicitations ? (
          solicitations.map((solicitation) => {
            const date = new Date(solicitation.date);
            const formattedDate = date.toLocaleString("pt-BR", {
              day: "2-digit", // Dia
              month: "2-digit", // Mês
              year: "numeric", // Ano
              hour: "2-digit", // Hora
              minute: "2-digit", // Minuto
              second: "2-digit", // Segundo
            });
            return (
              <div className="box-solicitacao">
                <div className="box-solicitacao">
                  <h2>Solicitação enviada em {formattedDate}</h2>
                  <div className="solicitacao">
                    <div className="create-comment">
                      <h2>Comentário</h2>
                      <textarea
                        className="text-fixed"
                        placeholder={solicitation.description}
                        disabled
                      ></textarea>
                      <div className="send-comment">
                        <div class="box">
                          <select value={solicitation.solicitation} disabled>
                            <option value="Document">Documento</option>
                            <option value="Interview">Entrevista</option>
                            <option value="Visit">Visita Domiciliar</option>
                          </select>
                        </div>
                        {solicitation.solicitation === "Document" && (
                          <div>
                            <div class="box">
                              <h2>Prazo para envio dos documentos</h2>
                              <select disabled>
                                <option value="1">1 dia</option>
                                <option value="2">2 dias</option>
                                <option value="3">3 dias</option>
                                <option value="4">4 dias</option>
                                <option value="5">5 dias</option>
                                <option value="6">6 dias</option>
                                <option value="7">7 dias</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                      {solicitation.solicitation === "Document" &&
                        documentLinks[solicitation.id] && (
                          <div>
                            <h3>Documentos:</h3>
                            {documentLinks[solicitation.id].map(
                              (link, index) => (
                                <a
                                  key={index}
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Documento {index + 1}
                                </a>
                              )
                            )}
                          </div>
                        )}
                      <div>
                        <h2>Relatório sobre a solicitação feita:</h2>
                        {!solicitation.report ? (
                          <>
                            <textarea
                              value={report}
                              onChange={handleReportChange}
                              placeholder="Escreva aqui o resultado da solicitação..."
                              rows="2" // Define o número de linhas
                              className="report-textarea"
                            ></textarea>
                            <button onClick={() => saveReport(solicitation.id)}>
                              Salvar Relatório
                            </button>
                          </>
                        ) : (
                          <textarea
                            value={solicitation.report}
                            rows="2" // Define o número de linhas
                            className="report-textarea"
                          ></textarea>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div>
            <div className="skeleton skeleton-table" />

            <div className="skeleton skeleton-table" />
          </div>
        )}
      </div>
    </div>
  );
}
