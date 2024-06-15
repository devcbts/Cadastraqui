import { useEffect, useState } from "react"
import ButtonBase from "Components/ButtonBase"
import RowTextAction from "Components/RowTextAction"
import FormList from "Pages/SubscribeForm/components/FormList"
import FormListItem from "Pages/SubscribeForm/components/FormList/FormListItem"
import ViewBankAccount from "../../../View_BankAccount"

export default function MemberIncomeView({ member, onSelect, onAdd }) {
    const { id, fullName } = member
    const [isLoading, setIsLoading] = useState(true)
    // MonthlyIncome stores an array with registered months
    // info stores the current additional information for each occupation (position)
    const [incomeInfo, setIncomeInfo] = useState({ monthlyIncome: [], info: [] })
    const [showBankAccount, setShowBankAccount] = useState(false)
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                // TODO: fetch member monthly income info on assistant route
                const incomes = {}
                if (incomes) {
                    setIncomeInfo(incomes)
                }
            } catch (err) {

            }
            setIsLoading(false)
        }
        fetchData()
    }, [id])
    const handleShowBankAccount = () => {
        setShowBankAccount(true)
    }
    return (
        <>
            {!showBankAccount ? (
                <FormList.Root title={"Rendas cadastradas"} isLoading={isLoading}>
                    <h2>{fullName} </h2>
                    <RowTextAction text={"declarações e comprovantes bancários"} label={'visualizar'} onClick={handleShowBankAccount} />
                    <FormList.List list={incomeInfo.monthlyIncome} text={`Nenhuma renda cadastrada para ${fullName}, clique abaixo para realizar o primeiro cadastro`} render={(item) => {
                        return (
                            <FormListItem.Root text={item.income.label}>
                                <FormListItem.Actions>
                                    <ButtonBase label={"visualizar"} onClick={() => onSelect({ member: member, income: item, info: incomeInfo?.info.find(e => e.employmentType === item.income.value) })} />
                                </FormListItem.Actions>
                            </FormListItem.Root>
                        )
                    }}>
                    </FormList.List>
                </FormList.Root>
            )
                : (
                    <ViewBankAccount id={member.id} />
                )
            }
        </>
    )
}