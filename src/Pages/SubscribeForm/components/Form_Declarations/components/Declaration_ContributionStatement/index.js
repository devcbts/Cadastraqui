import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import FormFilePicker from 'Components/FormFilePicker';
import useControlForm from 'hooks/useControlForm';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { NotificationService } from 'services/notification';
import uploadService from 'services/upload/uploadService';
import { z } from 'zod';
import declarationAtom from '../../atoms/declarationAtom';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto

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
            NotificationService.error({ text: 'Erro ao enviar documento. Tente novamente' })

        }
    }
    return (
        <div className={commonStyles.declarationForm}>
            <h2 className={commonStyles.declarationFormTitle}>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h2>
            <h3 className={commonStyles.declarationFormNameTitle}>{declarationData.name}</h3>
            <div className={commonStyles.declarationContent}>
                <h4>Não possui ainda o seu extrato de contribuição (CNIS)?</h4>
                <Link
                    target='_blank'
                    to={'https://www.gov.br/pt-br/servicos/emitir-extrato-de-contribuicao-cnis'}
                    className={commonStyles.LinkGerarRelatorio}
                >
                    <ButtonBase label="Gerar Relatório" />
                </Link>
                <div className={commonStyles.formFilePicker}>
                    <FormFilePicker
                        label={'Anexar extrato de contribuição (CNIS)'}
                        control={control}
                        name={"file"}
                        accept={'application/pdf'}

                    />
                </div>
                <h6 className={commonStyles.aviso}>*Tamanho máximo de 10Mb</h6>
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleSubmitDocument}

                />
            </div>
        </div>
    );
}
