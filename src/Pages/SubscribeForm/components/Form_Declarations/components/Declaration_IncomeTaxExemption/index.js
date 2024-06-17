import React, { useState, useEffect } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_IncomeTaxExemption({ onBack, onSave }) {
    const [confirmation, setConfirmation] = useState(null);
    const [year, setYear] = useState('');
    const [file, setFile] = useState(null);
    const [declarationData, setDeclarationData] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem('declarationData');
        if (savedData) {
            setDeclarationData(JSON.parse(savedData));
        }
    }, []);

    const handleSave = () => {
        if (confirmation !== null) {
            if (confirmation === 'sim') {
                onSave('sim');
            } else if (confirmation === 'nao' && year && file) {
                localStorage.setItem('incomeTaxDetails', JSON.stringify({ year, file: file.name }));
                onSave('nao');
            }
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO DE ISENTO DE IMPOSTO DE RENDA</h2>
            <h3>{declarationData.fullName} - usuário do Cadastraqui</h3>
            <p>Você é isento(a) de Imposto de Renda?</p>
            <div className={commonStyles.radioGroup}>
                <label>
                    <input type="radio" name="incomeTaxExemption" value="sim" onChange={() => setConfirmation('sim')} /> Sim
                </label>
                <label>
                    <input type="radio" name="incomeTaxExemption" value="nao" onChange={() => setConfirmation('nao')} /> Não
                </label>
            </div>
            {confirmation === 'nao' && (
                <>
                    <div className={commonStyles.inputGroup}>
                        <label htmlFor="year">Exercício</label>
                        <input
                            type="text"
                            id="year"
                            name="year"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            placeholder="Selecione o ano"
                        />
                    </div>
                    <div className={commonStyles.inputGroup}>
                        <label htmlFor="fileUpload">Última Declaração Completa de imposto de renda e Recibo</label>
                        <input
                            type="file"
                            id="fileUpload"
                            name="fileUpload"
                            onChange={handleFileChange}
                        />
                    </div>
                </>
            )}
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase label="Salvar" onClick={handleSave} />
            </div>
        </div>
    );
}
