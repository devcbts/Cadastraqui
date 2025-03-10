import CustomFilePicker from "Components/CustomFilePicker"
import FileCard from "../FileCard"
import YearGrid from "../YearGrid"
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

    return (
        <div style={{ marginTop: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns},minmax(200px, 1fr))`, gap: 16 }}>
                {
                    !!year
                        ? <YearGrid render={(year) => {
                            return (
                                <CustomFilePicker key={year} onUpload={(files) => onDocumentClick(files, year)} >
                                    <FileCard className={styles.uploadCard} label={year} url={documents.find(x => x.fields.year === year)?.url ?? ''} />
                                </CustomFilePicker>
                            )
                        }} />
                        : (transform(documents).length === 0 ? <strong>Nenhum documento</strong> : transform(documents).map((e, i) =>
                            <FileCard key={e.id} label={getTitle(i)} url={e.url} />))
                }
            </div>
        </div>
    )
}