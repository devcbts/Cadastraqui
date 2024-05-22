import styles from './styles.module.scss'
import Logo from '../../../../Assets/images/logo_primary.png'
export default function UserHeader() {
    return (
        <header className={styles.container}>
            <img alt="Cadastraqui" src={Logo} draggable={false} />
            <div>
                User info
            </div>
        </header>
    )
}