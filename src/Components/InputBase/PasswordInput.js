import { forwardRef, useState } from "react"
import { ReactComponent as Show } from 'Assets/icons/eye-open.svg'
import { ReactComponent as Hide } from 'Assets/icons/eye-close.svg'
const PasswordInput = forwardRef((props, ref) => {
    const [showPass, setShowPass] = useState(false)
    const [showIcon, setShowIcon] = useState(false)
    const Component = showPass ? Hide : Show
    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'center', width: '100%' }} >
            <input
                ref={ref}
                {...props}
                onFocus={() => setShowIcon(true)}
                onBlur={() => {
                    !!props.onBlur && props.onBlur()
                    setShowIcon(false)
                }}
                type={showPass ? 'text' : 'password'}
            />

            {showIcon && <Component
                style={{ cursor: 'pointer', marginRight: 8 }}
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                    e.preventDefault()
                    setShowPass(prev => !prev)
                }}
            />}
        </div>
    )
})

export default PasswordInput