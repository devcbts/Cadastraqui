import React, { useState } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_InactiveCompany({ onBack, onSave }) {
    const [hasInactiveCompany, setHasInactiveCompany] = useState(null);
    const [activity, setActivity] = useState('');

    const handleSave = () => {
        if (hasInactiveCompany !== null) {
            onSave(hasInactiveCompany, activity);
        }
    };

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÃO DE EMPRESA INATIVA</h1>
            <h2>João da Silva - usuário do Cadastraqui</h2>
            <p>Você possui alguma empresa inativa?</p>
            <div className={commonStyles.radioGroup}>
                <label>
                    <input type="radio" name="hasInactiveCompany" value="sim" onChange={() => setHasInactiveCompany('sim')} /> Sim
                </label>
                <label>
                    <input type="radio" name="hasInactiveCompany" value="nao" onChange={() => setHasInactiveCompany('nao')} /> Não
                </label>
            </div>
            {hasInactiveCompany === 'sim' && (
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
