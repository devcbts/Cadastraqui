import React, { useEffect, useState } from "react";

import { api } from "../../../services/axios.js";
import VerBasico from "../../Básico/ver-basico.js";
import LoadingCadastroCandidato from "../../Loading/LoadingCadastroCandidato.js";
import "./BasicoAssistente.css";

export default function BasicoAssistente({ id }) {
  const [basicInfo, setBasicInfo] = useState(null);
  const [registerInfo, setRegisterInfo] = useState(null);
 
  useEffect(() => {
    async function pegarIdentidade() {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get(`/candidates/identity-info/${id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        console.log("====================================");
        console.log(response.data);
        console.log("====================================");
        const dadosIdentidade = response.data.identityInfo;
        setBasicInfo(dadosIdentidade);
      } catch (err) {
        alert(err);
      }
    }
    async function pegarBasicInfo() {
      const token = localStorage.getItem('token');
     
      try {

          const response = await api.get(`/candidates/basic-info/${id}`, {
              headers: {
                  'authorization': `Bearer ${token}`,
              }
          })
          
          
              console.log(response.data)
              const dadosBasico = response.data.candidate
              
                  
                  setRegisterInfo(dadosBasico)
              
              console.log(dadosBasico)

      }
      catch (err) {
          alert(err)
      }
  }
  
  if (id) {
      pegarBasicInfo()
      pegarIdentidade();
    }
  }, []);

  return (
    <div>
      {basicInfo && registerInfo ? (
        <VerBasico candidate={basicInfo} basic={registerInfo} />
      ) : (
        <div>
          <LoadingCadastroCandidato />
        </div>
      )}
    </div>
  );
}
