import { forwardRef } from "react"

const EntityFormInput = forwardRef(({ name, label, error, ...props }, ref) => {
    const errorName = name?.split('.').pop()

    const useReactHookForm = error?.[errorName]?.hasOwnProperty("message") ? error?.[errorName]?.message : error?.[errorName]
    const style = error === null ? "#CCC" : (
        !useReactHookForm ? "#499468" : "#ef3e36"
    )
    return (
        <fieldset>
            <label htmlFor={name}>{label}</label>
            <input
                style={{ borderColor: style }}
                id={name}
                name={name} // Ajuste para corresponder à chave do estado
                {...props}
                ref={ref}
            />
            <div style={{ height: 14, display: "flex", alignItems: "left", marginTop: '-5px' }}>
                {useReactHookForm && !!useReactHookForm && <p style={{ fontSize: 12, color: "#ef3e36", fontWeight: "bold" }}>{useReactHookForm}</p>}
            </div>
        </fieldset>
    )
})

export default EntityFormInput
