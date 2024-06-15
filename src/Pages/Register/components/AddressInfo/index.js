import useControlForm from 'hooks/useControlForm';
import styles from '../../styles.module.scss'
import InputForm from 'Components/InputForm';
import ButtonBase from 'Components/ButtonBase';
import addressInfoSchema from './schemas/address-info-schema';
import useCep from 'hooks/useCep';
import { formatCEP } from 'utils/format-cep';
import FormSelect from 'Components/FormSelect';
import STATES from 'utils/enums/states';
export default function AddressInfo({ data, onBack, onSubmit }) {
    const { control, formState: { isValid }, trigger, getValues, watch, setValue } = useControlForm({
        schema: addressInfoSchema,
        defaultValues: {
            address: '',
            addressNumber: '',
            city: '',
            UF: '',
            CEP: '',
            neighborhood: '',
        },
        initialData: data
    })
    const handleSubmit = () => {
        if (!isValid) {
            trigger()
            return
        }
        onSubmit(getValues())
    }
    const watchCep = watch("CEP")
    const watchUF = watch("UF")
    useCep((address) => {
        setValue("UF", address?.UF)
        setValue("address", address?.address)
        setValue("city", address?.city)
        setValue("neighborhood", address?.neighborhood)

    }, watchCep)
    return (
        <div className={styles.register}>
            <div className={styles.title}>
                <h1>Cadastro</h1>
                <span>Endereço</span>
            </div>
            <div className={styles.inputs}>
                <InputForm control={control} name="CEP" label="CEP" transform={(e) => formatCEP(e.target.value)} />
                <FormSelect control={control} name="UF" label="UF" options={STATES} value={watchUF} />
                <InputForm control={control} name="city" label="cidade" />
                <InputForm control={control} name="neighborhood" label="bairro" />
                <InputForm control={control} name="addressNumber" label="número" />

            </div>
            <div className={styles.actions}>
                <ButtonBase label={'voltar'} onClick={() => onBack(getValues())} />
                <ButtonBase label={'próximo'} onClick={handleSubmit} />
            </div>

        </div>
    )
}

