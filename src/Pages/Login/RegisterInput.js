export default function RegisterInput({ name, label, error, ...props }) {
    return (
        <div className={props.className}>
            <label for={name}>
                <h2 className="info-cadastrado">{label}</h2>
            </label>
            <input
                style={{ borderColor: error?.[name] && '#ef3e36' }}
                id={name}
                name={name}
                {...props}
            ></input>
            <div style={{ height: 14 }}>
                {(error && !!error[name]) && <label style={{ fontSize: 14, color: 'red', margin: '0px 8px', fontWeight: "bold" }}>{error[name]}</label>}
            </div>
        </div>
    )
}