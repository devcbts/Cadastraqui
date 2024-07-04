import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import useAuth from 'hooks/useAuth';
import uploadService from 'services/upload/uploadService';
import { NotificationService } from 'services/notification';

export default function Declaration_WorkCardUpload({ onBack, onSave }) {
    const [declarationData, setDeclarationData] = useState(null);
    const [file, setFile] = useState(null)
    const { auth } = useAuth()
    useEffect(() => {
        const savedData = localStorage.getItem('declarationData');
        if (savedData) {
            setDeclarationData(JSON.parse(savedData));
        }
    }, []);

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
            await uploadService.uploadBySectionAndId({ section: 'declaracoes', id: auth?.uid }, formData)
            NotificationService.success({ text: 'Documento enviado' }).then((_) => onSave())
        } catch (err) {
            NotificationService.success({ text: 'Erro ao enviar documento. Tente novamente' })

        }
    }
    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO QUE INTEGRANTE DO GRUPO FAMILIAR AINDA NÃO POSSUI CARTEIRA DE TRABALHO</h2>
            <h3>{declarationData.fullName}</h3>
            <p>Relatório digital da Carteira de Trabalho e Previdência Social contendo todos os dados pessoais e todos os contratos de trabalho</p>
            <div className={commonStyles.fileUpload}>
                <label htmlFor="fileUpload">Anexar arquivo</label>
                <input type="file" id="fileUpload" onChange={(e) => setFile(e.target.files?.[0])} accept='application/pdf' />
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase label="Salvar" onClick={handleSubmitDocument} />
            </div>
        </div>
    );
}
