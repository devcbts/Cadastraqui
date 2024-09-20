import useControlForm from 'hooks/useControlForm';
import styles from '../../styles.module.scss'
import InputForm from 'Components/InputForm';
import ButtonBase from 'Components/ButtonBase';
import personalRegisterSchema from './schemas/personal-register-schema';
import { formatTelephone } from 'utils/format-telephone';
import { formatCPF } from 'utils/format-cpf';
import Container from 'Components/Container';
export default function Personal({ data, onSubmit }) {
    const { control, getValues, handleSubmit } = useControlForm({
        schema: personalRegisterSchema,
        defaultValues: {
            name: '',
            CPF: '',
            birthDate: '',
            // phone: ''
        },
        initialData: data
    })
    const handleNext = () => {
        onSubmit(getValues())
    }
    return (
        <Container title={'Cadastro'} desc={'Informações pessoais'}>
            <form className={styles.inputs} onSubmit={handleSubmit(handleNext)}>
                <div>
                    <InputForm control={control} name="name" label="nome completo" />
                    <InputForm control={control} name="CPF" label="CPF" transform={(e) => formatCPF(e.target.value)} />
                    <InputForm control={control} name="birthDate" label="data de nascimento" type="date" />
                </div>
                {/* <InputForm control={control} name="phone" label="telefone" transform={(e) => formatTelephone(e.target.value)} /> */}

                <ButtonBase type="submit" label={'próximo'} />
            </form>

        </Container>
    )
}

