import Logo from '../../Assets/images/logo_primary.png'
export default function Header() {
    return (
        <header >
            <img alt="Cadastraqui" src={Logo} draggable={false} />
            <div>
                User info
            </div>
        </header>
    )
}