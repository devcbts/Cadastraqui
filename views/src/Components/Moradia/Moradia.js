import React, { useEffect, useState } from 'react';
import { api } from '../../services/axios.js';
import CadastroMoradia from './cadastroMoradia.js';
import VerMoradia from './verMoradia.js';
import LoadingCadastroCandidato from '../Loading/LoadingCadastroCandidato.js';
export default function Moradia() {
    const [housing, setHousing] = useState(null);
    const [len,setLen] = useState(2)



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
                if(response === null){
                    setLen(0)
                    return
                }
                const dadosMoradia = response.data.housingInfo
                setHousing(dadosMoradia)
                setLen(dadosMoradia.length)

            }
            catch (err) {
                alert(err)
            }
        }
        pegarMembros()
        
    },[])

    return (
        <div>
            {housing? <VerMoradia formData={housing}/> : <div>
                
            {len > 0 ?
                <LoadingCadastroCandidato/>
            : <CadastroMoradia/>}
                </div>
                }




            
        </div>
    );
}

