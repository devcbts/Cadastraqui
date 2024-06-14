import React, { useState, useEffect } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_IncomeTaxExemptionConfirmation({ onBack, onNext }) {
    const [confirmation, setConfirmation] = useState(null);
    const [incomeTaxDetails, setIncomeTaxDetails] = useState(null);
    const [declarationData, setDeclarationData] = useState({});

    useEffect(() => {
        const savedDetails = localStorage.getItem('incomeTaxDetails');
        if (savedDetails) {
            setIncomeTaxDetails(JSON.parse(savedDetails));
        }
        const savedDeclarationData = localStorage.getItem('declarationData');
        if (savedDeclarationData) {
            setDeclarationData(JSON.parse(savedDeclarationData));
        }
    }, []);

    const handleSave = () => {
        if (confirmation !== null) {
            onNext();
        }
    };

    if (!incomeTaxDetails) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO DE ISENTO DE IMPOSTO DE RENDA</h2>
            <h3>{declarationData.fullName} - usuário do Cadastraqui</h3>
            <div className={commonStyles.declarationContent}>
                <p>
                    Eu, <b>{declarationData.fullName}</b>, portador(a) da cédula de identidade RG n° <b>{declarationData.RG}</b>, órgão emissor <b>{declarationData.rgIssuingAuthority}</b>, UF do órgão emissor <b>{declarationData.rgIssuingState}</b>, CPF n° <b>{declarationData.CPF}</b>, nacionalidade <b>{declarationData.nationality}</b>, estado civil <b>{declarationData.maritalStatus}</b>, profissão <b>{declarationData.profession}</b>, residente na rua <b>{declarationData.address}</b>, n° <b>{declarationData.addressNumber}</b>, complemento <b>{declarationData.complement}</b>, CEP: <b>{declarationData.CEP}</b>, bairro <b>{declarationData.neighborhood}</b>, cidade <b>{declarationData.city}</b>, UF <b>{declarationData.UF}</b>, e-mail: <b>{declarationData.email}</b>, DECLARO SER ISENTO(A) da apresentação da Declaração do Imposto de Renda Pessoa Física (DIRPF) no(s) exercício(s) <b>{incomeTaxDetails.year}</b> por não incorrer em nenhuma das hipóteses de obrigatoriedade estabelecidas pelas Instruções Normativas (IN) da Receita Federal do Brasil (RFB). Esta declaração está em conformidade com a IN RFB n° 1548/2015 e a Lei n° 7.115/83. Declaro ainda, sob as penas da lei, serem verdadeiras todas as informações acima prestadas.
                </p>
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
