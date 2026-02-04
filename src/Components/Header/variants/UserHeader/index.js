import styles from './styles.module.scss'
import Logo from 'Assets/images/logo_primary.png'
import Tutorial from 'Components/Tutorial'
import HeaderProfileCard from '../../components/HeaderProfileCard'

export default function UserHeader() {
    return (
        <header className={styles.container}>
            <img alt="Cadastraqui" src={Logo} draggable={false} />
            <div className={styles.right}>
                <Tutorial />
                <HeaderProfileCard />
            </div>
        </header>
    )
}