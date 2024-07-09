import ButtonBase from "Components/ButtonBase";
import useAuth from 'hooks/useAuth';
import { useState } from 'react';
import commonStyles from '../../styles.module.scss';
import findLabel from "utils/enums/helpers/findLabel";
import MARITAL_STATUS from "utils/enums/marital-status";
import { useRecoilState } from "recoil";
import declarationAtom from "../../atoms/declarationAtom";
import DOCUMENT_TYPE from "utils/enums/document-type";
import formatDate from "utils/format-date";

export default function Declaration_Form({ onEdit }) {
    const { auth } = useAuth();
    const [declarationExists, setDeclarationExists] = useState(null);
    const [error, setError] = useState(null);
    const [declarationData] = useRecoilState(declarationAtom)
    const identityDetails = declarationData?.IdentityDetails
    const handleRegisterDeclaration = async () => {
        setError(null);

        if (declarationExists === null) {
            setError('Por favor, selecione uma opção antes de salvar.');
            return;
        }

        if (declarationExists === false) {
            setError('Por favor, verifique os dados de cadastro.');
            return;
        }

        if (!auth?.uid) {
            console.error('UID não está definido');
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            console.error('Token não está definido');
            return;
        }

        const text = `
            Eu, ${identityDetails.fullName}, portador(a) da cédula de identidade RG nº ${identityDetails.RG}, órgão emissor ${identityDetails.rgIssuingAuthority}, \
UF do órgão emissor ${identityDetails.rgIssuingState} ${identityDetails.documentType && `portador(a) da ${findLabel(DOCUMENT_TYPE, identityDetails.documentType)}, número ${identityDetails.documentNumber}, \ 
validade ${formatDate(identityDetails.documentValidity)},`}ou  inscrito(a) no CPF nº ${identityDetails.CPF}, nacionalidade ${identityDetails.nationality}, \
estado civil ${identityDetails.maritalStatus}, profissão ${identityDetails.profession}, residente na ${identityDetails.address}, \
nº ${identityDetails.addressNumber}, complemento, CEP: ${identityDetails.CEP}, bairro ${identityDetails.neighborhood}, \
cidade ${identityDetails.city}, estado ${identityDetails.UF}, UF ${identityDetails.UF}, e-mail: ${identityDetails.email}, \
${declarationData?.Candidate?.length > 0 ?
                `responsável legal por ${declarationData.Candidate.map((e) => `${e.name}, \ `)}`
                : ''}\
declaro para os devidos fins do processo seletivo realizado nos termos da Lei Complementar nº 187 de 16 de dezembro de 2021 que todas as informações estão corretas.`;

        const payload = {
            declarationExists,
            ...(declarationExists && { text })
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/candidates/declaration/Form/${declarationData.id}`, {
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

            onEdit();
        } catch (error) {
            console.error('Erro ao registrar a declaração:', error);
        }
    };

    if (!identityDetails) {
        return <div>Carregando...</div>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>{identityDetails.fullName} </h2>
            <div className={commonStyles.declarationContent}>
                <p>
                    Eu, <span>{identityDetails.fullName}</span>, portador(a) da cédula de identidade RG nº <span>{identityDetails.RG}</span>,
                    órgão emissor <span>{identityDetails.rgIssuingAuthority}</span>, UF do órgão emissor <span>{identityDetails.rgIssuingState}</span>
                    {identityDetails.documentType &&
                        <>
                            , portador(a) da <span>{findLabel(DOCUMENT_TYPE, identityDetails.documentType)}</span>, número <span>{identityDetails.documentNumber}</span>,
                            validade <span>{formatDate(identityDetails.documentValidity)}</span>
                        </>
                    }
                    , inscrito(a) no <span>CPF</span> nº <span>{identityDetails.CPF}</span>,
                    nacionalidade <span>{identityDetails.nationality}</span>, estado civil <span>{findLabel(MARITAL_STATUS, identityDetails.maritalStatus)}</span>,
                    profissão <span>{identityDetails.profession}</span>, residente na <span>{identityDetails.address}</span>,
                    nº <span>{identityDetails.addressNumber}</span>, complemento, <span>CEP: {identityDetails.CEP}</span>,
                    bairro {identityDetails.neighborhood}, cidade <span>{identityDetails.city}</span>,
                    estado <span>{identityDetails.UF}</span>, UF <span>{identityDetails.UF}</span>,
                    e-mail: <span>{identityDetails.email}</span>,
                    {
                        declarationData?.Candidate?.length > 0 &&
                        <>
                            responsável legal por {declarationData.Candidate.map((e) => `${e.name}, `)}
                        </>
                    }
                    declaro para os devidos fins do processo seletivo realizado nos termos da Lei
                    Complementar nº 187, de 16 de dezembro de 2021 que:
                </p>
                <div className={commonStyles.radioGroup}>
                    <label>Todas as informações estão corretas?</label>
                    <div>
                        <input
                            type="radio"
                            id="yes"
                            name="infoCorrect"
                            value="yes"
                            checked={declarationExists === true}
                            onChange={() => setDeclarationExists(true)}
                        />
                        <label htmlFor="yes">Sim</label>
                        <input
                            type="radio"
                            id="no"
                            name="infoCorrect"
                            value="no"
                            checked={declarationExists === false}
                            onChange={() => setDeclarationExists(false)}
                        />
                        <label htmlFor="no">Não</label>
                    </div>
                </div>
                {error && <div className={commonStyles.error} style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
            </div>
            <div className={commonStyles.centeredButton}>
                <ButtonBase
                    onClick={handleRegisterDeclaration}
                    disabled={declarationExists === null}
                    style={{
                        borderColor: declarationExists === null ? '#ccc' : '#1F4B73',
                        cursor: declarationExists === null ? 'not-allowed' : 'pointer',
                        opacity: declarationExists === null ? 0.6 : 1
                    }}
                >
                    Salvar
                </ButtonBase>
            </div>
        </div>
    );
}
