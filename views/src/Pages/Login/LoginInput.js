export default function LoginInput({ Icon, name, placeholder, onChange, error, ...props }) {
    return (
        <div className="user-login" style={{ boxShadow: error[name] && '0px 0px 10px #ef3e36' }}>
            <label for={name}>
                <Icon size="40" color="white" />
            </label>
            <input

                name={name}
                id={name}
                onChange={onChange}
                placeholder={placeholder}
                {...props}
                required
            ></input>
        </div >
    )
}