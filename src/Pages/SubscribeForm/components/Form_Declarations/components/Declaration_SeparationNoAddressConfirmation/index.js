import React, { useState, useEffect } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto
import useAuth from 'hooks/useAuth';
import { api } from 'services/axios'; // Certifique-se de que o caminho está correto

export default function Declaration_SeparationNoAddressConfirmation({ onBack, onNext, userId }) {
    const { auth } = useAuth();
    const [confirmation, setConfirmation] = useState('sim'); // Inicialize como 'sim'
    const [separationDetails, setSeparationDetails] = useState(null);

    useEffect(() => {
        const savedSeparationDetails = localStorage.getItem('separationDetails');
        if (savedSeparationDetails) {
            setSeparationDetails(JSON.parse(savedSeparationDetails));
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

        if (!separationDetails) {
            console.error('Os dados da separação não estão disponíveis');
            return;
        }

        const text = `
            Me separei de ${separationDetails.personName}, inscrito(a) no CPF nº ${separationDetails.personCpf}, desde ${separationDetails.separationDate}.
            Meu(minha) ex-companheiro(a) reside em local que não tenho conhecimento.
            Até o presente momento não formalizei o encerramento de nossa relação por meio de divórcio.
        `;

        const payload = {
            declarationExists: confirmation === 'sim',
            ...(confirmation === 'sim' && { text })
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/candidates/declaration/NoAddressProof/${auth.uid}`, {
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

    if (!separationDetails) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO DE SEPARAÇÃO DE FATO (NÃO JUDICIAL)</h2>
            <h3>João da Silva - usuário do Cadastraqui</h3>
            <div className={commonStyles.declarationContent}>
                <p>
                    Me separei de <strong>{separationDetails.personName}</strong>, inscrito(a) no CPF nº <strong>{separationDetails.personCpf}</strong>, desde <strong>{separationDetails.separationDate}</strong>.
                    Meu(minha) ex-companheiro(a) reside em local que não tenho conhecimento.
                    Até o presente momento não formalizei o encerramento de nossa relação por meio de divórcio.
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
