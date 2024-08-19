import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import useAuth from 'hooks/useAuth';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import candidateService from 'services/candidate/candidateService';
import formatDate from 'utils/format-date';
import declarationAtom from '../../atoms/declarationAtom';
import commonStyles from '../../styles.module.scss';

export default function Declaration_StableUnionConfirmation({ onBack, onNext, partnerName, unionStartDate }) {
    const { auth } = useAuth();
    const declarationData = useRecoilValue(declarationAtom)
    const [confirmation, setConfirmation] = useState(null);
    const [error, setError] = useState('');

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

        const text = `
            Convivo em União Estável com ${declarationData?.stableUnion.partnerName}, CPF ${declarationData?.stableUnion.CPF}, desde ${formatDate(declarationData?.stableUnion.unionStartDate)} e que somos juridicamente capazes.\
Nossa União Estável possui natureza pública, contínua e duradoura com o objetivo de constituição de família, nos termos dos artigos 1723 e seguintes do Código Civil.
        `;

        const payload = {
            declarationExists: confirmation === 'sim',
            ...(confirmation === 'sim' && { text })
        };

        try {
            await candidateService.registerDeclaration({ section: 'StableUnion', id: declarationData.id, data: payload })

            // const response = await fetch(`${process.env.REACT_APP_API_URL}/candidates/declaration/StableUnion/${declarationData.id}`, {
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

            onNext(confirmation === 'sim');
        } catch (error) {
            console.error('Erro ao registrar a declaração:', error);
        }
    };

    return (
        <div className={commonStyles.declarationForm}>
            <h2 className={commonStyles.declarationFormTitle}>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h2>
            <h3 className={commonStyles.declarationFormSubTitle}>DECLARAÇÃO DE UNIÃO ESTÁVEL</h3>
            <h3 className={commonStyles.declarationFormNameTitle}>{declarationData.name}</h3>
            <div className={commonStyles.declarationContent}>
                <p>Convivo em União Estável com {declarationData?.stableUnion.partnerName}, CPF {declarationData?.stableUnion.CPF}, desde {formatDate(declarationData?.stableUnion.unionStartDate)} e que somos juridicamente capazes. Nossa União Estável possui natureza pública, contínua e duradoura com o objetivo de constituição de família, nos termos dos artigos 1723 e seguintes do Código Civil.</p>
                <p className={commonStyles.declarationConfirm}>Confirma a declaração?</p>
                <div className={commonStyles.radioGroupInput}>
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
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
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
