import { ReactComponent as Loading } from 'Assets/icons/loading.svg'
import styles from './styles.module.scss'
export default function Spinner({ size = '50%' }) {
    return (
        <Loading className={styles.loader} height={size} width={size} />
    )
}