import { useRef } from "react"
import useForm from "../../../../hooks/useForm"
import { formatCNPJ } from "../../../../utils/format-cnpj"
import FormCheckbox from "../../../Inputs/FormCheckbox"
import Input from "../../../Inputs/FormInput"
import MonthsIncomeModelD from "./components/MonthsIncome"
import { api } from "../../../../services/axios"
import toPersistence from "../utils/model-to-persistence"

export default function IncomeFormModelD({ incomeSource, onSubmit, member }) {
    const [[modelDInfo], handleModelDChange, modelDErrors, submit] = useForm({
        startDate: "",
        socialReason: "",
        fantasyName: "",
        CNPJ: "",
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
            const data = {
                employmentType: incomeSource,
                startDate: modelDInfo.startDate,
                socialReason: modelDInfo.socialReason,
                fantasyName: modelDInfo.fantasyName,
                CNPJ: modelDInfo.CNPJ,
            };
            await api.post(
                `/candidates/family-member/entepreneur/${member.id}`,
                data,
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );


        } catch (err) { }
    }
    return (
        <>
            {/*<!-- Data de Início -->*/}
            <Input
                label="Data de Início"
                name="startDate"
                type="date"
                value={modelDInfo.startDate}
                onChange={handleModelDChange}
                error={modelDErrors}
            />


            {/*<!-- CNPJ -->*/}
            <Input
                label="Razão Social"
                name="socialReason"
                type="text"
                value={modelDInfo.socialReason}
                onChange={handleModelDChange}
                error={modelDErrors}
            />

            {/*<!-- Renda Fixa ? -->*/}
            <Input
                label="Nome Fantasia (se houver)"
                name="fantasyName"
                value={modelDInfo.fixIncome}
                onChange={handleModelDChange}
                error={modelDErrors}

            />
            <div>
                <MonthsIncomeModelD monthCount={modelDInfo.fixIncome ? 3 : 6} ref={monthIncomeRef} />
            </div>

            <div class="survey-box survey-renda">
                <button
                    type="submit"
                    onClick={handleRegisterIncome}
                    id="submit-button"
                >
                    Salvar Informações
                </button>
            </div>
        </>
    )
}