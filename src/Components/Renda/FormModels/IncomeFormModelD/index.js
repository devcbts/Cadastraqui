import { useRef } from "react"
import useForm from "../../../../hooks/useForm"
import { formatCNPJ } from "../../../../utils/format-cnpj"
import FormCheckbox from "../../../Inputs/FormCheckbox"
import Input from "../../../Inputs/FormInput"
import MonthsIncomeModelD from "./components/MonthsIncome"
import { api } from "../../../../services/axios"
import toPersistence from "../utils/model-to-persistence"

export default function IncomeFormModelD({ incomeSource, onSubmit, member, edit: { isEditing, initialData } = { isEditing: true, initialData: null } }) {
    const [[modelDInfo], handleModelDChange, modelDErrors, submit] = useForm(initialData ? initialData.info : {
        startDate: "",
        socialReason: "",
        fantasyName: "",
        CNPJ: "",
        quantity: 6,
    })

    const monthIncomeRef = useRef()
    const handleRegisterIncome = async (e) => {
        e.preventDefault()
        const { getValues, isValid } = monthIncomeRef.current
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
                quantity: 6,

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


        } catch (err) {
            console.log('err', err)
        }
    }
    return (
        <>
            {/*<!-- Data de Início -->*/}
            <Input
                label="Data de Início"
                name="startDate"
                type="date"
                value={modelDInfo.startDate?.split('T')[0]}
                onChange={handleModelDChange}
                error={modelDErrors}
                readOnly={!!initialData?.info}

            />


            {/*<!-- CNPJ -->*/}
            <Input
                label="Razão Social"
                name="socialReason"
                type="text"
                value={modelDInfo.socialReason}
                onChange={handleModelDChange}
                error={modelDErrors}
                readOnly={!!initialData?.info}

            />

            {/*<!-- Renda Fixa ? -->*/}
            <Input
                label="Nome Fantasia (se houver)"
                name="fantasyName"
                value={modelDInfo.fantasyName}
                onChange={handleModelDChange}
                error={modelDErrors}
                readOnly={!!initialData?.info}

            />
            <Input
                label="CNPJ"
                name="CNPJ"
                value={modelDInfo.CNPJ}
                onChange={handleModelDChange}
                error={modelDErrors}
                readOnly={!!initialData?.info}

            />
            <div>
                <MonthsIncomeModelD monthCount={6} ref={monthIncomeRef} initialData={initialData?.incomes} />
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