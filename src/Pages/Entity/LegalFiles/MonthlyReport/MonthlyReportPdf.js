import { Document, Page, Text, View } from "@react-pdf/renderer";
import PDFTable from "Components/PDF/PDFTable";
import { PDFEntityHeader, PDFFooter, PDFRowHeader } from "Components/PDFLayout";
import { pdfStyles } from "Pages/SubscribeForm/components/Form_Declarations/components/HabitationDeclarationPDF";
import EDUCATION_TYPE from "utils/enums/education-type";
import findLabel from "utils/enums/helpers/findLabel";
import SCHOLARSHIP_TYPE from "utils/enums/scholarship-type";
import { formatCPF } from "utils/format-cpf";
import { formatCurrency } from "utils/format-currency";
import formatDate from "utils/format-date";
const getBoardView = ({ board = [], data, upperLimit, lowerLimit }) => {
    const section = board.slice(lowerLimit, upperLimit)
    return (
        <View style={{ display: 'flex', flexDirection: 'row' }}>
            {section.map((item, i) => (
                <View style={{
                    display: 'flex', width: `${100 / (section.length)}%`,
                    justifyContent: 'space-between',
                    borderRight: i >= 0 && i < upperLimit ? '1px solid black' : '',
                    borderBottom: '1px solid black',
                    padding: '2px',
                }}>
                    <Text style={{ fontSize: '7px', textAlign: 'center' }}>{String(item.title).replace(/^[a-z]/, (match) => match.toUpperCase())}</Text>
                    <Text style={{ fontSize: '7px', textAlign: 'center', fontWeight: 'bold' }}>{item.get(data)}</Text>
                </View>

            ))}
        </View>
    )
}
/**
  * @param {Object} data
 * @param {Object} [data.entity] 
 * @param {Object} [data.socialAssistant] 
 * @param {Object[]} [data.scholarships] 
 * @param {{year: string, month: string}} [data.period]
 * @returns 
 */
export default function MonthlyReportPdf(data) {
    const { entity, period, socialAssistant } = data
    if (!data) {
        return null
    }
    const getPeriod = () => {
        const date = new Date(2000, period.month - 1)
        const month = date.toLocaleString('pt-br', { month: 'long' })
        return `${month} de ${period.year}`
    }

    const board = [
        { title: 'código da instituição no censo', get: (data) => data.announcement.entity?.educationalInstitutionCode ?? data.annoucement.entity_subsidiary?.educationalInstitutionCode },
        { title: 'nível de ensino', get: (data) => findLabel(EDUCATION_TYPE, data.application.EducationLevel.level) },
        { title: 'etapa/curso', get: (data) => data.application.EducationLevel.course.name },
        // { title: 'nome do bolsista', get: (data) => data.candidateName },
        { title: 'data de nascimento', get: (data) => formatDate(data.application.candidate.birthDate) },
        { title: 'cód. de identificação do bolsista no censo', get: (data) => data.ScholarshipCode },
        { title: 'CPF do bolsista', get: (data) => formatCPF(data.candidateCPF) },
        { title: 'CPF do responsável', get: (data) => data.responsible?.CPF ? formatCPF(data.responsible?.CPF) : '-' },
        { title: 'tipo de bolsa de estudo', get: (data) => findLabel(SCHOLARSHIP_TYPE, data.application.EducationLevel.typeOfScholarship) },
        { title: 'percentual de bolsa concedida', get: (data) => data.application.ScholarshipPartial ? '50%' : '100%' },
        { title: 'renda familiar mensal per capita apurada neste mês', get: (data) => formatCurrency(data.perCapita) },
        { title: 'houve alteração quantitativa no grupo familiar?', get: (data) => data.familiarGroup },
        { title: 'houve alteração da bolsa?', get: (data) => data.scholarship },
        { title: 'novo percentual de bolsa', get: (data) => data.newScholarshipStatus ?? '-' }
    ]
    return (
        <Document>
            <Page size={"A4"} style={pdfStyles.page}>
                <PDFRowHeader title={`Relatório mensal\n${getPeriod()}`}>
                    <PDFEntityHeader {...entity} />
                </PDFRowHeader>
                <View style={{
                    padding: '32px 16px 16px 16px',
                    gap: '16px'
                }}>
                    <Text style={pdfStyles.h2}>
                        DECLARAÇÃO PARA FINS DE CUMPRIMENTO DO § 1º DO ART. 26 DA LEI COMPLEMENTAR Nº 187, DE 16 DE DEZEMBRO DE 2021
                    </Text>
                    <PDFTable
                        headers={['Nome', 'CNPJ', 'Código no educacenso/e-MEC']}
                        data={[[entity.socialReason, entity.CNPJ, entity.educationalInstitutionCode]]}
                    />
                    <Text style={pdfStyles.text}>
                        Eu, {socialAssistant?.name}, portador(a) da cédula de identidade RG nº {socialAssistant?.RG} e inscrito(a) no CPF sob o
                        nº {socialAssistant?.CPF}, Assistente Social inscrita no CRESS sob o nº {socialAssistant?.CRESS},
                        declaro para os devidos fins, que realizei o acompanhamento mensal do perfil socioeconômico dos alunos abaixo identificados no presente mês,
                        para fins de apuração de que seguem enquadrados no perfil de renda familiar bruta mensal exigida com base na Lei Complementar nº 187,
                        de 16 de dezembro de 2021
                    </Text>
                    {
                        data?.scholarships?.map((x, i) => (
                            <>
                                <Text style={pdfStyles.text}>{++i}. {x.candidateName}</Text>
                                <View style={{ border: '1px solid black', display: 'flex', flexDirection: 'column' }}>
                                    {getBoardView({ lowerLimit: 0, upperLimit: board.length / 2, board, data: x })}
                                    {getBoardView({ lowerLimit: board.length / 2, upperLimit: board.length, board, data: x })}
                                </View>
                            </>
                        ))
                    }
                </View>
                <PDFFooter />
            </Page>
        </Document>
    )
}