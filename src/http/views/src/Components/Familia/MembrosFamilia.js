import React, { useEffect, useState } from 'react';
import CadastroFamiliar from './cadastroFamiliar.js';
import { api } from '../../services/axios.js';
import VerFamiliar from './verFamiliar.js';

export default function MembrosFamilia() {
    const [membros, setMembros] = useState([]);
    const [mostrarCadastro, setMostrarCadastro] = useState(false);
    const [membroSelecionado, setMembroSelecionado] = useState(null);
    const adicionarMembro = (membro) => {
        setMembros([...membros, membro]);
        setMostrarCadastro(false); // Fecha o cadastro após adicionar o membro
    };

    const toggleCadastro = () => {
        setMostrarCadastro(!mostrarCadastro);
    };
    const selecionarMembro = (membro) => {
        setMembroSelecionado(membro);
        console.log('====================================');
        console.log(membro);
        console.log('====================================');
    };


    useEffect(() => {
        async function pegarMembros() {
            const token = localStorage.getItem('token');
            try {

                const response = await api.get("/candidates/family-member", {
                    headers: {
                        'authorization': `Bearer ${token}`,
                    }
                })
                console.log('====================================');
                console.log(response.data);
                console.log('====================================');
                const membrosdaFamilia = response.data.familyMembers
                setMembros(membrosdaFamilia)
                setMembroSelecionado(membrosdaFamilia[0])
            }
            catch (err) {
                alert(err)
            }
        }
        pegarMembros()
        
    },[])

    return (
        <div>


            {mostrarCadastro && <CadastroFamiliar onCadastroCompleto={adicionarMembro} />}


            {membros? <DropdownMembros membros={membros} onSelect={selecionarMembro}/> : ''}

            {!mostrarCadastro && membroSelecionado && <VerFamiliar familyMember={membroSelecionado} />}
            <button onClick={toggleCadastro}>
                {mostrarCadastro ? 'Fechar Cadastro' : 'Adicionar Membro'}
            </button>
        </div>
    );
}

const DropdownMembros = ({ membros, onSelect }) => {
    if (membros.length === 0) return null;
    
    const handleSelect = (event) => {
        const selectedMembro = membros.find(m => m.fullName === event.target.value);
        console.log('====================================');
        console.log(selectedMembro);
        console.log('====================================');
        onSelect(selectedMembro);
    };

    return (
        <div>
            <select onChange={handleSelect}>
                {membros.map((membro, index) => (
                    <option key={index} value={membro.fullName}>
                        {membro.fullName}
                    </option>
                ))}
            </select>
        </div>
    );
};
