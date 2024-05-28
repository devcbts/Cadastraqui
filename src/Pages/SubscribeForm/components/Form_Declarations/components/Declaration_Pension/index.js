import React, { useState } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_Pension({ onBack, onNext }) {
    const [receivesPension, setReceivesPension] = useState(null);

    const handleRadioChange = (event) => {
        setReceivesPension(event.target.value === 'yes');
    };

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>RECEBIMENTO OU AUSÊNCIA DE RECEBIMENTO DE PENSÃO ALIMENTÍCIA</h2>
            <h3>João da Silva - usuário do Cadastraqui</h3>
            <div className={commonStyles.declarationContent}>
                <label>A - Você recebe pensão alimentícia?</label>
                <div className={commonStyles.radioGroup}>
                    <input 
                        type="radio" 
                        id="yes" 
                        name="pension" 
                        value="yes" 
                        onChange={handleRadioChange}
                        checked={receivesPension === true}
                    />
                    <label htmlFor="yes">Sim</label>
                    <input 
                        type="radio" 
                        id="no" 
                        name="pension" 
                        value="no" 
                        onChange={handleRadioChange}
                        checked={receivesPension === false}
                    />
                    <label htmlFor="no">Não</label>
                </div>
                {receivesPension && (
                    <div className={commonStyles.additionalFields}>
                        <div className={commonStyles.inputGroup}>
                            <label htmlFor="payerName">Nome do Pagador da Pensão</label>
                            <input type="text" id="payerName" name="payerName" />
                        </div>
                        <div className={commonStyles.inputGroup}>
                            <label htmlFor="payerCpf">CPF do Pagador da Pensão</label>
                            <input type="text" id="payerCpf" name="payerCpf" />
                        </div>
                        <div className={commonStyles.inputGroup}>
                            <label htmlFor="amount">Valor</label>
                            <input type="text" id="amount" name="amount" />
                        </div>
                    </div>
                )}
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={() => { console.log("Navigating Back"); onBack(); }}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase label="Salvar" onClick={() => { console.log("Navigating to Child Pension"); onNext(); }} />
                <ButtonBase onClick={() => { console.log("Navigating to Child Pension"); onNext(); }}><Arrow width="40px" /></ButtonBase>
            </div>
        </div>
    );
}
