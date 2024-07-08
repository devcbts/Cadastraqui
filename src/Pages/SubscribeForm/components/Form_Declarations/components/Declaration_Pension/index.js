import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss';
import { formatCPF } from 'utils/format-cpf';
import { formatCurrency } from 'utils/format-currency';
import { useRecoilState } from 'recoil';
import declarationAtom from '../../atoms/declarationAtom';
import useControlForm from 'hooks/useControlForm';
import { z } from 'zod';
import { isValidCPF } from 'utils/validate-cpf';
import InputForm from 'Components/InputForm';
import MoneyFormInput from 'Components/MoneyFormInput';
import stringToFloat from 'utils/string-to-float';
import FormCheckbox from 'Components/FormCheckbox';
import pensionSchema from './pension-schema';

export default function Declaration_Pension({ onBack, onNext }) {
    // const [receivesPension, setReceivesPension] = useState(null);

    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);
    const { control, formState: { isValid }, trigger, getValues, watch, resetField } = useControlForm({
        schema: pensionSchema,
        defaultValues: {
            receivesPension: null,
            payerName: '',
            payerCpf: '',
            amount: ''
        },
        initialData: declarationData?.pensionData
    })
    useEffect(() => {
        if (!watch("receivesPension")) {
            console.log('a')
            resetField("payerName", { defaultValue: '' })
            resetField("payerCpf", { defaultValue: '' })
            resetField("amount", { defaultValue: '' })
        }
    }, [watch("receivesPension")])
    // useEffect(() => {
    //     if (declarationData.pensionData) {
    //         const { pensionData } = declarationData
    //         setReceivesPension(pensionData.receivesPension)
    //         setPayerName(pensionData.payerName)
    //         setPayerCpf(pensionData.payerCpf)
    //         setAmount(pensionData.amount)
    //     }
    // }, []);
    // const handleRadioChange = (event) => {
    //     setReceivesPension(event.target.value === 'yes');
    // };

    const handleSave = () => {
        if (!isValid) {
            trigger()
            return
        }


        const pensionData = {
            // receivesPension,
            ...getValues()
        };
        // localStorage.setItem('pensionData', JSON.stringify(pensionData));
        setDeclarationData((prev) => {
            return ({ ...prev, pensionData })
        })
        onNext();
    };


    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>RECEBIMENTO OU AUSÊNCIA DE RECEBIMENTO DE PENSÃO ALIMENTÍCIA</h2>
            <h3>{declarationData.name}</h3>
            <div className={commonStyles.declarationContent}>
                <FormCheckbox
                    label={'A - Você recebe pensão alimentícia?'}
                    control={control}
                    name={"receivesPension"}
                    value={watch("receivesPension")}
                />
                {/* <label>A - Você recebe pensão alimentícia?</label>
                <div className={commonStyles.radioGroup}>
                    <input
                        type="radio"
                        id="yes"
                        name="pension"
                        value="yes"
                        onChange={handleRadioChange}
                        checked={receivesPension}
                    />
                    <label htmlFor="yes">Sim</label>
                    <input
                        type="radio"
                        id="no"
                        name="pension"
                        value="no"
                        onChange={handleRadioChange}
                        checked={receivesPension === false}
                    />
                    <label htmlFor="no">Não</label>
                </div> */}
                {watch("receivesPension") && (
                    <div className={commonStyles.additionalFields}>
                        <InputForm control={control} label={'Nome do pagador'} name="payerName" />
                        <InputForm control={control} label={'CPF do pagador'} name="payerCpf" transform={(e) => formatCPF(e.target.value)} />
                        <MoneyFormInput control={control} label={'Valor da pensão'} name="amount" />
                    </div>
                )}
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleSave}

                />
                <ButtonBase
                    onClick={handleSave}

                >
                    <Arrow width="40px" />
                </ButtonBase>
            </div>
        </div>
    );
}
