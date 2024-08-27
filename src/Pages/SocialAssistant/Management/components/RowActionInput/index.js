import ButtonBase from "Components/ButtonBase";
import InputBase from "Components/InputBase";

export default function RowActionInput({
    label = '',
    inputProps = {
        error: null,
        readOnly: false,
        // value: '',
        // onChange: (v) => { }
    },
    buttonProps = {
        onClick: () => { },
        label: ''
    }
}) {
    const { error = null } = inputProps
    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', alignItems: 'baseline' }}>
            {label && <h4>{label}</h4>}
            <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', alignItems: 'baseline', }}>
                <InputBase {...inputProps} error={error} />
                <ButtonBase {...buttonProps} />
            </div>
        </div>
    )
}