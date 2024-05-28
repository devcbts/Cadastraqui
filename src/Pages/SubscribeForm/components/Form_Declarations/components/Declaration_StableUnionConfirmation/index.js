import React, { useState } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_StableUnionConfirmation({ onBack, partnerName, unionStartDate }) {
    const [confirmation, setConfirmation] = useState(null);

    const handleSave = () => {
        if (confirmation !== null) {
            // Adicione a lógica para salvar os dados aqui
        }
    };

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO DE UNIÃO ESTÁVEL</h2>
            <h3>João da Silva - usuário do Cadastraqui</h3>
            <div className={commonStyles.declarationContent}>
                <p>Convivo em União Estável com {partnerName}, desde {unionStartDate} e que somos juridicamente capazes. Nossa União Estável possui natureza pública, contínua e duradoura com o objetivo de constituição de família, nos termos dos artigos 1723 e seguintes do Código Civil.</p>
                <p>Confirma a declaração?</p>
                <div className={commonStyles.radioGroup}>
                    <label>
                        <input type="radio" name="confirmation" value="sim" onChange={() => setConfirmation('sim')} /> Sim
                    </label>
                    <label>
                        <input type="radio" name="confirmation" value="nao" onChange={() => setConfirmation('nao')} /> Não
                    </label>
                </div>
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase label="Salvar" onClick={handleSave} />
            </div>
        </div>
    );
}
