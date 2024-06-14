import React, { useState, useEffect } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_SeparationConfirmation({ onBack, onNext }) {
    const [separationDetails, setSeparationDetails] = useState(null);
    const [addressDetails, setAddressDetails] = useState(null);
    const [declarationData, setDeclarationData] = useState(null);
    const [confirmation, setConfirmation] = useState(null);

    useEffect(() => {
        const savedSeparationDetails = localStorage.getItem('separationDetails');
        if (savedSeparationDetails) {
            setSeparationDetails(JSON.parse(savedSeparationDetails));
        }

        const savedAddressDetails = localStorage.getItem('addressDetails');
        if (savedAddressDetails) {
            setAddressDetails(JSON.parse(savedAddressDetails));
        }

        const savedDeclarationData = localStorage.getItem('declarationData');
        if (savedDeclarationData) {
            setDeclarationData(JSON.parse(savedDeclarationData));
        }
    }, []);

    const handleSave = () => {
        if (confirmation !== null) {
            onNext(confirmation === 'sim');
        }
    };

    if (!separationDetails || !addressDetails || !declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO DE SEPARAÇÃO DE FATO (NÃO JUDICIAL)</h2>
            <h3>{declarationData.fullName} - usuário do Cadastraqui</h3>
            <div className={commonStyles.declarationContent}>
                <p>
                    Me separei de <strong>{separationDetails.personName}</strong>, inscrito(a) no CPF nº <strong>{separationDetails.personCpf}</strong>, desde <strong>{separationDetails.separationDate}</strong>.
                    Meu(minha) ex-companheiro(a) reside na <strong>{addressDetails.address}</strong>, nº <strong>{addressDetails.number}</strong>, complemento <strong>{addressDetails.complement}</strong>, CEP: <strong>{addressDetails.cep}</strong>, bairro <strong>{addressDetails.neighborhood}</strong>, cidade <strong>{addressDetails.city}</strong>, UF <strong>{addressDetails.uf}</strong>.
                    Até o presente momento não formalizei o encerramento de nossa relação por meio de divórcio.
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
