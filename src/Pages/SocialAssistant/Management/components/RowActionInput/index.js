import ButtonBase from "Components/ButtonBase";
import InputBase from "Components/InputBase";
import moneyInputMask from "Components/MoneyFormInput/money-input-mask";
import { useCallback, useEffect, useMemo, useState } from "react";
import stringToFloat from "utils/string-to-float";

export default function RowActionInput({
    label = '',
    inputProps = {
        error: null,
        readOnly: false,
        defaultValue: '',
        isMoney: false
    },
    buttonProps = {
        onClick: null,
        label: '',
    }
}) {

    const { error = null } = inputProps
    const { onClick } = buttonProps
    const [currentValue, setCurrentValue] = useState(inputProps.defaultValue)
    useEffect(() => {

        inputProps.isMoney ?
            setCurrentValue(moneyInputMask(inputProps.defaultValue))
            :
            setCurrentValue(inputProps.defaultValue)
    }, [inputProps.defaultValue])
    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', alignItems: 'baseline' }}>
            {label && <h4>{label}</h4>}
            <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', alignItems: 'baseline', }}>
                <InputBase {...inputProps} error={error}
                    value={inputProps.value ?? currentValue}
                    onChange={(e) => {
                        const { value } = e.target
                        const newValue = inputProps.isMoney ? moneyInputMask(value) : value
                        setCurrentValue(newValue)
                        inputProps?.onChange?.(newValue)
                    }} />
                {!!onClick && <ButtonBase {...buttonProps}
                    disabled={!currentValue}
                    onClick={() => {
                        onClick(inputProps.isMoney ? stringToFloat(currentValue) : currentValue)
                    }} />}
            </div>
        </div>
    )
}