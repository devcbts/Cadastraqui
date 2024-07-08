import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import { NotificationService } from 'services/notification';
import uploadService from 'services/upload/uploadService';
import useAuth from 'hooks/useAuth';
import { useRecoilState } from 'recoil';
import declarationAtom from '../../atoms/declarationAtom';

export default function Declaration_IncomeTaxExemption({ onBack, onSave }) {
    const [confirmation, setConfirmation] = useState(null);
    const [year, setYear] = useState('');
    const [file, setFile] = useState(null);
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);
    const { auth } = useAuth()
    useEffect(() => {
        if (declarationData.incomeTaxDetails) {
            const { year, confirmation } = declarationData.incomeTaxDetails
            setYear(year ?? '')
            setConfirmation(confirmation)
        }

    }, []);

    const handleSave = async () => {
        if (confirmation !== null) {
            if (confirmation) {
                setDeclarationData((prev) => ({ ...prev, incomeTaxDetails: { confirmation } }))
                onSave(true);
            } else if (!confirmation && year && file) {
                try {
                    setDeclarationData((prev) => ({ ...prev, incomeTaxDetails: { year, confirmation } }))
                    const formData = new FormData()
                    formData.append("file_IR", file)
                    await uploadService.uploadBySectionAndId({ section: 'declaracoes', id: auth?.uid }, formData)
                    localStorage.setItem('incomeTaxDetails', JSON.stringify({ year, file: file.name }));
                    NotificationService.success({ text: 'Documento enviado' }).then(_ => {
                        onSave(false);
                    }
                    )
                } catch (err) {
                    console.log(err)
                }
            }
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files?.[0]);
    };

    const isSaveDisabled = () => {
        if (!confirmation) {
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
            <h3>{declarationData.name}</h3>
            <p>Você é isento(a) de Imposto de Renda?</p>
            <div className={commonStyles.radioGroup}>
                <label>
                    <input type="radio" name="incomeTaxExemption" value="sim" onChange={() => setConfirmation(true)} checked={confirmation} /> Sim
                </label>
                <label>
                    <input type="radio" name="incomeTaxExemption" value="nao" onChange={() => setConfirmation(false)} checked={confirmation === false} /> Não
                </label>
            </div>
            {confirmation === false && (
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
