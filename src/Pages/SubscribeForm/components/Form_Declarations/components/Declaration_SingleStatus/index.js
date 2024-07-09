import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import { useRecoilState } from 'recoil';
import declarationAtom from '../../atoms/declarationAtom';
import FormCheckbox from 'Components/FormCheckbox';
import useControlForm from 'hooks/useControlForm';
import { z } from 'zod';

export default function Declaration_SingleStatus({ onBack, onNext }) {
    // const [confirmation, setConfirmation] = useState(null);
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);
    const { control, formState: { isValid }, trigger, getValues, watch } = useControlForm({
        schema: z.object({ confirmation: z.boolean() }),
        defaultValues: {
            confirmation: null
        },
        initialData: declarationData?.single
    })
    const confirmation = watch("confirmation")
    // useEffect(() => {
    //     if (declarationData.single) {
    //         setConfirmation(declarationData.single.confirmation)
    //     }

    // }, []);

    const handleSave = () => {
        if (!isValid) {
            trigger()
            return
        }
        setDeclarationData(prev => ({ ...prev, single: getValues() }))
        onNext(confirmation);
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO DE ESTADO CIVIL SOLTEIRO(A)</h2>
            <h3>{declarationData.name}</h3>
            <FormCheckbox
                control={control}
                label={'É solteiro e não mantém união estável?'}
                name={"confirmation"}
            />
            {/* <p>Sou solteiro e não mantenho união estável</p>
            <div className={commonStyles.radioGroup}>
                <label>
                    <input type="radio" name="confirmation" value="sim" onChange={() => setConfirmation(true)} checked={confirmation} /> Sim
                </label>
                <label>
                    <input type="radio" name="confirmation" value="nao" onChange={() => setConfirmation(false)} checked={confirmation === false} /> Não
                </label>
            </div> */}
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleSave}
                // disabled={confirmation === null}
                // style={{
                //     borderColor: confirmation === null ? '#ccc' : '#1F4B73',
                //     cursor: confirmation === null ? 'not-allowed' : 'pointer',
                //     opacity: confirmation === null ? 0.6 : 1
                // }}
                />
            </div>
        </div>
    );
}
