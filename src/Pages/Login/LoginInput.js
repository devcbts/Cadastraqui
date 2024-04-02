export default function LoginInput({ Icon, name, placeholder, onChange, error, showErrorHint, ...props }) {
    return (
        <>
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
            {showErrorHint && <label style={{ color: '#ef3e36', fontSize: 14, textAlign: "start" }}>{error[name]}</label>}
        </>
    )
}