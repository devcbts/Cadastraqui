import React, { useState, useEffect } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto
import useAuth from 'hooks/useAuth';
import { api } from 'services/axios'; // Certifique-se de que o caminho está correto

export default function Declaration_FamilyIncomeChange({ onBack, onNext, onResponsibilityConfirmation, userId }) {
    const { auth } = useAuth();
    const [confirmation, setConfirmation] = useState('sim'); // Inicialize como 'sim'
    const [declarationData, setDeclarationData] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem('declarationData');
        if (savedData) {
            setDeclarationData(JSON.parse(savedData));
        }
    }, []);

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
            Tenho ciência de que deve comunicar o(a) assistente social da entidade beneficente sobre nascimento ou falecimento de membro do meu grupo familiar, desde que morem na mesma residência, bem como sobre eventual rescisão de contrato de trabalho, encerramento de atividade que gere renda ou sobre início em novo emprego ou atividade que gere renda para um dos membros, pois altera a aferição realizada e o benefício em decorrência da nova renda familiar bruta mensal pode ser ampliado, reduzido ou mesmo cancelado, após análise por profissional de serviço social.
        `;

        const payload = {
            declarationExists: confirmation === 'sim',
            ...(confirmation === 'sim' && { text })
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/candidates/declaration/Form/${auth.uid}`, {
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
            onResponsibilityConfirmation();
        } catch (error) {
            console.error('Erro ao registrar a declaração:', error);
        }
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÃO ALTERAÇÃO NO TAMANHO DO GRUPO FAMILIAR E/OU RENDA</h1>
            <h2>{declarationData.fullName} - usuário do Cadastraqui</h2>
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
                            checked={confirmation === 'sim'} 
                            onChange={() => setConfirmation('sim')} 
                        /> Sim
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="confirmation" 
                            value="nao" 
                            checked={confirmation === 'nao'} 
                            onChange={() => setConfirmation('nao')} 
                        /> Não
                    </label>
                </div>
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase label="Salvar" onClick={handleRegisterDeclaration} />
            </div>
        </div>
    );
}
