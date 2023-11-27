import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../services/axios';
import PdfPreview from './pdfPreview';
import './cadastroEdital.css'
import dadosCursos from '../objects/cursos.json'

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
    { value: 'Law187Scholarship', label: 'Bolsa Lei 187' },
    { value: 'StudentWithDisability', label: 'Estudante com Deficiência' },
    { value: 'FullTime', label: 'Tempo Integral' },
    { value: 'EntityWorkers', label: 'Trabalhadores da Entidade' }
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

export default function CadastroEdital() {

    const [announcementType, setAnnouncementType] = useState(""); // Initial value can be set to default if needed.
    const [educationLevel, setEducationLevel] = useState("");
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [offeredVancancies, setOfferedVancancies] = useState(0)
    const [verifiedScholarships, setVerifiedScholarships] = useState(0)
    const [announcementDate, setAnnouncementDate] = useState(new Date().toISOString().split('T')[0])
    const [description, setDescription] = useState('')
    const [announcementName, setAnnouncementName] = useState('')
    const [filePdf, setFilePdf] = useState(null)
    const [selectedCursos, setSelectedCursos] = useState([]);

    const [educationalLevels, setEducationalLevels] = useState(
        selectedCursos.map(curso => ({
            availableCourses: curso,
            offeredVacancies: 5000,
            verifiedScholarships: 0,
            semester: 1,
            grade: '',
            basicEduType: null,
            scholarshipType: null,
            higherEduScholarshipType: null,
            offeredCourseType: null,
            shift: 'Matutino'
        }))
    );
    const [coursetype, setCourseType] = useState('UndergraduateBachelor')

    useEffect(() => {
        const totalScholarships = educationalLevels.reduce((total, currentLevel) => {
            return total + currentLevel.verifiedScholarships;
        }, 0);
    
        setVerifiedScholarships(totalScholarships);
    }, [educationalLevels]);
    const handleEducationalChange = (cursoIndex, field, value) => {
        setEducationalLevels(prevLevels => prevLevels.map((level, index) => {
            if (index === cursoIndex) {
                return { ...level, [field]: value };
            }
            return level;
        }));
        console.log('====================================');
        console.log(educationalLevels);
        console.log('====================================');
    };
    const handleSelectChange = (event) => {
        // Convertendo o NodeList para um array usando o operador spread
        const values = [...event.target.selectedOptions].map(opt => opt.value);
        setSelectedCursos([...values]);
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

    useEffect(() => {
        setEducationalLevels(selectedCursos.map(curso => ({
            availableCourses: curso,
            offeredVacancies: 5000,
            verifiedScholarships: 0,
            semester: 1,
            grade: '',
            basicEduType: '',
            scholarshipType: '',
            higherEduScholarshipType: '',
            offeredCourseType: '',
            shift: ''
        })));

    }, [selectedCursos]);

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
            announcementName: announcementName,
            offeredVacancies: offeredVancancies,
            verifiedScholarships: verifiedScholarships,
            description: description
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
                announcementName: announcementName,
                offeredVacancies: 5000,
                verifiedScholarships: verifiedScholarships,
                description: description,

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
                    basicEduType: '',
                    scholarshipType: education.scholarshipType,
                    higherEduScholarshipType: education.higherEduScholarshipType,
                    offeredCourseType: education.offeredCourseType,
                    availableCourses: education.availableCourses,
                    offeredVacancies: education.offeredVacancies,
                    verifiedScholarships: education.verifiedScholarships,
                    shift: education.shift,
                    semester: education.semester
                }
                console.log('====================================');
                console.log(data);
                console.log('====================================');
                try {
                    await api.post(`/entities/education/${announcement.id}`,
                        {
                            level: educationLevel,
                            basicEduType: '',
                            scholarshipType: education.scholarshipType,
                            higherEduScholarshipType: education.higherEduScholarshipType,
                            offeredCourseType: education.offeredCourseType,
                            availableCourses: education.availableCourses,
                            offeredVacancies: education.offeredVacancies,
                            verifiedScholarships: education.verifiedScholarships,
                            shift: education.shift,
                            semester: education.semester
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
                            alert("Erro ao atualizar foto de perfil.");
                            console.log(err);
                        }
                    }
                } catch (error) {
                    alert("Erro ao criar os educational levels")
                }

            })
           

        alert("Edital criado com suceeso")

        } catch (err) {
            alert("Erro ao atualizar foto de perfil.");
            console.log(err);
        }
    }

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
                            id="nome-edital"
                            required
                            autofocus
                            value={announcementName}
                            onChange={(e) => setAnnouncementName(e.target.value)}
                        />
                    </fieldset>
                    <fieldset>
                        <label for="email-institucional">
                            Data limite para inscrição
                        </label>
                        <input
                            placeholder="Exemplo: 10/11/2023"
                            type="date"
                            tabindex="2"
                            id="email-institucional"
                            required
                            value={announcementDate}
                            onChange={(e) => setAnnouncementDate(e.target.value)}
                        />
                    </fieldset>
               





                    {/* Dropdown para basicEduType */}
                    {educationLevel === 'BasicEducation' &&
                        <div>

                            <fieldset>

                                <label className="file-label"
                                >
                                    Tipo de Educação Básica:

                                </label>
                                <select className='select-educational'
                                    onChange={(e) => handleEducationalChange('basicEduType', e.target.value)}
                                >
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
                                    {/* Substitua ScholarshipOfferType pelo seu array de objetos correspondente */}
                                    {ScholarshipOfferType.map(type => <option value={type.value}>{type.label}</option>)}
                                </select>
                            </fieldset>
                            <fieldset>

                                <label>
                                    Série/Ano:
                                </label>
                                <input
                                    type="text"
                                    onChange={(e) => handleEducationalChange('grade', e.target.value)}
                                />

                            </fieldset>
                        </div>

                    }


                    {/* Dropdown para higherEduScholarshipType */}
                    {educationLevel === 'HigherEducation' &&
                        <div>

                            {/* Dropdown para offeredCourseType */}
                            <fieldset>

                                <label>
                                    Tipo de Curso Oferecido:
                                </label>
                                <select className='select-educational'
                                    value={coursetype}
                                    onChange={(e) => setCourseType(e.target.value)}
                                >
                                    {OfferedCourseType.map(type => <option value={type.value}>{type.label}</option>)}
                                </select>

                            </fieldset>
                            {/* Input para availableCourses */}
                            <fieldset>

                                <label>
                                    Cursos Disponíveis:
                                </label>
                                <select id="curso-dropdown" multiple value={selectedCursos} onChange={handleSelectChange}>
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
                            {selectedCursos ? selectedCursos.map((curso, index) => {
                                return (<div key={index}>
                                    <h2>{curso}</h2>
                                    <fieldset>

                                        <label>
                                            Tipo de Bolsa de Ensino Superior:
                                        </label>
                                        <select className='select-educational'
                                            value={educationalLevels[index]?.higherEduScholarshipType}
                                            onChange={(e) => handleEducationalChange(index, 'higherEduScholarshipType', e.target.value)}
                                        >
                                            {/* Substitua HigherEducationScholarshipType pelo seu array de objetos correspondente */}
                                            {HigherEducationScholarshipType.map(type => <option value={type.value}>{type.label}</option>)}
                                        </select>
                                    </fieldset>
                                    {/* Input para offeredVacancies */}
                                  
                                    {/* Input para verifiedScholarships */}
                                    <fieldset>

                                        <label>
                                            Número total de bolsas:
                                        </label>
                                        <input
                                            type="number"
                                            value={educationalLevels[index]?.verifiedScholarships}
                                            onChange={(e) => handleEducationalChange(index, 'verifiedScholarships', Number(e.target.value))}
                                        />
                                    </fieldset>

                                    {/* Dropdown para shift */}
                                    <fieldset>

                                        <label>
                                            Turno:
                                        </label>
                                        <select
                                            value={educationalLevels[index]?.shift}
                                            onChange={(e) => handleEducationalChange(index, 'shift', e.target.value)}
                                        >
                                            {/* Substitua SHIFT pelo seu array de objetos correspondente */}
                                            {SHIFT.map(type => <option value={type.value}>{type.label}</option>)}
                                        </select>
                                    </fieldset>

                                    {/* Input para semester */}
                                    <fieldset>

                                        <label>
                                            Semestre:
                                        </label>
                                        <input
                                            type="number"
                                            value={educationalLevels[index]?.semester}
                                            onChange={(e) => handleEducationalChange(index, 'semester', Number(e.target.value))}
                                        />
                                    </fieldset>

                                    {/* Input para grade */}

                                </div>
                                )
                            }) : ''}
                        </div>
                    }
                    <fieldset className="file-div">
                        <label
                            for="edital-pdf"
                            className="file-label"
                            id="label-file"
                        >
                            Fazer upload do PDF do Edital
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

