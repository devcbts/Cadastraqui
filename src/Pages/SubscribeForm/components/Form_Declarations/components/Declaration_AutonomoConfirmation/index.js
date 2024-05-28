import React, { useState } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_AutonomoConfirmation({ onBack, activity, onSave }) {
    const [confirmation, setConfirmation] = useState(null);

    const handleSave = () => {
        if (confirmation !== null) {
            onSave(confirmation);
        }
    };

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÃO DE AUTÔNOMO(A)/RENDA INFORMAL</h1>
            <h2>João da Silva - usuário do Cadastraqui</h2>
            <div className={commonStyles.declarationContent}>
                <p>
                    Eu, <span>João da Silva</span>, portador(a) do CPF nº <span>123.321.456-87</span>, desenvolvo atividades <span>{activity}</span> e recebo uma quantia média de R$ 2500,00 mensal.
                </p>
            </div>
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
