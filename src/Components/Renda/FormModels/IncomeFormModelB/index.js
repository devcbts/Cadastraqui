import { useRef } from "react"
import useForm from "../../../../hooks/useForm"
import { formatCNPJ } from "../../../../utils/format-cnpj"
import FormCheckbox from "../../../Inputs/FormCheckbox"
import Input from "../../../Inputs/FormInput"
import MonthsIncomeModelB from "./components/MonthsIncome"
import { api } from "../../../../services/axios"
import toPersistence from "../utils/model-to-persistence"

export default function IncomeFormModelB({ incomeSource, onSubmit, member }) {
    const [[meiInfo], handleMeiChange, meiErrors, submit] = useForm({
        startDate: "",
        CNPJ: "",
        fixIncome: false,
        financialAssistantCPF: ""
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
                }
            } else {
                urlApi = "dependent-autonomous"
                data = {
                    employmentType: incomeSource,
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
            />


            {/*<!-- CNPJ -->*/}
            <Input
                label="CNPJ"
                name="CNPJ"
                type="text"
                value={formatCNPJ(meiInfo.CNPJ)}
                onChange={handleMeiChange}
                error={meiErrors}
            />

            {/*<!-- Renda Fixa ? -->*/}
            <FormCheckbox
                label="Renda fixa?"
                name="fixIncome"
                value={meiInfo.fixIncome}
                onChange={handleMeiChange}
            />
            <div>
                <MonthsIncomeModelB monthCount={meiInfo.fixIncome ? 3 : 6} ref={monthIncomeRef} />
            </div>
            {incomeSource === "FinancialHelpFromOthers" && <Input
                label="CPF de quem presta ajuda"
                name="financialAssistantCPF"
                type="text"
                value={meiInfo.financialAssistantCPF}
                onChange={handleMeiChange}
                error={meiErrors}
            />}
            <div class="survey-box survey-renda">
                <button
                    type="submit"
                    onClick={handleRegisterIncome
                    }
                    id="submit-button"
                >
                    Salvar Informações
                </button>
            </div>
        </>
    )
}