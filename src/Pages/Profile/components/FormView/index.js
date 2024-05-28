import InputBase from 'Components/InputBase'
import commonStyles from '../../styles.module.scss'
import ButtonBase from 'Components/ButtonBase'
export default function FormView({ data, onEdit }) {
    return (
        <>
            <fieldset disabled>
                <InputBase label={'email'} value={data?.email} error={null} />
                <InputBase type="password" label={'senha'} error={null} value="********" />
            </fieldset>
            <div className={commonStyles.actions}>
                <ButtonBase label={'alterar senha'} onClick={onEdit} />
            </div>
        </>
    )
}