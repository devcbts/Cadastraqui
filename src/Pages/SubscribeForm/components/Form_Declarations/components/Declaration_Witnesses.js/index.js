import { Document, PDFDownloadLink, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import { api } from 'services/axios'; // Certifique-se de que o caminho está correto
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto

export default function Declaration_Witnesses({ onBack, onNext, userId }) {
    const { auth } = useAuth();
    const [declarationData, setDeclarationData] = useState(null);
    const [witness1, setWitness1] = useState({ name: '', cpf: '' });
    const [witness2, setWitness2] = useState({ name: '', cpf: '' });
    const [declarations, setDeclarations] = useState([]);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    useEffect(() => {
        const savedData = localStorage.getItem('declarationData');
        if (savedData) {
            setDeclarationData(JSON.parse(savedData));
        }
    }, []);

    const fetchDeclarations = async () => {
        const types = ['Form', 'Activity', 'AddressProof', 'Autonomo', 'Card', 'ChildPension', 'ChildSupport', 'ContributionStatement', 'Data', 'Empresario', 'InactiveCompany', 'IncomeTaxExemption', 'MEI', 'NoAddressProof', 'Penseion', 'Pension', 'Rent', 'RentDetails', 'RentIncome', 'RentedHouse', 'RuralWorker', 'SingleStatus', 'StableUnion', 'Status', 'WorkCard'];
        const fetchedDeclarations = [];

        for (const type of types) {
            try {
                const response = await api.get(`/candidates/declaration/${type}/${auth.uid}`);
                if (response.data && response.data.declaration) {
                    fetchedDeclarations.push({ type, text: response.data.declaration.text });
                }
            } catch (error) {
                console.error(`Erro ao buscar a declaração de tipo ${type}:`, error);
            }
        }

        setDeclarations(fetchedDeclarations);
    };

    const handleGeneratePDF = () => {
        setIsGeneratingPDF(true);
        fetchDeclarations().then(() => {
            setIsGeneratingPDF(false);
        });
    };

    const styles = StyleSheet.create({
        page: {
            padding: 30,
            fontSize: 12,
        },
        section: {
            marginBottom: 20,
        },
        declarationType: {
            textAlign: 'center',
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 8,
        },
        declarationText: {
            textAlign: 'justify',
            marginBottom: 10,
            fontSize: 12,
            lineHeight: 1.5,
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center', // Centraliza o texto
        },
    });

    const MyDocument = () => (
        <Document>
            <Page style={styles.page}>
                <Text style={styles.title}>Declarações</Text>
                {declarations.map((declaration, index) => (
                    <View key={index} style={styles.section}>
                        <Text style={styles.declarationType}>{declaration.type}</Text>
                        <Text style={styles.declarationText}>{declaration.text.replace(/\n/g, '').replace(/\s/g, ' ').trim()}</Text>
                    </View>
                ))}
            </Page>
        </Document>
    );

    const handleRegisterDeclaration = async () => {
        if (!auth?.uid) {
            console.error('UID não está definido');
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            console.error('Token não está definido');
            return;
        }

        if (!declarationData) {
            console.error('Os dados da declaração não estão disponíveis');
            return;
        }

        const text = `
            Indique duas Testemunhas:
            Testemunha 1:
            Nome: ${witness1.name}, CPF: ${witness1.cpf}
            Testemunha 2:
            Nome: ${witness2.name}, CPF: ${witness2.cpf}
        `;

        const payload = {
            declarationExists: true,
            text
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/candidates/declaration/Witnesses/${auth.uid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Erro: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Declaração registrada:', data);

            // Redireciona para a próxima tela
            onNext();
        } catch (error) {
            console.error('Erro ao registrar a declaração:', error);
        }
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÃO INTEIRA RESPONSABILIDADE PELAS INFORMAÇÕES CONTIDAS NESTE INSTRUMENTO</h1>
            <h2>{declarationData.fullName}</h2>
            <div className={commonStyles.declarationContent}>
                <h3>Indique duas Testemunhas</h3>
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
                </div>
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase label="Salvar" onClick={handleRegisterDeclaration} />
                {/* <ButtonBase label="Gerar PDF" onClick={handleGeneratePDF} /> */}
                {isGeneratingPDF ? (
                    <p>Gerando PDF...</p>
                ) : (
                    <PDFDownloadLink
                        document={<MyDocument />}
                        fileName="declaracoes.pdf"
                    // style={{ textDecoration: 'none', padding: '10px', color: '#4a4a4a', backgroundColor: '#f2f2f2', border: '1px solid #4a4a4a', borderRadius: '4px' }}
                    >
                        {({ blob, url, loading, error }) =>
                            loading ? 'Gerando PDF...' : <ButtonBase label={"Baixar PDF"} />
                        }
                    </PDFDownloadLink>
                )}
            </div>
        </div>
    );
}
