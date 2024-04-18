import { useRef } from "react"
import useForm from "../../../../hooks/useForm"
import { formatTelephone } from "../../../../utils/format-telephone"
import FormCheckbox from "../../../Inputs/FormCheckbox"
import Input from "../../../Inputs/FormInput"
import InputCheckbox from "../../../Inputs/InputCheckbox"
import MonthsIncome from "./components/MonthsIncome"
import modelAInfoValidation from "./validations/model-a-info-validation"
import { api } from "../../../../services/axios"
import { toFloat } from "../../../../utils/currency-to-float"
import toPersistence from "../utils/model-to-persistence"

export default function IncomeFormModelA({ member, incomeSource, onSubmit, edit: { isEditing, initialData } = { isEditing: true, initialData: null } }) {
    const [[modelAInfo], handlemodelAInfoChange, modelAErrors, submitModelA] = useForm(initialData ? { ...initialData.info, gratificationAutonomous: initialData.info.quantity === 6 } : {
        admissionDate: "",
        position: "",
        payingSource: "",
        payingSourcePhone: "",
        gratificationAutonomous: false,
        quantity: 3,
    }, modelAInfoValidation)
    const handleRegisterIncome = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem("token");

        const { getValues, isValid } = monthIncomeRef.current
        if (!submitModelA() || !isValid) {
            return
        }
        try {
            const parseAll = toPersistence(incomeSource, getValues().incomeInfo)
            console.log('parsed', parseAll)
            await onSubmit(parseAll)

            const data = {
                employmentType: incomeSource,
                admissionDate: modelAInfo.admissionDate,
                payingSource: modelAInfo.payingSource,
                payingSourcePhone: modelAInfo.payingSourcePhone,
                position: modelAInfo.position,
                quantity: modelAInfo.gratificationAutonomous ? 6 : 3
            };
            await api.post(`/candidates/family-member/CLT/${member.id}`, data, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            })
        } catch (err) { }
    }
    const monthIncomeRef = useRef()
    return (
        <>
            {/*<!-- Data de Admissão -->*/}
            <Input
                label="Data de Admissão"
                type="date"
                name="admissionDate"
                value={modelAInfo.admissionDate?.split('T')[0]}
                onChange={handlemodelAInfoChange}
                error={modelAErrors}
                readOnly={!!initialData?.info}
            />

            {/*<!-- Cargo -->*/}
            <Input
                label="Cargo"
                type="text"
                name="position"
                value={modelAInfo.position}
                onChange={handlemodelAInfoChange}
                error={modelAErrors}
                readOnly={!!initialData?.info}
            />

            {/*<!-- Fonte Pagadora( Empresa/Governo/ Pessoa Física) -->*/}
            <Input
                label="Fonte Pagadora"
                type="text"
                name="payingSource"
                value={modelAInfo.payingSource}
                onChange={handlemodelAInfoChange}
                error={modelAErrors}
                readOnly={!!initialData?.info}

            />

            {/*<!-- Telefone da Fonte Pagadora -->*/}
            <Input
                label="Telefone da Fonte Pagadora"
                type="text"
                name="payingSourcePhone"
                value={formatTelephone(modelAInfo.payingSourcePhone)}
                onChange={handlemodelAInfoChange}
                error={modelAErrors}
                readOnly={!!initialData?.info}

            />

            {/*<!-- Recebe Gratificação ? -->*/}
            <FormCheckbox
                label="Recebe horas extras, premiação ou gratificação?"
                name="gratificationAutonomous"
                checked={modelAInfo.gratificationAutonomous}
                onChange={handlemodelAInfoChange}
                disabled={!!initialData?.info}
                defaultValue={true}

            />


            <div>
                <MonthsIncome monthCount={modelAInfo.quantity} ref={monthIncomeRef} initialData={initialData?.incomes} />
            </div>

            {isEditing && <div class="survey-box survey-renda">
                <button
                    type="submit"
                    onClick={handleRegisterIncome}
                    id="submit-button"
                >
                    Salvar Informações
                </button>
            </div>}
        </>

    )
}