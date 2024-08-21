import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import candidateService from 'services/candidate/candidateService';
import declarationAtom from '../../atoms/declarationAtom';
import commonStyles from '../../styles.module.scss';

export default function Declaration_Activity({ onBack, onNext }) {
    const [activity, setActivity] = useState(null);
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);

    useEffect(() => {
        if (declarationData.activity) {
            setActivity(declarationData.activity)
        }

    }, []);

    const handleSave = () => {
        setDeclarationData((prev) => ({ ...prev, activity }))
        if (activity) {
            candidateService.deleteDeclaration({
                userId: declarationData.id, type: 'Activity', text: `
                Eu, ${declarationData.name}, inscrito(a) no CPF ${declarationData.CPF}, declaro não exercer nenhuma atividade laboral.
                ` })
        }
        if (activity !== null) {
            onNext(activity);
        }
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h2 className={commonStyles.declarationFormTitle}>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h2>
            <h3 className={commonStyles.declarationFormSubTitle}>DECLARAÇÃO DE AUSÊNCIA DE RENDA (DESEMPREGADO(A) OU DO LAR)</h3>
            <h3 className={commonStyles.declarationFormNameTitle}>{declarationData.name}</h3>
            <p className={commonStyles.declarationConfirm}>Você faz alguma atividade laboral?</p>
            <div className={commonStyles.radioGroupInput}>
                <label>
                    <input type="radio" name="activity" value="sim" onChange={() => setActivity(true)} checked={activity} /> Sim
                </label>
                <label>
                    <input type="radio" name="activity" value="nao" onChange={() => setActivity(false)} checked={activity === false} /> Não
                </label>
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleSave}
                    disabled={activity === null}
                    style={{
                        borderColor: activity === null ? '#ccc' : '#1F4B73',
                        cursor: activity === null ? 'not-allowed' : 'pointer',
                        opacity: activity === null ? 0.6 : 1
                    }}
                />
                {/* <ButtonBase
                    onClick={handleSave}
                    disabled={activity === null}
                    style={{
                        borderColor: activity === null ? '#ccc' : '#1F4B73',
                        cursor: activity === null ? 'not-allowed' : 'pointer',
                        opacity: activity === null ? 0.6 : 1
                    }}
                >
                    <Arrow width="30px" />
                </ButtonBase> */}
            </div>
        </div>
    );
}
