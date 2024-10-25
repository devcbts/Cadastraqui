import InputBase from 'Components/InputBase'
import styles from '../styles.module.scss'
export default function StudentAcademicSection({
    data
}) {
    const courseFields = [
        { field: "entity", label: 'instituição' },
        { field: "course", label: 'curso' },
        { field: "isPartial", label: 'tipo de bolsa' },
        { field: "shift", label: 'turno' },
        { field: "modality", label: 'modalidade de ensino' },
        { field: "semester", label: 'período' },
        { field: "status", label: 'status' },
    ]

    return (
        <div className={styles.information}>
            <h2 className={styles.title}>Dados acadêmicos</h2>
            {Object.entries(data).map(([k, v]) => {
                const currField = courseFields.find(e => k === e.field)
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