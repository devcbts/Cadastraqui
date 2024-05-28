import React, { useState } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_ChildPension({ onBack, onNext }) {
    const [childReceivesPension, setChildReceivesPension] = useState(null);

    const handleRadioChange = (event) => {
        setChildReceivesPension(event.target.value === 'yes');
    };

    const handleNext = () => {
        if (childReceivesPension) {
            onNext();
        }
    };

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>RECEBIMENTO OU AUSÊNCIA DE RECEBIMENTO DE PENSÃO ALIMENTÍCIA</h2>
            <h3>João da Silva - usuário do Cadastraqui</h3>
            <div className={commonStyles.declarationContent}>
                <label>B - Algum filho recebe pensão alimentícia?</label>
                <div className={commonStyles.radioGroup}>
                    <input 
                        type="radio" 
                        id="childYes" 
                        name="childPension" 
                        value="yes" 
                        onChange={handleRadioChange}
                        checked={childReceivesPension === true}
                    />
                    <label htmlFor="childYes">Sim</label>
                    <input 
                        type="radio" 
                        id="childNo" 
                        name="childPension" 
                        value="no" 
                        onChange={handleRadioChange}
                        checked={childReceivesPension === false}
                    />
                    <label htmlFor="childNo">Não</label>
                </div>
                {childReceivesPension && (
                    <div className={commonStyles.additionalFields}>
                        <div className={commonStyles.inputGroup}>
                            <label htmlFor="childPensionRecipients">Selecione todos que recebem pensão</label>
                            <input type="text" id="childPensionRecipients" name="childPensionRecipients" placeholder="Carlos da Silva, Fulana da Silva" />
                        </div>
                        <div className={commonStyles.inputGroup}>
                            <label htmlFor="payerName">Nome do Pagador da Pensão</label>
                            <input type="text" id="payerName" name="payerName" placeholder="Joana de Gizman Londres" />
                        </div>
                        <div className={commonStyles.inputGroup}>
                            <label htmlFor="payerCpf">CPF do Pagador da Pensão</label>
                            <input type="text" id="payerCpf" name="payerCpf" placeholder="524.321.789-09" />
                        </div>
                        <div className={commonStyles.inputGroup}>
                            <label htmlFor="amount">Valor</label>
                            <input type="text" id="amount" name="amount" placeholder="550,00" />
                        </div>
                    </div>
                )}
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase label="Salvar" onClick={handleNext} />
                <ButtonBase onClick={handleNext}><Arrow width="40px" /></ButtonBase>
            </div>
        </div>
    );
}
