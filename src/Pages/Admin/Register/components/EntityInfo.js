import ButtonBase from "Components/ButtonBase"
import FilePreview from "Components/FilePreview"
import FormFilePicker from "Components/FormFilePicker"
import InputForm from "Components/InputForm"
import useCnpj from "hooks/useCnpj"
import useControlForm from "hooks/useControlForm"
import { formatCNPJ } from "utils/format-cnpj"
import entityInfoSchema from "./schemas/entity-info-schema"
import styles from './styles.module.scss'
import { formatTelephone } from "utils/format-telephone"

export default function EntityInfo({ data, onPageChange }) {
    const { control, formState: { isValid }, trigger, getValues, watch, setValue } = useControlForm({
        schema: entityInfoSchema,
        defaultValues: {
            name: "",
            email: "",
            password: "",
            CNPJ: "",
            socialReason: "",
            phone: "",
            educationalInstitutionCode: "",
            logo: null
        },
        initialData: data
    })
    const handleSubmit = () => {
        const values = getValues()

        if (!isValid) {
            trigger()
            return
        }
        onPageChange(1, values)
    }
    useCnpj((cnpj) => {
        setValue("socialReason", cnpj?.name)
        setValue("email", cnpj?.emails?.[0])
        setValue("phone", cnpj?.phones?.[0])
        setValue("CEP", cnpj?.CEP)
    }, watch("CNPJ"))
    return (
        <div className={styles.container}>
            <h1>Informações Cadastrais</h1>
            <div className={styles.informacoes}>
                <InputForm control={control} name="CNPJ" label={"CNPJ"} transform={(e) => formatCNPJ(e.target.value)} />
                <InputForm control={control} name="name" label={"nome da instituição"} />
                <InputForm control={control} name="email" label={"email institucional"} />
                <InputForm control={control} name="phone" label={"telefone"} transform={(e) => formatTelephone(e.target.value)} />
                <InputForm control={control} name="socialReason" label={"razão social"} />
                <InputForm control={control} name="educationalInstitutionCode" label={"código institucional"} />
                <InputForm control={control} name="password" label={"senha"} type="password" />
                <FormFilePicker control={control} name="logo" label={"logotipo"} accept={'image/*'} />
                <FilePreview file={watch("file")} />
            </div>
            <ButtonBase label={'próximo'} onClick={handleSubmit} />
        </div>
    )
}