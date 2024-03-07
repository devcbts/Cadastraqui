import React, { useState } from "react";
import "./candidatosCadastrados.css";
import NavBar from "../../Components/navBar";
import { UilBell } from "@iconscout/react-unicons";
import { useAppState } from "../../AppGlobal";
import Candidatura from "../../Components/candidatura";
import Colaboracao from "../../Components/colaboracao";
import NavBarAssistente from "../../Components/navBarAssistente";
import { UilFilter } from "@iconscout/react-unicons";
import { useParams, } from "react-router";
import { useEffect } from "react";
import { useAuth } from "../../context/auth";
import { api } from "../../services/axios";
import { Link } from "react-router-dom";
import LoadingCandidaturaAssistente from "../../Components/Loading/loadingCandidaturaAssistente";

export default function CandidatosCadastrados() {
  const { announcement_id } = useParams();
  const { user } = useAuth();

  //Lista rankeada pela renda
  const [rankedList, setRankedList] = useState([])
  const { isShown } = useAppState();

  // Filtragem no sistema 
  const [filterIsShown, setFilterIsShown] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedShift, setSelectedShift] = useState('');
  const [selectedScholarshipType, setSelectedScholarshipType] = useState('');
  const [selectedEntityOrSubsidiary, setSelectedEntityOrSubsidiary] = useState('');

  // Função para manipular a mudança de Matriz ou Filial
  const handleEntityOrMatrixSelection = (event) => {
    const entity = event.target.value;
    setSelectedEntityOrSubsidiary(entity);
    // Resetar os outros seletores para garantir consistência
    setSelectedCourse('')
    setSelectedShift('');
    setSelectedScholarshipType('');
  };
  // Função para manipular a mudança de curso
  const handleCourseSelection = (event) => {
    const course = event.target.value;
    setSelectedCourse(course);
    // Resetar os outros seletores para garantir consistência
    setSelectedShift('');
    setSelectedScholarshipType('');
  };

  // Função para manipular a mudança de período
  const handleShiftChange = (event) => {
    const shift = event.target.value;
    if (isBasicEducation) {
      setSelectedBasicScholarshipType('')
    } else {

      setSelectedScholarshipType('');
    }
    setSelectedShift(shift);
    // Pode querer resetar o tipo de bolsa se for dependente do turno
  };

  // Função para manipular a mudança do tipo de bolsa
  const handleScholarshipTypeChange = (event) => {
    const scholarshipType = event.target.value;
    setSelectedScholarshipType(scholarshipType);
  };

  //------------------------------------------------------
  // Lógica para educação básica
  const [isBasicEducation, setIsBasicEducation] = useState(false)
  const [selectedBasicScholarshipType, setSelectedBasicScholarshipType] = useState('')
  const [selectedBasicEduType, setSelectedBasicEduType] = useState('')
  const [selectedGrade, setSelectedGrade] = useState('')

  function isEarlyEducation(educationLevels) {
    const earlyEducation = educationLevels?.some(level => level.level === "BasicEducation");
    if (earlyEducation) {
      setIsBasicEducation(true)
    }
  }

  const handleBasicEduTypeSelection = (event) => {
    const course = event.target.value;
    setSelectedBasicEduType(course);
    // Resetar os outros seletores para garantir consistência
    setSelectedShift('');
    setSelectedBasicScholarshipType('')
    setSelectedScholarshipType('');
  };

  // Função para manipular a mudança de período
  const handleGradeChange = (event) => {
    const grade = event.target.value;
    setSelectedGrade(grade);
    // Pode querer resetar o tipo de bolsa se for dependente do turno
    setSelectedShift('');
    setSelectedBasicScholarshipType('')
  };

  // Função para manipular a mudança do tipo de bolsa
  const handleBasicScholarshipTypeChange = (event) => {
    const scholarshipType = event.target.value;
    setSelectedBasicScholarshipType(scholarshipType);
  };
  //------------------------------------------------------

  const [applications, setApplications] = useState();

  //Edital e education levels
  const [entity, setEntity] = useState('');
  const [announcement, setAnnouncement] = useState();
  const [educationLevels, setEducationLevels] = useState(null);
  const handleClickFilter = () => {
    setFilterIsShown((prev) => !prev);
  };

  useEffect(() => {
    async function fetchCandidates() {
      const token = localStorage.getItem("token");
      const response = await api.get(`/assistant/${announcement_id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      setApplications(response.data.applications);
      setEntity(response.data.entity)
      console.log(response.data.applications);
    }

    fetchAnnouncement();
    fetchCandidates();
    fetchRankedCandidates();
  }, []);

  async function fetchAnnouncement() {
    const token = localStorage.getItem("token");
    try {
      const response = await api.get(`/assistant/announcement/${announcement_id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setEducationLevels(response.data.announcement.educationLevels);
      isEarlyEducation(response.data.announcement.educationLevels)
      setAnnouncement(response.data.announcement)
      console.log(response.data.announcement)
    } catch (error) {
      console.error("Error fetching announcement details:", error);
    }
  }

  async function fetchRankedCandidates() {
    const token = localStorage.getItem("token");
    try {
      const response = await api.get(`/assistant/rank-income/${announcement_id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data)
      setRankedList(response.data.rankedList)
    } catch (error) {
      console.error("Erro ao rankear candidatos", error);
    }
  }

  // Filtro de dados da ordem dos candidatos com base em CadUnic, renda, doençaGrave etc
  const [priorityOrder, setPriorityOrder] = useState(['totalIncomePerCapita', 'isCadUnico', 'hasSevereDisease']);

  const sortApplications = (a, b) => {
    for (let criteria of priorityOrder) {
      switch (criteria) {
        case 'totalIncomePerCapita':
          if (a.totalIncomePerCapita !== b.totalIncomePerCapita) {
            return a.totalIncomePerCapita - b.totalIncomePerCapita;
          }
          break;
        case 'isCadUnico':
          if (a.candidateApplication.candidate.IdentityDetails.CadUnico && !b.candidateApplication.candidate.IdentityDetails.CadUnico) {
            return -1;
          } else if (!a.candidateApplication.candidate.IdentityDetails.CadUnico && b.candidateApplication.candidate.IdentityDetails.CadUnico) {
            return 1;
          }
          break;
        case 'hasSevereDisease':
          if (a.candidateApplication.candidate.IdentityDetails.hasSevereDisease && !b.candidateApplication.candidate.IdentityDetails.hasSevereDisease) {
            return -1;
          } else if (!a.candidateApplication.candidate.IdentityDetails.hasSevereDisease && b.candidateApplication.candidate.IdentityDetails.hasSevereDisease) {
            return 1;
          }
          break;
        default:
          break;
      }
    }
    return 0; // Se todos os critérios forem iguais, mantém a ordem original
  };

  const [selectedEducationLevel, setSelectedEducationLevel] = useState(null);

  const handleEducationLevelChange = (e) => {
    const selectedLevel = e.target.value;
    setSelectedEducationLevel(selectedLevel);
  };

  // Filtrar cursos com base no nível de educação selecionado
  const filteredCourses = selectedEducationLevel
    ? educationLevels.find(level => level.id === selectedEducationLevel)?.availableCourses
    : [];
  return (
    <div className="container">
      <div className="section-nav">
        <NavBarAssistente></NavBarAssistente>
      </div>

      <div className="container-contas">
        <div className="upper-cadastrados">
          <h1>Edital - {announcement?.announcementName}</h1>
          <div className="btns-cadastro">
            <a className="btn-cadastro">Extrair PDF</a>

            <a className="btn-cadastro"> <Link className="btn-cadastro" to={`/assistente/estatisticas/${announcement_id}`}>Ver estatísticas</Link></a>

          </div>
        </div>
        <h1 className="title-thin">Candidatos</h1>
        <div
          className="filter-ico"
          onClick={() => {
            handleClickFilter();
          }}
        >
          <UilFilter size="30" color="#9e9e9e" id="btn-filter"></UilFilter>
        </div>

        {filterIsShown && (
          <div className="filters-assistente">
            {isBasicEducation ?
              <ul>
                <li>
                  <div>
                    <select onChange={(e) => handleEntityOrMatrixSelection(e)}>
                      <option value="">Selecione uma Matriz ou Filial</option>
                      <option value={entity?.id}>Matriz - {entity?.name}</option>
                      {announcement.entity_subsidiary.map(subsidiary => (
                        <option key={subsidiary.id} value={subsidiary.id}>Filial - {subsidiary.socialReason}</option>
                      ))}
                    </select>
                  </div>
                </li>
                <li>
                  <div>
                    <select onChange={handleBasicEduTypeSelection}>
                      <option value="">Tipo de Educação Básica</option>
                      {educationLevels
                        .filter(level => (selectedEntityOrSubsidiary === '' || (!level.entitySubsidiaryId && selectedEntityOrSubsidiary === entity.id) || level.entitySubsidiaryId === selectedEntityOrSubsidiary))
                        .map(level => level.basicEduType)
                        .filter((type, index, self) => self.indexOf(type) === index) // Remove duplicatas
                        .map((type, index) => (
                          <option key={index} value={type}>{translateBasicEducationScholashipType(type)}</option>
                        ))}
                    </select>
                  </div>
                </li>
                <li>
                  <div>
                    <select onChange={handleGradeChange} value={selectedGrade}>
                      <option value="">Selecione a Série/Ano</option>
                      {educationLevels
                        .filter(level => level.basicEduType === selectedBasicEduType && (selectedEntityOrSubsidiary === '' || (!level.entitySubsidiaryId && selectedEntityOrSubsidiary === entity.id) || level.entitySubsidiaryId === selectedEntityOrSubsidiary))
                        .map(level => level.grade)
                        .filter((grade, index, self) => self.indexOf(grade) === index) // Remove duplicatas
                        .map((grade, index) => (
                          <option key={index} value={grade}>{grade}</option>
                        ))}
                    </select>
                  </div>
                </li>
                <li>
                  <div>
                    <select onChange={handleBasicScholarshipTypeChange} value={selectedBasicScholarshipType}>
                      <option value="">Selecione um tipo de bolsa</option>
                      {educationLevels
                        .filter(level => level.basicEduType === selectedBasicEduType && level.grade === selectedGrade && (selectedEntityOrSubsidiary === '' || (!level.entitySubsidiaryId && selectedEntityOrSubsidiary === entity.id) || level.entitySubsidiaryId === selectedEntityOrSubsidiary))
                        .flatMap(level => level.scholarshipType) // Supondo que `basicScholarshipType` contém os tipos de bolsa
                        .filter((type, index, self) => self.indexOf(type) === index) // Remove duplicatas
                        .map((type, index) => (
                          <option key={index} value={type}>{translateBasicEducationScholashipofferType(type)}</option> // Supondo que os tipos de bolsa já estejam formatados corretamente
                        ))}
                    </select>
                  </div>
                </li>
              </ul>


              :

              <ul>
                <li>
                  <div>

                    <select onChange={(e) => handleEntityOrMatrixSelection(e)}>
                      <option value="">Selecione uma Matriz ou Filial</option>
                      <option value={entity?.id}>Matriz - {entity?.name}</option>
                      {announcement.entity_subsidiary.map(subsidiary => (
                        <option key={subsidiary.id} value={subsidiary.id}>Filial - {subsidiary.socialReason}</option>
                      ))}
                    </select>
                  </div>

                </li>
                <li>
                  <div>
                    <select onChange={handleCourseSelection}>
                      <option value="">Selecione um curso</option>
                      {educationLevels.filter(level => (selectedEntityOrSubsidiary === '' || (!level.entitySubsidiaryId && selectedEntityOrSubsidiary === entity.id) || level.entitySubsidiaryId === selectedEntityOrSubsidiary))
                        .map(level => level.availableCourses)
                        .filter((course, index, self) => self.indexOf(course) === index) // Remove duplicatas
                        .map((course, index) => (
                          <option key={index} value={course}>{course}</option>
                        ))}
                    </select>
                  </div>
                </li>
                <li>
                  <div>
                    <select onChange={handleShiftChange} value={selectedShift}>
                      <option value="">Selecione um período</option>
                      {educationLevels
                        .filter(level => level.availableCourses === selectedCourse && (selectedEntityOrSubsidiary === '' || (!level.entitySubsidiaryId && selectedEntityOrSubsidiary === entity.id) || level.entitySubsidiaryId === selectedEntityOrSubsidiary))
                        .map(level => level.shift)
                        .filter((shift, index, self) => self.indexOf(shift) === index) // Remove duplicatas
                        .map((shift, index) => (
                          <option key={index} value={shift}>{shift}</option>
                        ))}
                    </select>
                  </div>
                </li>
                <li>
                  <div>
                    <select onChange={handleScholarshipTypeChange} value={selectedScholarshipType}>
                      <option value="">Selecione um tipo de bolsa</option>
                      {educationLevels
                        .filter(level => level.availableCourses === selectedCourse && level.shift === selectedShift && (selectedEntityOrSubsidiary === '' || (!level.entitySubsidiaryId && selectedEntityOrSubsidiary === entity.id) || level.entitySubsidiaryId === selectedEntityOrSubsidiary))
                        .flatMap(level => level.higherEduScholarshipType) // Supondo que `types1` contém os tipos de bolsa
                        .filter((type, index, self) => self.indexOf(type) === index) // Remove duplicatas
                        .map((type, index) => (
                          <option key={index} value={type}>{translateHigherEducationScholashipType(type)}</option> // Use uma função de tradução se necessário
                        ))}
                    </select>
                  </div>
                </li>
                {/* ... (outros filtros conforme necessário) */}
              </ul>
            }
          </div>
        )}

        {/* ... (restante da renderização) */}

        <div className="solicitacoes">


          <h2>Selecione a ordem de prioridade</h2>
          <div className="select-fields" style={{justifyContent: 'center'}}>


            <select onChange={(e) => setPriorityOrder([...e.target.value])}>
              <option value={['totalIncomePerCapita', 'isCadUnico', 'hasSevereDisease']}>Renda Per Capita, CadÚnico, Doença Grave</option>
              <option value={['isCadUnico', 'hasSevereDisease', 'totalIncomePerCapita']}>CadÚnico, Doença Grave, Renda Per Capita</option>
              <option value={['hasSevereDisease', 'totalIncomePerCapita', 'isCadUnico']}>Doença Grave, Renda Per Capita, CadÚnico</option>
            </select>
          </div>
          <div className="education-levels-container">
            {educationLevels && educationLevels
              .filter(level => (selectedEducationLevel === null || level.id === selectedEducationLevel) &&
                (selectedShift === '' || level.shift === selectedShift) &&
                (selectedCourse === '' || level.availableCourses.includes(selectedCourse)) &&
                (selectedScholarshipType === '' || level.higherEduScholarshipType === selectedScholarshipType) &&
                (selectedEntityOrSubsidiary === '' || (!level.entitySubsidiaryId && selectedEntityOrSubsidiary === entity.id) || level.entitySubsidiaryId === selectedEntityOrSubsidiary) &&
                (selectedBasicEduType === '' || level.basicEduType === selectedBasicEduType) &&
                (selectedGrade === '' || level.grade === selectedGrade) &&
                (selectedScholarshipType === '' || level.scholarshipType === selectedScholarshipType)
              )
              .map((level) => (
                <div key={level.id} className="education-level">
                  {isBasicEducation ? <h2>
                    {translateBasicEducationScholashipType(level.basicEduType)} | {level.grade} | {translateBasicEducationScholashipofferType(level.scholarshipType)} | {level.shift}
                  </h2> :
                    <h2>{level.availableCourses} | {level.shift} | {translateHigherEducationScholashipType(level.higherEduScholarshipType)}</h2>
                  }
                  {/* Renderize os candidatos para este nível de educação */}
                  {rankedList[level.id]?.sort(sortApplications).map((application) => (
                    <div key={application.candidateApplication.id}>
                      <Candidatura
                        name={application.candidateApplication.candidateName}
                        assistente={application.candidateApplication.SocialAssistantName}
                        id={application.candidateApplication.id}
                        announcement_id={announcement_id}
                        valor={application.totalIncomePerCapita}
                        announcementName={announcement.announcementName}
                      />

                    </div>

                  ))}
                  <Candidatura
                    name="João Paulo"
                    assistente='Fernado Souza'
                    announcement_id={announcement_id}
                    valor={3500}
                  /><Candidatura
                    name="João Paulo"
                    assistente='Fernado Souza'
                    announcement_id={announcement_id}
                    valor={5000}
                  />
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}




function translateHigherEducationScholashipType(HigherEducationScholarship) {
  const HigherEducation = HigherEducationScholarshipType.find(
    (r) => r.value === HigherEducationScholarship
  );
  return HigherEducation ? HigherEducation.label : "Não especificado";
}
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

function translateBasicEducationScholashipType(BasicEducationScholarship) {
  const BasicEducation = BasicEducationType.find(

    (r) => r.value === BasicEducationScholarship
  )
  return BasicEducation ? BasicEducation.label : "Não especificado";
}

const BasicEducationType = [
  { value: 'Preschool', label: 'Pré-Escola' },
  { value: 'Elementary', label: 'Fundamental I e II' },
  { value: 'HighSchool', label: 'Ensino Médio' },
  { value: 'ProfessionalEducation', label: 'Educação Profissional' }
];

function translateBasicEducationScholashipofferType(BasicEducationScholarship) {
  const BasicEducation = ScholarshipOfferType.find(

    (r) => r.value === BasicEducationScholarship
  )
  return BasicEducation ? BasicEducation.label : "Não especificado";
}

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