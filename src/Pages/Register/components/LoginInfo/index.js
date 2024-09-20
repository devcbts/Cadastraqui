import useControlForm from 'hooks/useControlForm';
import styles from '../../styles.module.scss'
import InputForm from 'Components/InputForm';
import ButtonBase from 'Components/ButtonBase';
import loginInfoSchema from './schemas/login-info-schema';
import Container from 'Components/Container';
export default function LoginInfo({ data, onBack, onSubmit }) {
    const { control, getValues, handleSubmit } = useControlForm({
        schema: loginInfoSchema,
        defaultValues: {
            email: '',
            password: '',
            passwordConfirmation: ''
        },
        initialData: data
    })
    const handleNext = () => {

        onSubmit(getValues())
    }
    return (
        <Container title={'Cadastro'} desc={'Informações de login'}>


            <form className={styles.inputs} onSubmit={handleSubmit(handleNext)}>
                <div>

                    <InputForm control={control} name="email" label="email" />
                    <InputForm control={control} name="password" label="senha" type="password" />
                    <InputForm control={control} name="passwordConfirmation" label="confirme a senha" type="password" />
                </div>

                <div className={styles.actions}>
                    <ButtonBase label={'voltar'} onClick={() => onBack(getValues())} />
                    <ButtonBase type="submit" label={'próximo'} />
                </div>
            </form>

        </Container>

    )
}

