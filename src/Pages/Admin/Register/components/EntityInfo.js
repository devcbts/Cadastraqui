import useControlForm from "hooks/useControlForm"
import entityInfoSchema from "./schemas/entity-info-schema"
import ButtonBase from "Components/ButtonBase"
import InputForm from "Components/InputForm"
import FormFilePicker from "Components/FormFilePicker"
import FilePreview from "Components/FilePreview"
import { formatCNPJ } from "utils/format-cnpj"
import useCnpj from "hooks/useCnpj"

export default function EntityInfo({ data, onPageChange }) {
    const { control, formState: { isValid }, trigger, getValues, watch, setValue } = useControlForm({
        schema: entityInfoSchema,
        defaultValues: {
            name: "",
            email: "",
            password: "",
            CNPJ: "",
            socialReason: "",
            educationalInstitutionCode: "",
            logo: null
        },
        initialData: data
    })
    const handleSubmit = () => {
        const values = getValues()
        console.log(values)
        if (!isValid) {
            trigger()
            return
        }
        onPageChange(1, values)
    }
    useCnpj((cnpj) => {
        setValue("socialReason", cnpj?.name)
        setValue("email", cnpj?.emails?.[0])
        setValue("CEP", cnpj?.CEP)
    }, watch("CNPJ"))
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
            <h1>Informações Cadastrais</h1>
            <div style={{ width: 'max(400px, 50%)' }}>
                <InputForm control={control} name="CNPJ" label={"CNPJ"} transform={(e) => formatCNPJ(e.target.value)} />
                <InputForm control={control} name="name" label={"nome da instituição"} />
                <InputForm control={control} name="email" label={"email institucional"} />
                <InputForm control={control} name="socialReason" label={"razão social"} />
                <InputForm control={control} name="educationalInstitutionCode" label={"código institucional"} />
                <InputForm control={control} name="password" label={"senha"} type="password" />
                <FormFilePicker control={control} name="logo" label={"logotipo"} accept={'application/pdf'} />
                <FilePreview file={watch("file")} />
            </div>
            <ButtonBase label={'próximo'} onClick={handleSubmit} />
        </div>
    )
}