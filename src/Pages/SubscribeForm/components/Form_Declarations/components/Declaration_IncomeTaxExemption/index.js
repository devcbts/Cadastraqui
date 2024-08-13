import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import FormCheckbox from 'Components/FormCheckbox';
import FormFilePicker from 'Components/FormFilePicker';
import InputForm from 'Components/InputForm';
import useControlForm from 'hooks/useControlForm';
import { useRecoilState } from 'recoil';
import candidateService from 'services/candidate/candidateService';
import { NotificationService } from 'services/notification';
import uploadService from 'services/upload/uploadService';
import declarationAtom from '../../atoms/declarationAtom';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import incomeTaxSchema from './income-tax-schema';

export default function Declaration_IncomeTaxExemption({ onBack, onSave }) {
    // const [confirmation, setConfirmation] = useState(null);
    // const [year, setYear] = useState('');
    // const [file, setFile] = useState(null);
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);
    // const { auth } = useAuth()
    const { control, getValues, formState: { isValid }, trigger, watch } = useControlForm({
        schema: incomeTaxSchema,
        defaultValues: {
            confirmation: null,
            file: null,
            year: ''
        },
        initialData: declarationData?.incomeTaxDetails
    })
    const confirmation = watch('confirmation')
    // useEffect(() => {
    //     if (declarationData.incomeTaxDetails) {
    //         const { year, confirmation } = declarationData.incomeTaxDetails
    //         setYear(year ?? '')
    //         setConfirmation(confirmation)
    //     }

    // }, []);

    const handleSave = async () => {
        if (!isValid) {
            trigger()
            return
        }
        setDeclarationData((prev) => ({ ...prev, incomeTaxDetails: { confirmation } }))
        const values = getValues()
        if (confirmation) {
            setDeclarationData((prev) => ({ ...prev, incomeTaxDetails: { year: values.year, confirmation: values.confirmation } }))
            onSave(true);
        } else {
            try {
                // setDeclarationData((prev) => ({ ...prev, incomeTaxDetails: { year: values.year, confirmation: values.confirmation } }))
                const formData = new FormData()
                formData.append("file_IR", values.file)
                await uploadService.uploadBySectionAndId({ section: 'declaracoes', id: declarationData?.id }, formData)
                candidateService.deleteDeclaration({ userId: declarationData?.id, type: 'IncomeTaxExemption' }).catch(err => { })
                NotificationService.success({ text: 'Documento enviado' }).then(_ => {
                    onSave(false);
                }
                )
            } catch (err) {
            }
        }

    };

    // const handleFileChange = (e) => {
    //     setFile(e.target.files?.[0]);
    // };

    // const isSaveDisabled = () => {
    //     if (!confirmation) {
    //         return !year || !file;
    //     }
    //     return confirmation === null;
    // };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h2 className={commonStyles.declarationFormTitle}>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h2>
            <h3 className={commonStyles.declarationFormSubTitle}>DECLARAÇÃO DE ISENTO DE IMPOSTO DE RENDA</h3>
            <h3 className={commonStyles.declarationFormNameTitle}>{declarationData.name}</h3>
            <FormCheckbox
                control={control}
                label={'Você é isento(a) de Imposto de Renda?'}
                name={"confirmation"}
            />
            {/* <p>Você é isento(a) de Imposto de Renda?</p>
            <div className={commonStyles.radioGroup}>
                <label>
                    <input type="radio" name="incomeTaxExemption" value="sim" onChange={() => setConfirmation(true)} checked={confirmation} /> Sim
                </label>
                <label>
                    <input type="radio" name="incomeTaxExemption" value="nao" onChange={() => setConfirmation(false)} checked={confirmation === false} /> Não
                </label>
                </div> */}
            {confirmation && <InputForm control={control} label={'exercício'} name={"year"} />}
            {confirmation === false && (
                <>
                    <FormFilePicker accept={'application/pdf'} control={control} name={"file"} label={'última declaração completa de imposto de renda e recibo'} />
                </>
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
