import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto

export default function Declaration_WorkCardConfirmation({ onBack, onNext, userId }) {
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
            ${declarationData.fullName} até o presente momento não possui(em) Carteira de Trabalho e Previdência Social – CTPS e estou ciente de que a Carteira de Trabalho e Previdência Social (CTPS) é o documento que registra a vida profissional do trabalhador e garante o acesso aos direitos trabalhistas previstos em lei. Neste momento tomo ciência de que a carteira de trabalho atualmente é emitida de forma prioritária no formato digital e excepcionalmente no formato físico (fonte: https://www.gov.br/pt-br/servicos/obter-a-carteira-de-trabalho).
        `;

        const payload = {
            declarationExists: confirmation === 'sim',
            ...(confirmation === 'sim' && { text })
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/candidates/declaration/WorkCard/${auth.uid}`, {
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

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO QUE INTEGRANTE DO GRUPO FAMILIAR AINDA NÃO POSSUI CARTEIRA DE TRABALHO</h2>
            <h3>{declarationData.fullName}</h3>
            <div className={commonStyles.declarationContent}>
                <p>{declarationData.fullName} até o presente momento não possui(em) Carteira de Trabalho e Previdência Social – CTPS e estou ciente de que a Carteira de Trabalho e Previdência Social (CTPS) é o documento que registra a vida profissional do trabalhador e garante o acesso aos direitos trabalhistas previstos em lei. Neste momento tomo ciência de que a carteira de trabalho atualmente é emitida de forma prioritária no formato digital e excepcionalmente no formato físico (fonte: <a href="https://www.gov.br/pt-br/servicos/obter-a-carteira-de-trabalho">https://www.gov.br/pt-br/servicos/obter-a-carteira-de-trabalho</a>).</p>
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
