import { Document, Page, Text, View } from "@react-pdf/renderer";
import { pdfStyles, Strong } from "Pages/SubscribeForm/components/Form_Declarations/components/HabitationDeclarationPDF";
import { pdfjs } from "react-pdf";
import EDUCATION_TYPE from "utils/enums/education-type";
import findLabel from "utils/enums/helpers/findLabel";
import TYPE_ONE_BENEFITS from "utils/enums/type-one-benefits";
import formatDate from "utils/format-date";


export default function TypeOneCandidatePDF({ benefit }) {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.js',
        import.meta.url,
    ).toString();
    return (
        <Document title={"TERMO DE CONCESSÃO DE BENEFÍCIOS"} >
            <Page size={"A4"} style={pdfStyles.page}>
                <View style={pdfStyles.header}>
                    <Text style={pdfStyles.h1}>TERMO DE CONCESSÃO DE BENEFÍCIOS</Text>
                    <Text style={pdfStyles.h2}>TIPO I: AÇÕES DE APOIO AO ALUNO BOLSISTA</Text>

                </View>
                <View style={pdfStyles.body}>
                    <Text style={pdfStyles.text}>
                        A Entidade Beneficente {benefit?.entity?.socialReason}, inscrita no CNPJ da sob o nº {benefit?.entity?.CNPJ}
                        {benefit?.EducationLevel?.entitySubsidiary ? `mantenedora da Instituição de Ensino ${benefit?.EducationLevel?.socialReason} e código no Educacenso/e-MEC nº ${benefit?.EducationLevel?.entitySubsidiary.educationalInstitutionCode}` : ''}, denominada <Strong>CONCEDENTE</Strong>, e

                        O(a) <Strong>BENEFICIÁRIO(a)</Strong> {benefit?.candidate?.name},
                        inscrito(a) no CPF sob o nº {benefit?.candidate?.CPF}
                        data de nascimento: {formatDate(benefit?.candidate?.birthDate)}, código no Educacenso/CenSup nº {benefit?.ScholarshipGranted?.ScholarshipCode}.
                    </Text>
                    <Text style={pdfStyles.text}>
                        O(s) benefício(s) usufruído(s) serão: {benefit?.announcement?.types1?.map(e => findLabel(TYPE_ONE_BENEFITS, e)).join(', ')}
                    </Text>
                    <Text style={pdfStyles.text}>
                        Eu, candidato maior de idade, detentor(a) do Registro Geral nº {benefit?.candidate?.RG},
                        cadastrado(a) no CPF sob o nº {benefit?.candidate?.CPF},
                        {/* filho de nome do pai/mãe,  */}
                        nacionalidade {benefit?.candidateIdentity?.nationality},
                        domiciliado(a) no(a) {benefit?.candidate?.IdentityDetails?.address},
                        nº {benefit?.candidate?.IdentityDetails?.addressNumber},
                        complemento {benefit?.candidate?.IdentityDetails?.complement ?? '-'},
                        CEP: {benefit?.candidate?.IdentityDetails?.CEP},
                        bairro {benefit?.candidate?.IdentityDetails?.neighborhood},
                        cidade {benefit?.candidate?.IdentityDetails?.city},
                        UF {benefit?.candidate?.IdentityDetails?.UF},
                        aluno(a) devidamente matriculado(a) na {benefit?.EducationLevel?.availableCourses ?? benefit?.EducationLevel?.grade}{' '}
                        da {findLabel(EDUCATION_TYPE, benefit?.EducationLevel?.level)} na {benefit?.EducationLevel?.entitySubsidiary?.socialReason ?? benefit?.entity?.socialReason},
                        sou contemplado(a) com benefícios concedidos por esta instituição de ensino, conforme especificado anteriormente
                    </Text>
                    <Text style={pdfStyles.text}>
                        <Strong>DECLARO</Strong> ainda que: Possuo renda familiar bruta mensal compatível com a Lei Complementar nº 187,
                        de 16 de dezembro de 2021; Os benefícios recebidos serão usufruídos pelo(a) beneficiário(a) no
                        período letivo de {benefit?.currentYear}; Tenho ciência que responderei civil, administrativa e
                        criminalmente pela veracidade das informações aqui prestadas.

                    </Text>
                    <Text style={pdfStyles.text}>
                        <Strong>COMPROMETO-ME</Strong> a respeitar todas as condições previstas na a Lei Complementar nº 187, de 16 de dezembro de 2021, e nas demais normas que venham a substituir ou complementar a legislação vigente.

                    </Text>
                    <Text style={pdfStyles.text}>
                        <Strong>ESTOU CIENTE</Strong> de que a inobservância das normas pertinentes ao recebimento dos benefícios acima discriminados implicará o cancelamento do referido benefício.
                    </Text>

                </View>
                <View style={pdfStyles.signwrapper}>
                    <View style={pdfStyles.sign}>
                        <Text>__________________________________________________</Text>
                        <Text>Assinatura {benefit?.candidate?.name}</Text>
                    </View>
                </View>
            </Page>
        </Document>
    )
}