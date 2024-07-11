import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss';
import { useRecoilState } from 'recoil';
import declarationAtom from '../../atoms/declarationAtom';
import candidateService from 'services/candidate/candidateService';

export default function Declaration_PensionConfirmation({ onBack, onNext }) {
    const { auth } = useAuth();
    const [hasAddressProof, setHasAddressProof] = useState(null);
    const [pensionData, setPensionData] = useState(null);
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);
    const [childrenData, setChildrenData] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        console.log(declarationData)
        if (declarationData.pensionData) {
            setPensionData(declarationData.pensionData)
        }
        if (declarationData.childrenData) {
            setChildrenData(declarationData.childrenData)
        }
    }, []);

    const handleRegisterDeclaration = async () => {
        if (hasAddressProof === null) {
            return;
        }

        if (hasAddressProof === 'nao') {
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

        if (!declarationData) {
            console.error('Os dados da declaração não estão disponíveis');
            return;
        }
        let lastUsedLetter = 0
        let finalText = ''
        try {

            finalText += `
            ${String.fromCharCode(65 + lastUsedLetter++)}. ${pensionData.receivesPension
                    ? `Recebo pensão alimentícia (judicial) no valor total de ${pensionData.amount}, inscrito(a) no CPF nº ${pensionData.payerCpf}.\ `
                    : `Não recebo pensão alimentícia.\ `}
        `
            if (declarationData?.Candidate?.length) {
                finalText += !declarationData.childPensionData?.childReceivesPension
                    ? `${String.fromCharCode(65 + lastUsedLetter++)}. Meus filhos(as) não recebem pensão.\ `
                    : `
${String.fromCharCode(65 + lastUsedLetter++)}. Meu(s) filho(s) \
${declarationData.childPensionData?.childPensionRecipients.map(e => e)} recebe(m) pensão alimentícia (judicial) no valor total de ${declarationData.childPensionData?.amount}, \
inscrito(a) no CPF nº ${declarationData.childPensionData?.payerCpf}.
`
                childrenData.map((child, index) => (
                    finalText += `${String.fromCharCode(65 + lastUsedLetter++)}. Meu(s) filho(s) ${child.childName.map(e => e)} recebe(m) pensão alimentícia (judicial) no valor total de ${child.amount}, \ 
inscrito(a) no CPF nº ${child.payerCpf}.`
                ));
            }
        } catch (err) {
            console.log(err)
        }

        const text = finalText



        const payload = {
            declarationExists: hasAddressProof === 'sim',
            ...(hasAddressProof === 'sim' && { text })
        };

        try {

            await candidateService.registerDeclaration({ section: 'Pension', id: declarationData.id, data: payload })

            // const response = await fetch(`${process.env.REACT_APP_API_URL}/candidates/declaration/Pension/${declarationData.id}`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${token} `
            //     },
            //     body: JSON.stringify(payload)
            // });

            // if (!response.ok) {
            //     throw new Error(`Erro: ${response.statusText} `);
            // }

            // const data = await response.json();
            // console.log('Declaração registrada:', data);

            onNext(true);
        } catch (error) {
            console.error('Erro ao registrar a declaração:', error);
        }
    };

    const isSaveDisabled = hasAddressProof === null;

    if (!declarationData) {
        return <p>Carregando...</p>;
    }
    let lastUsedLetter = 0
    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>Recebimento ou ausência de recebimento de pensão alimentícia</h2>
            <h3>{declarationData.name}</h3>
            <div className={commonStyles.declarationContent}>
                <>
                    <p>
                        {pensionData?.receivesPension
                            ? `${String.fromCharCode(65 + lastUsedLetter++)}. Recebo pensão alimentícia(judicial) no valor total de ${pensionData.amount}, inscrito(a) no CPF nº ${pensionData.payerCpf}.`
                            : `${String.fromCharCode(65 + lastUsedLetter++)}. Não recebo pensão alimentícia(judicial).`
                        }
                    </p>
                    <p>

                        {declarationData?.Candidate?.length > 0
                            ? (!declarationData.childPensionData?.childReceivesPension
                                ? `${String.fromCharCode(65 + lastUsedLetter++)}. Meus filhos(as) não recebem pensão.`
                                : `
                        ${String.fromCharCode(65 + lastUsedLetter++)}. Meu(s) filho(s) \ 
                        ${declarationData.childPensionData?.childPensionRecipients.map(e => e).join(', ')} \
    recebe(m) pensão alimentícia(judicial) no valor total de ${declarationData.childPensionData?.amount}, \
    inscrito(a) no CPF nº ${declarationData.childPensionData?.payerCpf}.
    `) : ''
                        }
                    </p>

                    {childrenData.map((child, index) => (
                        <p>{`${String.fromCharCode(65 + lastUsedLetter++)}. Meu(s) filho(s) ${child.childName} recebe(m) pensão alimentícia(judicial) no valor total de ${child.amount}, inscrito(s) no CPF nº ${child.payerCpf}.`}</p>
                    ))}
                </>
                <p>Confirma a declaração?</p>
                <div className={commonStyles.radioGroup}>
                    <label>
                        <input
                            type="radio"
                            name="confirmation"
                            value="sim"
                            checked={hasAddressProof === 'sim'}
                            onChange={() => setHasAddressProof('sim')}
                        /> Sim
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="confirmation"
                            value="nao"
                            checked={hasAddressProof === 'nao'}
                            onChange={() => setHasAddressProof('nao')}
                        /> Não
                    </label>
                </div>
                {error && <div className={commonStyles.error} style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleRegisterDeclaration}
                    disabled={isSaveDisabled}
                    style={{
                        borderColor: isSaveDisabled ? '#ccc' : '#1F4B73',
                        cursor: isSaveDisabled ? 'not-allowed' : 'pointer',
                        opacity: isSaveDisabled ? 0.6 : 1
                    }}
                />
            </div>
        </div>
    );
}
