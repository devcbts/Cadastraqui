import React, { useState, useEffect } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_SeparationStatus({ onBack, onNext }) {
    const [confirmation, setConfirmation] = useState(null);
    const [personDetails, setPersonDetails] = useState({
        personName: '',
        personCpf: '',
        separationDate: '',
        knowsCurrentAddress: null,
    });
    const [declarationData, setDeclarationData] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem('declarationData');
        if (savedData) {
            setDeclarationData(JSON.parse(savedData));
        }
    }, []);

    const handleSave = () => {
        if (confirmation !== null) {
            localStorage.setItem('separationDetails', JSON.stringify(personDetails));
            onNext(confirmation === 'sim' && personDetails.knowsCurrentAddress === 'sim');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPersonDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO DE SEPARAÇÃO DE FATO (NÃO JUDICIAL)</h2>
            <h3>{declarationData.fullName} - usuário do Cadastraqui</h3>
            <p>Você é separado de fato, porém ainda não formalizou o encerramento por meio do divórcio?</p>
            <div className={commonStyles.radioGroup}>
                <label>
                    <input type="radio" name="confirmation" value="sim" onChange={() => setConfirmation('sim')} /> Sim
                </label>
                <label>
                    <input type="radio" name="confirmation" value="nao" onChange={() => setConfirmation('nao')} /> Não
                </label>
            </div>
            {confirmation === 'sim' && (
                <div className={commonStyles.additionalFields}>
                    <div className={commonStyles.inputGroup}>
                        <label>Nome da pessoa</label>
                        <input
                            type="text"
                            name="personName"
                            value={personDetails.personName}
                            onChange={handleInputChange}
                            placeholder="Fulana de tal"
                        />
                    </div>
                    <div className={commonStyles.inputGroup}>
                        <label>CPF da pessoa</label>
                        <input
                            type="text"
                            name="personCpf"
                            value={personDetails.personCpf}
                            onChange={handleInputChange}
                            placeholder="652.954.652-78"
                        />
                    </div>
                    <div className={commonStyles.inputGroup}>
                        <label>Data da separação</label>
                        <input
                            type="date"
                            name="separationDate"
                            value={personDetails.separationDate}
                            onChange={handleInputChange}
                        />
                    </div>
                    <p>Sabe onde essa pessoa mora atualmente?</p>
                    <div className={commonStyles.radioGroup}>
                        <label>
                            <input type="radio" name="knowsCurrentAddress" value="sim" onChange={handleInputChange} /> Sim
                        </label>
                        <label>
                            <input type="radio" name="knowsCurrentAddress" value="nao" onChange={handleInputChange} /> Não
                        </label>
                    </div>
                </div>
            )}
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase label="Salvar" onClick={handleSave} />
            </div>
        </div>
    );
}
