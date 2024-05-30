import { Document, Line, Page, PDFViewer, StyleSheet, Svg, Text, View } from '@react-pdf/renderer'
import { useEffect, useState } from 'react';
import { pdfjs } from 'react-pdf';
import candidateService from 'services/candidate/candidateService';

const styles = StyleSheet.create({
    page: {
        display: 'flex',
        flexDirection: 'column',
        padding: '12px 24px',
        textOverflow: 'wrap',
        lineHeight: 1.5
    },
    header: {
        textAlign: 'center'
    },
    h2: {
        fontSize: '14px',
        textAlign: 'center'
    },
    h1: {
        fontSize: '16px',
        textTransform: 'uppercase'
    },
    body: {
        marginTop: '96px',
        gap: '16px'
    },
    text: {
        fontSize: '10px',
        textAlign: 'justify'
    },
    strong: {
        fontWeight: 'black',
        fontSize: '10px',
        color: 'red',
        textTransform: 'uppercase'
    },
    signwrapper: {
        marginTop: '50px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '24px',
        width: '100%'
    },
    signrow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    sign: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: '8px'
    },
    // placeholder: {
    //     display: 'flex',
    //     flexDirection: 'row',
    //     justifyContent: 'center',
    //     alignItems: 'center'
    // }
})

const Strong = ({ children }) => {
    return <Text style={styles.strong}>{children ?? '________________________ '}</Text>
}
// const Placeholder = ({ text, width = 120 }) => {
//     return (
//         <View style={styles.placeholder}>
//             <Text>{text}</Text>
//             <Svg height="" >
//                 <Line
//                     x1="0"
//                     y1="0"
//                     x2={width}
//                     y2="0"
//                     strokeWidth={2.5}
//                     stroke="#0000"
//                 />
//             </Svg>
//         </View>
//     )
// }
export default function HabitationDeclarationPDF({
    owner
}) {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.js',
        import.meta.url,
    ).toString();
    const [user, setUser] = useState(null)
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const info = await candidateService.getBasicInfo()
                setUser(info)
                console.log('aaa', info)
            } catch (err) { }
        }
        fetchUser()
    }, [])
    return (
        <Document title='Declaração de imóvel cedido'>
            <Page size={'A4'} style={styles.page}>
                <View style={styles.header} >
                    <Text style={styles.h1}>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</Text>
                </View>
                <View style={styles.body} >
                    <Text style={styles.h2} > Declaração de Imóvel Cedido </Text>
                    <Text style={styles.text}>
                        Eu, <Strong>{owner.ownerName}</Strong>, portador(a) da cédula de identidade RG nº <Strong>{owner.RG}</Strong>, órgão emissor <Strong>{owner.documentIssuing}</Strong>,
                        UF do órgão emissor <Strong>{owner.ufIssuing}</Strong>,inscrito(a) no CPF nº <Strong>{owner.CPF}</Strong>, nacionalidade <Strong>{owner.nationality}</Strong>,
                        estado civil casado, profissão <Strong>{owner.profession}</Strong>, residente no(a) <Strong>{owner.address}</Strong>, nº <Strong>{owner.addressNumber}</Strong>,
                        CEP <Strong>{owner.CEP}</Strong>, bairro <Strong>{owner.neighborhood}</Strong>, cidade <Strong>{owner.city}</Strong>, UF <Strong>{owner.UF}</Strong>, e-mail <Strong>{owner.email}</Strong>,
                        declaro para os devidos fins do processo seletivo realizado nos termos da Lei Complementar nº 187, de 16 de dezembro de 2021 que meu imóvel localizado no(a)
                        <Strong>{user?.address}</Strong>, nº <Strong>{user?.addressNumber}</Strong>, CEP <Strong>{user?.CEP}</Strong>, bairro <Strong>{user?.neighborhood}</Strong>,
                        cidade <Strong>{user?.city}</Strong> estado <Strong>{user?.UF}</Strong>, UF <Strong>{user?.UF}</Strong>, foi cedido sem nenhum custo/ônus para
                        <Strong> {user?.name}</Strong> (nome do membro familiar para o qual o imóvel foi cedido), inscrito(a) no
                        CPF nº <Strong>{user?.CPF}</Strong>.
                    </Text>
                </View>
                <View style={styles.signwrapper}>
                    <View style={styles.sign}>
                        <Text>____________________</Text>
                        <Text>{owner.ownerName}</Text>
                        <Text>assinatura do(a) declarante</Text>
                    </View>
                    <View style={styles.signrow}>
                        <View style={styles.sign}>
                            <Text>____________________</Text>
                            <Text>assinatura do(a) 1ª testemunha</Text>
                            <Text>Nome: ____________________</Text>
                            <Text>CPF: ____________________</Text>
                        </View>
                        <View style={styles.sign}>
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