import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import { NotificationService } from 'services/notification';
import uploadService from 'services/upload/uploadService';
import useAuth from 'hooks/useAuth';

export default function Declaration_IncomeTaxExemption({ onBack, onSave }) {
    const [confirmation, setConfirmation] = useState(null);
    const [year, setYear] = useState('');
    const [file, setFile] = useState(null);
    const [declarationData, setDeclarationData] = useState(null);
    const { auth } = useAuth()
    useEffect(() => {
        const savedData = localStorage.getItem('declarationData');
        if (savedData) {
            setDeclarationData(JSON.parse(savedData));
        }
    }, []);

    const handleSave = async () => {
        if (confirmation !== null) {
            if (confirmation === 'sim') {
                onSave('sim');
            } else if (confirmation === 'nao' && year && file) {
                try {

                    const formData = new FormData()
                    formData.append("file_IR", file)
                    await uploadService.uploadBySectionAndId({ section: 'declaracoes', id: auth?.uid }, formData)
                    localStorage.setItem('incomeTaxDetails', JSON.stringify({ year, file: file.name }));
                    NotificationService.success({ text: 'Documento enviado' }).then(_ => {

                        onSave('nao');
                    }
                    )
                } catch (err) {

                }
            }
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files?.[0]);
    };

    const isSaveDisabled = () => {
        if (confirmation === 'nao') {
            return !year || !file;
        }
        return confirmation === null;
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO DE ISENTO DE IMPOSTO DE RENDA</h2>
            <h3>{declarationData.fullName}</h3>
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
                            accept='application/pdf'
                        />
                    </div>
                </>
            )}
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleSave}
                    disabled={isSaveDisabled()}
                    style={{
                        borderColor: isSaveDisabled() ? '#ccc' : '#1F4B73',
                        cursor: isSaveDisabled() ? 'not-allowed' : 'pointer',
                        opacity: isSaveDisabled() ? 0.6 : 1
                    }}
                />
            </div>
        </div>
    );
}
