import React from "react";
import { useState, useEffect } from "react";
import "./acceptEdital.css";
import { useParams, useNavigate } from 'react-router'
import { api } from "../../services/axios";
export default function AcceptEdital() {
  const params = useParams()
  console.log(params);
  const navigate = useNavigate()
  const [announcementInfo, setAnnouncementInfo] = useState()
  const [userInfo, setUserInfo] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null)
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

  function handleLevelChange(event) {
    const selectedLevelId = event.target.value;
    const selectedLevel = announcementInfo.educationLevels.find(level => level.id === selectedLevelId);
    setSelectedLevel(selectedLevel);
  }

  async function handleSubmitApplication() {
    const token = localStorage.getItem('token');
    if (!announcementInfo || !selectedLevel || !token) {
      console.log("Informações necessárias para a inscrição estão faltando.");
      return;
    }

    try {
      await api.post(`/candidates/application/${announcementInfo.id}/${selectedLevel.id}`, {}, {
        headers: {
          'authorization': `Bearer ${token}`,
        }
      });
      alert("Inscrição realizada com sucesso!");
    } catch (err) {
      alert("Erro ao enviar inscrição:", err);
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
              <select onChange={handleLevelChange}>
                {announcementInfo?.educationLevels.map((level) => {
                  return <option>{level.availableCourses}</option>
                })}
              </select>
              : ''}
          </div>
          <div>
            <h4>Tipo </h4>
            <select value={selectedLevel?.basicEduType} disabled>
              {announcementInfo?.educationLevels.map((level) => {
                return <option>{level.basicEduType}</option>
              })}
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

        </div>
        <div className="select-fields" style={{ justifyContent: 'center' }}>

          <div>
            <h2>Vagas:  </h2>
            <h3>{selectedLevel?.offeredVacancies}</h3>
          </div>
          <div>
            <h2>Número de bolsas:  </h2>
            <h3>{selectedLevel?.verifiedScholarships}</h3>
          </div>
        </div>
        <div style={{display:'flex', justifyContent: 'right'}}>

        <button type="button" className="cadastro-btn" onClick={handleSubmitApplication}>Salvar/Inscrever</button>
        </div>

      </div>

    </div>
  );
}
