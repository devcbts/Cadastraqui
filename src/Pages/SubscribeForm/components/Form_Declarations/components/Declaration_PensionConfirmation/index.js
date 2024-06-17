import React, { useState, useEffect } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_PensionConfirmation({ onBack, onNext }) {
    const [hasAddressProof, setHasAddressProof] = useState(null);
    const [pensionData, setPensionData] = useState(null);
    const [declarationData, setDeclarationData] = useState(null);

    useEffect(() => {
        const pensionData = localStorage.getItem('pensionData');
        if (pensionData) {
            setPensionData(JSON.parse(pensionData));
        }
        const declarationData = localStorage.getItem('declarationData');
        if (declarationData) {
            setDeclarationData(JSON.parse(declarationData));
        }
    }, []);

    const handleSave = () => {
        if (hasAddressProof !== null) {
            onNext(hasAddressProof === 'sim');
        }
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>Recebimento ou ausência de recebimento de pensão alimentícia</h2>
            <h3>{declarationData.fullName} - usuário do Cadastraqui</h3>
            <div className={commonStyles.declarationContent}>
                {pensionData && pensionData.receivesPension ? (
                    <>
                        <p>A. Recebo pensão alimentícia (judicial) no valor total de R$ {pensionData.amount}, inscrito(a) no CPF nº {pensionData.payerCpf}.</p>
                        <p>B. Meu(s) filho(s) DADOS VEM DO FORM DA PENSÃO ALIMENTÍCIA_LETRA B (CADA FILHO DECLARADO ENTRA NESSA INFORMAÇÃO), Carlos da Silva e Fulana da Silva recebem() pensão alimentícia (judicial) no valor total de R$ DADOS VEM DO FORM DA PENSÃO ALIMENTÍCIA_LETRA B, inscrito(s) no CPF nº DADOS VEM DO FORM DA PENSÃO ALIMENTÍCIA_LETRA B.</p>
                        <p>C. Meu(s) filho(s) DADOS VEM DO FORM DA PENSÃO ALIMENTÍCIA_LETRA C1 (CADA FILHO DECLARADO ENTRA NESSA INFORMAÇÃO), recebem() pensão alimentícia (judicial) no valor total de R$ DADOS VEM DO FORM DA PENSÃO ALIMENTÍCIA_LETRA C1, inscrito(s) no CPF nº DADOS VEM DO FORM DA PENSÃO ALIMENTÍCIA_LETRA C1 (utilizar caso um mais filhos recebam pensão de pessoas diferentes).</p>
                        <p>D. Meu(s) filho(s) DADOS VEM DO FORM DA PENSÃO ALIMENTÍCIA_LETRA C2 (CADA FILHO DECLARADO ENTRA NESSA INFORMAÇÃO), recebem() pensão alimentícia (judicial) no valor total de R$ DADOS VEM DO FORM DA PENSÃO ALIMENTÍCIA_LETRA C2, inscrito(s) no CPF nº DADOS VEM DO FORM DA PENSÃO ALIMENTÍCIA_LETRA C2 (utilizar caso um mais filhos recebam pensão de pessoas diferentes).</p>
                    </>
                ) : (
                    <p>Não recebo pensão alimentícia.</p>
                )}
                <p>Confirma a declaração?</p>
                <div className={commonStyles.radioButtons}>
                    <label>
                        <input type="radio" name="confirmation" value="sim" onChange={() => setHasAddressProof('sim')} /> Sim
                    </label>
                    <label>
                        <input type="radio" name="confirmation" value="nao" onChange={() => setHasAddressProof('nao')} /> Não
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
