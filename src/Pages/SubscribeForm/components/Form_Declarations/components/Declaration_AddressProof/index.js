import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import candidateService from 'services/candidate/candidateService';
import declarationAtom from '../../atoms/declarationAtom';
import commonStyles from '../../styles.module.scss';

export default function Declaration_AddressProof({ onBack, onNext }) {
    const [hasAddressProof, setHasAddressProof] = useState(null);
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);

    useEffect(() => {
        if (declarationData.hasAddressProof) {
            setHasAddressProof(declarationData.hasAddressProof)
        }

    }, []);

    const handleSave = () => {
        setDeclarationData((prev) => ({ ...prev, hasAddressProof }))
        if (hasAddressProof) {
            candidateService.deleteDeclaration({ userId: declarationData.id, type: 'NoAddressProof' }).catch(err => { })
        }
        if (hasAddressProof !== null) {
            onNext(hasAddressProof);
        }
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h2 className={commonStyles.declarationFormTitle}>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h2>
            <h3 className={commonStyles.declarationFormSubTitle}>DECLARAÇÃO DE AUSÊNCIA DE COMPROVANTE DE ENDEREÇO EM NOME</h3>
            <h3 className={commonStyles.declarationFormNameTitle}>{declarationData.name}</h3>
            <p className={commonStyles.declarationConfirm}>Você possui comprovante de endereço em seu nome?</p>

            <div className={commonStyles.radioGroupInput}>
                <label>
                    <input type="radio" name="confirmation" value="sim" onChange={() => setHasAddressProof(true)} checked={hasAddressProof} /> Sim
                </label>
                <label>
                    <input type="radio" name="confirmation" value="nao" onChange={() => setHasAddressProof(false)} checked={hasAddressProof === false} /> Não
                </label>
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleSave}
                    disabled={hasAddressProof === null}
                    style={{
                        borderColor: hasAddressProof === null ? '#ccc' : '#1F4B73',
                        cursor: hasAddressProof === null ? 'not-allowed' : 'pointer',
                        opacity: hasAddressProof === null ? 0.6 : 1
                    }}
                />
            </div>
        </div>
    );
}
