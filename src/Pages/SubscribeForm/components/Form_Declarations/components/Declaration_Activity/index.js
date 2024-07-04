import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss';

export default function Declaration_Activity({ onBack, onNext }) {
    const [activity, setActivity] = useState(null);
    const [declarationData, setDeclarationData] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem('declarationData');
        if (savedData) {
            setDeclarationData(JSON.parse(savedData));
        }
    }, []);

    const handleSave = () => {
        if (activity !== null) {
            onNext(activity);
        }
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO DE AUSÊNCIA DE RENDA (DESEMPREGADO(A) OU DO LAR)</h2>
            <h3>{declarationData.fullName}</h3>
            <p>Você faz alguma atividade laboral?</p>
            <div className={commonStyles.radioGroup}>
                <label>
                    <input type="radio" name="activity" value="sim" onChange={() => setActivity('sim')} /> Sim
                </label>
                <label>
                    <input type="radio" name="activity" value="nao" onChange={() => setActivity('nao')} /> Não
                </label>
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
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
                <ButtonBase
                    onClick={handleSave}
                    disabled={activity === null}
                    style={{
                        borderColor: activity === null ? '#ccc' : '#1F4B73',
                        cursor: activity === null ? 'not-allowed' : 'pointer',
                        opacity: activity === null ? 0.6 : 1
                    }}
                >
                    <Arrow width="40px" />
                </ButtonBase>
            </div>
        </div>
    );
}
