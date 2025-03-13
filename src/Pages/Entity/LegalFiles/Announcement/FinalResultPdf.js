import { Document, Page, Text, View } from "@react-pdf/renderer";
import PDFTable from "Components/PDF/PDFTable";
import { PDFEntityHeader, PDFRowHeader } from "Components/PDFLayout";
import { pdfStyles } from "Pages/SubscribeForm/components/Form_Declarations/components/HabitationDeclarationPDF";
import formatDate from "utils/format-date";

export default function FinalResultPdf({ data }) {
    if (!data) {
        return null
    }
    const {
        announcement,
        entity,
        totalApplications,
        totalApproved,
        totalRejected,
        totalWaiting,
        availableVacancies
    } = data
    return (
        <Document>
            <Page size={"A4"} style={pdfStyles.page}>
                <PDFRowHeader title={`Extrato final - ${announcement.announcementName} `}>
                    {entity && <PDFEntityHeader {...entity} />}
                </PDFRowHeader>
                <View style={pdfStyles.body}>

                    <View>
                        <Text style={pdfStyles.text}>
                            Abertura: {formatDate(announcement.announcementBegin)}
                        </Text>
                        <Text style={pdfStyles.text}>
                            Vigência: {formatDate(announcement.announcementDate)}
                        </Text>
                    </View>
                    <PDFTable
                        data={[[
                            totalApplications,
                            totalApproved,
                            totalRejected,
                            totalWaiting
                        ]]}
                        headers={['Total inscritos', 'Total aprovados', 'Total indeferidos', 'Total em espera']}
                    >

                    </PDFTable>
                    <PDFTable
                        data={availableVacancies.map(e => ([e.name, e.total]))}
                        headers={['Instituição', 'Total de vagas']}
                    >

                    </PDFTable>
                </View>
            </Page>
        </Document>
    )
}