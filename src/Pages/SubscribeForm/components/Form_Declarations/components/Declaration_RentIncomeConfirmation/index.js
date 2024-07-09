import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss';
import { useRecoilState } from 'recoil';
import declarationAtom from '../../atoms/declarationAtom';

export default function Declaration_RentIncomeConfirmation({ onBack, onNext }) {
    const { auth } = useAuth();
    const [confirmation, setConfirmation] = useState(null);
    const [rentDetails, setRentDetails] = useState(null);
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);
    const [error, setError] = useState('');

    useEffect(() => {
        if (declarationData.rentDetails) {
            setRentDetails(declarationData.rentDetails)
        }

    }, []);

    const handleSave = async () => {
        if (confirmation === null) {
            return;
        }

        if (confirmation === false) {
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

        if (!rentDetails || !declarationData) {
            console.error('Os dados da declaração não estão disponíveis');
            return;
        }

        const text = `
            Eu, ${declarationData.name}, portador(a) do CPF nº ${declarationData.CPF}, recebo aluguel do imóvel situado no Endereço ${rentDetails.address}, \
nº ${rentDetails.addressNumber}, complemento, CEP: ${rentDetails.CEP}, bairro ${rentDetails.neighborhood}, cidade ${rentDetails.city}, \
UF ${rentDetails.UF}, no valor mensal de ${rentDetails.rentAmount}, pago por ${rentDetails.landlordName}, inscrito(a) no CPF nº ${rentDetails.landlordCpf} (locatário(a)).
        `;

        const payload = {
            declarationExists: confirmation,
            ...(confirmation && { text })
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/candidates/declaration/RentIncome/${declarationData.id}`, {
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

            onNext('vehicleOwnership');
        } catch (error) {
            console.error('Erro ao registrar a declaração:', error);
        }
    };

    const isSaveDisabled = confirmation === null;

    if (!rentDetails || !declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÃO DE RECEBIMENTO DE ALUGUEL</h1>
            <h2>{declarationData.name}</h2>
            <div className={commonStyles.declarationContent}>
                <p>
                    Recebo aluguel do imóvel situado no Endereço <strong>{rentDetails.address}</strong>, nº <strong>{rentDetails.addressNumber}</strong>, complemento, CEP: <strong>{rentDetails.CEP}</strong>, bairro <strong>{rentDetails.neighborhood}</strong>, cidade <strong>{rentDetails.city}</strong>, Estado <strong>{rentDetails.UF}</strong>, no valor mensal de <strong>{rentDetails.rentAmount}</strong>, pago por <strong>{rentDetails.landlordName}</strong>, inscrito(a) no CPF nº <strong>{rentDetails.landlordCpf}</strong> (locatário(a)).
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
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleSave}
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
