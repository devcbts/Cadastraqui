import styles from './styles.module.scss'
import { ReactComponent as IconLogo } from 'Assets/icons/logo.svg'

export default function BrandLogo({ children }) {
    return (
        <div className={styles.brand}>
            <IconLogo />
            <span>
                Plataforma para processos de concessão e manutenção de bolsas de estudos para fins de CEBAS
            </span>
            {children}
        </div>
    )
}