import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { pdfStyles } from "Pages/SubscribeForm/components/Form_Declarations/components/HabitationDeclarationPDF";

export const pdfTableStyles = StyleSheet.create({
    header: {
        display: 'flex',
        flexDirection: 'row',
        borderBottom: '1px solid #1F4B73',
        fontSize: '12px',
        textAlign: 'center'
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        borderBottom: '1px solid #1F4B73',
        fontSize: '10px',
        textAlign: 'center'
    },
    cell: {

    }
})

export default function PDFTable({ headers, data, text }) {
    return (
        <View>



            {data?.length ?
                <>
                    <View style={pdfTableStyles.header}>
                        {headers.map(e => (
                            <Text style={{ width: `${(100 / headers.length)}%` }} >{e}</Text>
                        ))}
                    </View>
                    {data?.map(e =>
                        <View style={pdfTableStyles.row}>
                            {e.map(v =>

                                <Text style={{ width: `${(100 / headers.length)}%` }} >{v}</Text>
                            )}
                        </View>
                    )}
                </>
                : <Text style={pdfStyles.text}>{text}</Text>
            }
        </View>
    )
}