import FormCheckbox from "Components/FormCheckbox";
import InputForm from "Components/InputForm";
import useControlForm from "hooks/useControlForm";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import { forwardRef, useEffect } from "react";
import benefitsSchema from "./schemas/benefits-schema";
import styles from './styles.module.scss';
import FormFilePicker from "Components/FormFilePicker";
import ButtonBase from "Components/ButtonBase";
import { Link } from "react-router-dom";
import FilePreview from "Components/FilePreview";
import METADATA_FILE_TYPE from "utils/file/metadata-file-type";
import useTutorial from "hooks/useTutorial";
import SUBSCRIPTION_TUTORIALS from "utils/enums/tutorials/subscription-form";
const Benefits = forwardRef(({ data }, ref) => {
    const { control, watch, resetField } = useControlForm({
        schema: benefitsSchema,
        defaultValues: {
            enrolledGovernmentProgram: "",
            NIS: "",
            attendedPublicHighSchool: null,
            benefitedFromCebasScholarship_basic: null,
            benefitedFromCebasScholarship_professional: null,
            CadUnico: null,
            file_registerProof: null,
            metadata_registerProof: {
                type: METADATA_FILE_TYPE.DOCUMENT.REGISTERPROOF
            }
        },
        initialData: data
    }, ref)
    useTutorial(SUBSCRIPTION_TUTORIALS.CANDIDATEINFO.Benefits)


    const watchCad = watch("CadUnico")

    useEffect(() => {
        if (!watchCad) {
            resetField("NIS", { defaultValue: '', keepDirty: false, keepError: false })
            resetField("enrolledGovernmentProgram", { defaultValue: '', keepDirty: false, keepError: false })
        }
    }, [watchCad])
    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Benefícios e Programas</h1>
            {
                !!data?.fullName &&
                <h4 className={commonStyles.subTitle}>{data?.fullName}</h4>
            }
            <div className={styles.container}>
                <FormCheckbox name={"CadUnico"} control={control} label={"Inscrito no cadastro único?"} />

                <div className={styles.grid}>
                    {watchCad &&
                        <>
                            <InputForm name={"NIS"} control={control} label={"Número de Identificação Social (NIS)"} />
                            <InputForm name={"enrolledGovernmentProgram"} control={control} label={"inscrito em qual programa governamental?"} />
                            <FormFilePicker name={"file_registerProof"} control={control} label={'comprovante de cadastramento'} accept={'application/pdf'} />
                            <FilePreview url={data?.url_registerProof} file={watch("file_registerProof")} text={'ver comprovante'} />
                            <Link target="_blank" to={"https://www.mds.gov.br/consultacidadao"}>
                                <ButtonBase label={'gerar comprovante'} />
                            </Link>
                        </>
                    }
                    <FormCheckbox name={"attendedPublicHighSchool"} control={control} label={"estudou em escola pública?"} />
                    <FormCheckbox name={"benefitedFromCebasScholarship_basic"} control={control} label={"já recebeu bolsa CEBAS para educação básica?"} />
                    <FormCheckbox name={"benefitedFromCebasScholarship_professional"} control={control} label={"já recebeu bolsa CEBAS para educação profissional?"} />
                </div>
            </div>
        </div>
    )
})

export default Benefits