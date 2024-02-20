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
    setSelectedShift(shift);
    // Pode querer resetar o tipo de bolsa se for dependente do turno
    setSelectedScholarshipType('');
  };

  // Função para manipular a mudança do tipo de bolsa
  const handleScholarshipTypeChange = (event) => {
    const scholarshipType = event.target.value;
    setSelectedScholarshipType(scholarshipType);
  };

  //------------------------------------------------------


  const [applications, setApplications] = useState();

  //Edital e education levels
  const [announcement, setAnnouncement] = useState();
  const [educationLevels, setEducationLevels] = useState([]);
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
  <div className="filters">
    <ul>
      <li>
        <div>
          <select onChange={handleCourseSelection}>
            <option value="">Selecione um curso</option>
            {educationLevels
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
              .filter(level => level.availableCourses === selectedCourse)
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
              .filter(level => level.availableCourses === selectedCourse && level.shift === selectedShift)
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
  </div>
)}

        {/* ... (restante da renderização) */}

        <div className="solicitacoes">

          <div className="education-levels-container">
            {educationLevels
              .filter(level => (selectedEducationLevel === null || level.id === selectedEducationLevel) &&
              (selectedShift === '' || level.shift === selectedShift) &&
              (selectedCourse === '' || level.availableCourses.includes(selectedCourse)) &&
              (selectedScholarshipType === '' || level.higherEduScholarshipType === selectedScholarshipType))
        
              .map((level) => (
                <div key={level.id} className="education-level">
                  <h2>{level.availableCourses} | {level.shift} | {translateHigherEducationScholashipType(level.higherEduScholarshipType) }</h2>
                  {/* Renderize os candidatos para este nível de educação */}
                  {rankedList[level.id]?.map((application) => (
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