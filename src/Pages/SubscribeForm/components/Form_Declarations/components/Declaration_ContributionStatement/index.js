import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import { Link } from 'react-router-dom';
import { NotificationService } from 'services/notification';
import candidateService from 'services/candidate/candidateService';
import uploadService from 'services/upload/uploadService';
import useAuth from 'hooks/useAuth';
import { useRecoilState } from 'recoil';
import declarationAtom from '../../atoms/declarationAtom';
import FormFilePicker from 'Components/FormFilePicker';
import useControlForm from 'hooks/useControlForm';
import { z } from 'zod';

export default function Declaration_ContributionStatement({ onBack, onSave }) {
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);
    // const [file, setFile] = useState(null)
    const { control, getValues, formState: { isValid }, trigger } = useControlForm({
        schema: z.object({ file: z.instanceof(File, 'Arquivo obrigatório') }),
        defaultValues: {
            file: null
        }
    })
    // useEffect(() => {
    //     const savedData = localStorage.getItem('declarationData');
    //     if (savedData) {
    //         setDeclarationData(JSON.parse(savedData));
    //     }
    // }, []);

    // const { auth } = useAuth()
    // const handleFileChange = (e) => {
    //     setFile(e.target.files?.[0]);
    // };



    if (!declarationData) {
        return <p>Carregando...</p>;
    }
    const handleSubmitDocument = async () => {
        if (!isValid) {
            trigger()
            return
        }
        try {
            const file = getValues("file")
            const formData = new FormData()
            formData.append("file_CNIS", file)
            await uploadService.uploadBySectionAndId({ section: 'declaracoes', id: declarationData.id }, formData)
            NotificationService.success({ text: 'Documento enviado' }).then((_) => onSave())
        } catch (err) {
            NotificationService.success({ text: 'Erro ao enviar documento. Tente novamente' })

        }
    }
    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h3>{declarationData.name}</h3>
            <div className={commonStyles.declarationContent}>
                <FormFilePicker label={'Anexar extrato de contribuição (CNIS)'} control={control} name={"file"} accept={'application/pdf'} />
                {/* <p>Anexar o Extrato de Contribuição (CNIS).</p> */}
                {/* <div className={commonStyles.fileUpload}>
                    <label htmlFor="fileUpload">Anexar arquivo</label>
                    <input type="file" id="fileUpload" onChange={handleFileChange} accept='application/pdf' />
                </div> */}
                <h4>Não possui ainda o seu extrato de contribuição (CNIS)?</h4>
                <Link target='_blank' to={'https://www.gov.br/pt-br/servicos/emitir-extrato-de-contribuicao-cnis'}>
                    <ButtonBase label="Gerar Relatório" />
                </Link>
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleSubmitDocument}

                />
            </div>
        </div>
    );
}
