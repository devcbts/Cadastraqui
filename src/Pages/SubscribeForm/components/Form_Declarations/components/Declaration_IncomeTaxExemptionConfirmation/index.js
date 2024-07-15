import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss';
import { useRecoilState } from 'recoil';
import declarationAtom from '../../atoms/declarationAtom';
import findLabel from 'utils/enums/helpers/findLabel';
import MARITAL_STATUS from 'utils/enums/marital-status';
import candidateService from 'services/candidate/candidateService';

export default function Declaration_IncomeTaxExemptionConfirmation({ onBack, onNext }) {
    const { auth } = useAuth();
    const [confirmation, setConfirmation] = useState(null);
    const [incomeTaxDetails, setIncomeTaxDetails] = useState(null);
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);
    const [error, setError] = useState('');
    const identityDetails = declarationData?.IdentityDetails
    useEffect(() => {
        if (declarationData.incomeTaxDetails) {
            setIncomeTaxDetails(declarationData.incomeTaxDetails)
        }

    }, []);

    const handleSave = async () => {
        if (confirmation === false) {
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
Eu, ${identityDetails.fullName}, portador(a) da cédula de identidade RG n° ${identityDetails.RG}, órgão emissor ${identityDetails.rgIssuingAuthority}, \
UF do órgão emissor ${identityDetails.rgIssuingState}, CPF n° ${identityDetails.CPF}, nacionalidade ${identityDetails.nationality}, \
estado civil ${findLabel(MARITAL_STATUS, identityDetails.maritalStatus)}, profissão ${identityDetails.profession}, residente na rua ${identityDetails.address}, \
n° ${identityDetails.addressNumber}, complemento ${identityDetails.complement}, CEP: ${identityDetails.CEP}, bairro ${identityDetails.neighborhood}, \
cidade ${identityDetails.city}, UF ${identityDetails.UF}, e-mail: ${identityDetails.email}, \
DECLARO SER ISENTO(A) da apresentação da Declaração do Imposto de Renda Pessoa Física (DIRPF) no(s) exercício(s) ${incomeTaxDetails.year}. \
por não incorrer em nenhuma das hipóteses de obrigatoriedade estabelecidas pelas Instruções Normativas (IN) da Receita Federal do Brasil (RFB). \
Esta declaração está em conformidade com a IN RFB n° 1548/2015 e a Lei n° 7.115/83. Declaro ainda, sob as penas da lei, \
serem verdadeiras todas as informações acima prestadas. \
                `;

                const payload = {
                    declarationExists: confirmation,
                    ...(confirmation && { text })
                };
                await candidateService.registerDeclaration({ section: 'IncomeTaxExemption', id: declarationData.id, data: payload })

                // const response = await fetch(`${process.env.REACT_APP_API_URL}/candidates/declaration/IncomeTaxExemption/${declarationData.id}`, {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //         'Authorization': `Bearer ${token}`
                //     },
                //     body: JSON.stringify(payload)
                // });

                // if (!response.ok) {
                //     throw new Error(`Erro: ${response.statusText}`);
                // }

                // const data = await response.json();
                // ;

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
            <h3>{identityDetails.fullName}</h3>
            <div className={commonStyles.declarationContent}>
                <p>
                    Eu, <b>{identityDetails.fullName}</b>, portador(a) da cédula de identidade RG n° <b>{identityDetails.RG}</b>,
                    órgão emissor <b>{identityDetails.rgIssuingAuthority}</b>, UF do órgão emissor <b>{identityDetails.rgIssuingState}</b>,
                    CPF n° <b>{identityDetails.CPF}</b>, nacionalidade <b>{identityDetails.nationality}</b>, estado civil <b>{findLabel(MARITAL_STATUS, identityDetails.maritalStatus)}</b>,
                    profissão <b>{identityDetails.profession}</b>, residente na rua <b>{identityDetails.address}</b>, n° <b>{identityDetails.addressNumber}</b>,
                    complemento <b>{identityDetails.complement}</b>, CEP: <b>{identityDetails.CEP}</b>, bairro <b>{identityDetails.neighborhood}</b>,
                    cidade <b>{identityDetails.city}</b>, UF <b>{identityDetails.UF}</b>, e-mail: <b>{identityDetails.email}</b>,
                    DECLARO SER ISENTO(A) da apresentação da Declaração do Imposto de Renda Pessoa Física (DIRPF)
                    no(s) exercício(s) <b>{incomeTaxDetails.year}</b> por não incorrer em nenhuma das hipóteses de obrigatoriedade estabelecidas pelas Instruções
                    Normativas (IN) da Receita Federal do Brasil (RFB). Esta declaração está em conformidade com a IN RFB n° 1548/2015 e a Lei n° 7.115/83.
                    Declaro ainda, sob as penas da lei, serem verdadeiras todas as informações acima prestadas.
                </p>
                <p>Confirma a declaração?</p>
                <div className={commonStyles.radioGroup}>
                    <label>
                        <input type="radio" name="confirmation" value="sim" onChange={() => { setConfirmation(true); setError('') }} /> Sim
                    </label>
                    <label>
                        <input type="radio" name="confirmation" value="nao" onChange={() => { setConfirmation(false); setError('') }} /> Não
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
