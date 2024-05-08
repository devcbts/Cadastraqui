import ButtonBase from 'Components/ButtonBase'
import styles from './styles.module.scss'
export default function MemberCard() {
    return (
        <div className={styles.container}>
            <label className={styles.label}>Nome teste</label>
            <div className={styles.actions}>
                <ButtonBase label={"visualizar"} />
                <ButtonBase label={"excluir"} danger />
            </div>
        </div>
    )
}