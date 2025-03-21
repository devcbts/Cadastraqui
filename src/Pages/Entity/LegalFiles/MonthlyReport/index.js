import { ReactComponent as Back } from 'Assets/icons/chevron.svg'
import ButtonBase from "Components/ButtonBase"
import Spinner from "Components/Loader/Spinner"
import { useState } from "react"
import { NotificationService } from 'services/notification'
import { ENTITY_LEGAL_FILE } from "utils/enums/entity-legal-files-type"
import FileCard from "../FileCard"
import YearGrid from "../YearGrid"
import { useLegalFiles } from "../useLegalFiles"
import PreMonthlyReportPdf from "./PreMonthlyReportPdf"
export default function MonthlyReport() {
    const [selectedYear, setSelectedYear] = useState(null)
    const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
    const { loading, documents, handleUploadFile, handleUpdateFile } = useLegalFiles({ type: 'MONTHLY_REPORT' })
    const handleUpload = async (files, month, year) => {
        await handleUploadFile({
            files: files,
            metadata: {
                year: year ?? selectedYear,
                month: month,
                type: ENTITY_LEGAL_FILE.MONTHLY_REPORT
            },
            fields: {
                year: year ?? selectedYear,
                month: month
            },
            type: ENTITY_LEGAL_FILE.MONTHLY_REPORT
        })
    }
    const [generating, setGenerating] = useState(false)
    if (loading) {
        return <div style={{ display: 'flex', alignItems: 'center' }}>
            <Spinner size="24" />
            <strong>Carregando documentos da seção</strong>
        </div>
    }

    return (
        <>
            {generating && <>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer', marginBottom: 16, width: 'fit-content' }} onClick={() => setGenerating(false)}>
                    <Back style={{ transform: 'rotate(90deg)' }} height={20} /> Voltar
                </div>
                <PreMonthlyReportPdf
                    docFields={documents.map(x => x.metadata)}
                    onSign={async ({ year, month, blob }) => {
                        const file = new File([blob], `relatório_${month}_${year}.pdf`, { type: blob.type })
                        await handleUpload(file, month, year).then(_ => {
                            NotificationService.success({
                                text: 'Verifique seu e-mail para assinar o arquivo'
                            })
                        })
                    }} />
            </ >}

            {!generating && <>
                <ButtonBase label={'Criar relatório'} style={{ placeSelf: 'flex-start' }} onClick={() => {
                    setGenerating(true)
                }} />
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
                                    // onEdit={(id, files) => handleUpdateFile({ id, files: files })}
                                    onAdd={(files) => handleUpload(files, months.indexOf(month) + 1)}
                                    doc={documents.find(doc => {
                                        const { fields } = doc
                                        return (fields?.month === (months.indexOf(month) + 1) && fields?.year === (selectedYear))
                                    })} />
                            </div>
                        ))}
                    </div>
                }
            </>}
        </>
    )

}