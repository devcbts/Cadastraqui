import InputBase from 'Components/InputBase'
import styles from '../styles.module.scss'
export default function StudentPersonalSection({
    data,
}) {
    const personalFields = [
        { field: "name", label: 'nome completo' },
        { field: "socialName", label: 'nome social' },
        { field: "CPF", label: 'CPF' },
        { field: "birthDate", label: 'data de nascimento' },
        { field: "gender", label: 'sexo' },
        { field: "phone", label: 'telefone' },
        { field: "address", label: 'endereço' },
        { field: "email", label: 'email' },
    ]
    return (
        <div className={styles.information}>
            <h2 className={styles.title}>Dados pessoais</h2>
            {Object.entries(data ?? {}).map(([k, v]) => {
                const currField = personalFields.find(e => k === e.field)
                if (!currField) { return null }
                return (
                    <div className={styles.content}>
                        <h4 className={styles.titleinput}>{currField.label}</h4>
                        <InputBase error={null} value={v} key={k} disabled />
                    </div>
                )
            })}
        </div>
    )
}