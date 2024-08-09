import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import declarationAtom from '../../atoms/declarationAtom';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto

export default function Declaration_WorkCard({ onBack, onNext }) {
    const [hasWorkCard, setHasWorkCard] = useState(null);
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);

    useEffect(() => {
        if (declarationData.hasWorkCard !== null) {
            setHasWorkCard(declarationData.hasWorkCard)
        }
    }, []);

    const handleSave = () => {
        setDeclarationData((prev) => ({ ...prev, hasWorkCard }))
        if (hasWorkCard !== null) {
            onNext(hasWorkCard);
        }
    };

    return (
        <div className={commonStyles.declarationForm}>
            <h2 className={commonStyles.declarationFormTitle}>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h2>
            <h3 className={commonStyles.declarationFormSubTitle}>DECLARAÇÃO DE POSSUIDOR OU NÃO DE CARTEIRA DE TRABALHO</h3>
            <h3 className={commonStyles.declarationFormNameTitle}>{declarationData.name}</h3>
            <p className={commonStyles.declarationConfirm}>Você possui Carteira de trabalho? (a partir de 16 anos)</p>
            <div className={commonStyles.radioGroupInput}>
                <label>
                    <input type="radio" name="workCard" value="sim" onChange={() => setHasWorkCard(true)} checked={hasWorkCard} /> Sim
                </label>
                <label>
                    <input type="radio" name="workCard" value="nao" onChange={() => setHasWorkCard(false)} checked={hasWorkCard === false} /> Não
                </label>
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleSave}
                    disabled={hasWorkCard === null}
                    style={{
                        borderColor: hasWorkCard === null ? '#ccc' : '#1F4B73',
                        cursor: hasWorkCard === null ? 'not-allowed' : 'pointer',
                        opacity: hasWorkCard === null ? 0.6 : 1
                    }}
                />
            </div>
        </div>
    );
}
