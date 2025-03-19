import { Image, Text, View } from "@react-pdf/renderer"
import Logo from 'Assets/images/logo_white.png'
import { pdfStyles } from "Pages/SubscribeForm/components/Form_Declarations/components/HabitationDeclarationPDF"
const styles = {
    footer: {
        position: "absolute",
        padding: '0 32',
        bottom: 0,
        width: '100vw',
        height: 40,
        backgroundColor: '#1F4B73',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        // placeContent: 'center',
        justifyContent: 'space-between',
        color: 'white',
        fontSize: 10
    }
}

const PDFFooter = () => (<View style={styles.footer} fixed>
    <Image
        source={Logo}
        style={{ height: '30px', width: '120px' }}

    >
    </Image>
    <Text render={({ pageNumber, totalPages }) => {
        return `Pág. ${pageNumber}/${totalPages}`
    }}></Text>
</View>)


const PDFEntityHeader = ({ socialReason, address, addressNumber, city, UF, CEP, img }) => {
    return (
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginTop: 8 }}>
            {img &&
                <Image style={{ height: 45, width: 45, marginBottom: 8, borderRadius: 8, overflow: 'hidden' }} src={img}
                    cache={false}
                />
            }
            <View style={{ display: 'flex', flexDirection: 'column', marginLeft: 4 }}>
                <Text style={{ fontSize: 10, fontWeight: "semibold", }}>{socialReason}</Text>
                <View style={{
                    display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-start',
                    fontSize: 8, fontWeight: "light"
                }}>
                    <Text>{`${address} Nº${addressNumber}`}</Text>
                    <Text>{`${city} - ${UF}`}</Text>
                    <Text>{CEP}</Text>
                </View>
            </View>
        </View>
    )
}
const PDFRowHeader = ({
    title,
    children
}) => {
    return (
        <PDFHeader>
            {title && <View style={{ ...pdfStyles.header, flex: 1 }}>
                <Text style={pdfStyles.h1}>{title}</Text>
            </View>}
            {children}
        </PDFHeader>
    )
}

const PDFHeader = ({ children }) => {
    return (
        <View style={{
            display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
            borderBottom: '3px solid #1F4B73', paddingBottom: 4,
        }}>
            {children}
        </View>
    )
}
export {
    PDFEntityHeader, PDFFooter, PDFHeader, PDFRowHeader
}
