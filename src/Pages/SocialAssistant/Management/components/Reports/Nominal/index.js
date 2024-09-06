import ButtonBase from "Components/ButtonBase";
import InputBase from "Components/InputBase";
import Table from "Components/Table";
import { ReactComponent as Excel } from 'Assets/icons/excel.svg'
import { ReactComponent as PDF } from 'Assets/icons/PDF.svg'
import RowActionInput from "../../RowActionInput";
import { useLocation } from "react-router";
import { useMemo } from "react";
import { pdf } from "@react-pdf/renderer";
import NominalReportPDF from "./PDF/NominalReport";
import { NotificationService } from "services/notification";
import socialAssistantService from "services/socialAssistant/socialAssistantService";
export default function NominalReport() {
    const { state } = useLocation()
    const announcement = useMemo(() => state?.announcement, [state])
    const handleGenerateNominalReport = async ({ id, name, format = "CSV" }) => {
        try {
            const filename = `relatorio_bolsistas_${name}`
            const information = await socialAssistantService.getNominalReport(announcement?.announcement?.id, id, format, { filename })
            if (format === "PDF") {
                const blob = await pdf(<NominalReportPDF students={information.scholarshipsInfos} />).toBlob()
                const url = URL.createObjectURL(blob)
                window.open(url, "_blank")
            }

        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        }
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '24px', width: 'max(40%,400px)' }}>
            {/* <RowActionInput
                label="Cod. instituição no censo"
                buttonProps={{ label: 'salvar' }}
            /> */}

            <div style={{ marginTop: '24px' }}>
                <h3 style={{ textAlign: 'center' }}>Relação nominal de bolsistas</h3>
                <Table.Root headers={['unidade/cidade', 'gerar']}>
                    {
                        announcement?.educationLevels?.filter(e => e.matchedEducationLevels?.length !== 0).map(entity => {
                            return (
                                <Table.Row>
                                    <Table.Cell>{entity?.socialReason} - {entity?.city}</Table.Cell>
                                    <Table.Cell>
                                        <ButtonBase onClick={() => handleGenerateNominalReport({ id: entity.id, name: entity.socialReason })}>
                                            <Excel />
                                        </ButtonBase>
                                        <ButtonBase onClick={() => handleGenerateNominalReport({ id: entity.id, name: entity.socialReason, format: "PDF" })}>
                                            <PDF />
                                        </ButtonBase>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })
                    }
                </Table.Root>
            </div>
        </div>
    )
}