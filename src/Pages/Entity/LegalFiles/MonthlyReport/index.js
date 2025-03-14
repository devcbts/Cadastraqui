import Spinner from "Components/Loader/Spinner"
import { useState } from "react"
import { ENTITY_LEGAL_FILE } from "utils/enums/entity-legal-files-type"
import FileCard from "../FileCard"
import YearGrid from "../YearGrid"
import { useLegalFiles } from "../useLegalFiles"

export default function MonthlyReport() {
    const [selectedYear, setSelectedYear] = useState(null)
    const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
    const { loading, documents, handleUploadFile, handleUpdateFile } = useLegalFiles({ type: 'MONTHLY_REPORT' })
    const handleUpload = async (files, month) => {
        await handleUploadFile({
            files: files,
            metadata: {
                year: selectedYear,
                month: month,
                type: ENTITY_LEGAL_FILE.MONTHLY_REPORT
            },
            fields: {
                year: selectedYear,
                month: month
            },
            type: ENTITY_LEGAL_FILE.MONTHLY_REPORT
        })
    }
    if (loading) {
        return <div style={{ display: 'flex', alignItems: 'center' }}>
            <Spinner size="24" />
            <strong>Carregando documentos da seção</strong>
        </div>
    }
    return (
        <>
            <YearGrid
                container={{
                    onClick: (year) => setSelectedYear(year)
                }}
                render={(year) => {
                    return <strong>{year}</strong>
                }} />
            <h1>{selectedYear}</h1>
            {
                selectedYear &&
                <div style={{ display: 'flex', minWidth: '100%', overflowX: 'scroll', gap: '8px', padding: '16px' }}>
                    {months.map(month => (
                        <div style={{ minWidth: 'fit-content' }}>
                            <FileCard label={month.toUpperCase()}
                                onEdit={(id, files) => handleUpdateFile({ id, files: files })}
                                onAdd={(files) => handleUpload(files, months.indexOf(month) + 1)}
                                doc={documents.find(doc => {
                                    const { fields } = doc
                                    return (fields?.month === (months.indexOf(month) + 1) && fields?.year === (selectedYear))
                                })} />
                        </div>
                    ))}
                </div>
            }
        </>
    )

}