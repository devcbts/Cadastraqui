import React, { useEffect, useState } from "react";
import "./contas.css";
import NavBar from "../../Components/navBar";
import { useAppState } from "../../AppGlobal";
import Colaboracao from "../../Components/colaboracao";
import { api } from "../../services/axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";

export default function ContasEntidade() {
  const { isShown } = useAppState();
  const [entityInfo, setEntityInfo] = useState();
  const [subsidiaries, setSubsidiaries] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [directors, setDirectors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const refreshToken = Cookies.get('refreshToken');
        const response = await api.patch(`/refresh?refreshToken=${refreshToken}`);
        const { newToken, newRefreshToken } = response.data;
        localStorage.setItem('token', newToken);
        Cookies.set('refreshToken', newRefreshToken, { expires: 7, sameSite: 'strict', path: '/' });
      } catch (err) {
        ;
        navigate('/login');
      }
    };

    const intervalId = setInterval(refreshAccessToken, 480000); // Chama a função refreshAccessToken a cada 8 minutos

    const getEntityInfo = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get('/entities/', {
          headers: { 'authorization': `Bearer ${token}` },
        });
        setEntityInfo(response.data.entity);
        setSubsidiaries(response.data.entity.EntitySubsidiary);
      } catch (err) {
        ;
      }
    };

    getEntityInfo();
    return () => clearInterval(intervalId);
  }, [navigate]);

  useEffect(() => {
    const getAssistants = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get('/entities/announcement/assistant', {
          headers: { 'authorization': `Bearer ${token}` },
        });
        setAssistants(response.data.socialAssistants);
      } catch (err) {
        ;
      }
    };

    const getDirectors = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get(`/entities/director/`, {
          headers: { 'authorization': `Bearer ${token}` },
        });
        setDirectors(response.data.directors);
      } catch (err) {
        ;
      }
    };

    if (entityInfo) {
      getAssistants();
      getDirectors();
    }
  }, [entityInfo]);

  const removeColaborador = (id, role) => {
    if (role === 'Responsável') {
      setDirectors(prev => prev.filter(director => director.id !== id));
    } else if (role === 'Assistente') {
      setAssistants(prev => prev.filter(assistant => assistant.id !== id));
    } else if (role === 'Filial') {
      setSubsidiaries(prev => prev.filter(subsidiary => subsidiary.id !== id));
    }
  };

  return (
    <div className="container">
      <div className="section-nav">
        <NavBar entity={entityInfo}></NavBar>
      </div>
      <div className="container-contas">
        <h2>Status dos colaboradores</h2>
        <div className="solicitacoes">
          {directors && directors.map(director => (
            <Colaboracao
              key={director.id}
              name={director.name}
              role={"Responsável"}
              id={director.id}
              onRemoveEntity={() => removeColaborador(director.id, 'Responsável')}
            />
          ))}
          {assistants && assistants.map(assistant => (
            <Colaboracao
              key={assistant.id}
              name={assistant.name}
              role={"Assistente"}
              id={assistant.id}
              onRemoveEntity={() => removeColaborador(assistant.id, 'Assistente')}
            />
          ))}
        </div>
        <div className="historico">
          <h2>Filiais</h2>
          <div className="solicitacoes">
            {subsidiaries && subsidiaries.map(subsidiary => (
              <Colaboracao
                key={subsidiary.id}
                name={subsidiary.socialReason}
                role={"Filial"}
                address={subsidiary.address}
                CEP={subsidiary.CEP}
                educationalInstitutionCode={subsidiary.educationalInstitutionCode}
                id={subsidiary.id}
                onRemoveEntity={() => removeColaborador(subsidiary.id, 'Filial')}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
