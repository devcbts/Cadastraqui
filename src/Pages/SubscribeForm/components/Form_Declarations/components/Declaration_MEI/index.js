import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import FormCheckbox from 'Components/FormCheckbox';
import FormFilePicker from 'Components/FormFilePicker';
import useControlForm from 'hooks/useControlForm';
import { useRecoilState } from 'recoil';
import candidateService from 'services/candidate/candidateService';
import { NotificationService } from 'services/notification';
import uploadService from 'services/upload/uploadService';
import declarationAtom from '../../atoms/declarationAtom';
import commonStyles from '../../styles.module.scss';
import declarationMeiSchema from './declaration-mei-schema';

export default function Declaration_MEI({ onBack, onNext }) {
    // const [mei, setMei] = useState(null);
    // const [file, setFile] = useState(null);
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);
    const { control, getValues, formState: { isValid }, trigger, watch } = useControlForm({
        schema: declarationMeiSchema,
        defaultValues: {
            mei: null,
            file: null
        },
        initialData: declarationData?.mei
    })
    const mei = watch("mei")
    // useEffect(() => {
    //     if (declarationData.mei) {
    //         setMei(declarationData.mei)
    //     }

    // }, []);
    // const { auth } = useAuth()
    const handleSave = async () => {
        if (!isValid) {
            trigger()
            return
        }
        setDeclarationData((prev) => ({ ...prev, mei }))
        if (mei) {
            try {
                const formData = new FormData()
                const file = getValues('file')
                formData.append("file_MEI", file)
                await uploadService.uploadBySectionAndId({ section: 'declaracoes', id: declarationData.id }, formData)
                // localStorage.setItem('meiDetails', JSON.stringify({ file: file.name }));
                NotificationService.success({ text: 'Documento enviado' }).then(_ => onNext(mei))
            } catch (err) {

            }
        }
        if (!mei) {
            candidateService.deleteDeclaration({
                userId: declarationData.id, type: 'MEI', text: `
                Eu, ${declarationData.name}, inscrito(a) no CPF ${declarationData.CPF}, declaro não possuir cadastro de microempreendedor individual (MEI).
                `  }).catch(err => { })
            onNext(mei)
        }
    };

    // const handleFileChange = (e) => {
    //     setFile(e.target.files?.[0]);
    // };

    // const isSaveDisabled = () => {
    //     if (mei) {
    //         return !file;
    //     }
    //     return mei === null;
    // };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h2 className={commonStyles.declarationFormTitle}>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h2>
            <h3 className={commonStyles.declarationFormSubTitle}>DECLARAÇÃO DE RENDIMENTOS - MEI</h3>
            <h3 className={commonStyles.declarationFormNameTitle}>{declarationData.name}</h3>
            <FormCheckbox
                control={control}
                name={"mei"}
                label={'Você possui o cadastro de Microempreendedor Individual?'}
                value={mei}
            />

            {mei && (
                <FormFilePicker
                    label={'Anexar Declaração Anual do Simples Nacional para o(a) Microempreendedor(a) Individual (DAS-SIMEI)'}
                    accept={'application/pdf'}
                    control={control}
                    name={'file'}

                />
            )}
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleSave}
                // disabled={isSaveDisabled()}
                // style={{
                //     borderColor: isSaveDisabled() ? '#ccc' : '#1F4B73',
                //     cursor: isSaveDisabled() ? 'not-allowed' : 'pointer',
                //     opacity: isSaveDisabled() ? 0.6 : 1
                // }}
                />
            </div>
        </div>
    );
}
