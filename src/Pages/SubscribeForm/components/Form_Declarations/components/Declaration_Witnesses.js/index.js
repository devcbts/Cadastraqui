import { Document, PDFDownloadLink, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import FormFilePicker from 'Components/FormFilePicker';
import Tooltip from 'Components/Tooltip';
import useAuth from 'hooks/useAuth';
import useControlForm from 'hooks/useControlForm';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { api } from 'services/axios'; // Certifique-se de que o caminho está correto
import { NotificationService } from 'services/notification';
import uploadService from 'services/upload/uploadService';
import BANK_ACCOUNT_TYPES from 'utils/enums/bank-account-types';
import findLabel from 'utils/enums/helpers/findLabel';
import { z } from 'zod';
import declarationAtom from '../../atoms/declarationAtom';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto

export default function Declaration_Witnesses({ onBack, onNext, userId }) {
    const { auth } = useAuth();
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);
    const [witness1, setWitness1] = useState({ name: '', cpf: '' });
    const [witness2, setWitness2] = useState({ name: '', cpf: '' });
    const [declarations, setDeclarations] = useState([]);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState('');
    // const [file, setFile] = useState(null)
    const { control, getValues, formState: { isValid }, trigger } = useControlForm({
        schema: z.object({
            file: z.instanceof(File, 'Arquivo obrigatório').refine(d => !!d, 'Arquivo obrigatório')
        }),
        defaultValues: {
            file: null
        }
    })
    // useEffect(() => {
    //     const savedData = localStorage.getItem('declarationData');
    //     if (savedData) {
    //         setDeclarationData(JSON.parse(savedData));
    //     }
    // }, []);

    const fetchDeclarations = async () => {
        const types = ['Form', 'Activity', 'AddressProof', 'Autonomo', 'Card',
            'ChildPension', 'ChildSupport', 'ContributionStatement', 'Data',
            'Empresario', 'InactiveCompany', 'IncomeTaxExemption', 'MEI',
            'NoAddressProof', 'Pension', 'Rent', 'RentDetails',
            'RentIncome', 'RentedHouse', 'RuralWorker', 'SingleStatus', 'StableUnion', 'Status', 'WorkCard'];
        // const fetchedDeclarations = [];
        const title = {
            Form: '',
            AddressProof: 'DECLARAÇÃO DE AUSÊNCIA DE COMPROVANTE DE ENDEREÇO',
            RentedHouse: 'DECLARAÇÃO DE IMÓVEL ALUGADO - SEM CONTRATO DE ALUGUEL',
            WorkCard: 'DECLARAÇÃO QUE INTEGRANTE DO GRUPO FAMILIAR AINDA NÃO POSSUI CARTEIRA DE TRABALHO (maiores de 16 anos)',
            StableUnion: 'DECLARAÇÃO DE UNIÃO ESTÁVEL',
            SingleStatus: 'DECLARAÇÃO DE ESTADO CIVIL SOLTEIRO(A)',
            NoAddressProof: 'DECLARAÇÃO DE SEPARAÇÃO DE FATO (NÃO JUDICIAL)',
            IncomeTaxExemption: 'DECLARAÇÃO DE ISENTO DE IMPOSTO DE RENDA',
            Activity: 'DECLARAÇÃO DE AUSÊNCIA DE RENDA (DESEMPREGADO(A) OU DO LAR)',
            MEI: 'DECLARAÇÃO DE RENDIMENTOS – MEI',
            RuralWorker: 'DECLARAÇÃO DE TRABALHADOR(A) RURAL',
            Autonomo: 'DECLARAÇÃO DE AUTÔNOMO(A)/RENDA INFORMAL',
            Empresario: 'DECLARAÇÃO DE RENDA DE EMPRESÁRIO',
            InactiveCompany: 'DECLARAÇÃO DE EMPRESA INATIVA',
            Status: 'DECLARAÇÃO DE PROPRIEDADE DE VEÍCULO AUTOMOTOR',
            Pension: 'DECLARAÇÃO DE PENSÃO ALIMENTÍCIA',
            RentIncome: 'DECLARAÇÃO DE RENDIMENTO DE IMÓVEL ALUGADO',
            Rent: 'DECLARAÇÃO DE IMÓVEL ALUGADO - SEM CONTRATO DE ALUGUEL'

        }
        try {
            const response = await api.get(`/candidates/declaration/${declarationData.id}`)
            setDeclarations(response.data.declarations.map((e) => ({ ...e, title: title[e?.declarationType] })))
        } catch (err) {

        }
        // for (const type of types) {
        //     try {
        //         const response = await api.get(`/candidates/declaration/${type}/${declarationData.id}`);
        //         if (response.data && response.data.declaration) {
        //             fetchedDeclarations.push({ type, text: response.data.declaration.text, title: title[type] });
        //         }
        //     } catch (error) {
        //         console.error(`Erro ao buscar a declaração de tipo ${type}:`, error);
        //     }
        // }

    };

    const handleGeneratePDF = () => {
        setIsGeneratingPDF('generating');
        fetchDeclarations().then(() => {
            setIsGeneratingPDF('done');
        });
    };


    const styles = StyleSheet.create({

        page: {
            padding: 30,
            fontSize: 12,
            fontFamily: 'Times-Roman'
        },
        section: {
            marginBottom: 32,
        },
        declarationType: {
            textAlign: 'center',
            fontSize: 12,
            fontWeight: 'heavy',
            marginBottom: 16
        },
        declarationText: {
            textAlign: 'justify',
            fontSize: 10,
            lineHeight: 1.5,
        },
        title: {
            fontSize: 14,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center', // Centraliza o texto
        },
        sign: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            marginTop: 64
        },
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
            justifyContent: 'space-between',
            color: 'white',
        }
    });

    const MyDocument = () => (
        <Document  >
            <Page style={styles.page} >
                <Text style={styles.title} color='#1F4B73'>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</Text>
                {declarations.map((declaration, index) => (
                    <View key={index} style={styles.section} wrap={false} >
                        <Text style={styles.declarationType}>{declaration.title}</Text>
                        <Text style={styles.declarationText}>{declaration.text.trim()}</Text>
                    </View>
                ))}
                <View style={styles.section} wrap={false} >
                    <Text style={styles.declarationType}>DECLARAÇÃO DE ABERTURA E MANUTENÇÃO DE CONTA CORRENTE E/OU POUPANÇA</Text>
                    <Text style={styles.declarationText}>
                        {declarationData?.BankAccount.length === 0

                            ? 'Afirmo que não sou titular de nenhuma conta corrente ou conta poupança em quaisquer instituições financeiras.'
                            : `
                            Afirmo que sou titular nas seguintes contas:
                            ${declarationData.BankAccount?.map((e, index) => {
                                return `${index + 1}. ${findLabel(BANK_ACCOUNT_TYPES, e.accountType)} nº ${e.accountNumber}, vinculada à agência ${e.agencyNumber} do banco ${e.bankName}`
                            })}
                            `
                        }
                    </Text>
                </View>
                <View style={styles.section} wrap={false} >
                    <Text style={styles.declarationType}>ALTERAÇÃO NO TAMANHO DO GRUPO FAMILIAR E/OU RENDA</Text>
                    <Text style={styles.declarationText}>Tenho ciência de que devo comunicar o(a) assistente social da entidade beneficente sobre nascimento ou falecimento de membro do meu grupo familiar, desde que morem na mesma residência, bem como sobre eventual rescisão de contrato de trabalho, encerramento de atividade que gere renda ou sobre início em novo emprego ou atividade que gere renda para um dos membros, pois altera a aferição realizada e o benefício em decorrência da nova renda familiar bruta mensal pode ser ampliado, reduzido ou mesmo cancelado, após análise por profissional de serviço social.</Text>
                </View>
                <View style={styles.section} wrap={false} >
                    <Text style={styles.declarationType}>INTEIRA RESPONSABILIDADE PELAS INFORMAÇÕES CONTIDAS NESTE INSTRUMENTO</Text>
                    <Text style={styles.declarationText}>Estou ciente e assumo, inteira responsabilidade pelas informações contidas neste instrumento e em relação as informações prestadas no decorrer do preenchimento deste formulário eletrônico e documentos anexados, estando consciente que a apresentação de documento falso e/ou a falsidade nas informações implicará nas penalidades cabíveis, previstas nos artigos 298 e 299 do Código Penal Brasileiro, bem como sobre a condição prevista no caput e § 2º do art. 26 da Lei Complementar nº 187, de 16 de dezembro de 2021.
                        Art. 26. Os alunos beneficiários das bolsas de estudo de que trata esta Lei Complementar, ou seus pais ou responsáveis, quando for o caso, respondem legalmente pela veracidade e pela autenticidade das informações por eles prestadas, e as informações prestadas pelas instituições de ensino superior (IES) acerca dos beneficiários em qualquer âmbito devem respeitar os limites estabelecidos pela Lei nº 13.709, de 14 de agosto de 2018.
                        (...)
                        § 2º As bolsas de estudo poderão ser canceladas a qualquer tempo em caso de constatação de falsidade da informação prestada pelo bolsista ou por seus pais ou seu responsável, ou de inidoneidade de documento apresentado, sem prejuízo das demais sanções cíveis e penais cabíveis, sem que o ato do cancelamento resulte em prejuízo à entidade beneficente concedente, inclusive na apuração das proporções exigidas nesta Seção, salvo se comprovada negligência ou má-fé da entidade beneficente.</Text>
                </View>
                <Text >{declarationData?.IdentityDetails?.city}, {new Date().toLocaleString('pt-br', { month: 'long', year: 'numeric', day: '2-digit' })}</Text>
                <View style={styles.sign}>
                    <Text>__________________________________________________</Text>
                    <Text>Assinatura {declarationData?.name}</Text>
                </View>
                <View style={styles.footer} fixed>
                    <Text>Cadastraqui</Text>
                    <Text render={({ pageNumber, totalPages }) => {
                        return `Pág. ${pageNumber}/${totalPages}`
                    }}></Text>
                </View>
            </Page>
        </Document>
    );

    const handleRegisterDeclaration = async () => {
        if (!isValid) {
            trigger()
            return
        }
        // if (!auth?.uid) {
        //     console.error('UID não está definido');
        //     return;
        // }

        // const token = localStorage.getItem("token");
        // if (!token) {
        //     console.error('Token não está definido');
        //     return;
        // }

        // if (!declarationData) {
        //     console.error('Os dados da declaração não estão disponíveis');
        //     return;
        // }

        // const text = `
        //     Indique duas Testemunhas:
        //     Testemunha 1:
        //     Nome: ${witness1.name}, CPF: ${witness1.cpf}
        //     Testemunha 2:
        //     Nome: ${witness2.name}, CPF: ${witness2.cpf}
        // `;

        // const payload = {
        //     declarationExists: true,
        //     text
        // };
        try {

            const formData = new FormData()
            const file = getValues("file")
            formData.append("file_declaracoes", file)
            await uploadService.uploadBySectionAndId({ section: 'declaracoes', id: declarationData.id }, formData)
            NotificationService.success({ text: 'Declaração enviada' })
        } catch (err) { }
        // try {

        //     const response = await fetch(`${process.env.REACT_APP_API_URL}/candidates/declaration/Witnesses/${declarationData.id}`, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': `Bearer ${token}`
        //         },
        //         body: JSON.stringify(payload)
        //     });

        //     if (!response.ok) {
        //         throw new Error(`Erro: ${response.statusText}`);
        //     }

        //     const data = await response.json();
        //     ;

        //     // Redireciona para a próxima tela
        //     onNext();
        // } catch (error) {
        //     console.error('Erro ao registrar a declaração:', error);
        // }
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }
    // const handleFileChange = (e) => {
    //     setFile(e.target.files?.[0])
    // }
    return (
        <div className={commonStyles.declarationForm}>
            <h2 className={commonStyles.declarationFormTitle}>DECLARAÇÃO INTEIRA RESPONSABILIDADE PELAS INFORMAÇÕES CONTIDAS NESTE INSTRUMENTO</h2>
            <h3 className={commonStyles.declarationFormNameTitle}>{declarationData.name}</h3>
            <div className={commonStyles.declarationContent}>
                {/* <h3>Indique duas Testemunhas</h3>
                <div>
                    <label>Testemunha 1</label>
                    <input
                        type="text"
                        placeholder="Nome"
                        value={witness1.name}
                        onChange={(e) => setWitness1({ ...witness1, name: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="CPF"
                        value={witness1.cpf}
                        onChange={(e) => setWitness1({ ...witness1, cpf: e.target.value })}
                    />
                </div>
                <div>
                    <label>Testemunha 2</label>
                    <input
                        type="text"
                        placeholder="Nome"
                        value={witness2.name}
                        onChange={(e) => setWitness2({ ...witness2, name: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="CPF"
                        value={witness2.cpf}
                        onChange={(e) => setWitness2({ ...witness2, cpf: e.target.value })}
                    />
                </div> */}
                <Tooltip tooltip={'Clique em "Gerar declarações" e anexe o documento assinado'}>
                    <FormFilePicker label={'Anexar declaração'} accept={'application/pdf'} control={control} name={"file"} />
                </Tooltip>
                <h6 className={commonStyles.aviso}>*Tamanho máximo de 10Mb</h6>
                {/* <div>
                    <label>Anexar declaração</label>
                    <input type='file' accept='application/pdf' onChange={handleFileChange} />
                </div> */}
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase label="Salvar" onClick={handleRegisterDeclaration} />
                {!isGeneratingPDF && <ButtonBase label="Gerar declarações" onClick={handleGeneratePDF} />}
                {isGeneratingPDF === "generating" && (
                    <p>Gerando PDF...</p>
                )}
                {isGeneratingPDF === "done" && (
                    <PDFDownloadLink
                        document={<MyDocument />}
                        fileName={`declaracoes_${declarationData.name}.pdf`}
                    // style={{ textDecoration: 'none', padding: '10px', color: '#4a4a4a', backgroundColor: '#f2f2f2', border: '1px solid #4a4a4a', borderRadius: '4px' }}
                    >
                        {({ blob, url, loading, error }) =>
                            loading ? 'Gerando PDF...' : <ButtonBase label={"baixar PDF"} />
                        }
                    </PDFDownloadLink>
                )}
            </div>
        </div>
    );
}
