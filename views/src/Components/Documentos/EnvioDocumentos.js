import React, { useState, useEffect } from 'react';
import { api } from '../../services/axios';
import './envioDocumentos.css'

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

export default function EnviarDocumentos({ id }) {
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
    const enviarDocumento = async (tipo, file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("documentType", tipo); // Adiciona o tipo do documento ao FormData
        const token = localStorage.getItem('token');

        try {
            console.log('====================================');
            console.log(formData);
            console.log('====================================');
            const response = await api.post(`/candidates/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log(response.data);
            // Trate a resposta conforme necessário
        } catch (error) {
            console.error(error.response?.data || error.message);
            // Trate o erro conforme necessário
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Object.keys(documentos).forEach(tipo => {
            documentos[tipo].forEach(file => {
                enviarDocumento(tipo, file);
            });
        });
    };
    useEffect(() => {
        // Função para buscar os links dos documentos
        const fetchDocumentLinks = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await api.get('/candidates/documents', {
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
                console.log('====================================');
                console.log(updatedDocumentLinks);
                console.log('====================================');
                setDocumentLinks(updatedDocumentLinks);
                console.log('====================================');
                console.log(documentLinks);
                console.log('====================================');
            } catch (error) {
                console.error("Erro ao buscar links dos documentos", error);
            }
        };

        fetchDocumentLinks();
    }, []); // Roda apenas uma vez, quando o componente é montado

    return (
        <div className='fill-box'>

            <form onSubmit={handleSubmit} id='survey-form'>
                {Object.entries(DOCUMENT_CATEGORIES).map(([categoryKey, category]) => (
                    <div key={categoryKey}>
                        <h2>{category.description}</h2>

                        <div className='survey-box'>
                            <label>{`Adicionar documentos para ${category.details}`}</label>
                            <input
                                type="file"
                                onChange={(e) => handleFileChange(e, category.type)}
                                className='survey-control'
                                style={{marginLeft:'135px'}}
                            />
                            <br />
                            <button type="button" onClick={() => documentos[category.type]?.forEach(file => enviarDocumento(category.type, file))}>
                                Enviar Documentos de {categoryKey}
                            </button>
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
                <button type="submit">Enviar Todos os Documentos</button>
            </form>

        </div>
    );
};

