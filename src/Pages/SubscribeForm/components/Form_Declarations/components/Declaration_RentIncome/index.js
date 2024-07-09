import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss';
import { useRecoilState } from 'recoil';
import declarationAtom from '../../atoms/declarationAtom';
import candidateService from 'services/candidate/candidateService';

export default function Declaration_RentIncome({ onBack, onNext }) {
    const { auth } = useAuth();
    const [receivesRent, setReceivesRent] = useState(null);
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);

    useEffect(() => {
        if (declarationData.receivesRent) {
            setReceivesRent(declarationData.receivesRent)
        }

    }, []);

    const handleRegisterDeclaration = async () => {
        if (receivesRent === null) {
            return;
        }

        if (receivesRent === false) {
            candidateService.deleteDeclaration({ userId: declarationData.id, type: 'RentIncome' })
            onNext(false); // Navega para VEHICLE_OWNERSHIP
            return;
        }

        // if (!auth?.uid) {
        //     console.error('UID não está definido');
        //     return;
        // }

        // const token = localStorage.getItem("token");
        // if (!token) {
        //     console.error('Token não está definido');
        //     return;
        // }

        // if (!declarationData) {
        //     console.error('Os dados da declaração não estão disponíveis');
        //     return;
        // }

        // const text = `
        //     Eu, ${declarationData.name}, portador(a) do CPF nº ${declarationData.CPF}, ${receivesRent ? 'recebo' : 'não recebo'} rendimento de imóvel alugado.
        // `;

        // const payload = {
        //     declarationExists: receivesRent,
        //     ...(receivesRent && { text })
        // };

        // try {
        //     const response = await fetch(`${process.env.REACT_APP_API_URL}/candidates/declaration/RentIncome/${declarationData.id}`, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': `Bearer ${token}`
        //         },
        //         body: JSON.stringify(payload)
        //     });

        //     if (!response.ok) {
        //         throw new Error(`Erro: ${response.statusText}`);
        //     }

        //     const data = await response.json();
        //     console.log('Declaração registrada:', data);

        //     // Redireciona para a próxima tela
        // } catch (error) {
        //     console.error('Erro ao registrar a declaração:', error);
        // }
        onNext(receivesRent);
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÃO DE RECEBIMENTO DE ALUGUEL</h1>
            <h2>{declarationData.name}</h2>
            <p>Você recebe rendimento de imóvel alugado?</p>
            <div className={commonStyles.radioGroup}>
                <label>
                    <input
                        type="radio"
                        name="receivesRent"
                        value="sim"
                        onChange={() => setReceivesRent(true)}
                        checked={receivesRent}
                    /> Sim
                </label>
                <label>
                    <input
                        type="radio"
                        name="receivesRent"
                        value="nao"
                        onChange={() => setReceivesRent(false)}
                        checked={receivesRent === false}
                    /> Não
                </label>
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleRegisterDeclaration}
                    disabled={receivesRent === null}
                    style={{
                        borderColor: receivesRent === null ? '#ccc' : '#1F4B73',
                        cursor: receivesRent === null ? 'not-allowed' : 'pointer',
                        opacity: receivesRent === null ? 0.6 : 1
                    }}
                />
            </div>
        </div>
    );
}
