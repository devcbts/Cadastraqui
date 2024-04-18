import { useRef } from "react"
import useForm from "../../../../hooks/useForm"
import { formatCNPJ } from "../../../../utils/format-cnpj"
import FormCheckbox from "../../../Inputs/FormCheckbox"
import Input from "../../../Inputs/FormInput"
import MonthsIncomeModelB from "./components/MonthsIncome"
import { api } from "../../../../services/axios"
import toPersistence from "../utils/model-to-persistence"

export default function IncomeFormModelB({ incomeSource, onSubmit, member, edit: { isEditing, initialData } = { isEditing: true, initialData: null } }) {
    const [[meiInfo], handleMeiChange, meiErrors, submit] = useForm(initialData ? { ...initialData.info, fixIncome: initialData.info.quantity === 3 } : {
        startDate: "",
        CNPJ: "",
        fixIncome: false,
        financialAssistantCPF: "",
        quantity: 3,
    })
    const monthIncomeRef = useRef()
    const handleRegisterIncome = async (e) => {
        e.preventDefault()
        const { getValues, isValid } = monthIncomeRef.current
        console.log(isValid)
        if (!submit() || !isValid) {
            return
        }
        try {
            const token = localStorage.getItem("token");
            onSubmit(toPersistence(incomeSource, getValues().incomeInfo))
            let urlApi = "";
            let data = {};
            if (incomeSource === "IndividualEntrepreneur") {
                urlApi = "MEI";
                data = {
                    startDate: meiInfo.startDate,
                    CNPJ: meiInfo.CNPJ,
                    quantity: meiInfo.fixIncome ? 3 : 6,
                }
            } else {
                urlApi = "dependent-autonomous"
                data = {
                    employmentType: incomeSource,
                    quantity: meiInfo.fixIncome ? 3 : 6,

                }
            }

            await api.post(`/candidates/family-member/${urlApi}/${member.id}`, data, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
        } catch (err) { }
    }
    return (
        <>
            {/*<!-- Data de Início -->*/}
            <Input
                label="Data de Início"
                name="startDate"
                type="date"
                value={meiInfo.startDate}
                onChange={handleMeiChange}
                error={meiErrors}
                readOnly={!!initialData?.info}

            />


            {/*<!-- CNPJ -->*/}
            <Input
                label="CNPJ"
                name="CNPJ"
                type="text"
                value={formatCNPJ(meiInfo.CNPJ)}
                onChange={handleMeiChange}
                error={meiErrors}
                readOnly={!!initialData?.info}

            />

            {/*<!-- Renda Fixa ? -->*/}
            <FormCheckbox
                label="Renda fixa?"
                name="fixIncome"
                checked={meiInfo.fixIncome}
                onChange={handleMeiChange}
                disabled={!!initialData?.info}
            />
            <div>
                <MonthsIncomeModelB monthCount={meiInfo.fixIncome ? 3 : 6} ref={monthIncomeRef} initialData={initialData?.incomes} />
            </div>
            {incomeSource === "FinancialHelpFromOthers" && <Input
                label="CPF de quem presta ajuda"
                name="financialAssistantCPF"
                type="text"
                value={meiInfo.financialAssistantCPF}
                onChange={handleMeiChange}
                error={meiErrors}
            />}
            {isEditing && <div class="survey-box survey-renda">
                <button
                    type="submit"
                    onClick={handleRegisterIncome
                    }
                    id="submit-button"
                >
                    Salvar Informações
                </button>
            </div>}
        </>
    )
}