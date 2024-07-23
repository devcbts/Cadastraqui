import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import candidateService from 'services/candidate/candidateService';
import declarationAtom from '../../atoms/declarationAtom';
import commonStyles from '../../styles.module.scss';

export default function Declaration_RuralWorker({ onBack, onNext }) {
    const [ruralWorker, setRuralWorker] = useState(null);
    const [activity, setActivity] = useState('');
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);

    useEffect(() => {
        if (declarationData.ruralWorkerDetails) {
            const ruralWorkerDetails = declarationData.ruralWorkerDetails
            setRuralWorker(ruralWorkerDetails.ruralWorker)
            setActivity(ruralWorkerDetails.activity)
        }

    }, []);

    const handleSave = () => {
        setDeclarationData((prev) => ({
            ...prev,
            ruralWorkerDetails: {
                ruralWorker,
                activity: ruralWorker ? activity : ''
            }
        }))
        if (ruralWorker !== null) {
            localStorage.setItem('ruralWorkerDetails', JSON.stringify({ ruralWorker, activity }));
            if (!ruralWorker) {
                candidateService.deleteDeclaration({ userId: declarationData.id, type: 'RuralWorker' }).catch(err => { })
                onNext(false); // Navega para AUTONOMO
            } else {
                onNext(true); // Navega para a próxima tela com a atividade
            }
        }
    };

    const isSaveDisabled = () => {
        if (ruralWorker) {
            return !activity;
        }
        return ruralWorker === null;
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h2 className={commonStyles.declarationFormTitle}>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h2>
            <h3 className={commonStyles.declarationFormSubTitle}>DECLARAÇÃO DE TRABALHADOR(A) RURAL</h3>
            <h3 className={commonStyles.declarationFormNameTitle}>{declarationData.name}</h3>

            <p className={commonStyles.declarationConfirm}>Você é trabalhador rural?</p>
            <div className={commonStyles.radioGroupInput}>
                <label>
                    <input type="radio" name="ruralWorker" value="sim" onChange={() => setRuralWorker(true)} checked={ruralWorker} /> Sim
                </label>
                <label>
                    <input type="radio" name="ruralWorker" value="nao" onChange={() => setRuralWorker(false)} checked={ruralWorker === false} /> Não
                </label>
            </div>
            {ruralWorker && (
                <div className={commonStyles.inputGroup}>
                    <label htmlFor="activity">Escreva a atividade que exerce</label>
                    <textarea
                        id="activity"
                        name="activity"
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                        maxLength={255}
                        placeholder="Descreva sua atividade"
                    />
                    <div className={commonStyles.charCount}>{activity.length}/255</div>
                </div>
            )}
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleSave}
                    disabled={isSaveDisabled()}
                    style={{
                        borderColor: isSaveDisabled() ? '#ccc' : '#1F4B73',
                        cursor: isSaveDisabled() ? 'not-allowed' : 'pointer',
                        opacity: isSaveDisabled() ? 0.6 : 1
                    }}
                />
            </div>
        </div>
    );
}
