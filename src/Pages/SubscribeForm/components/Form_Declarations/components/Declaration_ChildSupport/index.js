import React, { useState } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_ChildSupport({ onBack, onNext }) {
    const [childReceivesSupport, setChildReceivesSupport] = useState(null);

    const handleRadioChange = (event) => {
        setChildReceivesSupport(event.target.value === 'yes');
    };

    const handleNext = () => {
        if (childReceivesSupport) {
            onNext();
        }
    };

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>RECEBIMENTO OU AUSÊNCIA DE RECEBIMENTO DE PENSÃO ALIMENTÍCIA</h2>
            <h3>João da Silva - usuário do Cadastraqui</h3>
            <div className={commonStyles.declarationContent}>
                <label>C - Há filho(s) que recebe(m) pensão alimentícia de outro(s) pai(s) ou mãe(s)?</label>
                <div className={commonStyles.radioGroup}>
                    <input 
                        type="radio" 
                        id="supportYes" 
                        name="childSupport" 
                        value="yes" 
                        onChange={handleRadioChange}
                        checked={childReceivesSupport === true}
                    />
                    <label htmlFor="supportYes">Sim</label>
                    <input 
                        type="radio" 
                        id="supportNo" 
                        name="childSupport" 
                        value="no" 
                        onChange={handleRadioChange}
                        checked={childReceivesSupport === false}
                    />
                    <label htmlFor="supportNo">Não</label>
                </div>
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase label="Salvar" onClick={handleNext} />
                <ButtonBase onClick={handleNext}><Arrow width="40px" /></ButtonBase>
            </div>
        </div>
    );
}
