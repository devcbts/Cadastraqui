import { useForm } from 'react-hook-form'
import InputForm from '../../../../../Components/InputForm'
import styles from './styles.module.scss'
import commonStyles from '../styles.module.scss'
import useCep from '../../../../../hooks/useCep'
import { zodResolver } from '@hookform/resolvers/zod'
import { addressDataSchema } from './schemas/address-schema'
export default function AddressData() {

    const { control, watch, setValue } = useForm({
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
    useCep((address) => {
        setValue("address", address.address)
        setValue("UF", address.UF)
        setValue("city", address.city)
        setValue("neighborhood", address.neighborhood)
    }, watchCep)
    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Endereço</h1>
            <div className={styles.container}>
                <InputForm name={"CEP"} control={control} label={"CEP"} />
                <InputForm name={"address"} control={control} label={"rua"} />
                <InputForm name={"addressNumber"} control={control} label={"número"} />
                <InputForm name={"neighborhood"} control={control} label={"bairro"} />
                <InputForm name={"city"} control={control} label={"cidade"} />
                <InputForm name={"UF"} control={control} label={"unidade federativa"} />
            </div>
        </div>
    )
}