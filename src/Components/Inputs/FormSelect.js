export default function FormSelect({ label, name, options, error, ...props }) {
    return (
        <div class="survey-box">
            <label htmlFor={name} id={`${name}-label`}>
                {label}
            </label>
            <br />
            <select
                name={name}
                id={name}
                class="select-data"
                {...props}
            >
                {options.map((type) => (
                    <option value={type.value}>{type.label}</option>
                ))}
            </select>
            {error?.[name] && <label style={{ color: "#ef3e36" }}>{error?.[name]}</label>}
        </div>
    )
}