import React, { useState, useEffect } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto
import useAuth from 'hooks/useAuth';
import { api } from 'services/axios'; // Certifique-se de que o caminho está correto

export default function Declaration_RentConfirmation({ onBack, onNext, userId }) {
    const { auth } = useAuth();
    const [confirmation, setConfirmation] = useState('sim'); // Inicialize como 'sim'
    const [rentDetails, setRentDetails] = useState(null);
    const [declarationData, setDeclarationData] = useState(null);

    useEffect(() => {
        const savedRentDetails = localStorage.getItem('rentDetails');
        if (savedRentDetails) {
            setRentDetails(JSON.parse(savedRentDetails));
        }
        const savedDeclarationData = localStorage.getItem('declarationData');
        if (savedDeclarationData) {
            setDeclarationData(JSON.parse(savedDeclarationData));
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

        if (!rentDetails || !declarationData) {
            console.error('Os dados da declaração ou do aluguel não estão disponíveis');
            return;
        }

        const text = `
            Resido em imóvel alugado e não possuo contrato de aluguel, pois se trata de acordo verbal/informal, ao qual pago o valor de 
            R$ ${rentDetails.rentValue} 
            por mês de aluguel para 
            ${rentDetails.landlordName}, 
            inscrito no CPF nº 
            ${rentDetails.landlordCpf}.
        `;

        const payload = {
            declarationExists: confirmation === 'sim',
            ...(confirmation === 'sim' && { text })
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/candidates/declaration/Rent/${auth.uid}`, {
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

    if (!rentDetails || !declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO DE IMÓVEL ALUGADO - SEM CONTRATO DE ALUGUEL</h2>
            <h3>{declarationData.fullName} - usuário do Cadastraqui</h3>
            <div className={commonStyles.declarationContent}>
                <p>
                    Resido em imóvel alugado e não possuo contrato de aluguel, pois se trata de acordo verbal/informal, ao qual pago o valor de 
                    <span> R$ {rentDetails.rentValue} </span> 
                    por mês de aluguel para 
                    <span> {rentDetails.landlordName} </span>, 
                    inscrito no CPF nº 
                    <span> {rentDetails.landlordCpf} </span>.
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
