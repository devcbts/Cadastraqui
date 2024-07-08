import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss';
import { useRecoilState } from 'recoil';
import declarationAtom from '../../atoms/declarationAtom';

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
        if (hasAddressProof !== null) {
            onNext(hasAddressProof);
        }
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO DE AUSÊNCIA DE COMPROVANTE DE ENDEREÇO EM NOME</h2>
            <h3>{declarationData.name}</h3>
            <p>Você possui comprovante de endereço em seu nome?</p>
            <div className={commonStyles.radioButtons}>
                <label>
                    <input type="radio" name="confirmation" value="sim" onChange={() => setHasAddressProof(true)} checked={hasAddressProof} /> Sim
                </label>
                <label>
                    <input type="radio" name="confirmation" value="nao" onChange={() => setHasAddressProof(false)} checked={hasAddressProof === false} /> Não
                </label>
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
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
