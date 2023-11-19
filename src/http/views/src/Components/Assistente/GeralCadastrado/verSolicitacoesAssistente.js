import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { UilTimesSquare, UilLinkAdd } from "@iconscout/react-unicons"
import { api } from '../../../services/axios'
import './verSolicitacoesAssistente.css'
export default function VerSolicitacoesAssistente({ application_id, announcement_id }) {

    const [solicitations, setSolicitations] = useState(null)
    const [documentLinks, setDocumentLinks] = useState({}); // Estado para armazenar links dos documentos
    const [useEffectCount, setUseEffectCount] = useState(0);

    const visualizarDocumentos = async () => {
        try {
            const token = localStorage.getItem("token");
            solicitations.forEach(async (solicitation) => {
                if (solicitation.solicitation === 'Document') {
                    const response = await api.get(`/assistant/solicitationDocuments/${application_id}/${solicitation.id}`, {
                        headers: { 'authorization': `Bearer ${token}` }
                    });
                    setDocumentLinks(prevLinks => ({
                        ...prevLinks,
                        [solicitation.id]: response.data.urls
                    }));
                }
            });
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {

        async function getSolicitations() {
            try {

                const token = localStorage.getItem("token")
                const solicitation = await api.get(`/assistant/solicitation/${application_id}`, {
                    headers: {
                        'authorization': `Bearer ${token}`,
                    }
                })
                setSolicitations(solicitation.data.solicitations)
                console.log('====================================');
                console.log(solicitation.data.solicitations);
                console.log('====================================');
            } catch (err) {
                console.log(err);
            }
        }

        getSolicitations();

    }, [announcement_id])


    useEffect(() =>{
        visualizarDocumentos()
    },[solicitations])

    return (
        <div className="container-solicitacoes">
            <div className="main-content">
                {solicitations ? solicitations.map((solicitation) => {
                    return (
                        <div>

                            <div className="solicitacao">
                                <h2>Solicitações e comunicações enviados pela(o) assistente social</h2>
                                <div className="solicitacao">

                                    <div className="create-comment">
                                        <h2>Comentário</h2>
                                        <textarea className="text-fixed" placeholder={solicitation.description} disabled ></textarea>
                                        <div className="send-comment">
                                            <div class="box">
                                                <select value={solicitation.solicitation} disabled>
                                                    <option value='Document'>Documento</option>
                                                    <option value="Interview">Entrevista</option>
                                                    <option value="Visit">Visita Domiciliar</option>
                                                </select>
                                            </div>
                                            {solicitation.solicitation === 'Document' &&
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
                                            }

                                        </div>
                                        {solicitation.solicitation === 'Document' && documentLinks[solicitation.id] && (
                                            <div>
                                                <h3>Documentos:</h3>
                                                {documentLinks[solicitation.id].map((link, index) => (
                                                    <a key={index} href={link} target="_blank" rel="noopener noreferrer">Documento {index + 1}</a>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>


                        </div>
                    )
                }) : ''}

            </div>
        </div>
    )
}

