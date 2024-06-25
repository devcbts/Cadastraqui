import useControlForm from 'hooks/useControlForm';
import styles from '../../styles.module.scss'
import InputForm from 'Components/InputForm';
import ButtonBase from 'Components/ButtonBase';
import loginInfoSchema from './schemas/login-info-schema';
export default function LoginInfo({ data, onBack, onSubmit }) {
    const { control, formState: { isValid }, trigger, getValues } = useControlForm({
        schema: loginInfoSchema,
        defaultValues: {
            email: '',
            password: ''
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
                <span>Informações de login</span>
            </div>
            <div className={styles.inputs}>
                <InputForm control={control} name="email" label="email" />
                <InputForm control={control} name="password" label="senha" type="password" />

            </div>
            <div className={styles.actions}>
                <ButtonBase label={'voltar'} onClick={() => onBack(getValues())} />
                <ButtonBase label={'próximo'} onClick={handleSubmit} />
            </div>

        </div>
    )
}

