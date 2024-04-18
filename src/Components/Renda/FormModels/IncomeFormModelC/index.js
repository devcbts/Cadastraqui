import useForm from "../../../../hooks/useForm"
import FormCheckbox from "../../../Inputs/FormCheckbox"
import Input from "../../../Inputs/FormInput"
import { api } from "../../../../services/axios"

export default function IncomeFormModelC({ incomeSource, onSubmit, member, edit: { isEditing, initialData } = { isEditing: true, initialData: null } }) {
    const [[modelCInfo], handleModelCChange, modelCErrors, submit] = useForm(initialData ? initialData.info : {
        parcelValue: "",
        parcels: "",
        firstParcelDate: "",
        receivesUnemployment: false
    })
    const handleRegisterIncome = async (e) => {
        e.preventDefault()
        if (!submit()) {
            return
        }
        try {
            await api.post(`/candidates/family-member/unemployed/${member.id}`, {
                ...modelCInfo,
                parcels: parseFloat(modelCInfo.parcels),
                parcelValue: parseFloat(modelCInfo.parcelValue),
            })

        } catch (err) { }
    }
    return (
        <>
            {/*<!-- Recebe Seguro Desemprego ? -->*/}
            <FormCheckbox
                label="Recebe Seguro Desemprego ?"
                name="receivesUnemployment"
                checked={modelCInfo.receivesUnemployment}
                onChange={handleModelCChange}
            />

            {modelCInfo.receivesUnemployment && (
                <>
                    {/*<!-- Quantidade de Parcelas -->*/}
                    <Input
                        label="Quantidade de Parcelas"
                        name="parcels"
                        value={modelCInfo.parcels}
                        onChange={handleModelCChange}
                        error={modelCErrors}
                    />


                    {/*<!-- Data da primeira Parcela -->*/}
                    <Input
                        label="Data da primeira Parcela"
                        name="firstParcelDate"
                        type="date"
                        value={modelCInfo.firstParcelDate?.split('T')[0]}
                        onChange={handleModelCChange}
                        error={modelCErrors}
                    />

                    {/*<!-- Valor da Parcela -->*/}
                    <Input
                        label="Valor da Parcela"
                        name="parcelValue"
                        value={modelCInfo.parcelValue}
                        onChange={handleModelCChange}
                        error={modelCErrors}
                    />

                    {isEditing && <div class="survey-box survey-renda">
                        <button
                            type="submit"
                            onClick={(e) => handleRegisterIncome(e, "Unemployed")}
                            id="submit-button"
                        >
                            Salvar Informações
                        </button>
                    </div>}
                </>
            )}
        </>
    )

}