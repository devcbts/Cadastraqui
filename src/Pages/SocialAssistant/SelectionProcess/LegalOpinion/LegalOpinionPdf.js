import { Text, Document, Page, View } from "@react-pdf/renderer";
import PDFTable from "Components/PDF/PDFTable";
import { pdfStyles, Strong } from "Pages/SubscribeForm/components/Form_Declarations/components/HabitationDeclarationPDF";
import { pdfjs } from "react-pdf";
import DISEASES from "utils/enums/diseases";
import DOMICILE_TYPE from "utils/enums/domicile-type";
import FAMILY_RELATIONSHIP from "utils/enums/family-relationship";
import findLabel from "utils/enums/helpers/findLabel";
import MARITAL_STATUS from "utils/enums/marital-status";
import NUMBER_ROOMS from "utils/enums/number-rooms";
import PROPERTY_STATUS from "utils/enums/property-status";
import TIME_LIVING_PROPERTY from "utils/enums/time-living-property";
import VEHICLE_SITUATION from "utils/enums/vehicle-situation-type";
import formatDate from "utils/format-date";
import formatMoney from "utils/format-money";

export default function LegalOpinionPdf({ data, candidate, house, disease, members, family, medications, partial, majoracao }) {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.js',
        import.meta.url,
    ).toString();
    return (
        <Document>
            <Page size={'A4'} style={pdfStyles.page}>
                <View style={pdfStyles.header} >
                    <Text style={pdfStyles.h1}>PARECER FINAL SOBRE A INSCRIÇÃO E PERFIL SOCIOECONÔMICO</Text>
                </View>
                <View style={pdfStyles.body}>
                    <View>

                        <Text style={pdfStyles.text}>
                            Em <Strong>{formatDate(data?.application?.createdAt)}</Strong>, o(a) candidato(a) <Strong>{candidate?.name}</Strong>, portador(a)
                            da cédula de identidade RG número <Strong>{candidate?.RG}</Strong>
                            , órgão emissor <Strong>{candidate?.rgIssuingAuthority}</Strong>
                            , inscrito(a) no CPF nº <Strong>{candidate?.cpf}</Strong>
                            , nacionalidade <Strong>{candidate?.nationality}</Strong>
                            , <Strong>{MARITAL_STATUS.find(e => e.value === candidate?.maritalStatus)?.label}</Strong>
                            ,<Strong>{candidate?.profession}</Strong>
                            , residente na <Strong>{candidate?.address}</Strong>
                            , número <Strong>{candidate?.addressNumber}</Strong>
                            , CEP <Strong>{candidate?.CEP}</Strong>
                            , <Strong>{candidate?.neighborhood}</Strong>, <Strong>{candidate?.city}/{candidate?.UF}</Strong>
                            , com e-mail <Strong>{candidate?.email}</Strong>
                            , inscreveu-se para participar do processo seletivo de que trata o <Strong>{data?.application?.name}</Strong> e recebeu o número de inscrição <Strong>{data?.application?.number}</Strong>.
                        </Text>
                    </View>
                    <View>

                        <Text style={pdfStyles.text}>
                            O(A) candidato(a) possui a idade de
                            <Strong>{candidate?.age}</Strong> anos e reside{' '}
                            {family?.length ?
                                <>
                                    com:{' '}
                                    {family?.map(member =>
                                        <Strong>
                                            {`${member.name} (${FAMILY_RELATIONSHIP.find(e => e.value === member.relationship)?.label})`}
                                        </Strong>
                                    )}.
                                </>
                                : 'sozinho(a).'
                            }
                        </Text>
                    </View>

                    <View>
                        <Text style={pdfStyles.text}>
                            O grupo familiar objeto da análise reside em imóvel <Strong>{findLabel(PROPERTY_STATUS, house?.propertyStatus)}</Strong>
                            , pelo prazo de <Strong>{findLabel(TIME_LIVING_PROPERTY, house?.timeLivingInProperty)}</Strong> e
                            a moradia é do tipo <Strong>{findLabel(DOMICILE_TYPE, house?.domicileType)}</Strong>. Esta moradia
                            possui <Strong>{findLabel(NUMBER_ROOMS, house?.numberOfRooms)}</Strong> cômodo(s),
                            sendo que <Strong>{house?.numberOfBedrooms}</Strong> estão servindo permanentemente de dormitório para os moradores deste domicílio.
                        </Text>
                    </View>


                    <PDFTable headers={['Proprietário(s)', 'Modelo/Marca', 'Ano de fabricação', 'Situação']} data={data?.vehicleInfoResults.map((e) => {
                        return [e.ownerNames?.map(x => x).join(','), e.modelAndBrand, e.manufacturingYear, findLabel(VEHICLE_SITUATION, e.situation)]
                    })}
                        text={'O(s) integrantes não possuem veículo(s).'}
                        title={'O(s) integrante(s) do grupo familiar possuem o(s) seguinte(s) veículo(s):'}
                    />

                    <PDFTable headers={['Integrante', 'Doença', 'Possui relatório médico?']} data={disease?.map((e) => {

                        return [e.name, findLabel(DISEASES, e.disease), e.hasMedicalReport ? 'Sim' : 'Não']
                    })}
                        text={'Nenhum integrante do grupo familiar possui doença grave ou crônica que exija custeio elevado.'}
                        title={'O(s) integrante(s) identificado(s) abaixo possuem a(s) seguinte(s) doença(s):'}
                    />
                    <PDFTable headers={['Integrante', 'Nome do(s) medicamento(s)', 'Obtém da rede pública?']} data={medications?.map((e) => {

                        return [e.name, e.medicationName, e.obtainedPublicly ? 'Sim' : 'Não']
                    })}
                        text={'Nenhum integrante do grupo familiar faz uso de medicação de alto custo.'}
                        title={'O(s) integrante(s) identificado(s) abaixo fazem uso do(s) seguinte(s) medicamento(s):'}
                    />
                    <PDFTable headers={['Nome', 'CPF', 'Idade', 'Parentesco', 'Ocupação', 'Renda Média']} data={members?.concat([candidate])?.map((e) => {
                        return [e.name, e.cpf, e.age, findLabel(FAMILY_RELATIONSHIP, e.relationship) ?? '-', e.profession, formatMoney(e.income)]
                    })}
                        title={'Para subsistência do grupo familiar, a renda provêm de:'}
                    />
                    <Text style={pdfStyles.text}>
                        A renda média familiar mensal aferida é de {formatMoney(data?.totalIncome)}
                    </Text>
                    <Text style={pdfStyles.text}>
                    O total de recursos obtidos por cada membro que aufere renda foi somado e dividido pelo total de de pessoas que moram na mesma moradia
                        e o resultado obtido foi {formatMoney(data?.incomePerCapita)}. Desta forma,a renda é compatível com o contido no 
                        {!partial 
                        ?"inciso I do § 1º do art. 19 da Lei Complementar nº 187, de 16 de dezembro de 2021, a qual permite a concessão ou renovação da bolsa de estudo integral."
                        : "inciso II do § 1º do art. 19 da Lei Complementar nº 187, de 16 de dezembro de 2021, a qual permite a concessão ou renovação da bolsa de estudo parcial, com 50% (cinquenta por cento) de gratuidade."
                        }
                    </Text>
                    <Text style={pdfStyles.text}>
                    A soma das despesas apresentadas é {
                    data?.hasGreaterIncome 
                    ? "inferior à renda familiar bruta mensal." 
                    : "superior à renda familiar bruta mensal superior, porém sem indicativo de que haja renda não declarada, com base em toda documentação juntada e análise realizada."}
                    </Text>
                    <Text style={pdfStyles.text}>
                    Toda documentação relacionada a qualificação de todos os membros do grupo familiar, como também referente a moradia, veículos e doenças (quando aplicável), e especialmente relacionada as receitas e despesas foram recebidas e analisadas.
                    </Text>
                    <Text style={pdfStyles.text}>
                    A faculdade contida no § 2º do art. 19, relacionada a majoração em até 20% (vinte por cento) do teto estabelecido (bolsa de estudo integral),
                    ao se considerar aspectos de natureza social do beneficiário, de sua família ou de ambos, quando consubstanciados em relatório comprobatório
                    devidamente assinado por assistente social com registro no respectivo órgão de classe foi {majoracao ? "aplicada" : "não foi aplicada"}.                    </Text>

                    <View style={pdfStyles.signwrapper} wrap={false}>
                        <View style={pdfStyles.sign}>
                            <Text>____________________</Text>
                            <Text style={{ fontSize: '10px' }}>assinatura</Text>
                        </View>
                    </View>

                </View>
            </Page>
        </Document>
    )
}