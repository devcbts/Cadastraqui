export default function FormCheckbox({ name, label, ...props }) {
    return (
        <div class="survey-box">
            <label htmlFor={name} id={`${name}-label`}>
                {label}
            </label>
            <br />
            <p className="onoff">

                <input
                    type="checkbox"
                    name={name}
                    id={`${name}-checkbox`}
                    class="survey-control"
                    {...props}

                />
                <label htmlFor={`${name}-checkbox`} id="yesno"></label>

            </p>
        </div>
    )
}