import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import candidateService from 'services/candidate/candidateService';
import declarationAtom from '../../atoms/declarationAtom';
import commonStyles from '../../styles.module.scss';

export default function Declaration_MEI_Confirmation({ onBack, onNext, onRentIncome, userId }) {
    const { auth } = useAuth();
    const [confirmation, setConfirmation] = useState(null);
    const [meiDetails, setMeiDetails] = useState(null);
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);
    const [error, setError] = useState('');

    useEffect(() => {
        // const savedDetails = localStorage.getItem('meiDetails');
        // const savedDeclarationData = localStorage.getItem('declarationData');
        // if (savedDetails) {
        //     setMeiDetails(JSON.parse(savedDetails));
        // }
        // if (savedDeclarationData) {
        //     setDeclarationData(JSON.parse(savedDeclarationData));
        // }
    }, []);

    const handleRegisterDeclaration = async () => {
        if (confirmation === 'nao') {
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
            console.error('Os dados da declaração ou do MEI não estão disponíveis');
            return;
        }

        const text = declarationData?.mei
            ? `
            Eu, ${declarationData.name}, portador(a) do CPF nº ${declarationData.CPF}, POSSUO o cadastro como Microempreendedor Individual e consta no meu cadastro, neste processo, a Declaração Anual do Simples Nacional para o(a) Microempreendedor(a) Individual (DAS-SIMEI).\
Esta declaração está em conformidade com a Lei n° 7.115/83. Declaro ainda, sob as penas da lei, serem verdadeiras todas as informações acima prestadas.
        `
            : `
        Eu, ${declarationData.name}, portador(a) do CPF nº ${declarationData.CPF}, NÃO POSSUO o cadastro como Microempreendedor Individual e que não recebo nenhuma remuneração nesta  atividade. Esta declaração está em conformidade com a Lei nº 7.115/83*. \
Declaro ainda, sob as penas da lei, serem verdadeiras todas as informações acima prestadas
        `

        const payload = {
            declarationExists: confirmation,
            ...(confirmation && { text })
        };

        try {
            await candidateService.registerDeclaration({ section: 'MEI', id: declarationData.id, data: payload })

            // const response = await fetch(`${process.env.REACT_APP_API_URL}/candidates/declaration/MEI/${declarationData.id}`, {
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

            onNext(confirmation);
        } catch (error) {
            console.error('Erro ao registrar a declaração:', error);
        }
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    const isSaveDisabled = confirmation === null;

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÃO DE RENDIMENTOS - MEI</h1>
            <h2>{declarationData.name}</h2>
            <div className={commonStyles.declarationContent}>
                <p>
                    {
                        declarationData?.mei
                            ? (
                                <>
                                    Eu, <span>{declarationData.name}</span>, portador(a) do CPF nº <span>{declarationData.CPF}</span>, POSSUO o cadastro como Microempreendedor Individual e consta no meu cadastro, neste processo, a Declaração Anual do Simples Nacional para o(a) Microempreendedor(a) Individual (DAS-SIMEI).
                                    Esta declaração está em conformidade com a Lei n° 7.115/83. Declaro ainda, sob as penas da lei, serem verdadeiras todas as informações acima prestadas.
                                </>
                            )
                            : (
                                <>
                                    Eu, <span>{declarationData.name}</span>, portador(a) do CPF nº <span>{declarationData.CPF}</span>, NÃO POSSUO o cadastro como Microempreendedor Individual e que não recebo nenhuma remuneração nesta  atividade. Esta declaração está em conformidade com a Lei nº 7.115/83*.
                                    Declaro ainda, sob as penas da lei, serem verdadeiras todas as informações acima prestadas.
                                </>
                            )
                    }

                </p>
                <p>Confirma a declaração?</p>
                <div className={commonStyles.radioGroup}>
                    <label>
                        <input
                            type="radio"
                            name="confirmation"
                            value="sim"
                            checked={confirmation}
                            onChange={() => setConfirmation(true)}
                        /> Sim
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="confirmation"
                            value="nao"
                            checked={confirmation === false}
                            onChange={() => setConfirmation(false)}
                        /> Não
                    </label>
                </div>
                {error && <div className={commonStyles.error} style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
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
