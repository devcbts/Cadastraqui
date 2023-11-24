import React, { useState, useEffect } from 'react';
import { api } from '../../../services/axios';

const DOCUMENT_CATEGORIES = {
    identificacao: {
        description: "Documentos de Identificação",
        type: "identificacao",
        details: "Inclui RG, CPF, Certidão de Nascimento e Certidão de Casamento."
    },
    rendaEmprego: {
        description: "Documentos de Renda e Emprego",
        type: "rendaEmprego",
        details: "Inclui Extrato de Contribuição, Declaração de IR e Demonstrativos de Pagamento."
    },
    empresaProfissional: {
        description: "Documentos de Empresa e Atividade Profissional",
        type: "empresaProfissional",
        details: "Inclui Contrato de Estágio, Termo Aditivo, Escrituração Fiscal, etc."
    },
    propriedadeResidencia: {
        description: "Documentos de Propriedade e Residência",
        type: "propriedadeResidencia",
        details: "Inclui Contrato de Locação, Comprovante de Residência, IPTU, ITR, IPVA."
    },
    saudeEducacao: {
        description: "Documentos de Saúde e Educação",
        type: "saudeEducacao",
        details: "Inclui Laudos de Doenças Graves/Crônicas, Comprovantes de Matrícula, etc."
    },
    bancariosFinanceiros: {
        description: "Documentos Bancários e Financeiros",
        type: "bancariosFinanceiros",
        details: "Inclui Extratos Bancários, Faturas de Cartão de Crédito, Extrato do FGTS."
    },
    programasGovernamentais: {
        description: "Documentos de Programas Governamentais",
        type: "programasGovernamentais",
        details: "Inclui Comprovantes do CadÚnico, Bolsa Família, BPC, etc."
    }
    // Outras categorias podem ser adicionadas conforme necessário
};

// Restante do componente...

export default function VerDocumentosAssistente({ id }) {
    const [documentos, setDocumentos] = useState({
        identificacao: [],
        rendaEmprego: [],
        empresaProfissional: [],
        propriedadeResidencia: [],
        saudeEducacao: [],
        bancariosFinanceiros: [],
        programasGovernamentais: [],
        // Outras categorias podem ser adicionadas conforme necessário
    });

    const handleFileChange = (e, categoryType) => {
        setDocumentos({
            ...documentos,
            [categoryType]: [...documentos[categoryType], e.target.files[0]]
        });
    };

    const [documentLinks, setDocumentLinks] = useState({
        identificacao: [],
        rendaEmprego: [],
        empresaProfissional: [],
        propriedadeResidencia: [],
        saudeEducacao: [],
        bancariosFinanceiros: [],
        programasGovernamentais: [],
        // Outras categorias podem ser adicionadas conforme necessário
    });

    
    useEffect(() => {
        // Função para buscar os links dos documentos
        const fetchDocumentLinks = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await api.get(`/candidates/documents/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const linksData = response.data.urls;
                linksData[`CandidateDocuments/${id}/identificacao`]?.map(doc => {
                    console.log('====================================');
                    console.log((doc.split('/')[6]).split('?')[0]);
                    console.log('====================================');
                })
                const updatedDocumentLinks = {};
                Object.keys(DOCUMENT_CATEGORIES).forEach(category => {
                    const categoryType = DOCUMENT_CATEGORIES[category].type;

                    updatedDocumentLinks[categoryType] = linksData[`CandidateDocuments/${id}/${categoryType}`]?.map(doc => ({
                        nome: (doc.split('/')[6]).split('?')[0],
                        url: doc
                    })) || [];

                });
               
                setDocumentLinks(updatedDocumentLinks);
                
            } catch (error) {
                console.error("Erro ao buscar links dos documentos", error);
            }
        };

        fetchDocumentLinks();
    }, []); // Roda apenas uma vez, quando o componente é montado

    return (
        <div className='fill-box'>

            <form id='survey-form'>
                {Object.entries(DOCUMENT_CATEGORIES).map(([categoryKey, category]) => (
                    <div key={categoryKey}>
                        <h2>{category.description}</h2>

                        <div className='survey-box'>
                            <label>{`Visualizar os documentos de ${category.details}`}</label>
                    
                            <br />
                            {documentLinks[category.type]?.map((objeto, index) => (
                                <div key={index}>
                                    <a href={objeto.url} target="_blank" rel="noopener noreferrer">
                                        {objeto.nome}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </form>

        </div>
    );
};

