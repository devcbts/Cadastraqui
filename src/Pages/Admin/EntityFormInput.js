export default function EntityFormInput({ name, label, error, ...props }) {
    console.log(error)
    return (
        <fieldset>
            <label htmlFor={name}>{label}</label>
            <input
                style={{ borderColor: (!!error?.[name] && '#ef3e36') || error?.[name] === "" && "#499468" }}
                id={name}
                autofocus
                name={name} // Ajuste para corresponder à chave do estado
                {...props}
            />
            <div style={{ height: 14, display: "flex", alignItems: "left", marginTop: '-5px' }}>
                {error && !!error[name] && <p style={{ fontSize: 12, color: "#ef3e36", fontWeight: "bold" }}>{error[name]}</p>}
            </div>
        </fieldset>
    )
}