import React, { useEffect, useState } from 'react';

import VerBasico from './ver-basico.js';
import LoadingCadastroCandidato from '../Loading/LoadingCadastroCandidato.js';
import CadastroBasico from './cadastro-basico.js';
import { api } from '../../services/axios.js';

export default function Basico() {
    const [basicInfo, setBasicInfo] = useState(null);

    const [len,setLen] = useState(2)

    useEffect(() => {
        async function pegarIdentidade() {
            const token = localStorage.getItem('token');
            try {

                const response = await api.get(`/candidates/identity-info`, {
                    headers: {
                        'authorization': `Bearer ${token}`,
                    }
                })
                console.log('====================================');
                console.log(response.data);
                console.log('====================================');
                const dadosIdentidade = response.data.identityInfo
                setBasicInfo(dadosIdentidade)
                setLen(dadosIdentidade.length)
            }
            catch (err) {
                alert(err)
            }
        }
        
            
            pegarIdentidade()
        

    }, [])

    return (
        <div>
            {basicInfo ? <VerBasico candidate={basicInfo} /> : 
            <div>
                {len > 0 ?
                <LoadingCadastroCandidato/>
            : <CadastroBasico/>}
                </div>}





        </div>
    );
}

