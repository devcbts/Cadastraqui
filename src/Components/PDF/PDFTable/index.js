import { Font, StyleSheet, Text, View } from "@react-pdf/renderer";
import { pdfStyles } from "Pages/SubscribeForm/components/Form_Declarations/components/HabitationDeclarationPDF";

export const pdfTableStyles = StyleSheet.create({
    header: {
        display: 'flex',
        flexDirection: 'row',
        borderBottom: '1px solid black',
        fontSize: '10px',
        textAlign: 'center'
    },
    row: {
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'row',
        borderBottom: '1px solid black',
        fontSize: '8px',
        textAlign: 'center',
        alignItems: 'center'
    },
    cell: {
        padding: '4px'
    },
    leftBorder: {
        borderLeft: '1px solid black'
    },
    rightBorder: {
        borderRight: '1px solid black'
    },
})

export const chunkSubstr = (str, size) => {
    const numChunks = Math.ceil(str.length / size);
    const chunks = new Array(numChunks);

    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
        chunks[i] = str.substr(o, size);
    }

    return chunks;
};

Font.registerHyphenationCallback((word) => {
    if (word.length > 16) {
        return chunkSubstr(word, 14);
    } else {
        return [word];
    }
});
// const getCurrentBorder = (index, max) => {
//     if (index === 1) {
//         return pdfTableStyles.rightBorder
//     }
//     if (index === max) {
//         return pdfTableStyles.leftBorder
//     }
//     return { ...pdfTableStyles.leftBorder, ...pdfTableStyles.rightBorder }
// }
export default function PDFTable({ headers, data, title, text }) {
    return (
        <View>
            {data?.length ?
                <>
                    {title && <Text style={pdfStyles.text}>{title}</Text>}
                    <View style={pdfTableStyles.header}>
                        {headers.map((e, i) => (
                            <Text style={{ width: `${(100 / headers.length)}%` }} >{e}</Text>
                        ))}
                    </View>
                    {data?.map(e =>
                        <View style={pdfTableStyles.row}>
                            {e.map((v, i) =>
                                <View style={{ ...pdfTableStyles.cell, width: `${(100 / headers.length)}%` }}>
                                    <Text >{v}</Text>
                                </View>
                            )}
                        </View>
                    )}
                </>
                : <Text style={pdfStyles.text}>{text}</Text>
            }
        </View>
    )
}