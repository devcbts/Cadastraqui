export default function RegisterInput({ name, label, error, ...props }) {
    return (
        <div className={props.className}>
            <label for={name}>
                <h2 className="info-cadastrado">{label}</h2>
            </label>
            <input
                id={name}
                name={name}
                {...props}
            ></input>
            {(error && !!error[name]) && <label>{error[name]}</label>}
        </div>
    )
}