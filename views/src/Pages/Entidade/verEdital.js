import React from "react";
import "./editais.css";
import { useState, useEffect } from "react";
import { UilBell } from "@iconscout/react-unicons";
import { useAppState } from "../../AppGlobal";
import NavBarAdmin from "../../Components/navBarAdmin";
import NavBar from "../../Components/navBar";
import Edital from "../../Components/edital";
import { api } from "../../services/axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from 'react-router';
import EditalEntidade from "../../Components/editalEntidade";
import './verEdital.css'
import Select from 'react-select';
export default function VerEditalEntidade() {
    const { isShown } = useAppState();
    // The empty array ensures this effect only runs once, on mount and unmount

    // BackEnd Functions
    const [profilePhoto, setProfilePhoto] = useState(null);

    // Estados para os editais
    const [announcement, setAnnouncement] = useState(null)
    const announcement_id = useParams()
    // Estado para informações acerca do usuário logado
    const [entityInfo, setEntityInfo] = useState(null)
    const navigate = useNavigate()

    //assistentes
    const [assistants, setAssistants] = useState([]);
    const [selectedAssistants, setSelectedAssistants] = useState([]);



    async function handleAddAssistantsToAnnouncement() {
        const token = localStorage.getItem("token");
        for (const assistant of selectedAssistants) {
            try {
                await api.post('/entities/announcement/assistant', {
                    announcement_id: announcement_id.announcement_id,
                    assistant_id: assistant.value,
                }, {
                    headers: {
                        'authorization': `Bearer ${token}`,
                    }
                });
            } catch (err) {
                console.log(err);
            }
        }
    }
    async function fetchAssistants() {
        const token = localStorage.getItem("token");
        try {
            const response = await api.get(`/entities/announcement/assistant`, {
                headers: {
                    'authorization': `Bearer ${token}`,
                }
            });
            setAssistants(response.data.socialAssistants);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchAssistants()
    }, [])

    useEffect(() => {
        async function fetchAnnouncements() {
            const token = localStorage.getItem("token")
            try {
                const response = await api.get(`/entities/announcement/${announcement_id.announcement_id}`, {
                    headers: {
                        'authorization': `Bearer ${token}`,
                    }
                })
                console.log(response.data.announcement)
                // Pega todos os editais e armazena em um estado
                setAnnouncement(response.data.announcement)
            } catch (err) {
                console.log(err)
            }
        }

        async function refreshAccessToken() {
            try {
                const refreshToken = Cookies.get('refreshToken')

                const response = await api.patch(`/refresh?refreshToken=${refreshToken}`)

                const { newToken, newRefreshToken } = response.data
                localStorage.setItem('token', newToken)
                Cookies.set('refreshToken', newRefreshToken, {
                    expires: 7,
                    sameSite: true,
                    path: '/',
                })
            } catch (err) {
                console.log(err)
                navigate('/login')
            }
        }
        const intervalId = setInterval(refreshAccessToken, 480000) // Chama a função refresh token a cada 

        async function getEntityInfo() {
            const token = localStorage.getItem("token")

            try {
                const entity_info = await api.get('/entities/', {
                    headers: {
                        'authorization': `Bearer ${token}`,
                    }
                })
                setEntityInfo(entity_info.data.entity)
            } catch (err) {
                console.log(err)
            }
        }
        async function getProfilePhotoEntity() {
            const token = localStorage.getItem("token");

            try {
                const profilePhoto = await api.get("/entities/profilePicture", {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                });
                console.log(profilePhoto);
                setProfilePhoto(profilePhoto.data.url);
                localStorage.setItem("profilePhoto", JSON.stringify(profilePhoto.data.url));

            } catch (err) {
                if (err.response.status === 401) {
                    navigate("/login");
                }
            }
        }
        getEntityInfo()
        fetchAnnouncements()
        getProfilePhotoEntity()
        return () => {
            // Limpar o intervalo
            clearInterval(intervalId);
        };
    }, [])
    return (
        <div className="container">
            <div className="section-nav">
                <NavBar entity={entityInfo}></NavBar>
            </div>
            <div className="container-open-edital">

                <div className="container-inscricao">
                    <div className="school-logo">
                        {profilePhoto ?
                            <img src={profilePhoto}></img>
                            : <div className="skeleton skeleton-big-image" />}
                    </div>
                    {announcement ?
                        <div className="descricao-edital-entidade descricao-edital">
                            <h1>{announcement?.announcementName}</h1>
                            <h2>Detalhes</h2>

                            <div className="container-info-edital-entidade">
                                <div>
                                    <h1> Inscritos</h1>
                                    <h2>{announcement.Application.length}</h2>
                                </div>
                                <div>

                                    <h1>Assistentes Atuais</h1>
                                    <AssistantsList assistants={announcement.socialAssistant} />
                                    <h1> Assistentes</h1>
                                    <Select
                                        options={assistants.map(assistant => ({ value: assistant.id, label: assistant.name }))}
                                        isMulti
                                        onChange={(selectedOptions) => setSelectedAssistants(selectedOptions)}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                    />
                                    <button onClick={handleAddAssistantsToAnnouncement}>Adicionar Assistentes</button>
                                </div>
                            </div>


                            <h4>
                                {/*announcementInfo ? announcementInfo.description : ''*/}
                            </h4>
                        </div>
                        : ''}
                    <div className="info-inscricao">
                        <h2>Vagas: Medicina{/*announcementInfo ? announcementInfo.offeredVacancies : ''*/}</h2>
                        <h2>Escolaridade: Ensino Superior</h2>
                        <h2>Turno: Tarde</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}

const AssistantsList = ({ assistants }) => {
    if (!assistants || assistants.length === 0) return <p>Nenhum assistente social adicionado.</p>;

    return (
        <ul>
            {assistants.map(assistant => (
                <li key={assistant.id}>{assistant.name}</li>
            ))}
        </ul>
    );
};