import React from "react";
import { useState, useEffect } from "react";
import "./acceptEdital.css";
import { useParams, useNavigate } from 'react-router'
import { api } from "../../services/axios";
import { handleAuthError } from "../../ErrorHandling/handleError";
import { handleSuccess } from "../../ErrorHandling/handleSuceess";
export default function AcceptEdital() {
  const params = useParams()
  const navigate = useNavigate()
  const [announcementInfo, setAnnouncementInfo] = useState()
  const [userInfo, setUserInfo] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null)


  //Filtro para escolha de cursos

  // Filtro de Matriz e Filial
  const [entity, setEntity] = useState('');
  const [subsidiaries, setSubsidiaries] = useState('');
  const [selectedEntityOrSubsidiary, setSelectedEntityOrSubsidiary] = useState('');
  // Determinar se é educação básica
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

  // Função para tratar a seleção da matriz ou filial
  const handleEntityOrSubsidiaryChange = (value) => {
    setSelectedEntityOrSubsidiary(value);

    // Filtra os educationLevels com base na entidade ou filial selecionada
    const filteredLevels = announcementInfo.educationLevels.filter(level => {
      // Se a matriz foi selecionada e o level não tem entity_subsidiary_id, ou
      // se uma filial foi selecionada e o level tem um entity_subsidiary_id correspondente
      return (value === entity.id && !level.entitySubsidiaryId) ||
        (level.entitySubsidiaryId && level.entitySubsidiaryId === value);
    });
    console.log(filteredLevels)
    // Se existirem levels filtrados, seleciona o primeiro. Caso contrário, mantém o selectedLevel atual
    if (filteredLevels.length > 0) {
      const firstLevel = filteredLevels[0];
      setSelectedLevel(firstLevel);
      setSelectedLevelId(firstLevel.id);
      setSelectedCourse(firstLevel.availableCourses);
      setSelectedScholarshipType(firstLevel.higherEduScholarshipType);
      setSelectedShift(firstLevel.shift);
      setSelectedGrade(firstLevel.grade)
      setSelectedBasicScholarshipType(firstLevel.scholarshipType)
      setSelectedBasicEduType(firstLevel.basicEduType)
      
    } else {
      // Se não houver levels correspondentes à seleção, você pode optar por resetar selectedLevel ou manter o último selecionado
      // Exemplo de reset (ajuste conforme necessário):
      setSelectedLevel(null);
      setSelectedLevelId('');
      setSelectedCourse('');
      setSelectedScholarshipType('');
      setSelectedShift('');
    }
  };



  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedShift, setSelectedShift] = useState('');
  const [selectedScholarshipType, setSelectedScholarshipType] = useState('');
  const [selectedLevelId, setSelectedLevelId] = useState('');

  useEffect(() => {
    if (announcementInfo) {
      let matchedLevels
      if (isBasicEducation) {
        // Filtragem para educação básica
        matchedLevels = announcementInfo.educationLevels.filter(level => {
          const matchesShift = level.shift === selectedShift;
          const matchesBasicEduType = level.basicEduType === selectedBasicEduType;
          const matchesGrade = level.grade === selectedGrade;
          const matchesBasicScholarshipType = level.scholarshipType === selectedBasicScholarshipType;
          const matchesEntityOrSubsidiary = selectedEntityOrSubsidiary === '' ||
            level.entitySubsidiaryId === selectedEntityOrSubsidiary ||
            (!level.entitySubsidiaryId && selectedEntityOrSubsidiary === entity.id);

          return  matchesShift && matchesEntityOrSubsidiary && matchesBasicEduType && matchesGrade && matchesBasicScholarshipType;
        });
      } else {
        // Filtragem para outros tipos de educação
        matchedLevels = announcementInfo.educationLevels.filter(level => {
          const matchesCourse = level.availableCourses === selectedCourse;
          const matchesShift = level.shift === selectedShift;
          const matchesScholarshipType = level.higherEduScholarshipType === selectedScholarshipType;
          const matchesEntityOrSubsidiary = selectedEntityOrSubsidiary === '' ||
            level.entitySubsidiaryId === selectedEntityOrSubsidiary ||
            (!level.entitySubsidiaryId && selectedEntityOrSubsidiary === entity.id);

          return matchesCourse && matchesShift && matchesEntityOrSubsidiary && (matchesScholarshipType || !selectedScholarshipType);
        });
      }

      if (matchedLevels.length === 0) {
        // Se nenhum nível corresponder exatamente e não for educação básica, relaxe o filtro de tipo de bolsa
        if (!isBasicEducation) {

          matchedLevels = announcementInfo.educationLevels.filter(level =>
            level.availableCourses === selectedCourse &&
            level.shift === selectedShift &&
            (selectedEntityOrSubsidiary === '' || level.entitySubsidiaryId === selectedEntityOrSubsidiary || (!level.entitySubsidiaryId && selectedEntityOrSubsidiary === entity.id))
          );
        } else {
          matchedLevels = announcementInfo.educationLevels.filter(level =>
            level.basicEduType === selectedBasicEduType &&
            level.grade === selectedGrade &&
            level.shift === selectedShift &&
            (selectedEntityOrSubsidiary === '' || level.entitySubsidiaryId === selectedEntityOrSubsidiary || (!level.entitySubsidiaryId && selectedEntityOrSubsidiary === entity.id)))
            if (matchedLevels.length === 0) {
              matchedLevels = announcementInfo.educationLevels.filter(level =>
                level.basicEduType === selectedBasicEduType &&
                level.grade === selectedGrade &&
                
                (selectedEntityOrSubsidiary === '' || level.entitySubsidiaryId === selectedEntityOrSubsidiary || (!level.entitySubsidiaryId && selectedEntityOrSubsidiary === entity.id)))
              }
              console.log(matchedLevels)
        }
      }

      // Seleciona o primeiro nível correspondente ou define um padrão se nenhum corresponder
      const levelToSelect = matchedLevels[0] || announcementInfo.educationLevels[0];
      setSelectedLevel(levelToSelect);
      setSelectedShift(levelToSelect?.shift);
      console.log(levelToSelect)
      // Ajuste para configurações específicas de educação básica ou superior
      if (isBasicEducation) {
        setSelectedBasicEduType(levelToSelect?.basicEduType);
        setSelectedGrade(levelToSelect?.grade);
        setSelectedBasicScholarshipType(levelToSelect?.scholarshipType);
      } else {
        setSelectedCourse(levelToSelect?.availableCourses);

        setSelectedScholarshipType(levelToSelect?.higherEduScholarshipType);
      }
    }



  }, [selectedCourse, selectedShift, selectedBasicEduType, selectedGrade, selectedBasicScholarshipType, selectedScholarshipType, selectedEntityOrSubsidiary, announcementInfo, entity.id]);





  function handleCourseSelection(event) {
    const courseName = event.target.value;
    setSelectedCourse(courseName);

    // Filtrar educationLevels para encontrar os que correspondem ao curso selecionado
    const filteredLevels = announcementInfo?.educationLevels.filter(level => level.availableCourses.includes(courseName));

    // Supondo que exista uma propriedade `numberOfVacancies` para ordenar,
    // ajuste conforme a sua estrutura de dados real.
    const sortedLevels = filteredLevels.sort((a, b) => a.numberOfVacancies - b.numberOfVacancies);

    // Selecionar o primeiro educationLevel do grupo ordenado
    if (sortedLevels.length > 0) {
      const selectedLevel = sortedLevels[0];
      setSelectedLevel(selectedLevel); // Atualiza o estado com o level selecionado
      setSelectedScholarshipType(selectedLevel.scholarshipType); // Atualiza o tipo de bolsa
      setSelectedShift(selectedLevel.shift); // Atualiza o turno
    }
  }

  function handleBasicEduSelection(event) {
    const courseName = event.target.value;
    setSelectedBasicEduType(courseName);

    // Filtrar educationLevels para encontrar os que correspondem ao curso selecionado
    const filteredLevels = announcementInfo?.educationLevels.filter(level => level.basicEduType.includes(courseName));

    // Supondo que exista uma propriedade `numberOfVacancies` para ordenar,
    // ajuste conforme a sua estrutura de dados real.
    const sortedLevels = filteredLevels.sort((a, b) => a.numberOfVacancies - b.numberOfVacancies);

    // Selecionar o primeiro educationLevel do grupo ordenado
    if (sortedLevels.length > 0) {
      const selectedLevel = sortedLevels[0];
      setSelectedLevel(selectedLevel); // Atualiza o estado com o level selecionado
      setSelectedGrade(selectedLevel.grade); // Atualiza o tipo de bolsa
     
    }
  }



  //----------------------------------------------------------


  useEffect(() => {
    async function fetchAnnouncements() {
      const token = localStorage.getItem("token")
      try {
        const response = await api.get(`/candidates/anouncements/${params.announcement_id}`, {
          headers: {
            'authorization': `Bearer ${token}`,
          }
        })
        // Pega todos os editais e armazena em um estado
        setAnnouncementInfo(response.data.announcements)
        setEntity(response.data.announcements.entity)
        setSubsidiaries(response.data.announcements.entity_subsidiary)
        isEarlyEducation(announcementInfo.educationLevels)
        handleEntityOrSubsidiaryChange(response.data.announcements.entity.id)
        
        console.log(announcementInfo.educationLevels)



      } catch (err) {
        console.log(err)
      }
    }
    fetchAnnouncements()



  }, [userInfo])

  useEffect(() => {
    async function getUserInfo() {
      const token = localStorage.getItem("token")
      const user_role = localStorage.getItem("role")
      if (user_role === 'CANDIDATE') {
        try {
          const user_info = await api.get('/candidates/basic-info', {
            headers: {
              'authorization': `Bearer ${token}`,
            }
          })
          setUserInfo(user_info.data.candidate)
        } catch (err) {
          if (err.response.status === 401) {
            try {
              const newToken = await api.patch('/token/refresh')
              localStorage.setItem("token", newToken)
            } catch (err) {
              console.log(err)
            }
          }
        }
      } else if (user_role === 'RESPONSIBLE') {
        const user_info = await api.get('/responsibles', {
          headers: {
            'authorization': `Bearer ${token}`,
          }
        })
        setUserInfo(user_info.data.responsible)
      }
    }
    getUserInfo()
  }, [])

  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/candidates/documents/announcement/${params.announcement_id}`,{
          headers: {
            'authorization': `Bearer ${token}`,
          }
        });
        setPdfUrl(response.data.url);
        console.log(response.data)
      } catch (error) {
        console.error('Erro ao buscar o PDF do edital:', error);
      }
    };

    fetchPdfUrl();
  }, [params.announcement_id]);


  async function handleSubmitApplication() {
    const token = localStorage.getItem('token');
    if (!announcementInfo || !selectedLevel || !token) {
      console.log("Informações necessárias para a inscrição estão faltando.");
      return;
    }

    try {
      const response =await api.post(`/candidates/application/${announcementInfo.id}/${selectedLevelId}`, {}, {
        headers: {
          'authorization': `Bearer ${token}`,
        }
      });
      handleSuccess(response,"Inscrição realizada com sucesso!");
    } catch (err) {
      handleAuthError(err,navigate ,'Dados cadastrais não preenchidos completamente! Volte para a sessão de cadastro.' )
      // Trate o erro conforme necessário, talvez exibindo uma mensagem ao usuário
    }
  }


  return (
    <div className="section-fill-edital">
      <h1>INSCRIÇÃO EM PROCESSO SELETIVO</h1>
      <h4 className="subtitle-subscription">
        Compromisso em comunicar eventual alteração no tamanho do grupo familiar
        e/ou renda.
      </h4>
      <h4 className="text-subscription">
        Tenho ciência de que devo comunicar o(a) assistente social da entidade
        beneficente sobre nascimento ou falecimento de membro do meu grupo
        familiar, desde que morem na mesma residência, bem como sobre eventual
        rescisão de contrato de trabalho, encerramento de atividade que gere
        renda ou sobre início em novo emprego ou atividade que gere renda para
        um dos membros, pois altera a aferição realizada e o benefício em
        decorrência da nova renda familiar bruta mensal pode ser ampliado,
        reduzido ou mesmo cancelado, após análise por profissional de serviço
        social.
      </h4>
      <h4 className="subtitle-subscription">
        Inteira responsabilidade pelas informações contidas neste cadastro.{" "}
      </h4>
      <h4 className="text-subscription">
        Estou ciente e assumo, inteira responsabilidade pelas informações
        contidas neste cadastro e em relação as informações prestadas no
        decorrer do preenchimento deste formulário eletrônico e documentos
        anexados, estando consciente que a falsidade nas informações implicará
        nas penalidades cabíveis, previstas nos artigos 298 e 299 do Código
        Penal Brasileiro, bem como sobre a condição prevista no caput e § 2º do
        art. 26 da Lei Complementar nº 187, de 16 de dezembro de 2021.
      </h4>
      <a href={pdfUrl}  target="_blank"
                    rel="noopener noreferrer"><h3>Visualizar PDF do Edital</h3></a>
      <div className="select-candidato">
        <h4>Candidato (a)</h4>
        <select>
          <option>{userInfo ? userInfo.name : ''}</option>
        </select>
      </div>

      <div className="select-course">
        <h4>Inscrição no curso pretendido</h4>
        <div className="select-fields">
          <div>
            <h4>Cidade</h4>
            <select>
              <option>São Paulo</option>
            </select>
          </div>
          <div>
            <h4>Instituição</h4>
            <select>
              <option>{announcementInfo ? announcementInfo.entity.name : ''}</option>
            </select>
          </div>
          <div>
            <h4>Edital</h4>
            <select>
              <option>{announcementInfo ? announcementInfo.announcementName : ''}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="select-course">
        <h4>Ensino superior</h4>
        <div className="select-fields">
          <div>
            <h4>Matriz ou Filial</h4>
            {announcementInfo ?
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
              : ''}
          </div>
        </div>
        <div className="select-fields">

          {isBasicEducation ?
            <div>

              <div>
                <h4>Tipo de Educação Básica</h4>
                <select  onChange={(e) => handleBasicEduSelection(e)}>
                  {announcementInfo?.educationLevels
                    .filter(level => level.basicEduType !== null &&
                      ((!level.entitySubsidiaryId && selectedEntityOrSubsidiary === entity.id) ||
                        level.entitySubsidiaryId === selectedEntityOrSubsidiary))
                    .map(level => level.basicEduType)
                    .filter((value, index, self) => self.indexOf(value) === index) // Filtra para ter valores únicos
                    .map(basicEduType => (
                      <option value={basicEduType}>{translateBasicEducationScholashipType(basicEduType)}</option>
                    ))}
                </select>
              </div>

              <div>
                <h4>Série/Ano</h4>
                <select value={selectedLevel?.grade} onChange={(e) => setSelectedGrade(e.target.value)}>
                  {announcementInfo?.educationLevels
                    .filter(level =>
                      level.basicEduType === selectedLevel?.basicEduType &&
                      ((!level.entitySubsidiaryId && selectedEntityOrSubsidiary === entity.id) ||
                        level.entitySubsidiaryId === selectedEntityOrSubsidiary))
                    .map(level => level.grade)
                    .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicatas
                    .map(grade => (
                        <option value={grade}>{grade}</option>
                    ))}
                </select>
              </div>
              <div>
                <h4>Periodo: </h4>
                <select value={selectedLevel?.shift} onChange={(e) => setSelectedShift(e.target.value)}>
                  {announcementInfo?.educationLevels
                    .filter(level =>
                      level.basicEduType === selectedBasicEduType &&
                      level.grade === selectedGrade &&
                      ((!level.entitySubsidiaryId && selectedEntityOrSubsidiary === entity.id) || level.entitySubsidiaryId === selectedEntityOrSubsidiary)
                    )
                    .map(level => level.shift)
                    .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicatas
                    .map(shift => (
                      <option value={shift}>{shift}</option>
                    ))}
                </select>
              </div>
              <div>
                <h4>Bolsa para Educação Básica</h4>
                <select onChange={(e) => setSelectedBasicScholarshipType(e.target.value)}>
                  {announcementInfo?.educationLevels
                    .filter(level =>
                      level.basicEduType === selectedBasicEduType &&
                      level.grade === selectedGrade &&
                      level.shift === selectedShift &&
                      ((!level.entitySubsidiaryId && selectedEntityOrSubsidiary === entity.id) ||
                        level.entitySubsidiaryId === selectedEntityOrSubsidiary))
                    .map(level => level.scholarshipType)
                    .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicatas
                    .map(scholarshipType => (
                      <option value={scholarshipType}>{translateBasicEducationScholashipofferType(scholarshipType)}</option>
                    ))}
                </select>
              </div>


            </div>


            : <div>

              <div>
                <h4>Curso</h4>
                {announcementInfo ?
                  <select onChange={handleCourseSelection}>
                    {announcementInfo?.educationLevels
                      .filter(level =>
                        (!level.entitySubsidiaryId && selectedEntityOrSubsidiary === entity.id) || // Pertence à matriz
                        level.entitySubsidiaryId === selectedEntityOrSubsidiary // Pertence à filial selecionada
                      )
                      .map(level => level.availableCourses)
                      .filter((value, index, self) => self.indexOf(value) === index) // Filtra para ter valores únicos
                      .map(course => (
                        <option value={course}>{course}</option>
                      ))}
                  </select>

                  : ''}
              </div>
              <div>
                <h4>Periodo: </h4>
                <select value={selectedLevel?.shift} onChange={(e) => setSelectedShift(e.target.value)}>
                  {announcementInfo?.educationLevels
                    .filter(level =>
                      level.availableCourses === selectedCourse &&
                      ((!level.entitySubsidiaryId && selectedEntityOrSubsidiary === entity.id) || level.entitySubsidiaryId === selectedEntityOrSubsidiary)
                    )
                    .map(level => level.shift)
                    .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicatas
                    .map(shift => (
                      <option value={shift}>{shift}</option>
                    ))}
                </select>
              </div>

              <div>
                <h4>Semestre</h4>
                <select disabled>
                  {announcementInfo?.educationLevels.map((level) => {
                    return <option>{level.semester}</option>
                  })}
                </select>
              </div>
              <div>
                <h4>Bolsa: </h4>
                <select value={selectedLevel?.higherEduScholarshipType} onChange={(e) => setSelectedScholarshipType(e.target.value)}>
                  {announcementInfo?.educationLevels
                    .filter(level =>
                      level.availableCourses === selectedCourse &&
                      level.shift === selectedShift &&
                      ((!level.entitySubsidiaryId && selectedEntityOrSubsidiary === entity.id) || level.entitySubsidiaryId === selectedEntityOrSubsidiary)
                    )
                    .map(level => level.higherEduScholarshipType)
                    .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicatas
                    .map(scholarshipType => (
                      <option value={scholarshipType}>{translateHigherEducationScholashipType(scholarshipType)}</option>
                    ))}
                </select>
              </div>
            </div>
          }
        </div>
        <div className="select-fields" style={{ justifyContent: 'center' }}>

          <div>
            <h2>Número de bolsas:  </h2>
            <h3>{selectedLevel?.verifiedScholarships}</h3>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'right' }}>

          <button type="button" className="cadastro-btn" onClick={handleSubmitApplication}>Salvar/Inscrever</button>
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
  const  BasicEducation = BasicEducationType.find(

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
  const  BasicEducation = ScholarshipOfferType.find(

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