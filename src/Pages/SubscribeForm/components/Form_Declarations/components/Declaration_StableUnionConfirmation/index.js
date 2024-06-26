import React, { useState } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto
import useAuth from 'hooks/useAuth';
import { api } from 'services/axios'; // Certifique-se de que o caminho está correto

export default function Declaration_StableUnionConfirmation({ onBack, onNext, partnerName, unionStartDate }) {
    const { auth } = useAuth();
    const [confirmation, setConfirmation] = useState('sim'); // Inicialize como 'sim'

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

        const text = `
            Convivo em União Estável com ${partnerName}, desde ${unionStartDate} e que somos juridicamente capazes. Nossa União Estável possui natureza pública, contínua e duradoura com o objetivo de constituição de família, nos termos dos artigos 1723 e seguintes do Código Civil.
        `;

        const payload = {
            declarationExists: confirmation === 'sim',
            ...(confirmation === 'sim' && { text })
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/candidates/declaration/StableUnion/${auth.uid}`, {
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

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO DE UNIÃO ESTÁVEL</h2>
            <h3>João da Silva - usuário do Cadastraqui</h3>
            <div className={commonStyles.declarationContent}>
                <p>Convivo em União Estável com {partnerName}, desde {unionStartDate} e que somos juridicamente capazes. Nossa União Estável possui natureza pública, contínua e duradoura com o objetivo de constituição de família, nos termos dos artigos 1723 e seguintes do Código Civil.</p>
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
