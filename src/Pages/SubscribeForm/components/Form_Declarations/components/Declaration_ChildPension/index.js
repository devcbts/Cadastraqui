import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import FormCheckbox from 'Components/FormCheckbox';
import FormSelect from 'Components/FormSelect';
import InputForm from 'Components/InputForm';
import MoneyFormInput from 'Components/MoneyFormInput';
import useControlForm from 'hooks/useControlForm';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { formatCPF } from 'utils/format-cpf';
import declarationAtom from '../../atoms/declarationAtom';
import commonStyles from '../../styles.module.scss';
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

    const handleNext = async () => {
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
        // if (!childReceivesPension) {
        //     const text = `
        //     A. ${declarationData.pensionData.receivesPension
        //             ? `Recebo pensão alimentícia (judicial) no valor total de R$ ${declarationData.pensionData.amount}, inscrito(a) no CPF nº ${declarationData.pensionData.payerCpf}.`
        //             : `Não recebo pensão alimentícia.`
        //         }
        //     ${declarationData?.Candidate?.length > 0 ? `
        //     B. Meu(s) filhos(as) não recebe(m) pensão alimentícia.
        //     ` : ''}
        // `


        //     try {
        //         const token = localStorage.getItem("token");

        //         const response = await fetch(`${process.env.REACT_APP_API_URL}/candidates/declaration/Pension/${declarationData.id}`, {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 'Authorization': `Bearer ${token}`
        //             },
        //             body: JSON.stringify({
        //                 declarationExists: true,
        //                 text
        //             })
        //         });

        //         if (!response.ok) {
        //             throw new Error(`Erro: ${response.statusText}`);
        //         }

        //         const data = await response.json();
        //         ;

        //         onNext(true);
        //     } catch (error) {
        //         console.error('Erro ao registrar a declaração:', error);
        //     }
        // }
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
            <h2 className={commonStyles.declarationFormTitle}>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h2>
            <h3 className={commonStyles.declarationFormSubTitle}>RECEBIMENTO OU AUSÊNCIA DE RECEBIMENTO DE PENSÃO ALIMENTÍCIA</h3>
            <h3 className={commonStyles.declarationFormNameTitle}>{declarationData.name}</h3>
            <div className={commonStyles.declarationContent}>
                <FormCheckbox
                    control={control}
                    name={"childReceivesPension"}
                    value={watch("childReceivesPension")}
                    label={'B - Algum filho recebe pensão alimentícia?'}
                />

                {watch("childReceivesPension") && (
                    <div className={commonStyles.additionalFields}>
                        <FormSelect control={control} name={'childPensionRecipients'} label={'Selecione todos que recebem pensão'}
                            multiple
                            value={watch("childPensionRecipients")}
                            options={declarationData?.Candidate?.filter(e => e?.IdentityDetails?.relationship === "Child").map((e) => ({ value: e.name, label: e.name }))}
                        />
                        <InputForm control={control} label={'Nome do pagador'} name="payerName" />
                        <InputForm control={control} label={'CPF do pagador'} name="payerCpf" transform={(e) => formatCPF(e.target.value)} />
                        <MoneyFormInput control={control} label={'Valor da pensão'} name="amount" />

                    </div>
                )}
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleNext}
                />
                {/* <ButtonBase
                    onClick={handleNext}
                >
                    <Arrow width="30px" />
                </ButtonBase> */}
            </div>
        </div>
    );
}
