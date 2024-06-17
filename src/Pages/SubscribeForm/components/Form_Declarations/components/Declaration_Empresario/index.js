import React, { useState, useEffect } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_Empresario({ onBack, onSave }) {
    const [isPartner, setIsPartner] = useState(null);
    const [activity, setActivity] = useState('');
    const [declarationData, setDeclarationData] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem('declarationData');
        if (savedData) {
            setDeclarationData(JSON.parse(savedData));
        }
    }, []);

    const handleSave = () => {
        if (isPartner !== null) {
            localStorage.setItem('empresarioDetails', JSON.stringify({ isPartner, activity }));
            onSave(isPartner, activity);
        }
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÃO DE RENDA DE EMPRESÁRIO</h1>
            <h2>{declarationData.fullName} - usuário do Cadastraqui</h2>
            <p>Você é sócio de alguma empresa?</p>
            <div className={commonStyles.radioGroup}>
                <label>
                    <input type="radio" name="isPartner" value="sim" onChange={() => setIsPartner('sim')} /> Sim
                </label>
                <label>
                    <input type="radio" name="isPartner" value="nao" onChange={() => setIsPartner('nao')} /> Não
                </label>
            </div>
            {isPartner === 'sim' && (
                <div className={commonStyles.inputGroup}>
                    <label htmlFor="activity">Escreva a atividade que exerce</label>
                    <textarea
                        id="activity"
                        name="activity"
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                        maxLength="255"
                        rows="4"
                    ></textarea>
                </div>
            )}
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase label="Salvar" onClick={handleSave} />
            </div>
        </div>
    );
}
