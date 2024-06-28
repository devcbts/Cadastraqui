import BackPageTitle from "Components/BackPageTitle"
import ButtonBase from "Components/ButtonBase"
import FormSelect from "Components/FormSelect"
import InputForm from "Components/InputForm"
import useCep from "hooks/useCep"
import useControlForm from "hooks/useControlForm"
import STATES from "utils/enums/states"
import { formatCEP } from "utils/format-cep"
import entityAddressSchema from "./schemas/entity-address-schema"
import styles from './styles.module.scss'

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
        <div className={styles.container}>
            <BackPageTitle title={'Informações cadastrais'} onClick={handlePageChange} />
            <div className={styles.informacoes}>
                <div className={styles.endereco}>
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