import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss';
import candidateService from 'services/candidate/candidateService';
import { useRecoilState } from 'recoil';
import declarationAtom from '../../atoms/declarationAtom';

export default function Declaration_RentConfirmation({ onBack, onNext, userId }) {
    const { auth } = useAuth();
    const [confirmation, setConfirmation] = useState(null);
    const [rentDetails, setRentDetails] = useState(null);
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);
    const [error, setError] = useState('');

    useEffect(() => {
        if (declarationData?.rent) {
            setRentDetails(declarationData?.rent)
        }
        // const savedRentDetails = localStorage.getItem('rentDetails');
        // if (savedRentDetails) {
        //     setRentDetails(JSON.parse(savedRentDetails));
        // }
        // const savedDeclarationData = localStorage.getItem('declarationData');
        // if (savedDeclarationData) {
        //     setDeclarationData(JSON.parse(savedDeclarationData));
        // }
    }, []);

    const handleRegisterDeclaration = async () => {
        if (!auth?.uid) {
            console.error('UID não está definido');
            return;
        }

        if (confirmation === false) {
            setError('Por favor, verifique os dados de cadastro.');
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            console.error('Token não está definido');
            return;
        }

        if (!declarationData) {
            console.error('Os dados da declaração ou do aluguel não estão disponíveis');
            return;
        }

        const text = `
Resido em imóvel alugado e não possuo contrato de aluguel, pois se trata de acordo verbal/informal, ao qual pago o valor de \
${rentDetails.rentValue} \
por mês de aluguel para \
${rentDetails.landlordName}, \
inscrito no CPF nº \
${rentDetails.landlordCpf}. \
`;

        const payload = {
            declarationExists: confirmation,
            ...(confirmation && { text })
        };

        try {
            await candidateService.registerDeclaration({ section: 'Rent', id: declarationData.id, data: payload })

            // const response = await fetch(`${process.env.REACT_APP_API_URL}/candidates/declaration/Rent/${declarationData.id}`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${token}`
            //     },
            //     body: JSON.stringify(payload)
            // });

            // if (!response.ok) {
            //     throw new Error(`Erro: ${response.statusText}`);
            // }

            // const data = await response.json();
            // ;

            onNext(confirmation);
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
            <h2>DECLARAÇÃO DE IMÓVEL ALUGADO - SEM CONTRATO DE ALUGUEL</h2>
            <h3>{declarationData.name}</h3>
            <div className={commonStyles.declarationContent}>
                <p>
                    Resido em imóvel alugado e não possuo contrato de aluguel, pois se trata de acordo verbal/informal, ao qual pago o valor de
                    <span> {rentDetails?.rentValue} </span>
                    por mês de aluguel para
                    <span> {rentDetails?.landlordName} </span>,
                    inscrito no CPF nº
                    <span> {rentDetails?.landlordCpf} </span>.
                </p>
                <p>Confirma a declaração?</p>
                <div className={commonStyles.radioGroup}>
                    <label>
                        <input
                            type="radio"
                            name="confirmation"
                            value="sim"
                            checked={confirmation}
                            onChange={() => {
                                setConfirmation(true);
                                setError('');
                            }}
                        /> Sim
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="confirmation"
                            value="nao"
                            checked={confirmation === false}
                            onChange={() => {
                                setConfirmation(false);
                                setError('');
                            }}
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
