import React, { useState, useEffect } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_WorkCard({ onBack, onNext }) {
    const [hasWorkCard, setHasWorkCard] = useState(null);
    const [declarationData, setDeclarationData] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem('declarationData');
        if (savedData) {
            setDeclarationData(JSON.parse(savedData));
        }
    }, []);

    const handleSave = () => {
        if (hasWorkCard !== null) {
            onNext(hasWorkCard === 'sim');
        }
    };

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h3>{declarationData?.fullName} - usuário do Cadastraqui</h3>
            <p>Você possui Carteira de trabalho? (a partir de 16 anos)</p>
            <div className={commonStyles.radioGroup}>
                <label>
                    <input type="radio" name="workCard" value="sim" onChange={() => setHasWorkCard('sim')} /> Sim
                </label>
                <label>
                    <input type="radio" name="workCard" value="nao" onChange={() => setHasWorkCard('nao')} /> Não
                </label>
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase label="Salvar" onClick={handleSave} />
            </div>
        </div>
    );
}
