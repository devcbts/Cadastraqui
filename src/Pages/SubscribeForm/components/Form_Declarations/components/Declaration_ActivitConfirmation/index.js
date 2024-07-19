import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import useAuth from 'hooks/useAuth';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { api } from 'services/axios';
import declarationAtom from '../../atoms/declarationAtom';
import commonStyles from '../../styles.module.scss';

export default function Declaration_ActivitConfirmation({ onBack, onNext }) {
    const { auth } = useAuth();
    const [confirmation, setConfirmation] = useState(null);
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);
    const [error, setError] = useState('');
    const identityDetails = declarationData?.IdentityDetails
    // useEffect(() => {
    //     const savedData = localStorage.getItem('declarationData');
    //     if (savedData) {
    //         setDeclarationData(JSON.parse(savedData));
    //     }
    // }, []);

    const handleSave = async () => {
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

        if (!declarationData) {
            console.error('Os dados da declaração não estão disponíveis');
            return;
        }

        const text = `
Eu, ${declarationData.name}, portador(a) do CPF nº ${declarationData.CPF}, residente e domiciliado(a) à ${identityDetails.address}, \
nº ${identityDetails.addressNumber}, complemento, CEP: ${identityDetails.CEP}, bairro ${identityDetails.neighborhood}, cidade ${identityDetails.city}, \
UF ${identityDetails.UF}, e-mail: ${identityDetails.email}, declaro para os devidos fins e sob as penas da lei, que não exerço nenhuma atividade remunerada, \
seja ela formal ou informal, não possuindo, portanto, nenhuma fonte de renda.\
        `;

        const payload = {
            declarationExists: confirmation,
            text: confirmation ? text : ''
        };

        try {
            const response = await api.post(`/candidates/declaration/Activity/${declarationData.id}`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status !== 200) {
                throw new Error(`Erro: ${response.statusText}`);
            }

            const data = await response.data;
            ;

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
            <h1>DECLARAÇÃO DE AUSÊNCIA DE RENDA (DESEMPREGADO(A) OU DO LAR)</h1>
            <h2>{declarationData.name}</h2>
            <p>
                Eu, <span>{declarationData.name}</span>, portador(a) do CPF nº <span>{declarationData.CPF}</span>, residente e domiciliado(a) à <span>{identityDetails.address}</span>, nº <span>{identityDetails.addressNumber}</span>, complemento, CEP: <span>{identityDetails.CEP}</span>, bairro <span>{identityDetails.neighborhood}</span>, cidade <span>{identityDetails.city}</span>, UF <span>{identityDetails.UF}</span>, e-mail: <span>{identityDetails.email}</span>, declaro para os devidos fins e sob as penas da lei, que não exerço nenhuma atividade remunerada, seja ela formal ou informal, não possuindo, portanto, nenhuma fonte de renda.
            </p>
            <p>Confirma a declaração?</p>
            <div className={commonStyles.radioGroup}>
                <label>
                    <input
                        type="radio"
                        name="confirmation"
                        value="sim"
                        checked={confirmation}
                        onChange={() => { setConfirmation(true); setError(''); }}
                    /> Sim
                </label>
                <label>
                    <input
                        type="radio"
                        name="confirmation"
                        value="nao"
                        checked={confirmation === false}
                        onChange={() => { setConfirmation(false); setError(''); }}
                    /> Não
                </label>
            </div>
            {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleSave}
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
