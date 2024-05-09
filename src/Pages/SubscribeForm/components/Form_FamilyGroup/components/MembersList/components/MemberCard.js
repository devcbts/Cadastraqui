import ButtonBase from 'Components/ButtonBase'
import styles from './styles.module.scss'
export default function MemberCard({ name, id, onView, onRemove }) {

    return (
        <div className={styles.container}>
            <label className={styles.label}>{name}</label>
            <div className={styles.actions}>
                <ButtonBase label={"visualizar"} onClick={onView} />
                <ButtonBase label={"excluir"} danger onClick={onRemove} />
            </div>
        </div>
    )
}