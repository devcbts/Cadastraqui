import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import declarationAtom from '../../atoms/declarationAtom';
import commonStyles from '../../styles.module.scss';

export default function Declaration_ChildSupport({ onBack, onNext, onNoPension }) {
    const [childReceivesSupport, setChildReceivesSupport] = useState(null);
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);

    useEffect(() => {
        if (declarationData.childReceivesSupport) {
            setChildReceivesSupport(declarationData.childReceivesSupport)
        }

    }, []);

    const handleRadioChange = (event) => {
        setChildReceivesSupport(event.target.value === 'yes');
    };

    const handleNext = () => {
        setDeclarationData((prev) => ({
            ...prev, childReceivesSupport,
            childrenData: childReceivesSupport ? prev.childrenData : null,

        }))
        if (childReceivesSupport === false) {
            onNoPension();
        } else {
            onNext();
        }
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h2 className={commonStyles.declarationFormTitle}>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h2>
            <h3 className={commonStyles.declarationFormSubTitle}>RECEBIMENTO OU AUSÊNCIA DE RECEBIMENTO DE PENSÃO ALIMENTÍCIA</h3>
            <h3 className={commonStyles.declarationFormNameTitle}>{declarationData.name}</h3>
            <div className={commonStyles.declarationContent}>
                <label>C - Há filho(s) que recebe(m) pensão alimentícia de outro(s) pai(s) ou mãe(s)?</label>
                <div className={commonStyles.radioGroup}>
                    <input
                        type="radio"
                        id="supportYes"
                        name="childSupport"
                        value="yes"
                        onChange={handleRadioChange}
                        checked={childReceivesSupport === true}
                    />
                    <label htmlFor="supportYes">Sim</label>
                    <input
                        type="radio"
                        id="supportNo"
                        name="childSupport"
                        value="no"
                        onChange={handleRadioChange}
                        checked={childReceivesSupport === false}
                    />
                    <label htmlFor="supportNo">Não</label>
                </div>
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleNext}
                    disabled={childReceivesSupport === null}
                    style={{
                        borderColor: childReceivesSupport === null ? '#ccc' : '#1F4B73',
                        cursor: childReceivesSupport === null ? 'not-allowed' : 'pointer',
                        opacity: childReceivesSupport === null ? 0.6 : 1
                    }}
                />
                <ButtonBase
                    onClick={handleNext}
                    disabled={childReceivesSupport === null}
                    style={{
                        borderColor: childReceivesSupport === null ? '#ccc' : '#1F4B73',
                        cursor: childReceivesSupport === null ? 'not-allowed' : 'pointer',
                        opacity: childReceivesSupport === null ? 0.6 : 1
                    }}
                >
                    <Arrow width="30px" />
                </ButtonBase>
            </div>
        </div>
    );
}
