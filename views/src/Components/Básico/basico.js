import React, { useEffect, useState } from 'react';

import VerBasico from './ver-basico.js';
import LoadingCadastroCandidato from '../Loading/LoadingCadastroCandidato.js';
import CadastroBasico from './cadastro-basico.js';
import { api } from '../../services/axios.js';

export default function Basico() {
    const [basicInfo, setBasicInfo] = useState(null);
    const [registerInfo, setRegisterInfo] = useState(null);
    const [len,setLen] = useState(2)

    useEffect(() => {
        async function pegarIdentidade() {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');
                console.log(role)
            try {
                
                const response = await api.get(`/candidates/identity-info`, {
                    headers: {
                        'authorization': `Bearer ${token}`,
                    }
                })
                if (response.data.identityInfo === null) {
                    setLen(0)
                    return
                }
                else{

                    const dadosIdentidade = response.data.identityInfo
                    
                        
                        setBasicInfo(dadosIdentidade)
                    
                    setLen(dadosIdentidade.length)
                    console.log(dadosIdentidade)
                }
            }
            catch (err) {
                setLen(0)
                alert(err)
            }
        }
        async function pegarBasicInfo() {
            const token = localStorage.getItem('token');
           
            try {

                const response = await api.get(`/candidates/basic-info`, {
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
        
            pegarBasicInfo()
            pegarIdentidade()
        

    }, [])

    return (
        <div>
            {basicInfo && registerInfo? <VerBasico candidate={basicInfo} basic={registerInfo} /> : 
            <div>
                {len > 0 ?
                <LoadingCadastroCandidato/>
            : <CadastroBasico/>}
                </div>}





        </div>
    );
}

