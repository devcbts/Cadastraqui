// DeclarationPDF.js
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    lineHeight: 1.5,
  },
});

const DeclarationPDF = ({ declarationData }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</Text>
        <Text style={styles.text}>{declarationData.fullName} </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.text}>
          Eu, {declarationData.fullName}, portador(a) da cédula de identidade RG nº {declarationData.RG}, órgão emissor {declarationData.rgIssuingAuthority}, UF do órgão emissor {declarationData.rgIssuingState} ou portador(a) da {declarationData.documentType}, número {declarationData.documentNumber}, validade {declarationData.documentValidity}, inscrito(a) no CPF nº {declarationData.CPF}, nacionalidade {declarationData.nationalidade}, estado civil {declarationData.maritalStatus}, profissão {declarationData.profession}, residente na {declarationData.address}, nº {declarationData.addressNumber}, complemento, CEP: {declarationData.CEP}, bairro {declarationData.neighborhood}, cidade {declarationData.city}, estado {declarationData.UF}, UF {declarationData.UF}, e-mail: {declarationData.email}, responsável legal por (quando for o caso, incluir os nomes dos menores de idade do grupo familiar), declaro para os devidos fins do processo seletivo realizado nos termos da Lei Complementar nº 187, de 16 de dezembro de 2021 que:
        </Text>
      </View>
    </Page>
  </Document>
);

export default DeclarationPDF;
