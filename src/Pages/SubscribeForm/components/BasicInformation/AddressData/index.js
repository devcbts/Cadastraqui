import { useForm } from 'react-hook-form'
import InputForm from '../../../../../Components/InputForm'
import styles from './styles.module.scss'
import commonStyles from '../styles.module.scss'
import useCep from '../../../../../hooks/useCep'
import { zodResolver } from '@hookform/resolvers/zod'
import { addressDataSchema } from './schemas/address-schema'
import SelectBase from '../../../../../Components/SelectBase'
import { formatCEP } from '../../../../../utils/format-cep'
import { forwardRef, useImperativeHandle } from 'react'
import FormSelect from '../../../../../Components/FormSelect'
import STATES from '../../../../../utils/enums/states'
const AddressData = forwardRef((_, ref) => {

    const { control, watch, setValue, trigger, formState: { isValid } } = useForm({
        mode: "all",
        defaultValues: {
            CEP: "",
            address: "",
            addressNumber: "",
            neighborhood: "",
            city: "",
            UF: "",
        },
        resolver: zodResolver(addressDataSchema)
    })
    const watchCep = watch("CEP")
    const watchState = watch("UF")
    useCep((address) => {
        setValue("address", address.address)
        setValue("UF", address.UF)
        setValue("city", address.city)
        setValue("neighborhood", address.neighborhood)
    }, watchCep)
    useImperativeHandle(ref, () => ({
        validate: () => {
            trigger();
            return isValid
        }
    }))
    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Endereço</h1>
            <div className={styles.container}>
                <InputForm name={"CEP"} control={control} label={"CEP"} transform={(e) => formatCEP(e.target.value)} />
                <InputForm name={"address"} control={control} label={"rua"} />
                <InputForm name={"addressNumber"} control={control} label={"número"} />
                <InputForm name={"neighborhood"} control={control} label={"bairro"} />
                <InputForm name={"city"} control={control} label={"cidade"} />
                <FormSelect name={"UF"} control={control} label={"unidade federativa"} options={STATES} value={STATES.find(e => e.value === watchState)} />
            </div>
        </div>
    )
})

export default AddressData