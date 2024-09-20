import useControlForm from 'hooks/useControlForm'
import styles from '../../styles.module.scss'
import userTypeSchema from './schemas/user-type-schema'
import FormRadio from 'Components/FormRadio'
import ButtonBase from 'Components/ButtonBase'
import LGPD from 'Components/LGPD'
import Container from 'Components/Container'
export default function UserType({ data, onBack, onSubmit }) {
    const { control, getValues, formState: { isValid }, trigger } = useControlForm({
        schema: userTypeSchema,
        defaultValues: {
            role: "",
            terms: null
        },
        initialData: data

    })
    const handleNext = async () => {
        if (!isValid) {
            trigger()
            return
        }
        await onSubmit(getValues())
    }
    return (
        <Container title={'Cadastro'} desc={'Para concluir o cadastro básico e poder acessar o sistema, selecione se você é responsável legal por filhos menores ou se você é o próprio candidato (maior de idade)'}>
            <div className={styles.inputs}>

                <div style={{ display: 'flex', flexDirection: 'column', placeSelf: 'center' }}>
                    <FormRadio name={"role"} field={"role"} control={control} value="candidate" label={'candidato'} />
                    <FormRadio name={"role"} field={"role"} control={control} value="responsible" label={'responsável legal'} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <FormRadio name={"terms"} label={'Li e concordo com os termos LGPD'} control={control} value={"accept"} />
                    <LGPD>
                        <span style={{ cursor: 'pointer', color: 'white', textDecoration: 'underline' }}>Termos LGPD</span>
                    </LGPD>
                </div>

                <div className={styles.actions}>
                    <ButtonBase label={'voltar'} onClick={() => onBack(getValues())} />
                    {isValid && <ButtonBase label={'concluir'} onClick={handleNext} />}
                </div>
            </div>
        </Container>
    )
}