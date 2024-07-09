import { Document, PDFDownloadLink, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import { api } from 'services/axios'; // Certifique-se de que o caminho está correto
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import uploadService from 'services/upload/uploadService';
import { NotificationService } from 'services/notification';
import { useRecoilState } from 'recoil';
import declarationAtom from '../../atoms/declarationAtom';
import FormFilePicker from 'Components/FormFilePicker';
import useControlForm from 'hooks/useControlForm';
import { z } from 'zod';
import Tooltip from 'Components/Tooltip';

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
            RentIncome: 'DECLARAÇÃO DE RENDIMENTO DE IMÓVEL ALUGADO'

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
            fontFamily: 'Courier'
        },
        section: {
            marginBottom: 32,
        },
        declarationType: {
            textAlign: 'center',
            fontSize: 14,
            fontWeight: 'heavy',
            marginBottom: 16
        },
        declarationText: {
            textAlign: 'justify',
            fontSize: 10,
            lineHeight: 1.5,
        },
        title: {
            fontSize: 18,
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
                <Text >{declarationData?.IdentityDetails?.city}, {new Date().toLocaleString('pt-br', { month: 'long', year: 'numeric', day: '2-digit' })}</Text>
                <View style={styles.sign}>
                    <Text>____________________</Text>
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
        //     console.log('Declaração registrada:', data);

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
            <h1>DECLARAÇÃO INTEIRA RESPONSABILIDADE PELAS INFORMAÇÕES CONTIDAS NESTE INSTRUMENTO</h1>
            <h2>{declarationData.name}</h2>
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
                {/* <div>
                    <label>Anexar declaração</label>
                    <input type='file' accept='application/pdf' onChange={handleFileChange} />
                </div> */}
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase label="Salvar" onClick={handleRegisterDeclaration} />
                {!isGeneratingPDF && <ButtonBase label="Gerar declarações" onClick={handleGeneratePDF} />}
                {isGeneratingPDF === "generating" && (
                    <p>Gerando PDF...</p>
                )}
                {isGeneratingPDF === "done" && (
                    <PDFDownloadLink
                        document={<MyDocument />}
                        fileName="declaracoes.pdf"
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
