import { Document, Page, Text, View } from "@react-pdf/renderer";
import PDFTable from "Components/PDF/PDFTable";
import { pdfStyles } from "Pages/SubscribeForm/components/Form_Declarations/components/HabitationDeclarationPDF";
import EDUCATION_TYPE from "utils/enums/education-type";
import findLabel from "utils/enums/helpers/findLabel";
import SCHOOL_LEVELS from "utils/enums/school-levels";

export default function NominalReportPDF({
    students
}) {
    return (
        <Document>

            <Page size={"A4"} style={pdfStyles.page} >
                <View style={pdfStyles.header}>
                    <Text style={pdfStyles.h1}>Relatório Nominal de Bolsistas</Text>
                </View>
                <View style={pdfStyles.body}>

                    <PDFTable
                        headers={[
                            "Entidade",
                            "CNPJ",
                            "Bolsista",
                            "Nível de ensino",
                            "Etapa/Curso",
                            "Porcentagem da bolsa"
                        ]}
                        data={students?.map(e => [
                            e.entityName,
                            e.entityCNPJ,
                            e.candidateName,
                            findLabel(EDUCATION_TYPE, e.level),
                            `${findLabel(SCHOOL_LEVELS, e.courseType) ?? e.courseType}- ${e.course}`,
                            e.partiaPercentage ? "Parcial - 50%" : "Integral - 100%",
                        ])}
                    >
                    </PDFTable>
                </View>

            </Page>
        </Document>
    )
}