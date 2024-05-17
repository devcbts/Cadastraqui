import { useEffect, useState } from "react"
import candidateService from "services/candidate/candidateService"
import FormList from "../../FormList"
import FormListItem from "../../FormList/FormListItem"
import FAMILY_RELATIONSHIP from "utils/enums/family-relationship"
import ButtonBase from "Components/ButtonBase"

export default function MemberIncomeView({ member, onSelect, onAdd }) {
    const { id, fullName, relationship } = member
    const [isLoading, setIsLoading] = useState(true)
    // MonthlyIncome stores an array with registered months
    // info stores the current additional information for each occupation (position)
    const [incomeInfo, setIncomeInfo] = useState({ monthlyIncome: [], info: [] })
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const incomes = await candidateService.getMemberIncomeInfo(id)
                if (incomes) {
                    setIncomeInfo(incomes)
                }
            } catch (err) {

            }
            setIsLoading(false)
        }
        fetchData()
    }, [id])

    return (
        <>
            <FormList.Root title={"Rendas cadastradas"} isLoading={isLoading}>
                <h2>{fullName} - {FAMILY_RELATIONSHIP.find(e => e.value === relationship).label}</h2>
                <FormList.List list={incomeInfo.monthlyIncome} text={`Nenhuma renda cadastrada para ${fullName}, clique abaixo para realizar o primeiro cadastro`} render={(item) => {
                    return (
                        <FormListItem.Root text={item.income.label}>
                            <FormListItem.Actions>
                                <ButtonBase label={"visualizar"} onClick={() => onSelect({ member: member, income: item, info: incomeInfo?.info.find(e => e.employmentType === item.income.value) })} />
                                {/* <ButtonBase label={"excluir"} danger /> */}
                            </FormListItem.Actions>
                        </FormListItem.Root>
                    )
                }}>

                </FormList.List>
                <ButtonBase label={"cadastrar renda"} onClick={() => onAdd({ member })} />
            </FormList.Root>
        </>
    )
}