import React, { useState, useEffect } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_RuralWorker({ onBack, onNext }) {
    const [ruralWorker, setRuralWorker] = useState(null);
    const [activity, setActivity] = useState('');
    const [declarationData, setDeclarationData] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem('declarationData');
        if (savedData) {
            setDeclarationData(JSON.parse(savedData));
        }
    }, []);

    const handleSave = () => {
        if (ruralWorker !== null) {
            localStorage.setItem('ruralWorkerDetails', JSON.stringify({ ruralWorker, activity }));
            onNext(ruralWorker, activity);
        }
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÃO DE TRABALHADOR(A) RURAL</h1>
            <h2>{declarationData.fullName} - usuário do Cadastraqui</h2>
            <p>Você é trabalhador rural?</p>
            <div className={commonStyles.radioGroup}>
                <label>
                    <input type="radio" name="ruralWorker" value="sim" onChange={() => setRuralWorker('sim')} /> Sim
                </label>
                <label>
                    <input type="radio" name="ruralWorker" value="nao" onChange={() => setRuralWorker('nao')} /> Não
                </label>
            </div>
            {ruralWorker === 'sim' && (
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
