import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import { api } from 'services/axios';
import commonStyles from '../../styles.module.scss';

export default function Declaration_ActivitConfirmation({ onBack, onNext }) {
    const { auth } = useAuth();
    const [confirmation, setConfirmation] = useState('sim');
    const [declarationData, setDeclarationData] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem('declarationData');
        if (savedData) {
            setDeclarationData(JSON.parse(savedData));
        }
    }, []);

    const handleSave = async () => {
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
            Eu, ${declarationData.fullName}, portador(a) do CPF nº ${declarationData.CPF}, residente e domiciliado(a) à ${declarationData.address}, nº ${declarationData.addressNumber}, complemento, CEP: ${declarationData.CEP}, bairro ${declarationData.neighborhood}, cidade ${declarationData.city}, UF ${declarationData.UF}, e-mail: ${declarationData.email}, declaro para os devidos fins e sob as penas da lei, que não exerço nenhuma atividade remunerada, seja ela formal ou informal, não possuindo, portanto, nenhuma fonte de renda.
        `;

        const payload = {
            declarationExists: confirmation === 'sim',
            text: confirmation === 'sim' ? text : ''
        };

        try {
            const response = await api.post(`/candidates/declaration/Activity/${auth.uid}`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status !== 200) {
                throw new Error(`Erro: ${response.statusText}`);
            }

            const data = await response.data;
            console.log('Declaração registrada:', data);

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
            <h1>DECLARAÇÃO DE AUSÊNCIA DE RENDA (DESEMPREGADO(A) OU DO LAR)</h1>
            <h2>{declarationData.fullName}</h2>
            <p>
                Eu, <span>{declarationData.fullName}</span>, portador(a) do CPF nº <span>{declarationData.CPF}</span>, residente e domiciliado(a) à <span>{declarationData.address}</span>, nº <span>{declarationData.addressNumber}</span>, complemento, CEP: <span>{declarationData.CEP}</span>, bairro <span>{declarationData.neighborhood}</span>, cidade <span>{declarationData.city}</span>, UF <span>{declarationData.UF}</span>, e-mail: <span>{declarationData.email}</span>, declaro para os devidos fins e sob as penas da lei, que não exerço nenhuma atividade remunerada, seja ela formal ou informal, não possuindo, portanto, nenhuma fonte de renda.
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
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase label="Salvar" onClick={handleSave} />
            </div>
        </div>
    );
}
