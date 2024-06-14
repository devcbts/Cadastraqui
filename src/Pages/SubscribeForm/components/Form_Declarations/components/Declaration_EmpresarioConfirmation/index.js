import React, { useState, useEffect } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_EmpresarioConfirmation({ onBack, onSave }) {
    const [confirmation, setConfirmation] = useState(null);
    const [declarationData, setDeclarationData] = useState(null);
    const [empresarioDetails, setEmpresarioDetails] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem('declarationData');
        const savedEmpresarioDetails = localStorage.getItem('empresarioDetails');
        if (savedData) {
            setDeclarationData(JSON.parse(savedData));
        }
        if (savedEmpresarioDetails) {
            setEmpresarioDetails(JSON.parse(savedEmpresarioDetails));
        }
    }, []);

    const handleSave = () => {
        if (confirmation !== null) {
            onSave(confirmation);
        }
    };

    if (!declarationData || !empresarioDetails) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÃO DE RENDA DE EMPRESÁRIO</h1>
            <h2>{declarationData.fullName} - usuário do Cadastraqui</h2>
            <div className={commonStyles.declarationContent}>
                <p>
                    Eu, <span>{declarationData.fullName}</span>, portador(a) do CPF nº <span>{declarationData.CPF}</span>, sou sócio de uma empresa e exerço a atividade: <span>{empresarioDetails.activity}</span>.
                </p>
            </div>
            <p>Confirma a declaração?</p>
            <div className={commonStyles.radioGroup}>
                <label>
                    <input type="radio" name="confirmation" value="sim" onChange={() => setConfirmation('sim')} /> Sim
                </label>
                <label>
                    <input type="radio" name="confirmation" value="nao" onChange={() => setConfirmation('nao')} /> Não
                </label>
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase label="Salvar" onClick={handleSave} />
            </div>
        </div>
    );
}
