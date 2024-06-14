import React, { useState, useEffect } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_MEI({ onBack, onNext }) {
    const [mei, setMei] = useState(null);
    const [file, setFile] = useState(null);
    const [declarationData, setDeclarationData] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem('declarationData');
        if (savedData) {
            setDeclarationData(JSON.parse(savedData));
        }
    }, []);

    const handleSave = () => {
        if (mei !== null && (mei === 'sim' ? file : true)) {
            if (mei === 'sim' && file) {
                localStorage.setItem('meiDetails', JSON.stringify({ file: file.name }));
            }
            onNext(mei);
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
            <h2>DECLARAÇÃO DE RENDIMENTOS - MEI</h2>
            <h3>{declarationData.fullName} - usuário do Cadastraqui</h3>
            <p>Você possui o cadastro de Microempreendedor Individual?</p>
            <div className={commonStyles.radioGroup}>
                <label>
                    <input type="radio" name="mei" value="sim" onChange={() => setMei('sim')} /> Sim
                </label>
                <label>
                    <input type="radio" name="mei" value="nao" onChange={() => setMei('nao')} /> Não
                </label>
            </div>
            {mei === 'sim' && (
                <>
                    <p>Anexar Declaração Anual do Simples Nacional para o(a) Microempreendedor(a) Individual (DAS-SIMEI).</p>
                    <input type="file" onChange={handleFileChange} />
                </>
            )}
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase label="Salvar" onClick={handleSave} />
            </div>
        </div>
    );
}
