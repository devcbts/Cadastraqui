import styles from './styles.module.scss'
import Logo from 'Assets/images/logo_white.png'
export default function UnauthenticatedHeader() {
    return (
        <header style={{ height: '80px', backgroundColor: '#1F4B73', display: 'flex', flexDirection: 'row', justifyContent: 'start', padding: '0 40px', alignItems: 'center' }}>
            <img className={styles.logo} src={Logo} alt='Logo' />
        </header>
    )
}