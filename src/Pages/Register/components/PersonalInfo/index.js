import useControlForm from 'hooks/useControlForm';
import styles from '../../styles.module.scss'
import InputForm from 'Components/InputForm';
import ButtonBase from 'Components/ButtonBase';
import personalRegisterSchema from './schemas/personal-register-schema';
import { formatTelephone } from 'utils/format-telephone';
import { formatCPF } from 'utils/format-cpf';
export default function Personal({ data, onSubmit }) {
    const { control, formState: { isValid }, trigger, getValues } = useControlForm({
        schema: personalRegisterSchema,
        defaultValues: {
            name: '',
            CPF: '',
            birthDate: '',
            phone: ''
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
    return (
        <div className={styles.register}>
            <div className={styles.title}>
                <h1>Cadastro</h1>
                <span>Informações pessoais</span>
            </div>
            <div className={styles.inputs}>
                <InputForm control={control} name="name" label="nome completo" />
                <InputForm control={control} name="CPF" label="CPF" transform={(e) => formatCPF(e.target.value)} />
                <InputForm control={control} name="birthDate" label="data de nascimento" type="date" />
                <InputForm control={control} name="phone" label="telefone" transform={(e) => formatTelephone(e.target.value)} />
            </div>
            <ButtonBase label={'próximo'} onClick={handleSubmit} />

        </div>
    )
}

