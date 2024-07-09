import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss';
import { useRecoilState } from 'recoil';
import declarationAtom from '../../atoms/declarationAtom';

export default function Declaration_FamilyIncomeChange({ onBack, onNext, onResponsibilityConfirmation, userId }) {
    const { auth } = useAuth();
    const [confirmation, setConfirmation] = useState(null); // Inicialize como null
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);
    const [error, setError] = useState(null)
    useEffect(() => {
        const savedData = localStorage.getItem('declarationData');
        if (savedData) {
            setDeclarationData(JSON.parse(savedData));
        }
    }, []);

    const handleRegisterDeclaration = async () => {
        if (confirmation === false) {
            setError('Por favor, verifique os dados de cadastro.');

            return;
        }

        //         if (!auth?.uid) {
        //             console.error('UID não está definido');
        //             return;
        //         }

        //         const token = localStorage.getItem("token");
        //         if (!token) {
        //             console.error('Token não está definido');
        //             return;
        //         }

        //         if (!declarationData) {
        //             console.error('Os dados da declaração não estão disponíveis');
        //             return;
        //         }

        //         const text = `
        //             Tenho ciência de que deve comunicar o(a) assistente social da entidade beneficente sobre nascimento ou falecimento de membro do meu grupo familiar, \
        // desde que morem na mesma residência, bem como sobre eventual rescisão de contrato de trabalho, encerramento de atividade que gere renda ou sobre início em novo \
        // emprego ou atividade que gere renda para um dos membros, pois altera a aferição realizada e o benefício em decorrência da nova renda familiar bruta mensal pode ser \ 
        // ampliado, reduzido ou mesmo cancelado, após análise por profissional de serviço social.
        //         `;

        //         const payload = {
        //             declarationExists: confirmation,
        //             ...(confirmation && { text })
        //         };

        //         try {
        //             const response = await fetch(`${process.env.REACT_APP_API_URL}/candidates/declaration/Notify/${declarationData.id}`, {
        //                 method: 'POST',
        //                 headers: {
        //                     'Content-Type': 'application/json',
        //                     'Authorization': `Bearer ${token}`
        //                 },
        //                 body: JSON.stringify(payload)
        //             });

        //             if (!response.ok) {
        //                 throw new Error(`Erro: ${response.statusText}`);
        //             }

        //             const data = await response.json();
        //             console.log('Declaração registrada:', data);

        //             // Redireciona para a próxima tela
        //             onResponsibilityConfirmation();
        //         } catch (error) {
        //             console.error('Erro ao registrar a declaração:', error);
        //         }
        onResponsibilityConfirmation()
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÃO ALTERAÇÃO NO TAMANHO DO GRUPO FAMILIAR E/OU RENDA</h1>
            <h2>{declarationData.name}</h2>
            <div className={commonStyles.declarationContent}>
                <p>
                    Tenho ciência de que deve comunicar o(a) assistente social da entidade beneficente sobre nascimento ou falecimento de membro do meu grupo familiar, desde que morem na mesma residência, bem como sobre eventual rescisão de contrato de trabalho, encerramento de atividade que gere renda ou sobre início em novo emprego ou atividade que gere renda para um dos membros, pois altera a aferição realizada e o benefício em decorrência da nova renda familiar bruta mensal pode ser ampliado, reduzido ou mesmo cancelado, após análise por profissional de serviço social.
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
                            onChange={() => setConfirmation(false)}
                            checked={confirmation === false}
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
