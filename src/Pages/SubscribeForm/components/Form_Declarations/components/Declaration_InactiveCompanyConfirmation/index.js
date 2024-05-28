import React from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_InactiveCompanyConfirmation({ onBack, onSave, activity }) {
    const handleSave = () => {
        onSave(true);
    };

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÃO DE EMPRESA INATIVA</h1>
            <h2>João da Silva - usuário do Cadastraqui</h2>
            <p>
                Eu, <span>João da Silva</span>, portador(a) do CPF nº <span>123.321.456-87</span>, possuo empresa inativa e exerço a atividade de <span>{activity}</span>.
            </p>
            <div className={commonStyles.radioGroup}>
                <label>
                    <input type="radio" name="confirm" value="sim" /> Sim
                </label>
                <label>
                    <input type="radio" name="confirm" value="nao" /> Não
                </label>
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase label="Salvar" onClick={handleSave} />
            </div>
        </div>
    );
}
