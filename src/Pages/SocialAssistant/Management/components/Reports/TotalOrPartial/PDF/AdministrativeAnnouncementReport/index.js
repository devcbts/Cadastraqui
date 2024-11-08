import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import PDFTable from "Components/PDF/PDFTable";
import { PDFEntityHeader, PDFFooter, PDFRowHeader, registerFont } from "Components/PDFLayout";
import { pdfStyles } from "Pages/SubscribeForm/components/Form_Declarations/components/HabitationDeclarationPDF";
import EDUCATION_TYPE from "utils/enums/education-type";
import GRADE_LEVELS from "utils/enums/grade-levels";
import findLabel from "utils/enums/helpers/findLabel";
import SCHOLARSHIP_OFFER from "utils/enums/scholarship-offer";
import SCHOLARSHIP_TYPE from "utils/enums/scholarship-type";
import SCHOOL_LEVELS from "utils/enums/school-levels";


export default function AdministrativeAnnouncementReport({
    scholarships,
    title,
    entity = null,
}) {
    return (
        <Document>

            <Page size={"A4"} style={pdfStyles.page} >
                <PDFRowHeader title={title}>
                    {entity && <PDFEntityHeader {...entity} />}
                </PDFRowHeader>
                <View style={pdfStyles.body}>

                    <PDFTable
                        headers={[
                            "Nível de ensino",
                            "Etapa/Curso",
                            "Nome do bolsista",
                            "Data de Nascimento",
                            "Código de identificação do bolsista no censo",
                            "CPF do bolsista",
                            "CPF do responsável (se houver)",
                            "Tipo de bolsa de estudo",
                            "Porcentagem da bolsa"
                        ]}
                        data={scholarships?.map(e => [
                            findLabel(EDUCATION_TYPE, e.level),
                            `${findLabel(SCHOOL_LEVELS, e.courseType) ?? e.courseType}- ${e.course}`,
                            e.candidateName,
                            e.candidateBirthDate,
                            e.ScholarshipCode,
                            e.candidateCPF,
                            e.responsibleCPF ?? '-',
                            findLabel(SCHOLARSHIP_TYPE, e.ScholarshipOfferType) ?? findLabel(SCHOLARSHIP_OFFER, e.ScholarshipOfferType),
                            e.partiaPercentage ? "Parcial - 50%" : "Integral - 100%",
                        ])}
                    >
                    </PDFTable>
                </View>
                <PDFFooter />
            </Page>
        </Document>
    )
}