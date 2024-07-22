import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import candidateService from 'services/candidate/candidateService';
import declarationAtom from '../../atoms/declarationAtom';
import commonStyles from '../../styles.module.scss';

export default function Declaration_Autonomo({ onBack, onSave }) {
    const [informalWork, setInformalWork] = useState(null);
    const [activity, setActivity] = useState('');
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);

    useEffect(() => {
        if (declarationData.autonomoDetails) {
            const autonomoDetails = declarationData.autonomoDetails
            setInformalWork(autonomoDetails.informalWork)
            setActivity(autonomoDetails.activity)
        }

    }, []);

    const handleSave = () => {
        setDeclarationData((prev) => ({
            ...prev,
            autonomoDetails: {
                informalWork,
                activity: informalWork ? activity : ''
            }
        }))
        if (!informalWork) {
            candidateService.deleteDeclaration({ userId: declarationData.id, type: 'Autonomo' })
        }
        if (informalWork !== null) {
            localStorage.setItem('autonomoDetails', JSON.stringify({ informalWork, activity }));
            onSave(informalWork, activity);
        }
    };

    const isSaveDisabled = () => {
        if (informalWork) {
            return !activity;
        }
        return informalWork === null;
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÃO DE AUTÔNOMO(A)/RENDA INFORMAL</h1>
            <h2>{declarationData.name}</h2>
            <p className={commonStyles.declarationConfirm}>Você desenvolve alguma atividade sem vínculo empregatício?</p>
            <div className={commonStyles.radioGroupInput}>
                <label>
                    <input type="radio" name="informalWork" value="sim" onChange={() => setInformalWork(true)} checked={informalWork} /> Sim
                </label>
                <label>
                    <input type="radio" name="informalWork" value="nao" onChange={() => setInformalWork(false)} checked={informalWork === false} /> Não
                </label>
            </div>
            {informalWork && (
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
