export default function Select({ name, label, options, error, ...props }) {
    return (
        <fieldset>
            <label htmlFor={name}>{label}</label>
            <select
                style={{
                    all: 'unset', border: '1px solid black', width: '100%',
                    border: "1px solid",
                    background: " #FFF",
                    margin: " 0 0 5px",
                    padding: "10px",
                    textAlign: "left",
                    fontWeight: "normal",
                    fontSize: "12px",
                    borderColor: (!!error?.[name] && '#ef3e36') || (error?.[name] === "" && "#499468") || "#CCC"
                }}
                id={name}
                name={name}
                defaultValue={null}
                {...props}
            >
                {
                    options.map((option) => (
                        <option
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))
                }

            </select>
            <div style={{ height: 14, display: "flex", alignItems: "left", marginTop: '-5px' }}>
                {error && !!error[name] && <p style={{ fontSize: 12, color: "#ef3e36", fontWeight: "bold" }}>{error[name]}</p>}
            </div>
        </fieldset>
    )
}