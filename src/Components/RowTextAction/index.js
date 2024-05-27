import ButtonBase from 'Components/ButtonBase'
import styles from './styles.module.scss'
export default function RowTextAction({ text, label, onClick }) {
    return (
        <div className={styles.container}>
            <h3>{text}</h3>
            <ButtonBase label={label} onClick={onClick}></ButtonBase>
        </div>
    )
}