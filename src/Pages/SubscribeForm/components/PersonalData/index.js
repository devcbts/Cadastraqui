import personalDataFormSchema from "./schemas/personal-data-schema"
import InputForm from "Components/InputForm"
import FormSelect from "Components/FormSelect"
import FormFilePicker from "Components/FormFilePicker"
import FilePreview from "Components/FilePreview"
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import { formatCPF } from "utils/format-cpf"
import { formatTelephone } from "utils/format-telephone"
import { formatRG } from "utils/format-rg"
import { forwardRef } from "react"
import useControlForm from "hooks/useControlForm"
import STATES from "utils/enums/states"
import METADATA_FILE_TYPE from "utils/file/metadata-file-type"
import METADATA_FILE_CATEGORY from "utils/file/metadata-file-category"
import styles from './styles.module.scss'

const PersonalData = forwardRef(({ data, tooltips }, ref) => {
    const { control, watch } = useControlForm({
        schema: personalDataFormSchema,
        defaultValues: {
            fullName: '',
            CPF: '',
            birthDate: '',
            landlinePhone: '',
            email: '',
            RG: "",
            rgIssuingState: "",
            rgIssuingAuthority: "",
            file_idDocument: null,
            url_idDocument: null,
            metadata_idDocument: {
                type: METADATA_FILE_TYPE.DOCUMENT.ID,
                category: METADATA_FILE_CATEGORY.Identity
            }
        },
        initialData: data
    }, ref)

    const watchIssuingState = watch("rgIssuingState")
    const watchFile = watch("file_idDocument")

    let fullName = ''
    if (data?.fullName && data?.fullName !== '') {
        fullName = data?.fullName;
    } else if (data?.name) {
        fullName = data?.name;
    }

    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Dados Pessoais</h1>
            <h4 className={commonStyles.subTitle}>{fullName}</h4>
            <div className={styles.container}>
                <InputForm name="fullName" label="nome completo" control={control} />
                <InputForm name="CPF" label="CPF" control={control} transform={(e) => formatCPF(e.target.value)} />
                <InputForm name="birthDate" label="data de nascimento" type="date" control={control} />
                <InputForm name="landlinePhone" label="telefone" control={control} transform={(e) => formatTelephone(e.target.value)} tooltip={tooltips?.['landlinePhone']} />
                <InputForm name="email" label="email" control={control} tooltip={tooltips?.['email']} />
                <InputForm name={"RG"} control={control} label={"RG/RNE"} transform={(e) => formatRG(e.target.value)} />
                <FormSelect name={"rgIssuingState"} control={control} label={"estado emissor do RG/RNE"} options={STATES} value={watchIssuingState} />
                <InputForm name={"rgIssuingAuthority"} control={control} label={"órgão emissor do RG/RNE"} />
            </div>
            <FormFilePicker name={"file_idDocument"} control={control} label={"documento de identificação"} accept={'application/pdf'} />
            <FilePreview file={watchFile} url={data?.url_idDocument} text={'visualizar documento'} />
        </div>
    )
})

export default PersonalData