import { Document, Page, Text, View } from "@react-pdf/renderer";
import HabitationDeclarationPDF, { pdfStyles, Strong } from "Pages/SubscribeForm/components/Form_Declarations/components/HabitationDeclarationPDF";
import { useEffect, useState } from "react";
import { pdfjs } from "react-pdf";
import candidateService from "services/candidate/candidateService";

export default function FinancialHelpPdf({
    owner,
    lastIncomeHelp,
    memberId
}) {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.js',
        import.meta.url,
    ).toString();
    const [user, setUser] = useState(null)
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const members = await candidateService.getFamilyMembers({ includeSelf: true })
                console.log(members)
                setUser(members?.find(e => e.id === memberId))
            } catch (err) { }
        }
        fetchUser()
    }, [])
    return (
        <Document title={'Declaração de ajuda financeira de terceiros'}>
            <Page size={'A4'} style={pdfStyles.page}>
                <View style={pdfStyles.header} >
                    <Text style={pdfStyles.h1}>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</Text>
                </View>
                <View style={pdfStyles.body} >
                    <Text style={pdfStyles.h2} >declaração de ajuda financeira de terceiros </Text>

                    <Text style={pdfStyles.text}>
                        Eu, <Strong>{owner?.ownerName}</Strong>, portador(a) da cédula de identidade RG nº <Strong>{owner?.RG}</Strong>, órgão emissor <Strong>{owner?.documentIssuing}</Strong>,
                        UF do órgão emissor <Strong>{owner?.ufIssuing}</Strong>,inscrito(a) no CPF nº <Strong>{owner?.CPF}</Strong>, nacionalidade <Strong>{owner?.nationality}</Strong>,
                        estado civil casado, profissão <Strong>{owner?.profession}</Strong>, residente no(a) <Strong>{owner?.address}</Strong>, nº <Strong>{owner?.addressNumber}</Strong>,
                        CEP <Strong>{owner?.CEP}</Strong>, bairro <Strong>{owner?.neighborhood}</Strong>, cidade <Strong>{owner?.city}</Strong>, UF <Strong>{owner?.UF}</Strong>, e-mail <Strong>{owner?.email}</Strong>,
                        declaro para os devidos fins do processo seletivo realizado nos termos da Lei Complementar nº 187, de 16 de dezembro de 2021 que ajudo financeiramente <Strong>{user?.fullName}</Strong>,
                        inscrito no CPF nº <Strong>{user?.CPF}</Strong> com valor mensal de <Strong>{lastIncomeHelp}</Strong>.
                    </Text>
                    <Text style={pdfStyles.text}>{`${owner?.city}, ${new Date().toLocaleString('pt-br', { month: 'long', year: 'numeric', day: '2-digit' })}`}</Text>
                </View>
                <View style={pdfStyles.signwrapper}>
                    <View style={pdfStyles.sign}>
                        <Text>____________________</Text>
                        <Text>{owner?.ownerName}</Text>
                        <Text>assinatura do(a) declarante</Text>
                    </View>
                    <View style={pdfStyles.signrow}>
                        <View style={pdfStyles.sign}>
                            <Text>____________________</Text>
                            <Text>assinatura do(a) 1ª testemunha</Text>
                            <Text>Nome: ____________________</Text>
                            <Text>CPF: ____________________</Text>
                        </View>
                        <View style={pdfStyles.sign}>
                            <Text>____________________</Text>
                            <Text>assinatura do(a) 2ª testemunha</Text>
                            <Text>Nome: ____________________</Text>
                            <Text>CPF: ____________________</Text>
                        </View>
                    </View>

                </View>
            </Page>

        </Document>


    )
}