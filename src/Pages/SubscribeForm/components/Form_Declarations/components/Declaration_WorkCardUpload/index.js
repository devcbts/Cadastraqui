import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import useAuth from 'hooks/useAuth';
import uploadService from 'services/upload/uploadService';
import { NotificationService } from 'services/notification';
import { useRecoilState } from 'recoil';
import declarationAtom from '../../atoms/declarationAtom';
import candidateService from 'services/candidate/candidateService';

export default function Declaration_WorkCardUpload({ onBack, onSave }) {
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);
    const [file, setFile] = useState(null)
    const { auth } = useAuth()

    // useEffect(() => {
    //     const savedData = localStorage.getItem('declarationData');
    //     if (savedData) {
    //         setDeclarationData(JSON.parse(savedData));
    //     }
    // }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files?.[0]);
    };

    const handleSave = () => {
        if (file) {
            // Logic to save the file
            onSave();
        } else {
            alert('Por favor, selecione um arquivo antes de salvar.');
        }
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }
    const handleSubmitDocument = async () => {
        if (!file) {
            return onSave()
        }
        try {
            const formData = new FormData()
            formData.append("file_carteira-de-trabalho", file)
            await uploadService.uploadBySectionAndId({ section: 'declaracoes', id: declarationData.id }, formData)
            candidateService.deleteDeclaration({ userId: declarationData.id, type: 'WorkCard' }).catch(err => { })
            NotificationService.success({ text: 'Documento enviado' }).then((_) => onSave())
        } catch (err) {
            NotificationService.error({ text: 'Erro ao enviar documento. Tente novamente' })

        }
    }
    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO QUE INTEGRANTE DO GRUPO FAMILIAR POSSUI CARTEIRA DE TRABALHO</h2>
            <h3>{declarationData.name}</h3>
            <p>Relatório digital da Carteira de Trabalho e Previdência Social contendo todos os dados pessoais e todos os contratos de trabalho</p>
            <div className={commonStyles.fileUpload}>
                <label htmlFor="fileUpload">Anexar arquivo</label>
                <input type="file" id="fileUpload" onChange={handleFileChange} accept='application/pdf' />
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleSubmitDocument}
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
