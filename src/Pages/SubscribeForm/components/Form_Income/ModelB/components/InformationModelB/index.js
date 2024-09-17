import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import InputForm from "Components/InputForm";
import { zodResolver } from "@hookform/resolvers/zod";
import INCOME_SOURCE from "utils/enums/income-source";
import modelBInformationSchema from "./schemas/model-b-information-schema";
import { formatTelephone } from "utils/format-telephone";
import { formatCNPJ } from "utils/format-cnpj";
import useControlForm from "hooks/useControlForm";
import { formatCPF } from "utils/format-cpf";
import useTutorial from "hooks/useTutorial";
import INCOME_TUTORIALS from "utils/enums/tutorials/income";
const InformationModelB = forwardRef(({ data, viewMode }, ref) => {
    const { control } = useControlForm({
        schema: modelBInformationSchema(data.incomeSource),
        defaultValues: {
            CNPJ: "",
            admissionDate: "",
            position: "",
            payingSource: "",
            payingSourcePhone: "",
        },
        initialData: data
    }, ref)
    useTutorial(INCOME_TUTORIALS.INFORMATION[data?.incomeSource])

    return (
        <div className={commonStyles.formcontainer}>
            <fieldset disabled={viewMode}>
                {data.incomeSource === "DomesticEmployee"
                    ? <InputForm name={"CNPJ"} control={control} label={"CPF"} transform={(e) => formatCPF(e.target.value)} />
                    : <InputForm name={"CNPJ"} control={control} label={"CNPJ"} transform={(e) => formatCNPJ(e.target.value)} />
                }
                <InputForm name={"admissionDate"} control={control} label={"date de início/admissão"} type="date" />
                <InputForm name={"position"} control={control} label={"atividade exercida"} />
                <InputForm name={"payingSource"} control={control} label={"fonte pagadora"} />
                <InputForm name={"payingSourcePhone"} control={control} label={"telefone da fonte pagadora"} transform={(e) => formatTelephone(e.target.value)} />
            </fieldset>
        </div>
    )
})

export default InformationModelB