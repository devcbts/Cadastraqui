import React, { useEffect } from "react";
import "./newEntidade.css";

import { useState } from "react";
import NavBarAdmin from "../../Components/navBarAdmin";
import { api } from "../../services/axios";
import { useParams } from 'react-router'
import './verEntidade.css'
import CardEdital from "../../Components/Admin/CardEdital";


export default function VerEntidade() {
    const [entity, setEntity] = useState({})
    const { entity_id } = useParams()

    useEffect(() => {
        async function getEntities() {
            const token = localStorage.getItem('token');
            const response = await api.get(`/admin/entidades/${entity_id}`, {
                headers: {
                    'authorization': `Bearer ${token}`,
                },
            })

            setEntity(response.data.entity)
        }
        getEntities();
    }, [1])

    return (
        <div className="container">
            <div className="section-nav">
                <NavBarAdmin></NavBarAdmin>
            </div>
            <div className="editais">

                <div className="upper">
                    <h1>Visualizar Informações da Entidade</h1>
                </div>

                {entity ?
                    <div className="container-entidade-admin">
                        <div className="box-entidade-info">

                            <div className="admin-endidade-field">
                                <div className="entidade-informacao">
                                    <h2>Nome da entidade:</h2>
                                    <h3> {entity.name}</h3>
                                </div>
                                <div className="entidade-informacao">
                                    <h2>CEP: </h2>
                                    <h3> {entity.CEP}</h3>
                                </div>
                                <div className="entidade-informacao">
                                    <h2>Endereço: </h2>
                                    <h3> {entity.address}</h3>
                                </div>
                                <div className="entidade-informacao">
                                    <h2>Código Institucional: </h2>
                                    <h3> {entity.educationalInstitutionCode}</h3>
                                </div>
                            </div>
                        </div>
                        <h2>Editais abertos:</h2>
                        <div className="box-editais-admin">
                            {entity.Announcement?.map(announcement => {
                                return <CardEdital announcement={announcement} entity={entity} />
                            })}
                        </div>
                        <div>
                            <h2>Assistentes Sociais:</h2>
                            {entity.SocialAssistant?.map(assistant => {
                                return (<div>
                                    <h3>Nome: {assistant.name}</h3>

                                </div>)
                            })}
                            <div>
                                <h3>Nome: Silva</h3>

                            </div>
                        </div>
                    </div>
                    : ''}
            </div>
        </div>

    );
}

