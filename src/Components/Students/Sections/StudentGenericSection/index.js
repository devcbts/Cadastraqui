import InputBase from 'Components/InputBase'
import styles from '../styles.module.scss'
/**
 * 
 * @param {*} fields 
 * @type {field: 'fieldName', label: 'Label to be shown'}[]
 * @param {*} data
 * @type {Object} - Object with keys being one of 'field' on 'fields' array. The component will map and find the matching key on data->fields array and return an input
 */
export default function StudentGenericSection({
    title,
    data,
    fields,
    children
}) {

    return (
        <div className={styles.information}>
            <h2 className={styles.title}>{title}</h2>
            {Object.entries(data ?? {}).map(([k, v]) => {
                const currField = fields.find(e => k === e.field)
                if (!currField) { return null }
                return (
                    <div className={styles.content}>
                        <h4 className={styles.titleinput}>{currField.label}</h4>
                        <InputBase error={null} value={v} key={k} disabled />
                    </div>
                )
            })}

            {children({ content: styles.content })}
        </div>
    )
}