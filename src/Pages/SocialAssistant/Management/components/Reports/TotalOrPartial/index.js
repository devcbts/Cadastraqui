import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Excel } from 'Assets/icons/excel.svg'
import { ReactComponent as PDF } from 'Assets/icons/PDF.svg'
import { useLocation } from "react-router";
import { useMemo, useState } from "react";
import { NotificationService } from "services/notification";
import socialAssistantService from "services/socialAssistant/socialAssistantService";
import { pdf } from "@react-pdf/renderer";
import AdministrativeAnnouncementReport from "./PDF/AdministrativeAnnouncementReport";
export default function TotalOrPartialReport() {
    const { state } = useLocation()
    const announcement = useMemo(() => state?.announcement?.announcement, [state])
    const courses = useMemo(() => state?.announcement?.educationLevels, [state])
    const [doc, setPdf] = useState({ id: null, url: null })
    const handleGetPartialReport = async ({ id, name, type = "CSV" }) => {
        try {
            const filename = `relatorio_parcial_${name}`
            const information = await socialAssistantService.getPartialReport(announcement.id, id, type, { filename })
            if (type === "PDF") {
                const blob = await pdf(<AdministrativeAnnouncementReport title={"Relatório Parcial"}
                    scholarships={information.scholarshipsInfos}
                    entity={information.entity}
                />).toBlob()
                const url = URL.createObjectURL(blob)
                setPdf({ id, url })
                handleOpenDocument(url)
            }

        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        }
    }
    const handleGetGeneralReport = async ({ type = "CSV" }) => {
        try {
            const filename = `relatorio_geral`
            const information = await socialAssistantService.getFullReport(announcement.id, type, { filename })
            if (type === "PDF") {
                const blob = await pdf(<AdministrativeAnnouncementReport title={"Relatório Geral"}
                    scholarships={information.scholarshipsInfos}
                    entity={information.entity}
                />).toBlob()
                const url = URL.createObjectURL(blob)
                handleOpenDocument(url)
            }

        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        }
    }
    const handleOpenDocument = (url) => {
        window.open(url, "_blank")
    }
    return (
        <div style={{ padding: '32px 24px 0px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ textAlign: 'center' }}>Processo seletivo {announcement?.announcementName} -  Resultado final</h3>
            {/* <label>Instituição Universidade teste - CNPJ cnpj</label> */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <h2 style={{ textAlign: 'center' }}>Relatório geral</h2>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '24px' }}>
                    <ButtonBase onClick={() => handleGetGeneralReport({ type: "CSV" })}>
                        <Excel width={30} height={30} />
                    </ButtonBase>
                    <ButtonBase onClick={() => handleGetGeneralReport({ type: "PDF" })}>
                        <PDF width={30} height={30} />
                    </ButtonBase>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <h2 style={{ textAlign: 'center' }}>Relatório parcial</h2>
                    {
                        courses?.filter(e => e.matchedEducationLevels?.length !== 0).map(entity => {
                            return (
                                <div
                                    key={entity.id}
                                    style={{
                                        padding: '0px 24px 4px 24px',
                                        display: 'flex', flexWrap: 'wrap',
                                        flexDirection: 'row', borderBottom: '2px solid #1F4B73',
                                        width: 'max(60%,400px)',
                                        justifyContent: 'space-between', alignItems: 'center', placeSelf: 'center'
                                    }}>
                                    <label>{entity.socialReason}</label>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '24px' }}>
                                        <ButtonBase onClick={() => handleGetPartialReport({ id: entity.id, name: entity.socialReason })} >
                                            <Excel width={20} height={20} />
                                        </ButtonBase>
                                        <ButtonBase onClick={() => {
                                            if (doc.id === entity.id) return handleOpenDocument(doc.url)
                                            handleGetPartialReport({ id: entity.id, name: entity.socialReason, type: 'PDF' })
                                        }} >
                                            <PDF width={20} height={20} />
                                        </ButtonBase>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}