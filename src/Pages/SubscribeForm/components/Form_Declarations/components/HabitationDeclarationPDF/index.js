import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { pdfjs } from 'react-pdf';

export const pdfStyles = StyleSheet.create({
    page: {
        display: 'flex',
        flexDirection: 'column',
        padding: '12px 24px',
        textOverflow: 'wrap',
        lineHeight: 1.5,
        fontFamily: 'Poppins'
    },
    header: {
        textAlign: 'center'
    },
    h2: {
        fontSize: '14px',
        textAlign: 'center',
        textTransform: 'capitalize'
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
        fontWeight: 'heavy',
        fontSize: '10px',
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

export const Strong = ({ children }) => {
    return <Text style={pdfStyles.strong}>{children ?? '________________________ '}</Text>
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
    owner,
    title,
    children
}) {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.js',
        import.meta.url,
    ).toString();

    return (
        <Document title={title}>
            <Page size={'A4'} style={pdfStyles.page}>
                <View style={pdfStyles.header} >
                    <Text style={pdfStyles.h2}>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</Text>
                </View>
                <View style={pdfStyles.body} >
                    <Text style={pdfStyles.h3} > {title} </Text>

                    <Text style={pdfStyles.text}>
                        {children}
                    </Text>
                </View>
                <View style={pdfStyles.signwrapper}>
                    <View style={pdfStyles.sign}>
                        <Text>_____________________________________</Text>
                        <Text>{owner.ownerName}</Text>
                        <Text>Assinatura do(a) declarante</Text>
                    </View>
                    <View style={pdfStyles.signrow}>
                        <View style={pdfStyles.sign}>
                            <Text>_____________________________________</Text>
                            <Text>assinatura do(a) 1ª testemunha</Text>
                            <Text>Nome: ______________________________</Text>
                            <Text>CPF: _______________________________</Text>
                        </View>
                        <View style={pdfStyles.sign}>
                            <Text>_____________________________________</Text>
                            <Text>assinatura do(a) 2ª testemunha</Text>
                            <Text>Nome: ______________________________</Text>
                            <Text>CPF: _______________________________</Text>
                        </View>
                    </View>

                </View>
            </Page>

        </Document>
    )
}