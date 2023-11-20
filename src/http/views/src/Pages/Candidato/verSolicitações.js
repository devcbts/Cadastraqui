import React, { useEffect, useState , useRef} from 'react'
import './verSolicitações.css'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { api } from '../../services/axios'
import { UilTimesSquare, UilLinkAdd } from "@iconscout/react-unicons"
export default function VerSolicitacoes() {

    const application_id = useParams()
    const [solicitations, setSolicitations] = useState(null)
    const [selectedFiles, setSelectedFiles] = useState({}); // Mapeamento de solicitation_id para arquivos

    const fileInputRefs = useRef({});

    const handleFileSelect = (solicitation_id, event) => {
        setSelectedFiles({
            ...selectedFiles,
            [solicitation_id]: [...(selectedFiles[solicitation_id] || []), ...event.target.files]
        });
    };

    const handleFileIconClick = (solicitation_id) => {
        fileInputRefs.current[solicitation_id].click();
    };

    useEffect(() => {

        async function getSolicitations() {
            try {

                const token = localStorage.getItem("token")
                const solicitation = await api.post(`/candidates/application/see/${application_id.application_id}`, {}, {
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
        getSolicitations()
    }, [])
    const enviarDocumento = async (solicitation_id, file) => {
        const formData = new FormData();
        formData.append("file", file);
        const token = localStorage.getItem('token');

        try {
            console.log('====================================');
            console.log(formData);
            console.log('====================================');
            const response = await api.post(`/candidates/upload/${solicitation_id}`, formData, {
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
    return (
        <div className="container-solicitacoes">
              <a className="btn-cadastro">
              <Link
                className="btn-cadastro"
                to={`/candidato/solicitacoes`}
              >
                {"< "}Voltar
              </Link>
            </a>
            <header>
                <h1>Seja bem-vindo!</h1>
                <p>Aqui você terá acesso...</p>
            </header>

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
                                    </div>
                                    {solicitation.solicitation === 'Document' &&
                                       <div className="attach-file">
                                       <UilLinkAdd size="25" color="#1f4b73" onClick={() => handleFileIconClick(solicitation.id)} />
                                       <h3 onClick={() => handleFileIconClick(solicitation.id)}>Anexar documento</h3>
                                       <input
                                           type="file"
                                           multiple
                                           ref={el => fileInputRefs.current[solicitation.id] = el}
                                           onChange={(e) => handleFileSelect(solicitation.id, e)}
                                           style={{ display: 'none' }}
                                       />
                                       <button className="btn-send" onClick={() => selectedFiles[solicitation.id]?.forEach((file) =>enviarDocumento(solicitation.id,file))}>Enviar</button>
                                   </div>
                                    }
                                </div>
                            </div>


                        </div>
                    )
                }) : ''}

            </div>
        </div>
    )
}

