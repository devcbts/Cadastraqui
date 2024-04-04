export default function LoginButton({ label, onClick, ...props }) {
    return (
        <button className="login-btn" type="button" onClick={onClick}>
            <div className="btn-entrar">
                <a>{label}</a>
            </div>
        </button>
    )

}