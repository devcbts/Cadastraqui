import React, { useEffect, useState } from 'react';
import { api } from '../../../services/axios';

const DECLARATION_CATEGORIES = {
    responsavelLegal: "Declaração de Responsável Legal ou Candidato Maior de Idade",
    grupoFamiliar: "Declaração de Integrante do Grupo Familiar",
    auxilioTerceiros: "Declaração de Auxílio de Terceiros",
    imovelCedido: "Declaração de Imóvel Cedido",
    // Outras categorias podem ser adicionadas conforme necessário
};

export default function VerDeclaracoes({ id }) {
    const [declarationLinks, setDeclarationLinks] = useState({
        responsavelLegal: [],
        grupoFamiliar: [],
        auxilioTerceiros: [],
        imovelCedido: [],
        // ... outras categorias conforme necessário
    });

    useEffect(() => {
        const fetchDeclarationLinks = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await api.get(`/candidates/documents/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const linksData = response.data.urls;
                const updatedDeclarationLinks = {};

                Object.keys(DECLARATION_CATEGORIES).forEach(categoryKey => {
                    updatedDeclarationLinks[categoryKey] = linksData[`CandidateDocuments/${id}/${categoryKey}`]?.map(doc => ({
                        nome: (doc.split('/')[6]).split('?')[0],
                        url: doc
                    })) || [];
                });

                setDeclarationLinks(updatedDeclarationLinks);
            } catch (error) {
                console.error("Erro ao buscar links das declarações", error);
            }
        };

        fetchDeclarationLinks();
    }, [id]);

    return (
        <div className='fill-box'>
            <form  id='survey-form'>

                <h1>Visualizar Declarações</h1>
                {Object.entries(DECLARATION_CATEGORIES).map(([categoryKey, categoryLabel]) => (
                    <div key={categoryKey} className='survey-box'>
                        <h2>{categoryLabel}</h2>


                        {declarationLinks[categoryKey]?.map((objeto, index) => (
                            <div key={index}>
                                <a href={objeto.url} target="_blank" rel="noopener noreferrer">
                                    {objeto.nome}
                                </a>
                            </div>
                        ))}
                    </div>
                ))}
            </form>
        </div>
    );
};
