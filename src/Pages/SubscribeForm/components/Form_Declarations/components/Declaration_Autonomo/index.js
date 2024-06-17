import React, { useState, useEffect } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_Autonomo({ onBack, onSave }) {
    const [informalWork, setInformalWork] = useState(null);
    const [activity, setActivity] = useState('');
    const [declarationData, setDeclarationData] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem('declarationData');
        if (savedData) {
            setDeclarationData(JSON.parse(savedData));
        }
    }, []);

    const handleSave = () => {
        if (informalWork !== null) {
            localStorage.setItem('autonomoDetails', JSON.stringify({ informalWork, activity }));
            onSave(informalWork, activity);
        }
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÃO DE AUTÔNOMO(A)/RENDA INFORMAL</h1>
            <h2>{declarationData.fullName} - usuário do Cadastraqui</h2>
            <p>Você desenvolve alguma atividade sem vínculo empregatício?</p>
            <div className={commonStyles.radioGroup}>
                <label>
                    <input type="radio" name="informalWork" value="sim" onChange={() => setInformalWork('sim')} /> Sim
                </label>
                <label>
                    <input type="radio" name="informalWork" value="nao" onChange={() => setInformalWork('nao')} /> Não
                </label>
            </div>
            {informalWork === 'sim' && (
                <div className={commonStyles.inputGroup}>
                    <label htmlFor="activity">Escreva a atividade que exerce</label>
                    <textarea
                        id="activity"
                        name="activity"
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                        maxLength={255}
                        placeholder="Descreva sua atividade"
                    />
                    <div className={commonStyles.charCount}>{activity.length}/255</div>
                </div>
            )}
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase label="Salvar" onClick={handleSave} />
            </div>
        </div>
    );
}
