import React, { useState } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_IncomeTaxExemptionConfirmation({ onBack, onNext }) {
    const [confirmation, setConfirmation] = useState(null);

    const handleSave = () => {
        if (confirmation !== null) {
            onNext();
        }
    };

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO DE ISENTO DE IMPOSTO DE RENDA</h2>
            <h3>João da Silva - usuário do Cadastraqui</h3>
            <div className={commonStyles.declarationContent}>
                <p>Eu, João da Silva, portador(a) da cédula de identidade RG n° 123456-85 , órgão emissor SSP, UF do órgão emissor RJ, CPF n° 123.321.456-87 , nacionalidade brasileira, estado civil casado, profissão mecânico, residente na rua do império, n° 598, complemento, CEP: 23541-012, bairro Flores, cidade Rio de Janeiro, UF RJ, e-mail: joao.silva@test.com, DECLARO SER ISENTO(A) da apresentação da Declaração do Imposto de Renda Pessoa Física (DIRPF) no(s) exercício(s) 2024 por não incorrer em nenhuma das hipóteses de obrigatoriedade estabelecidas pelas Instruções Normativas (IN) da Receita Federal do Brasil (RFB).
                Esta declaração está em conformidade com a IN RFB n° 1548/2015 e a Lei n° 7.115/83. Declaro ainda, sob as penas da lei, serem verdadeiras todas as informações acima prestadas.</p>
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
