import React, { useState } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_MEI_Confirmation({ onBack, onNext }) {
    const [confirmation, setConfirmation] = useState(null);

    const handleSave = () => {
        if (confirmation !== null) {
            onNext(confirmation);
        }
    };

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÃO DE RENDIMENTOS - MEI</h1>
            <h2>João da Silva - usuário do Cadastraqui</h2>
            <div className={commonStyles.declarationContent}>
                <p>
                    Eu, <span>João da Silva</span>, portador(a) do CPF nº <span>123.321.456-87</span>, NÃO POSSUO o cadastro como Microempreendedor Individual e que não recebo nenhuma remuneração nesta atividade. Esta declaração está em conformidade com a Lei nº 7.115/83*. Declaro ainda, sob as penas da lei, serem verdadeiras todas as informações acima prestadas.
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
