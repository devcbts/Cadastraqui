import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import axios from 'axios';
import { api } from '../services/axios';
import PdfPreview from './pdfPreview';
import './cadastroEdital.css'
import dadosCursos from '../objects/cursos.json'
import Select from 'react-select';
import { handleAuthError } from '../ErrorHandling/handleError';
import { handleSuccess } from '../ErrorHandling/handleSuceess';
console.log('====================================');
console.log(dadosCursos.bacharelado);
console.log('====================================');

const LevelType = [{
    value: 'BasicEducation', label: 'Educação Básica'
},
{
    value: 'HigherEducation', label: 'Educação superior'
}]

const BasicEducationType = [
    { value: 'Preschool', label: 'Pré-Escola' },
    { value: 'Elementary', label: 'Fundamental I e II' },
    { value: 'HighSchool', label: 'Ensino Médio' },
    { value: 'ProfessionalEducation', label: 'Educação Profissional' }
];

const ScholarshipOfferType = [
    { value: 'Law187Scholarship', label: 'Bolsa Lei 187 Integral' },
    { value: 'Law187ScholarshipPartial', label: 'Bolsa Lei 187 Parcial' },

    { value: 'StudentWithDisabilityPartial', label: 'Estudante com Deficiência Parcial' },
    { value: 'StudentWithDisability', label: 'Estudante com Deficiência Integral' },

    { value: 'FullTime', label: 'Tempo Integral (Integral)' },
    { value: 'FullTimePartial', label: 'Tempo Integral (Parcial)' },

    { value: 'EntityWorkers', label: 'Trabalhadores da Entidade Integral' },
    { value: 'EntityWorkersPartial', label: 'Trabalhadores da Entidade Parcial' }

];

const HigherEducationScholarshipType = [
    { value: 'PROUNIFull', label: 'PROUNI Integral' },
    { value: 'PROUNIPartial', label: 'PROUNI Parcial' },
    { value: 'StateGovernment', label: 'Governo Estadual' },
    { value: 'CityGovernment', label: 'Governo Municipal' },
    { value: 'ExternalEntities', label: 'Entidades Externas' },
    { value: 'HigherEduInstitutionFull', label: 'Instituição de Ensino Superior Integral' },
    { value: 'HigherEduInstitutionPartial', label: 'Instituição de Ensino Superior Parcial' },
    { value: 'HigherEduInstitutionWorkers', label: 'Trabalhadores da Instituição de Ensino Superior' },
    { value: 'PostgraduateStrictoSensu', label: 'Pós-Graduação Stricto Sensu' }
];

const OfferedCourseType = [
    { value: 'UndergraduateBachelor', label: 'Graduação - Bacharelado' },
    { value: 'UndergraduateLicense', label: 'Graduação - Licenciatura' },
    { value: 'UndergraduateTechnologist', label: 'Graduação - Tecnólogo' }
];

const SHIFT = [
    { value: 'Matutino', label: 'Matutino' },
    { value: 'Vespertino', label: 'Vespertino' },
    { value: 'Noturno', label: 'Noturno' },
    { value: 'Integral', label: 'Integral' }
];
const types1Options = [
    { value: 'UNIFORM', label: 'Uniforme' },
    { value: 'TRANSPORT', label: 'Transporte' },
    { value: 'FOOD', label: 'Alimentação' },
    { value: 'HOUSING', label: 'Moradia' },
    { value: 'STUDY_MATERIAL', label: 'Material Didático' },
];
export default function CadastroEdital() {


    const navigate = useNavigate();


    const [announcementType, setAnnouncementType] = useState(""); // Initial value can be set to default if needed.
    const [educationLevel, setEducationLevel] = useState("");
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [offeredVancancies, setOfferedVancancies] = useState(0)
    const [verifiedScholarships, setVerifiedScholarships] = useState(0)
    const [announcementDate, setAnnouncementDate] = useState(new Date().toISOString().split('T')[0])
    const [announcementBegin, setAnnouncementBegin] = useState(new Date().toISOString().split('T')[0])
    const [description, setDescription] = useState('')
    const [announcementName, setAnnouncementName] = useState('')
    const [filePdf, setFilePdf] = useState(null)
    const [selectedCursos, setSelectedCursos] = useState([]);


    // Para as subsidiarias e entidade
    const [subsidiaries, setSubsidiaries] = useState(null)
    const [selectedSubsidiaries, setSelectedSubsidiaries] = useState([])
    const [entity, setEntity] = useState([])
    const [selectedEntityOrSubsidiary, setSelectedEntityOrSubsidiary] = useState('');
    useEffect(() => {
        async function getEntityInfo() {

            const token = localStorage.getItem("token")

            try {

                const response = await api.get('/entities/', {
                    headers: {
                        'authorization': `Bearer ${token}`,
                    }
                })
                console.log(response.data)
                setEntity(response.data.entity)
                setSubsidiaries(response.data.entity.EntitySubsidiary)

            } catch (error) {
                console.log(error)
            }
        }

        getEntityInfo()
    }, [])

    // Mudança de entidade e subsidiaria
    const handleEntityOrSubsidiaryChange = (value) => {
        setSelectedEntityOrSubsidiary(value);

        // Se a matriz for selecionada, resetar selectedSubsidiaries e entity_subsidiary_id
        if (value === entity.id) {
            setCurrentCourse({ ...currentCourse, entity_subsidiary_id: null });
        } else {
            // Se uma filial for selecionada, adicionar ao selectedSubsidiaries
            const selectedSubsidiary = subsidiaries?.find(sub => sub.id === value);
            const selectedSubsidiaryAlreadySelected = selectedSubsidiaries.find(sub => sub.id === value);
            if (selectedSubsidiary && !selectedSubsidiaryAlreadySelected) {
                setSelectedSubsidiaries([...selectedSubsidiaries, selectedSubsidiary]);
                setCurrentCourse({ ...currentCourse, entity_subsidiary_id: selectedSubsidiary.id });
            }
        }
    };


    // para os tipos de bolsas
    const [selectedTypes1, setSelectedTypes1] = useState([]);
    const [type2, setType2] = useState('');
    const [benefitsGrantedYes, setBenefitsGrantedYes] = useState(false);
    const [benefitsGrantedNo, setBenefitsGrantedNo] = useState(false);
    const [actionsForFamilyYes, setActionsForFamilyYes] = useState(false);
    const [actionsForFamilyNo, setActionsForFamilyNo] = useState(false);
    // ... outros estados

    // Handler para as checkboxes de benefícios
    const handleBenefitsChange = (value) => {
        setBenefitsGrantedYes(value === 'yes');
        setBenefitsGrantedNo(value === 'no');
    };

    // Handler para as checkboxes de ações e serviços
    const handleActionsChange = (value) => {
        setActionsForFamilyYes(value === 'yes');
        setActionsForFamilyNo(value === 'no');
    };




    const [currentCourse, setCurrentCourse] = useState({
        availableCourses: '',
        offeredVacancies: 5000,
        verifiedScholarships: 1,
        semester: 1,
        grade: '',
        basicEduType: '',
        scholarshipType: '',
        higherEduScholarshipType: 'PROUNIFull',
        offeredCourseType: '',
        shift: 'Matutino',
        entity_subsidiary_id: subsidiaries ? subsidiaries[0].id : null
    });

    const [educationalLevels, setEducationalLevels] = useState([]);
    const handleEducationalChange = (field, value) => {
        setCurrentCourse({ ...currentCourse, [field]: value });
        console.log(currentCourse)
    };


    const completeCourseRegistration = () => {
        setEducationalLevels([...educationalLevels, currentCourse]);
        if (educationLevel === "BasicEducation") {
            setCurrentCourse({
                availableCourses: '',
                offeredVacancies: 5000,
                verifiedScholarships: 1,
                semester: 1,
                grade: '',
                basicEduType: '',
                scholarshipType: '',
                higherEduScholarshipType: '',
                offeredCourseType: '',
                shift: 'Matutino',
                entity_subsidiary_id: subsidiaries ? subsidiaries[0].id : null
            })
        }
        else {

            setCurrentCourse({
                availableCourses: '',
                offeredVacancies: 5000,
                verifiedScholarships: 1,
                semester: 1,
                grade: '',
                basicEduType: '',
                scholarshipType: '',
                higherEduScholarshipType: 'PROUNIFull',
                offeredCourseType: '',
                shift: 'Matutino',
                entity_subsidiary_id: subsidiaries ? subsidiaries[0].id : null
            })
        }
        setIsAddingCourse(false)
    };


    const [coursetype, setCourseType] = useState('UndergraduateBachelor')
    useEffect(() => {
        const totalScholarships = educationalLevels.reduce((total, currentLevel) => {
            return total + currentLevel.verifiedScholarships;
        }, 0);

        setVerifiedScholarships(totalScholarships);
    }, [educationalLevels]);

    const handleSelectChange = (event) => {
        // Atualiza o estado currentCourse com o valor do curso selecionado.
        const selectedCourse = event.target.value;
        setCurrentCourse({ ...currentCourse, availableCourses: selectedCourse });
    };




    function handleChange(event) {
        setFile(event.target.files[0]);
        const fileInput = event.target;
        const label = document.querySelector(".file-label");

        if (fileInput.files && fileInput.files.length > 0) {
            // If there's a file attached, update label text with file name
            label.textContent = "Alterar arquivo";
        } else {
            // If no file is attached, revert back to default label text
            label.textContent = "Selecione um arquivo";
        }

    }

    useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file)
            reader.onload = (e) => {
                // Converte o ArrayBuffer para um Uint8Array
                setFilePdf(e.target.result); // Atualiza o estado com o Uint8Array
            };
        }

    }, [file])



    // Set announcement type according to the option selected
    const handleAnnouncementTypeChange = (e) => {
        setAnnouncementType(e.target.value);
    };

    // Set announcement ed. level according to the option selected
    const handleEducationLevelChange = (e) => {
        setEducationLevel(e.target.value);
    };

    // BackEnd Functions
    async function CreateAnnouncement() {

    }

    async function handleSubmit(event) {
        event.preventDefault();

        const data = {
            entityChanged: false,
            branchChanged: false,
            announcementType: announcementType,
            announcementDate: announcementDate,
            announcementBegin: announcementBegin,
            announcementName: announcementName,
            offeredVacancies: offeredVancancies,
            verifiedScholarships: verifiedScholarships,
            description: description,
            types1: selectedTypes1.map(option => option.value), // Envia apenas os valores
            type2: type2,
        }
        console.log('====================================');
        console.log(data);
        console.log('====================================');
        const token = localStorage.getItem("token");
        try {
            const response = await api.post("/entities/announcement", {
                entityChanged: false,
                branchChanged: false,
                announcementType: announcementType,
                announcementDate: announcementDate,
                announcementBegin: announcementBegin,
                announcementName: announcementName,
                offeredVacancies: 5000,
                verifiedScholarships: verifiedScholarships,
                description: description,
                types1: selectedTypes1.map(option => option.value), // Envia apenas os valores
                type2: type2,
                entity_subsidiary_id: selectedSubsidiaries.map(subsidiary => subsidiary.id), // Adiciona os IDs das filiais

            },
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            )

            const announcement = response.data.announcement


            educationalLevels.map(async (education) => {
                const data = {
                    level: educationLevel,
                    basicEduType: education.basicEduType || '',
                    scholarshipType: education.scholarshipType,
                    higherEduScholarshipType: education.higherEduScholarshipType,
                    offeredCourseType: education.offeredCourseType,
                    availableCourses: education.availableCourses,
                    offeredVacancies: education.offeredVacancies,
                    verifiedScholarships: education.verifiedScholarships,
                    shift: education.shift,
                    grade: education.grade || '',
                    semester: education.semester,
                    entity_subsidiary_id: education.entity_subsidiary_id
                }
                console.log('====================================');
                console.log(data);
                console.log('====================================');
                try {
                    await api.post(`/entities/education/${announcement.id}`,
                        {
                            level: educationLevel,
                            basicEduType: education.basicEduType || '',
                            scholarshipType: education.scholarshipType,
                            higherEduScholarshipType: education.higherEduScholarshipType,
                            offeredCourseType: education.offeredCourseType,
                            availableCourses: education.availableCourses,
                            offeredVacancies: education.offeredVacancies,
                            verifiedScholarships: education.verifiedScholarships,
                            shift: education.shift,
                            grade: education.grade || '',

                            semester: education.semester,
                            entity_subsidiary_id: education.entity_subsidiary_id || '2132'

                        }, {
                        headers: {
                            authorization: `Bearer ${token}`,
                        },
                    })
                    if (file) {

                        try {
                            const formData = new FormData();
                            formData.append("file", file);
                            await api.post(`/entities/upload/${announcement.id}`, formData, {
                                headers: {
                                    authorization: `Bearer ${token}`,
                                },
                            });
                        } catch (err) {
                            handleAuthError(err, navigate, 'Erro ao enviar PDF')
                            console.log(err);
                        }
                    }
                } catch (error) {
                    handleAuthError(error, navigate, 'Erro ao criar os cursos')
                }

            })


            handleSuccess(response, 'Edital Criado com sucesso')

        } catch (err) {
            handleAuthError(err, navigate, 'Erro ao criar o edital')
        }
    }


    const [isAddingCourse, setIsAddingCourse] = useState(false);
    const [isEdittingCourse, setIsEdittingCourse] = useState(true);
    //Tabela dos educational Level
    const EducationalLevelsTable = ({ educationalLevels }) => {
        // Função auxiliar para encontrar o nome da matriz ou da filial
        const findEntityOrSubsidiaryName = (level) => {
            // Se level.entity_subsidiary_id estiver definido, tente encontrar a filial correspondente
            if (level.entity_subsidiary_id) {
                const subsidiary = subsidiaries.find(sub => sub.id === level.entity_subsidiary_id);
                return subsidiary ? subsidiary.socialReason : "Filial não encontrada";
            }
            // Caso contrário, retorne o nome da matriz
            return entity.name;
        };
        if (educationLevel === 'HigherEducation') {


            return (
                <table>
                    <thead>
                        <tr>
                            <th>Matriz ou Filial</th>
                            <th>Quantidade de Vagas</th>
                            <th>Curso</th>
                            <th>Ciclo/Ano/Série/Semestre</th>
                            <th>Turno</th>
                            <th>Percentual de Gratuidade</th>
                            <th></th>
                            {/* Adicione mais cabeçalhos de colunas conforme necessário */}
                        </tr>
                    </thead>
                    <tbody>
                        {educationalLevels.map((level, index) => (
                            <tr key={index}>
                                <td>{findEntityOrSubsidiaryName(level)}</td>
                                <td>{level.verifiedScholarships}</td>
                                <td>{level.availableCourses}</td>
                                <td>{level.semester}</td>
                                <td>{level.shift}</td>
                                <td>{translateHigherEducationScholashipType(level.higherEduScholarshipType)}</td>
                                <td>
                                    <button className='button-edital-editar' onClick={() => editEducationalLevel(index)}>Editar</button>
                                    <button className='button-edital-excluir' onClick={() => deleteEducationalLevel(index)}>Excluir</button>
                                </td>
                                {/* Adicione mais células de dados conforme necessário */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        } else if (educationLevel === 'BasicEducation') {
            return (
                <table>
                    <thead>
                        <tr>
                            <th>Matriz ou Filial</th>
                            <th>Quantidade de Vagas</th>
                            <th>Tipo de Educação básica</th>
                            <th>Ciclo/Ano/Série/Semestre</th>
                            <th>Turno</th>
                            <th>Tipo de Bolsa</th>
                            <th></th>

                        </tr>
                    </thead>
                    <tbody>
                        {educationalLevels.map((level, index) => (
                            <tr key={index}>
                                <td>{findEntityOrSubsidiaryName(level)}</td>
                                <td>{level.verifiedScholarships}</td>
                                <td>{translateBasicEducationScholashipType(level.basicEduType)}</td>
                                <td>{level.grade}</td>
                                <td>{level.shift}</td>
                                <td>{translateBasicEducationScholashipofferType(level.scholarshipType)}</td>
                                <td>
                                    <button className='button-edital-editar' onClick={() => editEducationalLevel(index)}>Editar</button>
                                    <button className='button-edital-excluir' onClick={() => deleteEducationalLevel(index)}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }
        return <div>Selecione um nível educacional para visualizar os registros.</div>;
    };


    // Edição dos dados da tabela
    const editEducationalLevel = (index) => {
        const level = educationalLevels[index];
        setCurrentCourse(level);
        setIsAddingCourse(true);
        deleteEducationalLevel(index)
    };

    // Deletar algum dos dados da tabela
    const deleteEducationalLevel = (index) => {
        setEducationalLevels(currentLevels => currentLevels.filter((_, i) => i !== index));
    };




    return (
        <div> <div className="container-cadastros">
            <div className="novo-cadastro">
                <form
                    id="contact"
                    action=""
                    method="post"
                    onSubmit={handleSubmit}
                >
                    <h3>Informações do edital</h3>
                    <h4>Preencha as informações abaixo para realizar o cadastro</h4>

                    <fieldset>
                        <select
                            value={announcementType}
                            onChange={handleAnnouncementTypeChange}
                        >
                            <option value="" disabled>
                                Selecionar o tipo de edital
                            </option>
                            <option value="ScholarshipGrant">Concessão de bolsa de estudo</option>
                            <option value="PeriodicVerification">
                                Aferição periódica (manutenção)
                            </option>
                        </select>
                    </fieldset>

                    <fieldset>
                        <select
                            value={educationLevel}
                            onChange={handleEducationLevelChange}
                        >
                            <option value="" disabled>
                                Selecionar o nível de ensino
                            </option>
                            {LevelType.map(type => <option value={type.value}>{type.label}</option>)}

                        </select>
                    </fieldset>

                    <fieldset>
                        <label for="nome-edital">Número do edital</label>
                        <input
                            placeholder="Exemplo: 2023.1"
                            type="text"
                            tabindex="1"
                            id='input-edital'
                            required
                            autofocus
                            value={announcementName}
                            onChange={(e) => setAnnouncementName(e.target.value)}
                        />
                    </fieldset>
                    <fieldset>
                        <label for="email-institucional">
                            Data de início das inscrições
                        </label>
                        <input
                            placeholder="Exemplo: 5/6/2024"
                            type="date"
                            tabindex="2"
                            required
                            id='input-edital'
                            value={announcementBegin}
                            onChange={(e) => setAnnouncementBegin(e.target.value)}
                        />
                    </fieldset>
                    <fieldset>
                        <label for="email-institucional">
                            Data limite para inscrição
                        </label>
                        <input
                            placeholder="Exemplo: 10/11/2024"
                            type="date"
                            tabindex="2"
                            required
                            id='input-edital'
                            value={announcementDate}
                            onChange={(e) => setAnnouncementDate(e.target.value)}
                        />
                    </fieldset>






                    {/* Dropdown para basicEduType */}
                    {isAddingCourse && educationLevel === 'BasicEducation' &&
                        <div>


                            {/* Dropdown para offeredCourseType */}
                            <fieldset>
                                <label>Matriz ou Filial:</label>
                                <select
                                    value={selectedEntityOrSubsidiary}
                                    onChange={(e) => handleEntityOrSubsidiaryChange(e.target.value)}
                                >
                                    <option value={entity.id}>Matriz - {entity.name}</option>
                                    {subsidiaries.map((subsidiary) => (
                                        <option key={subsidiary.id} value={subsidiary.id}>
                                            Filial - {subsidiary.socialReason}
                                        </option>
                                    ))}
                                </select>
                            </fieldset>
                            <fieldset>

                                <label className="file-label"
                                >
                                    Tipo de Educação Básica:

                                </label>
                                <select className='select-educational'
                                    onChange={(e) => handleEducationalChange('basicEduType', e.target.value)}
                                >
                                    <option value="">Selecione</option>
                                    {/* Substitua BasicEducationType pelo seu array de objetos correspondente */}
                                    {BasicEducationType.map(type => <option value={type.value}>{type.label}</option>)}
                                </select>
                            </fieldset>
                            {/* Dropdown para scholarshipType */}

                            <fieldset>

                                <label>
                                    Tipo de Bolsa:
                                </label>
                                <select className='select-educational'
                                    onChange={(e) => handleEducationalChange('scholarshipType', e.target.value)}
                                >
                                    <option value="">Selecione</option>
                                    {/* Substitua ScholarshipOfferType pelo seu array de objetos correspondente */}
                                    {ScholarshipOfferType.map(type => <option value={type.value}>{type.label}</option>)}
                                </select>
                            </fieldset>
                            <fieldset style={{ textAlign: 'left' }}>

                                <label>
                                    Número total de bolsas:
                                </label>
                                <input style={{ width: '30%' }}
                                    type="number"
                                    min={1}
                                    value={currentCourse.verifiedScholarships}
                                    onChange={(e) => handleEducationalChange('verifiedScholarships', Number(e.target.value))}
                                />
                            </fieldset>
                            <fieldset>

                                <label>
                                Ciclo/Ano/Série/Curso:
                                </label>
                                <input
                                    type="text"
                                    value={currentCourse.grade}
                                    onChange={(e) => handleEducationalChange('grade', e.target.value)}
                                />

                            </fieldset>


                            {/* Dropdown para shift */}
                            <fieldset>

                                <label>
                                    Turno:
                                </label>
                                <select
                                    value={currentCourse.shift}
                                    onChange={(e) => handleEducationalChange('shift', e.target.value)}
                                >
                                    {/* Substitua SHIFT pelo seu array de objetos correspondente */}
                                    {SHIFT.map(type => <option value={type.value}>{type.label}</option>)}
                                </select>
                            </fieldset>

                            <button onClick={completeCourseRegistration}>Concluir Cadastro</button>

                        </div>

                    }

                    {!isAddingCourse && (
                        <button onClick={() => setIsAddingCourse(true)}>Cadastrar Vaga</button>
                    )}
                    {/* Dropdown para higherEduScholarshipType */}
                    {isAddingCourse && educationLevel === 'HigherEducation' &&
                        <div className='box-edital'>

                            {/* Dropdown para offeredCourseType */}
                            <fieldset>
                                <label>Matriz ou Filial:</label>
                                <select
                                    value={selectedEntityOrSubsidiary}
                                    onChange={(e) => handleEntityOrSubsidiaryChange(e.target.value)}
                                >
                                    <option value={entity.id}>Matriz - {entity.name}</option>
                                    {subsidiaries.map((subsidiary) => (
                                        <option key={subsidiary.id} value={subsidiary.id}>
                                            Filial - {subsidiary.socialReason}
                                        </option>
                                    ))}
                                </select>
                            </fieldset>

                            <fieldset>

                                <label>
                                    Tipo de Curso Oferecido:
                                </label>
                                <select className='select-educational'
                                    value={coursetype}
                                    onChange={(e) => setCourseType(e.target.value)}
                                >
                                    <option value="">Selecione</option>
                                    {OfferedCourseType.map(type => <option value={type.value}>{type.label}</option>)}
                                </select>

                            </fieldset>
                            {/* Input para availableCourses */}
                            <fieldset>

                                <label>
                                    Cursos Disponíveis:
                                </label>
                                <select id="curso-dropdown" value={currentCourse.availableCourses} onChange={handleSelectChange}>
                                    {coursetype === 'UndergraduateBachelor' &&
                                        <optgroup label="Cursos Gerais">

                                            {dadosCursos.bacharelado.map((curso, index) => (
                                                <option key={index} value={curso}>
                                                    {curso}
                                                </option>
                                            ))}
                                        </optgroup>
                                    }
                                    {coursetype === 'UndergraduateLicense' &&

                                        <optgroup label="Cursos de Licenciatura">
                                            {dadosCursos.licenciatura.map((curso, index) => (
                                                <option key={`lic-${index}`} value={curso}>
                                                    {curso}
                                                </option>
                                            ))}
                                        </optgroup>
                                    }
                                    {coursetype === 'UndergraduateTechnologist' &&
                                        <optgroup label="Cursos Tecnólogos">
                                            {dadosCursos.tecnologos.map((curso, index) => (
                                                <option key={`tec-${index}`} value={curso}>
                                                    {curso}
                                                </option>
                                            ))}
                                        </optgroup>
                                    }
                                </select>
                            </fieldset>
                            <div className='box-edital' >
                                <h2>{currentCourse.availableCourses}</h2>
                                <fieldset>

                                    <label>
                                        Tipo de Bolsa de Ensino Superior:
                                    </label>
                                    <select className='select-educational'
                                        value={currentCourse.higherEduScholarshipType}
                                        onChange={(e) => handleEducationalChange('higherEduScholarshipType', e.target.value)}
                                    >
                                        {/* Substitua HigherEducationScholarshipType pelo seu array de objetos correspondente */}
                                        {HigherEducationScholarshipType.map(type => <option value={type.value}>{type.label}</option>)}
                                    </select>
                                </fieldset>
                                {/* Input para offeredVacancies */}

                                {/* Input para verifiedScholarships */}
                                <fieldset style={{ textAlign: 'left' }}>

                                    <label>
                                        Número total de bolsas:
                                    </label>
                                    <input style={{ width: '30%' }}
                                        type="number"
                                        min={1}
                                        value={currentCourse.verifiedScholarships}
                                        onChange={(e) => handleEducationalChange('verifiedScholarships', Number(e.target.value))}
                                    />
                                </fieldset>

                                {/* Dropdown para shift */}
                                <fieldset>

                                    <label>
                                        Turno:
                                    </label>
                                    <select
                                        value={currentCourse.shift}
                                        onChange={(e) => handleEducationalChange('shift', e.target.value)}
                                    >
                                        {/* Substitua SHIFT pelo seu array de objetos correspondente */}
                                        {SHIFT.map(type => <option value={type.value}>{type.label}</option>)}
                                    </select>
                                </fieldset>

                                {/* Input para semester */}
                                <fieldset style={{ textAlign: 'left' }}>

                                    <label>
                                        Semestre:
                                    </label>
                                    <input style={{ width: '30%' }}
                                        type="number"
                                        value={currentCourse.semester}
                                        onChange={(e) => handleEducationalChange('semester', Number(e.target.value))}
                                    />
                                </fieldset>

                                {/* Input para grade */}

                            </div>
                            <button onClick={completeCourseRegistration}>Concluir Cadastro</button>
                        </div>
                    }


                    <h1>Quadro Resumo</h1>
                    <EducationalLevelsTable educationalLevels={educationalLevels} />
                    <div className='box-edital'>

                        <h2>Das ações de apoio ao aluno</h2>
                        <fieldset>
                            <label>A entidade concederá benefícios ao aluno?</label>
                            <div>
                                <input
                                    type="checkbox"
                                    checked={benefitsGrantedYes}
                                    onChange={() => handleBenefitsChange('yes')}
                                /> Sim
                                <input
                                    type="checkbox"
                                    checked={benefitsGrantedNo}
                                    onChange={() => handleBenefitsChange('no')}
                                /> Não
                            </div>
                        </fieldset>
                        {benefitsGrantedYes && (
                            <fieldset>
                                <label>Especifique qual(is)</label>
                                <Select
                                    className="select-educational"
                                    isMulti
                                    name="types1"
                                    options={types1Options}
                                    classNamePrefix="select"
                                    onChange={setSelectedTypes1} // Atualiza o state com a seleção
                                    value={selectedTypes1}
                                />
                                <h4>O Termo de Concessão de Benefícios - Tipo 1: Ações de apoio ao aluno bolsista, será disponibilizado no perfil do candidato para que o mesmo ou seu responsável legal, quando for o caso, assine e providencie a entrega na entidade.</h4>

                            </fieldset>
                        )}
                    </div>

                    <div className='box-edital'>

                        <h2>Das ações e serviços destinados ao aluno e seu grupo familiar</h2>
                        <fieldset>
                            <label>Haverá ações e serviços destinados a alunos e seu grupo familiar?</label>
                            <div>
                                <input
                                    type="checkbox"
                                    checked={actionsForFamilyYes}
                                    onChange={() => handleActionsChange('yes')}
                                /> Sim
                                <input
                                    type="checkbox"
                                    checked={actionsForFamilyNo}
                                    onChange={() => handleActionsChange('no')}
                                /> Não
                            </div>
                        </fieldset>
                        {actionsForFamilyYes && (
                            <fieldset>
                                <label>Descreva o(s) serviço(s) que será(ão) usufruído(s):</label>
                                <input style={{ width: '80%' }}
                                    type="text"
                                    value={type2}
                                    onChange={(e) => setType2(e.target.value)}
                                    placeholder="Digite a descrição do tipo 2"

                                />
                                <h4>O Termo de Concessão de Benefícios - Tipo 2: Ações e serviços destinados a alunos e seu grupo familiar, será disponibilizado no perfil do candidato para que o mesmo ou seu responsável legal, quando for o caso, assine e providencie a entrega na entidade.</h4>
                            </fieldset>

                        )}

                    </div>








                    <fieldset className="file-div">
                        <label
                            for="edital-pdf"
                            className="file-label"
                            id="label-file"
                        >
                            Fazer upload do PDF do Edital, Termo Aditivo ou Comunicados
                        </label>
                        <div className="upload">
                            <input
                                type="file"
                                id="edital-pdf"
                                title="Escolher arquivo"
                                onChange={handleChange}
                            />
                        </div>
                        {filePdf ?
                            <PdfPreview file={filePdf} /> : ''}
                    </fieldset>

                    {/* Botão de submissão */}
                    <fieldset>
                        <textarea
                            placeholder="Descrição"
                            tabindex="5"
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </fieldset>

                    <fieldset>
                        <button
                            name="submit"
                            type="submit"
                            id="contact-submit"
                            data-submit="...Sending"
                            onClick={CreateAnnouncement}
                        >
                            Cadastrar
                        </button>
                    </fieldset>

                </form>
            </div>
        </div></div>
    )
}

function translateHigherEducationScholashipType(HigherEducationScholarship) {
    const HigherEducation = HigherEducationScholarshipType.find(
        (r) => r.value === HigherEducationScholarship
    );
    return HigherEducation ? HigherEducation.label : "Não especificado";
}

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
