import Overlay from "Components/Overlay";
import Portal from "Components/Portal";
import styles from './styles.module.scss'
import { ReactComponent as Loading } from 'Assets/icons/loading.svg'
export default function Loader({ loading, text }) {
    if (!loading) return;
    return (
        <Portal id="loader">
            <Overlay>
                <div className={styles.container}>
                    <Loading className={styles.loader} />
                    <label className={styles.label}>{text}</label>
                </div>
            </Overlay>
        </Portal>
    )
}