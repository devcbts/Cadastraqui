import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss';
import { useRecoilState } from 'recoil';
import declarationAtom from '../../atoms/declarationAtom';
import { formatCPF } from 'utils/format-cpf';
import { formatCurrency } from 'utils/format-currency';
import useControlForm from 'hooks/useControlForm';
import InputForm from 'Components/InputForm';
import MoneyFormInput from 'Components/MoneyFormInput';
import FormCheckbox from 'Components/FormCheckbox';
import FormSelect from 'Components/FormSelect';
import pensionSchema from '../Declaration_Pension/pension-schema';
import childPensionSchema from './child-pension-schema';

export default function Declaration_ChildPension({ onBack, onNext, onNoPension }) {
    const [childReceivesPension, setChildReceivesPension] = useState(null);
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);
    const [childPensionRecipients, setChildPensionRecipients] = useState('');
    // const [payerName, setPayerName] = useState('');
    // const [payerCpf, setPayerCpf] = useState('');
    // const [amount, setAmount] = useState('');
    const { control, formState: { isValid }, trigger, getValues, watch, resetField } = useControlForm({
        schema: childPensionSchema,
        defaultValues: {
            childReceivesPension: null,
            childPensionRecipients: [],
            payerName: '',
            payerCpf: '',
            amount: ''
        },
        initialData: declarationData?.childPensionData
    })
    useEffect(() => {
        if (!watch("childReceivesPension")) {
            resetField("childPensionRecipients", { defaultValue: [] })
            resetField("payerName", { defaultValue: '' })
            resetField("payerCpf", { defaultValue: '' })
            resetField("amount", { defaultValue: '' })
        }
    }, [watch("childReceivesPension")])
    // useEffect(() => {
    //     if (declarationData.childPensionData) {
    //         const { childPensionData } = declarationData
    //         setChildReceivesPension(childPensionData.childReceivesPension)
    //         setChildPensionRecipients(childPensionData.childPensionRecipients)
    //         setPayerName(childPensionData.payerName)
    //         setPayerCpf(childPensionData.payerCpf)
    //         setAmount(childPensionData.amount)
    //     }
    // }, []);

    // const handleRadioChange = (event) => {
    //     setChildReceivesPension(event.target.value === 'yes');
    // };

    const handleNext = () => {
        if (!isValid) {
            trigger()
            return
        }


        const childPensionData = {
            ...getValues()
            // childReceivesPension,
            // childPensionRecipients: childReceivesPension ? childPensionRecipients : '',
            // payerName: childReceivesPension ? payerName : '',
            // payerCpf: childReceivesPension ? payerCpf : '',
            // amount: childReceivesPension ? amount : '',
        };
        const childReceivesPension = getValues("childReceivesPension")
        // localStorage.setItem('childPensionData', JSON.stringify(pensionData));
        setDeclarationData((prev) => ({
            ...prev, childPensionData,
            childrenData: childReceivesPension ? prev.childrenData : null,
            childReceivesSupport: childReceivesPension ? prev.childReceivesSupport : null
        }))
        if (childReceivesPension) {
            onNext();
        } else {
            onNoPension();
        }
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
                    control={control}
                    name={"childReceivesPension"}
                    value={watch("childReceivesPension")}
                    label={'B - Algum filho recebe pensão alimentícia?'}
                />
                {/* <label>B - Algum filho recebe pensão alimentícia?</label>
                <div className={commonStyles.radioGroup}>
                    <input
                        type="radio"
                        id="childYes"
                        name="childPension"
                        value="yes"
                        onChange={handleRadioChange}
                        checked={childReceivesPension === true}
                    />
                    <label htmlFor="childYes">Sim</label>
                    <input
                        type="radio"
                        id="childNo"
                        name="childPension"
                        value="no"
                        onChange={handleRadioChange}
                        checked={childReceivesPension === false}
                    />
                    <label htmlFor="childNo">Não</label>
                </div> */}
                {watch("childReceivesPension") && (
                    <div className={commonStyles.additionalFields}>
                        <FormSelect control={control} name={'childPensionRecipients'} label={'Selecione todos que recebem pensão'}
                            multiple
                            value={watch("childPensionRecipients")}
                            options={declarationData?.Candidate?.filter(e => e.relationship === "Child").map((e) => ({ value: e.name, label: e.name }))}
                        />
                        <InputForm control={control} label={'Nome do pagador'} name="payerName" />
                        <InputForm control={control} label={'CPF do pagador'} name="payerCpf" transform={(e) => formatCPF(e.target.value)} />
                        <MoneyFormInput control={control} label={'Valor da pensão'} name="amount" />
                        {/* <div className={commonStyles.inputGroup}>
                            <label htmlFor="childPensionRecipients">Selecione todos que recebem pensão</label>
                            <input
                                type="text"
                                id="childPensionRecipients"
                                name="childPensionRecipients"
                                value={childPensionRecipients}
                                onChange={(e) => setChildPensionRecipients(e.target.value)}
                                placeholder="Carlos da Silva, Fulana da Silva"
                            />
                        </div> */}
                        {/* <div className={commonStyles.inputGroup}>
                            <label htmlFor="payerName">Nome do Pagador da Pensão</label>
                            <input
                                type="text"
                                id="payerName"
                                name="payerName"
                                value={payerName}
                                onChange={(e) => setPayerName(e.target.value)}
                                placeholder="Joana de Gizman Londres"
                            />
                        </div> */}
                        {/* <div className={commonStyles.inputGroup}>
                            <label htmlFor="payerCpf">CPF do Pagador da Pensão</label>
                            <input
                                type="text"
                                id="payerCpf"
                                name="payerCpf"
                                value={payerCpf}
                                onChange={(e) => setPayerCpf(formatCPF(e.target.value))}
                                placeholder="524.321.789-09"
                            />
                        </div> */}
                        {/* <div className={commonStyles.inputGroup}>
                            <label htmlFor="amount">Valor</label>
                            <input
                                type="text"
                                id="amount"
                                name="amount"
                                value={amount}
                                onChange={(e) => setAmount(formatCurrency(e.target.value))}
                                placeholder="550,00"
                            />
                        </div> */}
                    </div>
                )}
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleNext}

                />
                <ButtonBase
                    onClick={handleNext}

                >
                    <Arrow width="40px" />
                </ButtonBase>
            </div>
        </div>
    );
}
