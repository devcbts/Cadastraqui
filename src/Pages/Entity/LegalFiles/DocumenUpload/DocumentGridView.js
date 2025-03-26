import FileCard from "../FileCard"
import YearGrid from "../YearGrid"
import YearMultipleFile from "../YearMultipleFile"

export default function DocumentGridView({
    columns = 2,
    documents = [],
    onUpdate = () => { },
    title,
    transform = (x) => x,
    year,
    onDocumentClick,
    multiple = false,
    children,
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
                        ? (!multiple ? <YearGrid render={(year) => {
                            return (
                                <FileCard label={year} doc={documents.find(x => x.fields.year === year)}
                                    onAdd={(files) => onDocumentClick(files, year)}
                                    onEdit={(id, files) => onUpdate(id, files)}
                                    children={children}
                                />
                            )
                        }} />
                            : <YearMultipleFile documents={documents} onUpdate={onUpdate} onAdd={(files, year) => onDocumentClick(files, year)} />)
                        : (transform(documents).length === 0 ? <strong>Nenhum documento</strong> : transform(documents).map((e, i) =>
                            <FileCard key={e.id} label={getTitle(i)} doc={e} onEdit={onUpdate} children={children} />))
                }
            </div>
        </div>
    )
}