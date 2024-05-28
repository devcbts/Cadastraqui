import React from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_RentConfirmation({ onBack }) {
    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO DE IMÓVEL ALUGADO - SEM CONTRATO DE ALUGUEL</h2>
            <h3>João da Silva - usuário do Cadastraqui</h3>
            <div className={commonStyles.declarationContent}>
                <p>Resido em imóvel alugado e não possuo contrato de aluguel, pois se trata de acordo verbal/informal, ao qual pago o valor de <span>R$ 550,00</span> por mês de aluguel para <span>Fulano de Tal</span>, inscrito no CPF nº <span>123.456.789-10</span>.</p>
                <p>Confirma a declaração?</p>
                <div className={commonStyles.radioGroup}>
                    <label>
                        <input type="radio" name="confirmation" value="sim" /> Sim
                    </label>
                    <label>
                        <input type="radio" name="confirmation" value="nao" /> Não
                    </label>
                </div>
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase label="Salvar" />
            </div>
        </div>
    );
}
