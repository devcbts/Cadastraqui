import React, { useState, useEffect } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_RentConfirmation({ onBack, onNext }) {
    const [rentDetails, setRentDetails] = useState(null);
    const [confirmation, setConfirmation] = useState(null);
    const [declarationData, setDeclarationData] = useState(null);

    useEffect(() => {
        const savedRentDetails = localStorage.getItem('rentDetails');
        if (savedRentDetails) {
            setRentDetails(JSON.parse(savedRentDetails));
        }
        const savedDeclarationData = localStorage.getItem('declarationData');
        if (savedDeclarationData) {
            setDeclarationData(JSON.parse(savedDeclarationData));
        }
    }, []);

    const handleSave = () => {
        if (confirmation === 'sim') {
            onNext();
        }
    };

    if (!rentDetails || !declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO DE IMÓVEL ALUGADO - SEM CONTRATO DE ALUGUEL</h2>
            <h3>{declarationData.fullName} - usuário do Cadastraqui</h3>
            <div className={commonStyles.declarationContent}>
                <p>
                    Resido em imóvel alugado e não possuo contrato de aluguel, pois se trata de acordo verbal/informal, ao qual pago o valor de 
                    <span> R$ {rentDetails.rentValue} </span> 
                    por mês de aluguel para 
                    <span> {rentDetails.landlordName} </span>, 
                    inscrito no CPF nº 
                    <span> {rentDetails.landlordCpf} </span>.
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
