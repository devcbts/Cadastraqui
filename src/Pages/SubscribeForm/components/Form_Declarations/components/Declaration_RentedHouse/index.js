import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import candidateService from 'services/candidate/candidateService';
import declarationAtom from '../../atoms/declarationAtom';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto

export default function Declaration_RentedHouse({ onBack, onNext }) {
    const [rentedHouse, setRentedHouse] = useState(null);
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);

    useEffect(() => {
        if (declarationData?.rent) {
            setRentedHouse(declarationData?.rent?.rentedHouse)
        }
    }, []);

    const handleSave = async () => {
        setDeclarationData((prev) => ({ ...prev, rent: rentedHouse ? { ...prev.rent, rentedHouse } : { rentedHouse } }))
        if (!rentedHouse) {
            await candidateService.deleteDeclaration({ userId: declarationData?.id, type: 'Rent' }).catch(_ => { })
        }
        onNext(rentedHouse);
    };

    return (
        <div className={commonStyles.declarationForm}>
            <h2 className={commonStyles.declarationFormTitle}>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h2>
            <h3 className={commonStyles.declarationFormSubTitle}>DECLARAÇÃO DE IMÓVEL ALUGADO - SEM CONTRATO DE ALUGUEL</h3>
            <h3 className={commonStyles.declarationFormNameTitle}>{declarationData?.name}</h3>
            <p className={commonStyles.declarationConfirm}>Você mora em imóvel alugado sem contrato de aluguel?</p>
            <div className={commonStyles.radioGroupInput}>
                <label>
                    <input type="radio" name="rentedHouse" value="sim" onChange={() => setRentedHouse(true)} checked={rentedHouse} /> Sim
                </label>
                <label>
                    <input type="radio" name="rentedHouse" value="nao" onChange={() => setRentedHouse(false)} checked={rentedHouse === false} /> Não
                </label>
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleSave}
                />
                {/* <ButtonBase
                    onClick={handleSave}
                >
                    <Arrow width="30px" />
                </ButtonBase> */}
            </div>
        </div>
    );
}
