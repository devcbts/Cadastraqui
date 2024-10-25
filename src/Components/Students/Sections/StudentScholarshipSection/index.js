import InputBase from 'Components/InputBase'
import styles from '../styles.module.scss'
export default function StudentScholarshipSection({
    data
}) {
    const scholarshipFields = [
        { field: "isPartial", label: 'Tipo de bolsa' },
        { field: "admission", label: 'data de concessão' },
        { field: "scholarshipType", label: 'Motivo da bolsa' },
        { field: "scholarshipStatus", label: 'status da bolsa' },
        { field: "renewStatus", label: 'status da renovação' },
    ]
    return (
        <div className={styles.information}>
            <h2 className={styles.title}>Dados da bolsa</h2>
            {Object.entries(data ?? {}).map(([k, v]) => {
                const currField = scholarshipFields.find(e => k === e.field)
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