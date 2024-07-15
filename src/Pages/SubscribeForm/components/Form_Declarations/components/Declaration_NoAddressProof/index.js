import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import { api } from 'services/axios';
import commonStyles from '../../styles.module.scss';
import { useRecoilState } from 'recoil';
import declarationAtom from '../../atoms/declarationAtom';
import candidateService from 'services/candidate/candidateService';

export default function Declaration_NoAddressProof({ onBack, onNext }) {
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);
    const [hasConfirmed, setHasConfirmed] = useState(null);
    const [error, setError] = useState(null);
    const { auth } = useAuth();
    const identityDetails = declarationData?.IdentityDetails
    // useEffect(() => {
    //     const fetchDeclarationData = async () => {
    //         try {
    //             const response = await api.get(`/candidates/declaration/Form/${declarationData.id}`);
    //             const data = response.data.infoDetails;
    //             setDeclarationData(data);
    //         } catch (error) {
    //             console.error('Erro ao buscar os dados da declaração:', error);
    //         }
    //     };

    //     fetchDeclarationData();
    // }, [declarationData.id]);

    const handleSave = async () => {
        setError(null); // Reseta o erro

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

        if (hasConfirmed === null) {
            setError('Por favor, selecione uma opção antes de salvar.');
            return;
        }

        if (hasConfirmed === 'nao') {
            setError('Por favor, verifique os dados cadastrados.');
            return;
        }

        const text = `
            Eu, ${declarationData.name}, resido na ${identityDetails.address}, nº ${identityDetails.addressNumber}, complemento, \
            CEP: ${identityDetails.CEP}, bairro ${identityDetails.neighborhood}, cidade ${identityDetails.city}, estado ${identityDetails.UF}, \
            e-mail: ${declarationData.email}, declaro que não possuo comprovante de endereço em meu nome. Por ser \
            a expressão da verdade e, ciente que a falsidade de informação sujeitará às penas da legislação pertinente, confirmo a presente \
            declaração para efeitos legais.
        `;

        const payload = {
            declarationExists: hasConfirmed,
            ...(hasConfirmed && { text })
        };

        try {
            await candidateService.registerDeclaration({ section: 'NoAddressProof', id: declarationData.id, data: payload })

            // const response = await fetch(`${process.env.REACT_APP_API_URL}/candidates/declaration/NoAddressProof/${declarationData.id}`, {
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

            // Redireciona para a próxima tela
            onNext(hasConfirmed);
        } catch (error) {
            console.error('Erro ao registrar a declaração:', error);
        }
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO DE AUSÊNCIA DE COMPROVANTE DE ENDEREÇO EM NOME</h2>
            <h3>{declarationData.name}</h3>
            <div className={commonStyles.declarationContent}>
                <p>
                    Eu, <strong>{declarationData.name}</strong>, resido na <strong>{identityDetails?.address}</strong>, nº <strong>{identityDetails?.addressNumber}</strong>, complemento,
                    CEP: <strong>{identityDetails?.CEP}</strong>, bairro <strong>{identityDetails?.neighborhood}</strong>, cidade <strong>{identityDetails?.city}</strong>, estado <strong>{identityDetails?.UF}</strong>,
                    e-mail: <strong>{declarationData.email}</strong>, declaro que não possuo comprovante de endereço em meu nome. Por ser
                    a expressão da verdade e, ciente que a falsidade de informação sujeitará às penas da legislação pertinente, confirmo a presente
                    declaração para efeitos legais.
                </p>
                <p>Confirma a declaração?</p>
                <div className={commonStyles.radioButtons}>
                    <label>
                        <input type="radio" name="confirmation" value="sim" onChange={() => setHasConfirmed(true)} checked={hasConfirmed} /> Sim
                    </label>
                    <label>
                        <input type="radio" name="confirmation" value="nao" onChange={() => setHasConfirmed(false)} checked={hasConfirmed === false} /> Não
                    </label>
                </div>
                {error && <div className={commonStyles.error} style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleSave}
                    disabled={hasConfirmed === null}
                    style={{
                        borderColor: hasConfirmed === null ? '#ccc' : '#1F4B73',
                        cursor: hasConfirmed === null ? 'not-allowed' : 'pointer',
                        opacity: hasConfirmed === null ? 0.6 : 1
                    }}
                />
            </div>
        </div>
    );
}
