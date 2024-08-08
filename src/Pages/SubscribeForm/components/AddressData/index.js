import FormSelect from 'Components/FormSelect'
import InputForm from 'Components/InputForm'
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import useCep from 'hooks/useCep'
import useControlForm from 'hooks/useControlForm'
import { forwardRef } from 'react'
import STATES from 'utils/enums/states'
import { formatCEP } from 'utils/format-cep'
import { addressDataSchema } from './schemas/address-schema'
import styles from './styles.module.scss'
const AddressData = forwardRef(({ data }, ref) => {
    const { control, watch, setValue } = useControlForm({
        schema: addressDataSchema,
        defaultValues: {
            CEP: "",
            address: "",
            addressNumber: "",
            neighborhood: "",
            city: "",
            UF: "",
            complement: ""
        },
        initialData: data
    }, ref)
    /* console.log(data); */
    const watchCep = watch("CEP")
    const watchState = watch("UF")
    useCep((address) => {
        setValue("address", address.address)
        setValue("UF", address.UF)
        setValue("city", address.city)
        setValue("neighborhood", address.neighborhood)
    }, watchCep)

    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Endereço</h1>
            <h4 className={commonStyles.subTitle}>{data?.name}</h4>
            <div className={styles.container}>
                <InputForm name={"CEP"} control={control} label={"CEP"} transform={(e) => formatCEP(e.target.value)} />
                <InputForm name={"address"} control={control} label={"rua"} />
                <InputForm name={"addressNumber"} control={control} label={"número"} />
                <InputForm name={"neighborhood"} control={control} label={"bairro"} />
                <InputForm name={"city"} control={control} label={"cidade"} />
                <InputForm name={"complement"} control={control} label={"complemento"} />
                <FormSelect name={"UF"} control={control} label={"unidade federativa"} options={STATES} value={watchState} />
            </div>
        </div>
    )
})

export default AddressData