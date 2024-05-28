import React, { useState } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_MEI({ onBack, onNext }) {
    const [mei, setMei] = useState(null);
    const [file, setFile] = useState(null);

    const handleSave = () => {
        if (mei !== null) {
            onNext();
        }
    };

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO DE RENDIMENTOS - MEI</h2>
            <h3>João da Silva - usuário do Cadastraqui</h3>
            <p>Você possui o cadastro de Microempreendedor Individual?</p>
            <div className={commonStyles.radioGroup}>
                <label>
                    <input type="radio" name="mei" value="sim" onChange={() => setMei('sim')} /> Sim
                </label>
                <label>
                    <input type="radio" name="mei" value="nao" onChange={() => setMei('nao')} /> Não
                </label>
            </div>
            {mei === 'sim' && (
                <>
                    <p>Anexar Declaração Anual do Simples Nacional para o(a) Microempreendedor(a) Individual (DAS-SIMEI).</p>
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                    <p>Não possui ainda o seu extrato de contribuição (CNIS)?</p>
                    <ButtonBase label="Gerar Relatório" onClick={() => window.open('https://www.gov.br/pt-br/servicos/obter-a-carteira-de-trabalho')} />
                </>
            )}
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase label="Salvar" onClick={handleSave} />
                <ButtonBase onClick={handleSave}><Arrow width="40px" /></ButtonBase>
            </div>
        </div>
    );
}
