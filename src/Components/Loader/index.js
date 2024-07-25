import Overlay from "Components/Overlay";
import Portal from "Components/Portal";
import styles from './styles.module.scss'
import { ReactComponent as Loading } from 'Assets/icons/loading.svg'
import Spinner from "./Spinner";
export default function Loader({ loading, text = "Aguarde um momento" }) {
    if (!loading) return;
    return (
        <Portal id="loader">
            <Overlay>
                <div className={styles.container}>
                    <Spinner />
                    <label className={styles.label}>{text}</label>
                </div>
            </Overlay>
        </Portal>
    )
}