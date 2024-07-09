import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import { NotificationService } from 'services/notification';
import uploadService from 'services/upload/uploadService';
import useAuth from 'hooks/useAuth';
import { useRecoilState } from 'recoil';
import declarationAtom from '../../atoms/declarationAtom';
import candidateService from 'services/candidate/candidateService';
import FormCheckbox from 'Components/FormCheckbox';
import useControlForm from 'hooks/useControlForm';
import InputForm from 'Components/InputForm';
import FormFilePicker from 'Components/FormFilePicker';
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
        if (confirmation) {
            onSave(true);
        } else {
            try {
                const values = getValues()
                setDeclarationData((prev) => ({ ...prev, incomeTaxDetails: { year: values.year, confirmation: values.confirmation } }))
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
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO DE ISENTO DE IMPOSTO DE RENDA</h2>
            <h3>{declarationData.name}</h3>
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
            {confirmation === false && (
                <>
                    <InputForm control={control} label={'Ano de exercício'} name={"year"} />
                    <FormFilePicker accept={'application/pdf'} control={control} name={"file"} label={'última declaração completa de imposto de renda e recibo'} />
                    {/* <div className={commonStyles.inputGroup}>
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
                    </div> */}
                </>
            )}
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
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
