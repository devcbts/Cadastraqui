import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss';

export default function Declaration_IncomeTaxExemptionConfirmation({ onBack, onNext }) {
    const { auth } = useAuth();
    const [confirmation, setConfirmation] = useState(null);
    const [incomeTaxDetails, setIncomeTaxDetails] = useState(null);
    const [declarationData, setDeclarationData] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        const savedDetails = localStorage.getItem('incomeTaxDetails');
        if (savedDetails) {
            setIncomeTaxDetails(JSON.parse(savedDetails));
        }
        const savedDeclarationData = localStorage.getItem('declarationData');
        if (savedDeclarationData) {
            setDeclarationData(JSON.parse(savedDeclarationData));
        }
    }, []);

    const handleSave = async () => {
        if (confirmation === 'nao') {
            setError('Por favor, verifique os dados de cadastro.');
            return;
        }

        if (confirmation !== null) {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error('Token não está definido');
                    return;
                }

                const text = `
                    Eu, ${declarationData.fullName}, portador(a) da cédula de identidade RG n° ${declarationData.RG}, órgão emissor ${declarationData.rgIssuingAuthority}, UF do órgão emissor ${declarationData.rgIssuingState}, CPF n° ${declarationData.CPF}, nacionalidade ${declarationData.nationality}, estado civil ${declarationData.maritalStatus}, profissão ${declarationData.profession}, residente na rua ${declarationData.address}, n° ${declarationData.addressNumber}, complemento ${declarationData.complement}, CEP: ${declarationData.CEP}, bairro ${declarationData.neighborhood}, cidade ${declarationData.city}, UF ${declarationData.UF}, e-mail: ${declarationData.email}, DECLARO SER ISENTO(A) da apresentação da Declaração do Imposto de Renda Pessoa Física (DIRPF) no(s) exercício(s) ${incomeTaxDetails.year} por não incorrer em nenhuma das hipóteses de obrigatoriedade estabelecidas pelas Instruções Normativas (IN) da Receita Federal do Brasil (RFB). Esta declaração está em conformidade com a IN RFB n° 1548/2015 e a Lei n° 7.115/83. Declaro ainda, sob as penas da lei, serem verdadeiras todas as informações acima prestadas.
                `;

                const payload = {
                    declarationExists: confirmation === 'sim',
                    ...(confirmation === 'sim' && { text })
                };

                const response = await fetch(`${process.env.REACT_APP_API_URL}/candidates/declaration/IncomeTaxExemption/${auth.uid}`, {
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

                onNext();
            } catch (error) {
                console.error('Erro ao registrar a declaração:', error);
            }
        }
    };

    if (!incomeTaxDetails) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO DE ISENTO DE IMPOSTO DE RENDA</h2>
            <h3>{declarationData.fullName}</h3>
            <div className={commonStyles.declarationContent}>
                <p>
                    Eu, <b>{declarationData.fullName}</b>, portador(a) da cédula de identidade RG n° <b>{declarationData.RG}</b>, órgão emissor <b>{declarationData.rgIssuingAuthority}</b>, UF do órgão emissor <b>{declarationData.rgIssuingState}</b>, CPF n° <b>{declarationData.CPF}</b>, nacionalidade <b>{declarationData.nationality}</b>, estado civil <b>{declarationData.maritalStatus}</b>, profissão <b>{declarationData.profession}</b>, residente na rua <b>{declarationData.address}</b>, n° <b>{declarationData.addressNumber}</b>, complemento <b>{declarationData.complement}</b>, CEP: <b>{declarationData.CEP}</b>, bairro <b>{declarationData.neighborhood}</b>, cidade <b>{declarationData.city}</b>, UF <b>{declarationData.UF}</b>, e-mail: <b>{declarationData.email}</b>, DECLARO SER ISENTO(A) da apresentação da Declaração do Imposto de Renda Pessoa Física (DIRPF) no(s) exercício(s) <b>{incomeTaxDetails.year}</b> por não incorrer em nenhuma das hipóteses de obrigatoriedade estabelecidas pelas Instruções Normativas (IN) da Receita Federal do Brasil (RFB). Esta declaração está em conformidade com a IN RFB n° 1548/2015 e a Lei n° 7.115/83. Declaro ainda, sob as penas da lei, serem verdadeiras todas as informações acima prestadas.
                </p>
                <p>Confirma a declaração?</p>
                <div className={commonStyles.radioGroup}>
                    <label>
                        <input type="radio" name="confirmation" value="sim" onChange={() => {setConfirmation('sim'); setError('')}} /> Sim
                    </label>
                    <label>
                        <input type="radio" name="confirmation" value="nao" onChange={() => {setConfirmation('nao'); setError('')}} /> Não
                    </label>
                </div>
                {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleSave}
                    disabled={confirmation === null}
                    style={{
                        borderColor: confirmation === null ? '#ccc' : '#1F4B73',
                        cursor: confirmation === null ? 'not-allowed' : 'pointer',
                        opacity: confirmation === null ? 0.6 : 1
                    }}
                />
            </div>
        </div>
    );
}
