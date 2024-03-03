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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




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
    const [subsidiaries, setSubsidiaries] = useState(null)
    //assistentes
    const [assistants, setAssistants] = useState([]);
    const [selectedAssistants, setSelectedAssistants] = useState([]);
    const [showAddAssistantSection, setShowAddAssistantSection] = useState(false);


    const [applications, setApplications] = useState([])
    const [educationLevels, setEducationLevels] = useState([])




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


    async function getApplications() {
        const token = localStorage.getItem("token");
        try {
            const response = await api.get(`/entities/applications/${announcement_id.announcement_id}`, {
                headers: {
                    'authorization': `Bearer ${token}`,
                }
            });
            console.log(response.data.applications)
            setApplications(response.data.applications);
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        fetchAssistants()
        getApplications()
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
                setEducationLevels(response.data.announcement.educationLevels)
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
                console.log(entity_info)
                setEntityInfo(entity_info.data.entity)
                setSubsidiaries(entity_info.data.entity.EntitySubsidiary)
                console.log(entity_info.data.entity.EntitySubsidiary)
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

    const copyEditalLink = () => {
        const url = `${window.location.origin}/candidato/edital/${announcement_id.announcement_id}`;
        navigator.clipboard.writeText(url)
            .then(() => {
                toast.success('Link copiado com sucesso!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
            .catch(err => {
                toast.error('Erro ao copiar o link.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            });
    };
   
    const renderEducationLevelDetails = (educationLevel) => {
        const findEntityOrSubsidiaryName = (level) => {
            // Se level.entity_subsidiary_id estiver definido, tente encontrar a filial correspondente
            if (level.entitySubsidiaryId) {
                const subsidiary = subsidiaries.find(sub => sub.id === level.entitySubsidiaryId);
                return subsidiary ? subsidiary.socialReason : "Filial não encontrada";
            }
            // Caso contrário, retorne o nome da matriz
            return entityInfo.name;
        };
        return (
            <div key={educationLevel.id} className="education-level-details">
                <h1>{educationLevel.name}</h1>
                <div className="course-details">
                    <h1>Matriz ou Filial: {findEntityOrSubsidiaryName(educationLevel)}</h1>
                    <h1>Curso: {educationLevel.availableCourses ||  educationLevel.grade }</h1>
                    <h2>Bolsas: {educationLevel.verifiedScholarships}</h2>
                    <h2>Turno : {educationLevel.shift}</h2>
                    {!educationLevel.basicEduType ?
                    <h2>Semestre: {educationLevel.semester}</h2>:
                    <div>
                    <h2>Tipo de bolsa: {translateBasicEducationScholashipofferType(educationLevel.scholarshipType)}</h2>
                    <h2>Grau de Escolaridade: {translateBasicEducationScholashipType(educationLevel.basicEduType)}</h2>
                    </div>
                    }
                </div>
            </div>
        );
    };
    return (
        <div className="container">
            <div className="section-nav">
                <NavBar entity={entityInfo}></NavBar>
            </div>
            <div className="container-open-edital">
                <ToastContainer />
                <div className="container-inscricao">
                    <div className="school-logo" style={{ height: 'fit-content', overflowX: 'clip' }}>
                        {profilePhoto ?
                            <img src={profilePhoto}></img>
                            : <div className="skeleton skeleton-big-image" />}
                    </div>
                    <button onClick={copyEditalLink} className="copy-link-button">
                        Copiar link do edital
                    </button>
                    {announcement ?
                        <div className="descricao-edital-entidade descricao-edital">
                            <h1>{announcement?.announcementName}</h1>
                            <h2>Detalhes</h2>
                            <h3>{announcement.description}</h3>
                            <div className="container-info-edital-entidade" >
                                <div className="education-level-details">
                                    <h1> Inscritos</h1>
                                    <h2>{applications.length}</h2>
                                </div>
                                <div style={{ marginBottom: '20px', marginTop: '30px', overflowX: 'clip' }} className="education-level-details">

                                    <h1>Assistentes Atuais</h1>
                                    <AssistantsList assistants={announcement.socialAssistant} />
                                    <button onClick={() => setShowAddAssistantSection(!showAddAssistantSection)} style={{ width: 'fit-content', marginTop: "15px", fontSize: '15px', opacity: '80%' }}>
                                        {showAddAssistantSection ? 'Esconder' : 'Mostrar'} Seleção de Assistentes
                                    </button>
                                    {showAddAssistantSection && (
                                        <div className="add-assistant-section">
                                            <h2>Selecionar Assistentes</h2>
                                            <Select
                                                options={assistants.map(assistant => ({ value: assistant.id, label: assistant.name }))}
                                                isMulti
                                                onChange={(selectedOptions) => setSelectedAssistants(selectedOptions)}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                            />
                                            <button onClick={handleAddAssistantsToAnnouncement} style={{ width: 'fit-content', marginTop: "15px", fontSize: '15px', backgroundColor: 'green', opacity: '80%' }}>Adicionar Assistentes</button>
                                        </div>
                                    )}
                                </div>
                            </div>


                            <div className="general-info">
                                <h2>Total de Bolsas: {announcement.verifiedScholarships}</h2>
                            </div>
                        </div>
                        : ''}


                    <div className="education-level-section">
                        {educationLevels.map(educationLevel => renderEducationLevelDetails(educationLevel))}
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





const BasicEducationType = [
    { value: 'Preschool', label: 'Pré-Escola' },
    { value: 'Elementary', label: 'Fundamental I e II' },
    { value: 'HighSchool', label: 'Ensino Médio' },
    { value: 'ProfessionalEducation', label: 'Educação Profissional' }
];

const ScholarshipOfferType = [
    { value: 'Law187Scholarship', label: 'Bolsa Lei 187' },
    { value: 'StudentWithDisability', label: 'Estudante com Deficiência' },
    { value: 'FullTime', label: 'Tempo Integral' },
    { value: 'EntityWorkers', label: 'Trabalhadores da Entidade' }
];
function translateBasicEducationScholashipType(BasicEducationScholarship) {
    const BasicEducation = BasicEducationType.find(

        (r) => r.value === BasicEducationScholarship
    )
    return BasicEducation ? BasicEducation.label : "Não especificado";
}


function translateBasicEducationScholashipofferType(BasicEducationScholarship) {
    const BasicEducation = ScholarshipOfferType.find(

        (r) => r.value === BasicEducationScholarship
    )
    return BasicEducation ? BasicEducation.label : "Não especificado";
}
