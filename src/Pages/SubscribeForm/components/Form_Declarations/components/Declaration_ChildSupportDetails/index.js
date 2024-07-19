import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import FormSelect from 'Components/FormSelect';
import InputForm from 'Components/InputForm';
import MoneyFormInput from 'Components/MoneyFormInput';
import useControlForm from 'hooks/useControlForm';
import { useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import { formatCPF } from 'utils/format-cpf';
import stringToFloat from 'utils/string-to-float';
import { isValidCPF } from 'utils/validate-cpf';
import { z } from 'zod';
import declarationAtom from '../../atoms/declarationAtom';
import commonStyles from '../../styles.module.scss';

export default function Declaration_ChildSupportDetails({ onBack, onNext }) {
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);
    // const [numberOfChildren, setNumberOfChildren] = useState(1);
    // const [childrenData, setChildrenData] = useState([]);
    const [isSaveDisabled, setIsSaveDisabled] = useState(true);
    const { control, formState: { isValid }, trigger, getValues, watch, setValue } = useControlForm({
        schema: z.object({
            numberOfParents: z.number().max(12, 'Máximo de 12 pensões diferentes').default(1),
            childrenData: z.array(z.object({
                childName: z.array(z.string()).min(1, 'Selecione pelo menos um(a) filho(a)'),
                payerName: z.string().min(1, 'Nome do pagador obrigatório'),
                payerCpf: z.string().min(1, 'CPF obrigatório').refine(isValidCPF, 'CPF inválido'),
                amount: z.string().refine(d => stringToFloat(d) > 0, 'Valor obrigatório')
            }))
        }),
        defaultValues: {
            numberOfParents: 1,
            childrenData: [{
                childName: [],
                payerName: '',
                payerCpf: '',
                amount: ''
            }]
        },
        initialData: {
            numberOfParents: declarationData?.childrenData?.length,
            childrenData: declarationData?.childrenData
        }
    })
    const numberOfParents = watch("numberOfParents")
    const { fields, append, remove } = useFieldArray({
        control: control,
        name: "childrenData"
    })
    // useEffect(() => {
    //     if (declarationData.childrenData) {
    //         setChildrenData(declarationData.childrenData)
    //         setNumberOfChildren(declarationData.childrenData.length)
    //     }

    // }, []);



    // const handleChildrenDataChange = (index, field, value) => {
    //     const newChildrenData = Array.from(childrenData);
    //     if (!newChildrenData[index]) {
    //         newChildrenData[index] = {};
    //     }
    //     const update = { ...newChildrenData[index], [field]: value }
    //     newChildrenData[index] = update;
    //     setChildrenData(newChildrenData);
    //     localStorage.setItem('childrenData', JSON.stringify(newChildrenData));
    // };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }
    const handleSave = () => {
        if (!isValid) {
            trigger()
            return
        }
        const childrenData = getValues("childrenData")
        setDeclarationData((prev) => ({ ...prev, childrenData }))
        onNext()
    }
    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>RECEBIMENTO OU AUSÊNCIA DE RECEBIMENTO DE PENSÃO ALIMENTÍCIA</h2>
            <h3>{declarationData.name}</h3>
            <div className={commonStyles.declarationContent}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

                    <InputForm label={"C - de quantos?"} name={"numberOfParents"} error={null} disabled control={control} />
                    <ButtonBase label={'adicionar'} onClick={() => {
                        setValue("numberOfParents", getValues("numberOfParents") + 1)
                        append({
                            childName: [],
                            payerName: '',
                            payerCpf: '',
                            amount: ''
                        })
                    }}></ButtonBase>
                </div>
                {/* <label htmlFor="numberOfParents">C - De quantos?</label>
                <input
                    type="number"
                    id="numberOfParents"
                    name="numberOfParents"
                    value={numberOfChildren}
                    onChange={(e) => {
                        const val = Number(e.target.value)
                        if (val < 1 || val > 12) {
                            return
                        }
                        // removing an element
                        if (val < numberOfChildren) {
                            setChildrenData((prev) => {
                                if (val !== prev.length) {
                                    prev.pop()
                                }
                                return prev
                            })
                        }
                        setNumberOfChildren(val)
                    }
                    }
                    className={commonStyles.inputField}
                /> */}
            </div>
            {fields.map((field, index) => (
                <div key={field.id} className={commonStyles.childForm}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', button: { scale: '.5' } }}>
                        <h4>Pensão {index + 1}</h4>
                        <ButtonBase label={'remover'} danger onClick={() => {
                            remove(index)
                            setValue("numberOfParents", getValues("numberOfParents") - 1)

                        }} />
                    </div>
                    <FormSelect control={control} name={`childrenData.${index}.childName`} label={'Selecione todos que recebem pensão'}
                        multiple
                        value={watch(`childrenData.${index}.childName`)}
                        options={declarationData?.Candidate?.filter(e => e?.IdentityDetails?.relationship === "Child").map((e) => ({ value: e.name, label: e.name }))}
                    />
                    <InputForm control={control} label={'Nome do pagador'} name={`childrenData.${index}.payerName`} />
                    <InputForm control={control} label={'CPF do pagador'} name={`childrenData.${index}.payerCpf`} transform={(e) => formatCPF(e.target.value)} />
                    <MoneyFormInput control={control} label={'Valor'} name={`childrenData.${index}.amount`} />
                    {/* <div className={commonStyles.fieldGroup}>
                        <label htmlFor={`childName_${index}`}>Selecione todos que recebem pensão</label>
                        <input
                            type="text"
                            id={`childName_${index}`}
                            name={`childName_${index}`}
                            placeholder="Nome do Filho"
                            className={commonStyles.inputField}
                            value={childrenData?.[index]?.["childName"]}
                            onChange={(e) => handleChildrenDataChange(index, 'childName', e.target.value)}
                        />
                    </div> */}
                    {/* <div className={commonStyles.fieldGroup}>
                        <label htmlFor={`payerName_${index}`}>Nome do Pagador da Pensão</label>
                        <input
                            type="text"
                            id={`payerName_${index}`}
                            name={`payerName_${index}`}
                            placeholder="Nome do Pagador"
                            className={commonStyles.inputField}
                            value={childrenData?.[index]?.["payerName"]}
                            onChange={(e) => handleChildrenDataChange(index, 'payerName', e.target.value)}
                        />
                    </div>
                    <div className={commonStyles.fieldGroup}>
                        <label htmlFor={`payerCpf_${index}`}>CPF do Pagador da Pensão</label>
                        <input
                            type="text"
                            id={`payerCpf_${index}`}
                            name={`payerCpf_${index}`}
                            placeholder="CPF do Pagador"
                            className={commonStyles.inputField}
                            value={childrenData?.[index]?.["payerCpf"]}
                            onChange={(e) => handleChildrenDataChange(index, 'payerCpf', formatCPF(e.target.value))}
                        />
                    </div>
                    <div className={commonStyles.fieldGroup}>
                        <label htmlFor={`amount_${index}`}>Valor</label>
                        <input
                            // type="number"
                            id={`amount_${index}`}
                            name={`amount_${index}`}
                            placeholder="Valor da Pensão"
                            className={commonStyles.inputField}
                            value={childrenData?.[index]?.["amount"]}
                            onChange={(e) => handleChildrenDataChange(index, 'amount', formatCurrency(e.target.value))}
                        />
                        // </div>
                        */}
                </div>
            ))}
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleSave}

                />
                <ButtonBase
                    onClick={handleSave}

                >
                    <Arrow width="30px" />
                </ButtonBase>
            </div>
        </div>
    );
}
