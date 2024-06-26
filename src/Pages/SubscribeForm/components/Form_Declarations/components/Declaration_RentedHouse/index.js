import React, { useState, useEffect } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_RentedHouse({ onBack, onNext }) {
    const [rentedHouse, setRentedHouse] = useState(null);
    const [declarationData, setDeclarationData] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem('declarationData');
        if (savedData) {
            setDeclarationData(JSON.parse(savedData));
        }
    }, []);

    const handleSave = () => {
        if (rentedHouse !== null) {
            onNext(rentedHouse === 'sim');
        }
    };

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO DE IMÓVEL ALUGADO - SEM CONTRATO DE ALUGUEL</h2>
            <h3>{declarationData?.fullName} - usuário do Cadastraqui</h3>
            <p>Você mora em imóvel alugado sem contrato de aluguel?</p>
            <div className={commonStyles.radioButtons}>
                <label>
                    <input type="radio" name="rentedHouse" value="sim" onChange={() => setRentedHouse('sim')} /> Sim
                </label>
                <label>
                    <input type="radio" name="rentedHouse" value="nao" onChange={() => setRentedHouse('nao')} /> Não
                </label>
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase label="Salvar" onClick={handleSave} />
                <ButtonBase onClick={handleSave}><Arrow width="40px" /></ButtonBase>
            </div>
        </div>
    );
}
