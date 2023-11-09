import React, { useEffect, useState } from 'react';
import { api } from '../../services/axios.js';
import CadastroMoradia from './cadastroMoradia.js';
import VerMoradia from './verMoradia.js';
export default function Moradia() {
    const [housing, setHousing] = useState(null);
   


    useEffect(() => {
        async function pegarMembros() {
            const token = localStorage.getItem('token');
            try {

                const response = await api.get("/candidates/housing-info", {
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
        pegarMembros()
        
    },[])

    return (
        <div>
            {housing? <VerMoradia formData={housing}/> : <CadastroMoradia/>}




            
        </div>
    );
}

