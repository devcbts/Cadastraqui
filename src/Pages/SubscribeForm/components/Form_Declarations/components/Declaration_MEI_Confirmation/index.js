import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto

export default function Declaration_MEI_Confirmation({ onBack, onNext, onRentIncome, userId }) {
    const { auth } = useAuth();
    const [confirmation, setConfirmation] = useState('sim'); // Inicialize como 'sim'
    const [meiDetails, setMeiDetails] = useState(null);
    const [declarationData, setDeclarationData] = useState(null);

    useEffect(() => {
        const savedDetails = localStorage.getItem('meiDetails');
        const savedDeclarationData = localStorage.getItem('declarationData');
        if (savedDetails) {
            setMeiDetails(JSON.parse(savedDetails));
        }
        if (savedDeclarationData) {
            setDeclarationData(JSON.parse(savedDeclarationData));
        }
    }, []);

    const handleRegisterDeclaration = async () => {
        if (confirmation === 'nao') {
            onRentIncome();
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

        if (!meiDetails || !declarationData) {
            console.error('Os dados da declaração ou do MEI não estão disponíveis');
            return;
        }

        const text = `
            Eu, ${declarationData.fullName}, portador(a) do CPF nº ${declarationData.CPF}, POSSUO o cadastro como Microempreendedor Individual e consta no meu cadastro, neste processo, a Declaração Anual do Simples Nacional para o(a) Microempreendedor(a) Individual (DAS-SIMEI). 
            Esta declaração está em conformidade com a Lei n° 7.115/83. Declaro ainda, sob as penas da lei, serem verdadeiras todas as informações acima prestadas.
        `;

        const payload = {
            declarationExists: confirmation === 'sim',
            ...(confirmation === 'sim' && { text })
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/candidates/declaration/MEI/${auth.uid}`, {
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
            onNext(confirmation === 'sim');
        } catch (error) {
            console.error('Erro ao registrar a declaração:', error);
        }
    };

    if (!meiDetails || !declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÃO DE RENDIMENTOS - MEI</h1>
            <h2>{declarationData.fullName}</h2>
            <div className={commonStyles.declarationContent}>
                <p>
                    Eu, <span>{declarationData.fullName}</span>, portador(a) do CPF nº <span>{declarationData.CPF}</span>, POSSUO o cadastro como Microempreendedor Individual e consta no meu cadastro, neste processo, a Declaração Anual do Simples Nacional para o(a) Microempreendedor(a) Individual (DAS-SIMEI).
                    Esta declaração está em conformidade com a Lei n° 7.115/83. Declaro ainda, sob as penas da lei, serem verdadeiras todas as informações acima prestadas.
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
