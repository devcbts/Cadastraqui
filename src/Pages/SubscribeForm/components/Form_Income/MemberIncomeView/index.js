import { useEffect, useState } from "react"
import candidateService from "services/candidate/candidateService"
import FormList from "../../FormList"
import FormListItem from "../../FormList/FormListItem"
import FAMILY_RELATIONSHIP from "utils/enums/family-relationship"
import ButtonBase from "Components/ButtonBase"

export default function MemberIncomeView({ member, onSelect, onAdd }) {
    const { id, fullName, relationship } = member
    const [isLoading, setIsLoading] = useState(true)
    const [incomes, setIncomes] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const incomes = await candidateService.getMonthlyIncome(id)
                if (incomes) {
                    setIncomes(incomes)
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
                <FormList.List list={incomes} text={`Nenhuma renda cadastrada para ${fullName}, clique abaixo para realizar o primeiro cadastro`} render={(item) => {
                    return (
                        <FormListItem.Root text={item.income.label}>
                            <FormListItem.Actions>
                                <ButtonBase label={"visualizar"} onClick={() => onSelect({ member: member, income: item })} />
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