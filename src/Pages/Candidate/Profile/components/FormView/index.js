import InputBase from 'Components/InputBase'
import ButtonBase from 'Components/ButtonBase'
export default function FormView({ data, onEdit }) {
    return (
        <>
            <fieldset disabled>
                <InputBase label={'email'} value={data?.email} error={null} />
                <InputBase type="password" label={'senha'} error={null} value="********" />
            </fieldset>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <ButtonBase label={'alterar senha'} onClick={onEdit} />
            </div>
        </>
    )
}