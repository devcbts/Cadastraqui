import React, { useState } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_WorkCardConfirmation({ onBack, onNext }) {
    const [confirmation, setConfirmation] = useState(null);

    const handleSave = () => {
        if (confirmation !== null) {
            onNext(confirmation === 'sim');
        }
    };

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO QUE INTEGRANTE DO GRUPO FAMILIAR AINDA NÃO POSSUI CARTEIRA DE TRABALHO</h2>
            <h3>João da Silva - usuário do Cadastraqui</h3>
            <div className={commonStyles.declarationContent}>
                <p>Maria da Silva até o presente momento não possui(em) Carteira de Trabalho e Previdência Social – CTPS e estou ciente de que a Carteira de Trabalho e Previdência Social (CTPS) é o documento que registra a vida profissional do trabalhador e garante o acesso aos direitos trabalhistas previstos em lei. Neste momento tomo ciência de que a carteira de trabalho atualmente é emitida de forma prioritária no formato digital e excepcionalmente no formato físico (fonte: <a href="https://www.gov.br/pt-br/servicos/obter-a-carteira-de-trabalho">https://www.gov.br/pt-br/servicos/obter-a-carteira-de-trabalho</a>).</p>
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
