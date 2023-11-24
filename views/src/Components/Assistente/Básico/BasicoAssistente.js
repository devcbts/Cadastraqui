import React, { useEffect, useState } from 'react';

import { api } from '../../../services/axios.js';
import VerBasico from '../../Básico/ver-basico.js';
import LoadingCadastroCandidato from '../../Loading/LoadingCadastroCandidato.js';

export default function BasicoAssistente({ id }) {
    const [basicInfo, setBasicInfo] = useState(null);



    useEffect(() => {
        async function pegarIdentidade() {
            const token = localStorage.getItem('token');
            try {

                const response = await api.get(`/candidates/identity-info/${id}`, {
                    headers: {
                        'authorization': `Bearer ${token}`,
                    }
                })
                console.log('====================================');
                console.log(response.data);
                console.log('====================================');
                const dadosIdentidade = response.data.identityInfo
                setBasicInfo(dadosIdentidade)
            }
            catch (err) {
                alert(err)
            }
        }
        if (id) {
            
            pegarIdentidade()
        }

    }, [])

    return (
        <div>
            {basicInfo ? <VerBasico candidate={basicInfo} /> : 
            <div>
                <LoadingCadastroCandidato/>
                </div>}





        </div>
    );
}

