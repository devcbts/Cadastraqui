import React from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_NoAddressProof({ onBack }) {
    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO DE AUSÊNCIA DE COMPROVANTE DE ENDEREÇO EM NOME</h2>
            <h3>João da Silva - usuário do Cadastraqui</h3>
            <div className={commonStyles.declarationContent}>
                <p>Eu, João da Silva, resido na rua do império, nº 598, complemento, CEP: 23541-012, bairro Flores, cidade Rio de Janeiro, estado Rio de Janeiro, UF RJ, e-mail: joao.silva@test.com, declaro que não possuo comprovante de endereço em meu nome. Por ser a expressão da verdade e, ciente que a falsidade de informação sujeitará às penas da legislação pertinente, confirmo a presente declaração para efeitos legais.</p>
                <p>Confirma a declaração?</p>
                <div className={commonStyles.radioButtons}>
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
