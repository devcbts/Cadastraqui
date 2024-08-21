import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import candidateService from 'services/candidate/candidateService';
import declarationAtom from '../../atoms/declarationAtom';
import commonStyles from '../../styles.module.scss';

export default function Declaration_Empresario({ onBack, onSave }) {
    const [isPartner, setIsPartner] = useState(null);
    const [activity, setActivity] = useState('');
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);

    useEffect(() => {
        if (declarationData.empresarioDetails) {
            const empresarioDetails = declarationData.empresarioDetails
            setIsPartner(empresarioDetails.isPartner)
            setActivity(empresarioDetails.activity)
        }

    }, []);

    const handleSave = () => {
        setDeclarationData((prev) => ({
            ...prev,
            empresarioDetails: {
                isPartner,
                activity: isPartner ? activity : ''
            }
        }))
        if (!isPartner) {
            candidateService.deleteDeclaration({
                userId: declarationData.id, type: 'Empresario',
                text: `
                Eu, ${declarationData.name}, inscrito(a) no CPF ${declarationData.CPF}, declaro não ser sócio de qualquer empresa.
                `
            })

        }
        if (isPartner !== null) {
            localStorage.setItem('empresarioDetails', JSON.stringify({ isPartner, activity }));
            onSave(isPartner, activity);
        }
    };

    const isSaveDisabled = () => {
        if (isPartner) {
            return !activity;
        }
        return isPartner === null;
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h2 className={commonStyles.declarationFormTitle}>DECLARAÇÃO PARA FINS DE PROCESSO SELETIVO CEBAS</h2>
            <h3 className={commonStyles.declarationFormSubTitle}>DECLARAÇÃO DE RENDA DE EMPRESÁRIO</h3>
            <h3 className={commonStyles.declarationFormNameTitle}>{declarationData.name}</h3>
            <p className={commonStyles.declarationConfirm}>Você é sócio de alguma empresa?</p>
            <div className={commonStyles.radioGroupInput}>
                <label>
                    <input type="radio" name="isPartner" value="sim" onChange={() => setIsPartner(true)} checked={isPartner} /> Sim
                </label>
                <label>
                    <input type="radio" name="isPartner" value="nao" onChange={() => setIsPartner(false)} checked={isPartner === false} /> Não
                </label>
            </div>
            {isPartner && (
                <div className={commonStyles.inputGroup}>
                    <label htmlFor="activity">Escreva a atividade que exerce</label>
                    <textarea
                        id="activity"
                        name="activity"
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                        maxLength="255"
                        rows="4"
                    ></textarea>
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
