import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss';

export default function Declaration_InactiveCompanyConfirmation({ onBack, onSave, userId }) {
    const { auth } = useAuth();
    const [confirmation, setConfirmation] = useState(null);
    const [declarationData, setDeclarationData] = useState(null);
    const [inactiveCompanyDetails, setInactiveCompanyDetails] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const savedData = localStorage.getItem('declarationData');
        const savedInactiveCompanyDetails = localStorage.getItem('inactiveCompanyDetails');
        if (savedData) {
            setDeclarationData(JSON.parse(savedData));
        }
        if (savedInactiveCompanyDetails) {
            setInactiveCompanyDetails(JSON.parse(savedInactiveCompanyDetails));
        }
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

        if (!declarationData || !inactiveCompanyDetails) {
            console.error('Os dados da declaração ou da empresa inativa não estão disponíveis');
            return;
        }

        const text = `
            Eu, ${declarationData.fullName}, portador(a) do CPF nº ${declarationData.CPF}, possuo uma empresa inativa localizada no endereço ${inactiveCompanyDetails.address}, nº ${inactiveCompanyDetails.number}, complemento ${inactiveCompanyDetails.complement}, bairro ${inactiveCompanyDetails.neighborhood}, cidade ${inactiveCompanyDetails.city}, UF ${inactiveCompanyDetails.uf}, CEP ${inactiveCompanyDetails.cep}.
        `;

        const payload = {
            declarationExists: confirmation === 'sim',
            ...(confirmation === 'sim' && { text })
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/candidates/declaration/InactiveCompany/${auth.uid}`, {
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

            onSave(confirmation === 'sim');
        } catch (error) {
            console.error('Erro ao registrar a declaração:', error);
        }
    };

    const isSaveDisabled = !declarationData || !inactiveCompanyDetails || confirmation === null;

    if (!declarationData || !inactiveCompanyDetails) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÃO DE EMPRESA INATIVA</h1>
            <h2>{declarationData.fullName}</h2>
            <div className={commonStyles.declarationContent}>
                <p>
                    Eu, <span>{declarationData.fullName}</span>, portador(a) do CPF nº <span>{declarationData.CPF}</span>, possuo uma empresa inativa localizada no endereço <span>{inactiveCompanyDetails.address}</span>, nº <span>{inactiveCompanyDetails.number}</span>, complemento <span>{inactiveCompanyDetails.complement}</span>, bairro <span>{inactiveCompanyDetails.neighborhood}</span>, cidade <span>{inactiveCompanyDetails.city}</span>, UF <span>{inactiveCompanyDetails.uf}</span>, CEP <span>{inactiveCompanyDetails.cep}</span>.
                </p>
            </div>
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
            {error && <div className={commonStyles.error} style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
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
