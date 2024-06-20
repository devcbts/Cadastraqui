import useControlForm from "hooks/useControlForm"
import entityInfoSchema from "./schemas/entity-info-schema"
import ButtonBase from "Components/ButtonBase"
import InputForm from "Components/InputForm"
import FormFilePicker from "Components/FormFilePicker"
import FilePreview from "Components/FilePreview"
import { formatCNPJ } from "utils/format-cnpj"
import useCnpj from "hooks/useCnpj"
import BackPageTitle from "Components/BackPageTitle"
import entityAddressSchema from "./schemas/entity-address-schema"
import useCep from "hooks/useCep"
import FormSelect from "Components/FormSelect"
import { formatCEP } from "utils/format-cep"
import STATES from "utils/enums/states"

export default function EntityAddress({ data, onPageChange }) {
    const { control, formState: { isValid }, trigger, getValues, watch, setValue } = useControlForm({
        schema: entityAddressSchema,
        defaultValues: {
            CEP: "",
            address: "",
            addressNumber: "",
            city: "",
            UF: "",
            neighborhood: "",
        },
        initialData: data
    })
    const handlePageChange = () => {
        const values = getValues()
        onPageChange(-1, values)
    }
    const handleSubmit = () => {
        if (!isValid) {
            trigger()
            return
        }
        const values = getValues()
        onPageChange(1, values)
    }
    useCep((address) => {
        setValue("UF", address?.UF)
        setValue("address", address?.address)
        setValue("city", address?.city)
        setValue("neighborhood", address?.neighborhood)
    }, watch("CEP"))
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
            <BackPageTitle title={'Informações cadastrais'} onClick={handlePageChange} />
            <div style={{ width: 'max(400px, 50%)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '20px' }}>
                    <InputForm control={control} name="CEP" label={"CEP"} transform={(e) => formatCEP(e.target.value)} />
                    <InputForm control={control} name="city" label={"cidade"} />
                    <FormSelect control={control} name="UF" label={"UF"} options={STATES} value={watch("UF")} />
                    <InputForm control={control} name="neighborhood" label={"bairro"} />
                </div>
                <InputForm control={control} name="address" label={"rua"} />
                <InputForm control={control} name="addressNumber" label={"número"} />

            </div>
            <ButtonBase label={'próximo'} onClick={handleSubmit} />
        </div>
    )
}