import React, { useEffect, useState } from 'react';

import VerMoradiaAssistente from './verMoradiaAssistente.js';
import { api } from '../../../services/axios.js';

    export default function MoradiaAssistente({id}) {
    const [housing, setHousing] = useState(null);
   


    useEffect(() => {
        async function pegarMoradia() {
            const token = localStorage.getItem('token');
            try {

                const response = await api.get(`/candidates/housing-info/${id}`, {
                    headers: {
                        'authorization': `Bearer ${token}`,
                    }
                })
                console.log('====================================');
                console.log(response.data);
                console.log('====================================');
                const dadosMoradia = response.data.housingInfo
                setHousing(dadosMoradia)
            }
            catch (err) {
                alert(err)
            }
        }
        pegarMoradia()
        
    },[])

    return (
        <div>
            {housing? <VerMoradiaAssistente formData={housing}/> : ''}




            
        </div>
    );
}

