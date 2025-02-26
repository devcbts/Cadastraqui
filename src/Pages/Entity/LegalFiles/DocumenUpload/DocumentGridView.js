import CustomFilePicker from "Components/CustomFilePicker"
import { useMemo } from "react"
import FileCard from "../FileCard"
import styles from './styles.module.scss'

export default function DocumentGridView({
    columns = 2,
    documents = [],
    title,
    transform = (x) => x,
    year,
    onDocumentClick
}) {
    const getTitle = (i) => {
        if (title === 'last') {
            return i === transform(documents).length - 1
                ? 'Vigente'
                : 'Anterior'
        }
        if (typeof title === 'string') {
            return title
        }
        if (typeof title === 'function') {
            return title(i)
        }
    }
    const years = useMemo(() => {
        const currYear = new Date().getFullYear()
        return Array.from({ length: year?.count ?? 4 }).map((_, i) => currYear - i)
    }, [])
    return (
        <div style={{ marginTop: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns},minmax(200px, 1fr))`, gap: 16 }}>
                {
                    !!year
                        ? years.map((e, i) => (
                            <CustomFilePicker key={e} onUpload={(files) => onDocumentClick(files, e)} >
                                <FileCard className={styles.uploadCard} label={e} url={documents.find(x => x.fields.year === e)?.url ?? ''} />
                            </CustomFilePicker>
                        ))
                        : (transform(documents).length === 0 ? <strong>Nenhum documento</strong> : transform(documents).map((e, i) =>
                            <FileCard key={e.id} label={getTitle(i)} url={e.url} />))
                }
            </div>
        </div>
    )
}