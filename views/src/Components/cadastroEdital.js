import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../services/axios';
import PdfPreview from './pdfPreview';
import './cadastroEdital.css'
import dadosCursos from '../objects/cursos.json'
import Select from 'react-select';
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
const types1Options = [
    { value: 'UNIFORM', label: 'Uniforme' },
    { value: 'TRANSPORT', label: 'Transporte' },
    { value: 'FOOD', label: 'Alimentação' },
    { value: 'HOUSING', label: 'Moradia' },
    { value: 'STUDY_MATERIAL', label: 'Material Didático' },
];
export default function CadastroEdital() {

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
        verifiedScholarships: 0,
        semester: 1,
        grade: '',
        basicEduType: '',
        scholarshipType: '',
        higherEduScholarshipType: '',
        offeredCourseType: '',
        shift: 'Matutino'
    });

    const [educationalLevels, setEducationalLevels] = useState([]);
    const handleEducationalChange = (field, value) => {
        setCurrentCourse({ ...currentCourse, [field]: value });
        console.log(currentCourse)
    };


    const completeCourseRegistration = () => {
        setEducationalLevels([...educationalLevels, currentCourse]);
        setCurrentCourse({
            availableCourses: '',
            offeredVacancies: 5000,
            verifiedScholarships: 0,
            semester: 1,
            grade: '',
            basicEduType: '',
            scholarshipType: '',
            higherEduScholarshipType: '',
            offeredCourseType: '',
            shift: 'Matutino'
        })
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


    const [isAddingCourse, setIsAddingCourse] = useState(false);
    const [isEdittingCourse, setIsEdittingCourse] = useState(true);
    //Tabela dos educational Level
    const EducationalLevelsTable = ({ educationalLevels }) => {
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
                            <td>Entidade A</td>
                            <td>{level.verifiedScholarships}</td>
                            <td>{level.availableCourses}</td>
                            <td>{level.semester}</td>
                            <td>{level.shift}</td>
                            <td>{level.higherEduScholarshipType}</td>
                            <td> 
                                <button onClick={() => editEducationalLevel(index)}>Editar</button>
                                <button onClick={() => deleteEducationalLevel(index)}>Excluir</button>
                            </td>
                            {/* Adicione mais células de dados conforme necessário */}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
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

                    {!isAddingCourse && (
                        <button onClick={() => setIsAddingCourse(true)}>Cadastrar Vaga</button>
                    )}
                    {/* Dropdown para higherEduScholarshipType */}
                    {isAddingCourse && educationLevel === 'HigherEducation' &&
                        <div className='box-edital'>

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





                    <div className='box-edital'  >

                        <h2>Critérios de seleção e desempate</h2>

                        <div className="checkbox-wrapper">
                            <fieldset className='checkbox-filtro'>
                                <input type="checkbox" id="cadastro-unico" />
                                <span for="cadastro-unico" className="checkbox-label">Cadastro Único</span>
                            </fieldset>

                            <fieldset className='checkbox-filtro'>
                                <input type="checkbox" id="renda-familiar" />
                                <span for="renda-familiar" className="checkbox-label">Menor renda familiar bruta mensal</span>
                            </fieldset>

                            <fieldset className='checkbox-filtro'>
                                <input type="checkbox" id="doenca-grave" />
                                <span for="doenca-grave" className="checkbox-label">Doença grave</span>
                            </fieldset>

                            <fieldset className='checkbox-filtro'>
                                <input type="checkbox" id="proximidade-residencia" />
                                <span for="proximidade-residencia" className="checkbox-label">Proximidade da residência</span>
                            </fieldset>

                            <fieldset className='checkbox-filtro'>
                                <input type="checkbox" id="nota-enem" />
                                <span for="nota-enem" className="checkbox-label">Nota do ENEM</span>
                            </fieldset>

                            <fieldset className='checkbox-filtro'>
                                <input type="checkbox" id="sorteio" />
                                <span for="sorteio" className="checkbox-label">Sorteio</span>
                            </fieldset>
                        </div>

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

