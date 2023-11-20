import React, { useState } from 'react';
import CadastroFamiliar from './cadastroFamiliar.js';

export default function MembrosFamilia() {
    const [membros, setMembros] = useState([]);
    const [mostrarCadastro, setMostrarCadastro] = useState(false);

    const adicionarMembro = (membro) => {
        setMembros([...membros, membro]);
        setMostrarCadastro(false); // Fecha o cadastro após adicionar o membro
    };

    const toggleCadastro = () => {
        setMostrarCadastro(!mostrarCadastro);
    };

    return (
        <div>
            {mostrarCadastro && <CadastroFamiliar onCadastroCompleto={adicionarMembro} />}

            <DropdownMembros membros={membros} />
            <button onClick={toggleCadastro}>
                {mostrarCadastro ? 'Fechar Cadastro' : 'Adicionar Membro'}
            </button>
        </div>
    );
}

const DropdownMembros = ({ membros }) => {
    if (membros.length === 0) return null;

    return (
        <div>
            <select>
                {membros.map((membro, index) => (
                    <option key={index} value={membro.nome}>
                        {membro.nome}
                    </option>
                ))}
            </select>
        </div>
    );
};
