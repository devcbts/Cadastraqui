import React, { useEffect, useState } from "react";
import { api } from "../../services/axios";
import imovelCedidoPDF from "../../Assets/imovel-cedido.pdf"; // Importando o arquivo PDF
import auxilioTerceirosPDF from "../../Assets/auxilio-terceiros.pdf"; // Importando o arquivo PDF
import declaracaoCandidatoResponsavelPDF from "../../Assets/candidato-responsavel-declaracao.pdf"; // Importando o arquivo PDF
import declaracaoGrupoFamiliarPDF from "../../Assets/declaracao-grupo-familiar.pdf"; // Importando o arquivo PDF
import { handleAuthError } from "../../ErrorHandling/handleError";
import { handleSuccess } from "../../ErrorHandling/handleSuceess";

const DECLARATION_CATEGORIES = {
  responsavelLegal:
    "Declaração de Responsável Legal ou Candidato Maior de Idade",
  grupoFamiliar: "Declaração de Integrante do Grupo Familiar",
  auxilioTerceiros: "Declaração de Auxílio de Terceiros",
  imovelCedido: "Declaração de Imóvel Cedido",
  // Outras categorias podem ser adicionadas conforme necessário
};

export default function EnviarDeclaracoes({ id }) {
  const [declaracoes, setDeclaracoes] = useState({
    responsavelLegal: [],
    grupoFamiliar: [],
    auxilioTerceiros: [],
    imovelCedido: [],
    // Outras categorias podem ser adicionadas conforme necessário
  });

  const [declarationLinks, setDeclarationLinks] = useState({
    responsavelLegal: [],
    grupoFamiliar: [],
    auxilioTerceiros: [],
    imovelCedido: [],
    // ... other categories as needed
  });

  const handleFileChange = (e, category) => {
    setDeclaracoes({
      ...declaracoes,
      [category]: [...declaracoes[category], e.target.files[0]],
    });
  };

  const enviarDeclaracao = async (tipo, file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", tipo);
    const token = localStorage.getItem("token");

    try {
      const response = await api.post(`/candidates/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Trate a resposta conforme necessário
      handleSuccess(response,"Declaração Enviada!");
    } catch (error) {
      // Trate o erro conforme necessário
      handleAuthError(error)
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Object.keys(declaracoes).forEach((categoria) => {
      declaracoes[categoria].forEach((file) => {
        enviarDeclaracao(categoria, file);
      });
    });
  };

  const pdfLinks = {
    responsavelLegal: declaracaoCandidatoResponsavelPDF,
    grupoFamiliar: declaracaoGrupoFamiliarPDF,
    auxilioTerceiros: auxilioTerceirosPDF,
    imovelCedido: imovelCedidoPDF,
  };

  // Fetching document links
  useEffect(() => {
    const fetchDeclarationLinks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/candidates/documents", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Process and set the fetched links in the state
        const linksData = response.data.urls;
        const updatedDeclarationLinks = {};

        Object.keys(DECLARATION_CATEGORIES).forEach((categoryKey) => {
          console.log(`CandidateDocuments/${id}/${categoryKey}`);
          console.log(linksData[`CandidateDocuments/${id}/${categoryKey}`]);
          updatedDeclarationLinks[categoryKey] =
            linksData[`CandidateDocuments/${id}/${categoryKey}`]?.map(
              (doc) => ({
                nome: doc.split("/")[6].split("?")[0],
                url: doc,
              })
            ) || [];
        });

        setDeclarationLinks(updatedDeclarationLinks);
        console.log("====================================");
        console.log(updatedDeclarationLinks);
        console.log("====================================");
      } catch (error) {
        handleAuthError(error)
        console.error("Erro ao buscar links das declarações", error);
      }
    };

    fetchDeclarationLinks();
  }, []); // Dependency array includes 'id' to refetch when 'id' changes

  return (
    <div className="fill-box">
      <form onSubmit={handleSubmit} id="survey-form">
        {Object.entries(DECLARATION_CATEGORIES).map(
          ([categoryKey, categoryLabel]) => (
            <div className="doc-box">
              <div
                key={categoryKey}
                className="survey-box"
                
              >
                <h2>{categoryLabel}</h2>

                <a
                  href={pdfLinks[categoryKey]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visualizar {categoryLabel}
                </a>
                <input
                  type="file"
                  accept=".pdf"
                  className="survey-control"
                  style={{
                    marginLeft: "175px",
                    justifyContent: "center",
                    marginBottom: "10px",
                  }}
                  onChange={(e) => handleFileChange(e, categoryKey)}
                />

                <button
                  type="button"
                  className="send-document-btn"
                  onClick={() =>
                    declaracoes[categoryKey].forEach((file) =>
                      enviarDeclaracao(categoryKey, file)
                    )
                  }
                >
                  Enviar Declaração
                </button>
                {declarationLinks[categoryKey]?.map((objeto, index) => (
                  <div key={index}>
                    <a
                      href={objeto.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {objeto.nome}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </form>
    </div>
  );
}
