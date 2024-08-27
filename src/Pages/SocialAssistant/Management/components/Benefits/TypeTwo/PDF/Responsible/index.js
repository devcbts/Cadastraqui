import { Document, Page, Text, View } from "@react-pdf/renderer";
import { pdfStyles, Strong } from "Pages/SubscribeForm/components/Form_Declarations/components/HabitationDeclarationPDF";
import { pdfjs } from "react-pdf";


export default function TypeOneResponsiblePDF() {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.js',
        import.meta.url,
    ).toString();
    return (
        <Document title={"TERMO DE CONCESSÃO DE BENEFÍCIOS"} >
            <Page size={"A4"} style={pdfStyles.page}>
                <View style={pdfStyles.header}>
                    <Text style={pdfStyles.h1}>TERMO DE CONCESSÃO DE BENEFÍCIOS</Text>
                    <Text style={pdfStyles.h2}>TIPO II: AÇÕES E SERVIÇOS DESTINADOS AO ALUNO E SEU GRUPO FAMILIAR</Text>

                </View>
                <View style={pdfStyles.body}>
                    <Text style={pdfStyles.text}>
                        A Entidade Beneficente X, inscrita no CNPJ da sob o nº xxxxx, mantenedora da Instituição de Ensino X e código no Educacenso/e-MEC nº xxxxxx, denominada <Strong>CONCEDENTE</Strong>, e

                        O(a) <Strong>ESTUDANTE</Strong> X, inscrito(a) no CPF sob o nº xxxxx, data de nascimento: xx/xx/xxxx, código no Educacenso/CenSup nº xxxxx, <Strong>BENEFICIÁRIO(a)</Strong> de bolsa de estudo nos termos da Lei Complementar nº 187, de 16 de dezembro de 2021 representado(a) por X, inscrito(a) no CPF sob o nº xxxxx.

                        (preencher de acordo com a quantidade de integrantes no grupo familiar)
                        O(a) X, <Strong>BENEFICIÁRIO(a)</Strong> não estudante, inscrito no CPF sob o nº xxxxx, data de nascimento: xx/xx/xxxx e parentesco do beneficiário com estudante da educação básica/superior X.

                        O(s) benefício(s) usufruído(s) serão: descrição.

                        Eu, responsável legal <Strong>DECLARO</Strong> para devidos fins que nome do aluo beneficiado, nacionalidade X, domiciliado(a) no(a) X, nº xx, complemento X, CEP: xxxxx-xxx, bairro X, cidade X, estado X, UF xx, detentor(a) do Registro Geral nº xxxxx, cadastrado(a) no CPF sob o nº xxxxx, filho de nome do pai/mãe, aluno(a) devidamente matriculado(a) na série/ano/período da educação básica/superior na nome da instituição, sou contemplado(a) de ações e serviços destinados a alunos e seu grupo familiar, concedido por esta instituição de ensiono, conforme  especificado anteriormente.

                        <Strong>DECLARO</Strong> ainda que: Possuo renda familiar bruta mensal compatível com a Lei Complementar nº 187, de 16 de dezembro de 2021; Os benefícios recebidos serão usufruídos pelo(a) beneficiário(a) no período letivo de 20XX; Tenho ciência que responderei civil, administrativa e criminalmente pela veracidade das informações aqui prestadas.

                        <Strong>COMPROMETO-ME</Strong> a respeitar todas as condições previstas na a Lei Complementar nº 187, de 16 de dezembro de 2021, e nas demais normas que venham a substituir ou complementar a legislação vigente.

                        <Strong>ESTOU CIENTE</Strong> de que a inobservância das normas pertinentes ao recebimento dos benefícios acima discriminados implicará o cancelamento do referido benefício.




                    </Text>

                </View>
                <View style={pdfStyles.sign}>
                    <Text>__________________________________________________</Text>
                    <Text>Assinatura Responsável</Text>
                </View>
            </Page>
        </Document>
    )
}