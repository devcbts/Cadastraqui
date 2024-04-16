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

export default function IncomeFormModelA({ member, incomeSource, onSubmit }) {
    const [[modelAInfo], handlemodelAInfoChange, modelAErrors, submitModelA] = useForm({
        admissionDate: "",
        position: "",
        payingSource: "",
        payingSourcePhone: "",
        gratificationAutonomous: false,
    }, modelAInfoValidation)

    const handleRegisterIncome = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem("token");

        const { getValues, isValid } = monthIncomeRef.current
        if (!submitModelA() || !isValid) {
            return
        }
        try {

            await onSubmit(toPersistence(incomeSource, getValues().incomeInfo))

            const data = {
                employmentType: incomeSource,
                admissionDate: modelAInfo.admissionDate,
                payingSource: modelAInfo.payingSource,
                payingSourcePhone: modelAInfo.payingSourcePhone,
                position: modelAInfo.position,
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
                value={modelAInfo.admissionDate}
                onChange={handlemodelAInfoChange}
                error={modelAErrors}
            />

            {/*<!-- Cargo -->*/}
            <Input
                label="Cargo"
                type="text"
                name="position"
                value={modelAInfo.position}
                onChange={handlemodelAInfoChange}
                error={modelAErrors}
            />

            {/*<!-- Fonte Pagadora( Empresa/Governo/ Pessoa Física) -->*/}
            <Input
                label="Fonte Pagadora"
                type="text"
                name="payingSource"
                value={modelAInfo.payingSource}
                onChange={handlemodelAInfoChange}
                error={modelAErrors}
            />

            {/*<!-- Telefone da Fonte Pagadora -->*/}
            <Input
                label="Telefone da Fonte Pagadora"
                type="text"
                name="payingSourcePhone"
                value={formatTelephone(modelAInfo.payingSourcePhone)}
                onChange={handlemodelAInfoChange}
                error={modelAErrors}
            />

            {/*<!-- Recebe Gratificação ? -->*/}
            <FormCheckbox
                label="Recebe horas extras, premiação ou gratificação?"
                name="gratificationAutonomous"
                value={modelAInfo.gratificationAutonomous}
                onChange={handlemodelAInfoChange}
            />


            <div>
                <MonthsIncome monthCount={modelAInfo.gratificationAutonomous ? 6 : 3} ref={monthIncomeRef} />
            </div>

            <div class="survey-box survey-renda">
                <button
                    type="submit"
                    onClick={(e) => handleRegisterIncome(e, "PrivateEmployee")}
                    id="submit-button"
                >
                    Salvar Informações
                </button>
            </div>
        </>

    )
}