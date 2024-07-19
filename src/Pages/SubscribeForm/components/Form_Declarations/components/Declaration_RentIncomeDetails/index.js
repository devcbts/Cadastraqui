import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import InputForm from 'Components/InputForm';
import MoneyFormInput from 'Components/MoneyFormInput';
import useControlForm from 'hooks/useControlForm';
import AddressData from 'Pages/SubscribeForm/components/AddressData';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { formatCPF } from 'utils/format-cpf';
import stringToFloat from 'utils/string-to-float';
import { isValidCPF } from 'utils/validate-cpf';
import { z } from 'zod';
import declarationAtom from '../../atoms/declarationAtom';
import commonStyles from '../../styles.module.scss';

export default function Declaration_RentIncomeDetails({ onBack, onSave }) {
    const { control, formState: { isValid }, trigger, getValues } = useControlForm({
        schema: z.object({
            landlordName: z.string().min(1, 'Nome obrigatório'),
            landlordCpf: z.string().min(1, 'CPF obrigatório').refine(isValidCPF, 'CPF inválido'),
            rentAmount: z.string().refine(d => stringToFloat(d) > 0, 'Valor não pode ser zero')
        }),
        defaultValues: {
            landlordName: '',
            landlordCpf: '',
            rentAmount: ''
        },

    })
    const [rentDetails, setRentDetails] = useState({
        cep: '',
        address: '',
        neighborhood: '',
        number: '',
        city: '',
        uf: '',
        complement: '',
        landlordName: '',
        landlordCpf: '',
        rentAmount: ''
    });
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom)

    useEffect(() => {
        if (declarationData.rentDetails) {
            setRentDetails(declarationData.rentDetails)
        }
    }, [])
    const handleSave = () => {
        if (!addressRef.current.validate() || !isValid) {
            trigger()
            return
        }
        const address = addressRef.current.values()
        const info = getValues()
        setDeclarationData((prev) => ({
            ...prev,
            rentDetails: { ...address, ...info }
        }))
        onSave();
    };


    const addressRef = useRef(null)
    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÃO DE RECEBIMENTO DE ALUGUEL</h1>
            <h2>{declarationData.name}</h2>
            <p>Preencha os dados do endereço do imóvel que você recebe aluguel:</p>
            <AddressData ref={addressRef} />

            <InputForm label={'Nome do locatário'} control={control} name="landlordName" />
            <InputForm label={'CPF do locatário'} control={control} name="landlordCpf" transform={(e) => formatCPF(e.target.value)} />
            <MoneyFormInput label={'Valor'} name={"rentAmount"} control={control} />

            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleSave}

                />
            </div>
        </div>
    );
}
