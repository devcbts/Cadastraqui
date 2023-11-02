import React, { useEffect, useState } from 'react'
import './verSolicitações.css'
import { useParams } from 'react-router'
import { api } from '../../services/axios'
import { UilTimesSquare } from "@iconscout/react-unicons"
export default function VerSolicitacoes() {

    const application_id = useParams()
    const [solicitations, setSolicitations] = useState(null)
    console.log('====================================');
    console.log(application_id.application_id);
    console.log('====================================');
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

    return (
        <div className="container-solicitacoes">
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
                                        <h2>Adicionar comentario de seção</h2>
                                        <textarea className="text-fixed" placeholder={solicitation.description} disabled ></textarea>
                                        <div className="send-comment">
                                            <div class="box">
                                                <select value={solicitation.solicitation} >
                                                    <option value='Document'>Documento</option>
                                                    <option value="Interview">Entrevista</option>
                                                    <option value="Visit">Visita Domiciliar</option>
                                                </select>
                                            </div>

                                            <div class="box">
                                                <h2>Prazo para envio dos documentos</h2>
                                                <select>
                                                    <option value="1">1 dia</option>
                                                    <option value="2">2 dias</option>
                                                    <option value="3">3 dias</option>
                                                    <option value="4">4 dias</option>
                                                    <option value="5">5 dias</option>
                                                    <option value="6">6 dias</option>
                                                    <option value="7">7 dias</option>
                                                </select>
                                            </div>
                                            <button className="btn-send" >Enviar</button>
                                        </div>
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

