import React, { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_ChildSupportDetails({ onBack, onNext }) {
    const [declarationData, setDeclarationData] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem('declarationData');
        if (savedData) {
            setDeclarationData(JSON.parse(savedData));
        }
    }, []);

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>RECEBIMENTO OU AUSÊNCIA DE RECEBIMENTO DE PENSÃO ALIMENTÍCIA</h2>
            <h3>{declarationData.fullName} - usuário do Cadastraqui</h3>
            <div className={commonStyles.declarationContent}>
                <label htmlFor="numberOfParents">C - De quantos?</label>
                <input type="number" id="numberOfParents" name="numberOfParents" placeholder="2" />
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase label="Salvar" onClick={onNext} />
                <ButtonBase onClick={onNext}><Arrow width="40px" /></ButtonBase>
            </div>
        </div>
    );
}
