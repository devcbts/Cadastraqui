import React, { useState, useEffect } from 'react';
import commonStyles from '../../styles.module.scss'; 
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; 
import useAuth from 'hooks/useAuth';
import { api } from 'services/axios'; // Certifique-se de que o caminho está correto

export default function Assistent_AutonomoConfirmation({ onBack, onSave, userId }) {
    const { auth } = useAuth();
    const [confirmation, setConfirmation] = useState('sim'); // Inicialize como 'sim'
    const [declarationData, setDeclarationData] = useState(null);
    const [autonomoDetails, setAutonomoDetails] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem('declarationData');
        const savedAutonomoDetails = localStorage.getItem('autonomoDetails');
        if (savedData) {
            setDeclarationData(JSON.parse(savedData));
        }
        if (savedAutonomoDetails) {
            setAutonomoDetails(JSON.parse(savedAutonomoDetails));
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

        if (!declarationData || !autonomoDetails) {
            console.error('Os dados da declaração ou do autônomo não estão disponíveis');
            return;
        }

        const text = `
            Eu, ${declarationData.fullName}, portador(a) do CPF nº ${declarationData.CPF}, desenvolvo atividades ${autonomoDetails.activity} e recebo uma quantia média de R$ 2500,00 mensal.
        `;

        const payload = {
            declarationExists: confirmation === 'sim',
            ...(confirmation === 'sim' && { text })
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/candidates/declaration/Autonomo/${auth.uid}`, {
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
            onSave(confirmation === 'sim');
        } catch (error) {
            console.error('Erro ao registrar a declaração:', error);
        }
    };

    if (!declarationData || !autonomoDetails) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÃO DE AUTÔNOMO(A)/RENDA INFORMAL</h1>
            <h2>{declarationData.fullName} - usuário do Cadastraqui</h2>
            <div className={commonStyles.declarationContent}>
                <p>
                    Eu, <span>{declarationData.fullName}</span>, portador(a) do CPF nº <span>{declarationData.CPF}</span>, desenvolvo atividades <span>{autonomoDetails.activity}</span> e recebo uma quantia média de R$ 2500,00 mensal.
                </p>
            </div>
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
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase label="Salvar" onClick={handleRegisterDeclaration} />
            </div>
        </div>
    );
}
