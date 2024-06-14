import React, { useState, useEffect } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_AddressProof({ onBack, onNext }) {
    const [hasAddressProof, setHasAddressProof] = useState(null);
    const [declarationData, setDeclarationData] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem('declarationData');
        if (savedData) {
            setDeclarationData(JSON.parse(savedData));
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
            <h2>DECLARAÇÃO DE AUSÊNCIA DE COMPROVANTE DE ENDEREÇO EM NOME</h2>
            <h3>{declarationData.fullName} - usuário do Cadastraqui</h3>
            <p>Você possui comprovante de endereço em seu nome?</p>
            <div className={commonStyles.radioButtons}>
                <label>
                    <input type="radio" name="confirmation" value="sim" onChange={() => setHasAddressProof('sim')} /> Sim
                </label>
                <label>
                    <input type="radio" name="confirmation" value="nao" onChange={() => setHasAddressProof('nao')} /> Não
                </label>
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase label="Salvar" onClick={handleSave} />
            </div>
        </div>
    );
}
