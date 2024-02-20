import React from "react";
import { useState, useEffect } from "react";
import "./acceptEdital.css";
import { useParams, useNavigate } from 'react-router'
import { api } from "../../services/axios";
export default function AcceptEdital() {
  const params = useParams()
  const navigate = useNavigate()
  const [announcementInfo, setAnnouncementInfo] = useState()
  const [userInfo, setUserInfo] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null)


  //Filtro para escolha de cursos
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedShift, setSelectedShift] = useState('');
  const [selectedScholarshipType, setSelectedScholarshipType] = useState('');
  const [selectedLevelId, setSelectedLevelId] = useState('');
  useEffect(() => {
    let matchedLevels = announcementInfo?.educationLevels.filter(level =>
      level.availableCourses === selectedCourse &&
      level.shift === selectedShift &&
      level.higherEduScholarshipType === selectedScholarshipType
    );
  
      

    if (matchedLevels.length === 0) {
      matchedLevels = announcementInfo?.educationLevels.filter(level =>
        level.availableCourses === selectedCourse &&
        level.shift === selectedShift 
      );
      // Se nenhum nível corresponder, selecione um padrão
      const defaultLevel = matchedLevels[0];
      setSelectedLevel(defaultLevel);
      setSelectedLevelId(defaultLevel?.id);
      setSelectedCourse(defaultLevel?.availableCourses);
      setSelectedScholarshipType(defaultLevel?.higherEduScholarshipType);
      setSelectedShift(defaultLevel?.shift);
    } else {
      // Caso contrário, selecione o primeiro nível correspondente
      const matchedLevel = matchedLevels[0];
      setSelectedLevel(matchedLevel);
      setSelectedLevelId(matchedLevel.id);
      setSelectedCourse(matchedLevel.availableCourses);
      setSelectedScholarshipType(matchedLevel.higherEduScholarshipType);
      setSelectedShift(matchedLevel.shift);
    }
  }, [selectedCourse, selectedShift, selectedScholarshipType,announcementInfo]);




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
        setSelectedLevel(response.data.announcements.educationLevels[0])
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



  async function handleSubmitApplication() {
    const token = localStorage.getItem('token');
    if (!announcementInfo || !selectedLevel || !token) {
      console.log("Informações necessárias para a inscrição estão faltando.");
      return;
    }

    try {
      await api.post(`/candidates/application/${announcementInfo.id}/${selectedLevelId}`, {}, {
        headers: {
          'authorization': `Bearer ${token}`,
        }
      });
      alert("Inscrição realizada com sucesso!");
    } catch (err) {
      alert("Erro ao enviar inscrição:", err);
      console.log(err)
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
            <h4>Curso</h4>
            {announcementInfo ?
              <select onChange={handleCourseSelection}>
                {announcementInfo?.educationLevels
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
                .filter(level => level.availableCourses === selectedCourse) // Filtra por curso selecionado
                .map(level => level.shift) // Extrai os turnos
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
            <select value={selectedLevel?.scholarshipType} onChange={(e) => setSelectedScholarshipType(e.target.value)}>
              {announcementInfo?.educationLevels
                .filter(level => level.availableCourses === selectedCourse && level.shift === selectedShift) // Filtra por curso selecionado
                .map(level => level.higherEduScholarshipType) // Extrai os turnos
                .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicatas
                .map(scholarshipType => (
                  <option value={scholarshipType}>{translateHigherEducationScholashipType(scholarshipType)}</option>
                ))}
            </select>
          </div>
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