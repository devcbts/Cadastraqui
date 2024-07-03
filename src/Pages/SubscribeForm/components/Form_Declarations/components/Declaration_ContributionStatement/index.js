import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto

export default function Declaration_ContributionStatement({ onBack, onSave }) {
    const [declarationData, setDeclarationData] = useState(null);
    const [file, setFile] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem('declarationData');
        if (savedData) {
            setDeclarationData(JSON.parse(savedData));
        }
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSave = () => {
        if (file) {
            
            onSave();
        } else {
            alert('Por favor, selecione um arquivo antes de salvar.');
        }
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h3>{declarationData.fullName}</h3>
            <div className={commonStyles.declarationContent}>
                <p>Anexar o Extrato de Contribuição (CNIS).</p>
                <div className={commonStyles.fileUpload}>
                    <label htmlFor="fileUpload">Anexar arquivo</label>
                    <input type="file" id="fileUpload" onChange={handleFileChange} />
                </div>
                <p>Não possui ainda o seu extrato de contribuição (CNIS)?</p>
                <ButtonBase label="Gerar Relatório" />
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleSave}
                    disabled={!file}
                    style={{
                        borderColor: !file ? '#ccc' : '#1F4B73',
                        cursor: !file ? 'not-allowed' : 'pointer',
                        opacity: !file ? 0.6 : 1
                    }}
                />
            </div>
        </div>
    );
}
