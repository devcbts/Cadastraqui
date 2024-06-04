import { useEffect, useState } from "react"
import candidateService from "services/candidate/candidateService"
import FormList from "../../FormList"
import FormListItem from "../../FormList/FormListItem"
import ButtonBase from "Components/ButtonBase"
import RowTextAction from "Components/RowTextAction"
import FormBankAccount from "../../Form_BankAccount"
import InputBase from "Components/InputBase"

export default function MemberIncomeView({ member, onSelect, onAdd }) {
    const { id, fullName } = member
    const [isLoading, setIsLoading] = useState(true)
    // MonthlyIncome stores an array with registered months
    // info stores the current additional information for each occupation (position)
    const [incomeInfo, setIncomeInfo] = useState({ monthlyIncome: [], info: [] })
    const [showBankAccount, setShowBankAccount] = useState(false)
    useEffect(() => {
        console.log(member)
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const incomes = await candidateService.getMemberIncomeInfo(id)
                if (incomes) {
                    console.log('incomes', incomes)
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
                                    {/* <ButtonBase label={"excluir"} onClick={() => console.log(item)} danger /> */}
                                </FormListItem.Actions>
                            </FormListItem.Root>
                        )
                    }}>

                    </FormList.List>
                    <ButtonBase label={"cadastrar renda"} onClick={() => onAdd({ member })} />
                </FormList.Root>
            )
                : (
                    <FormBankAccount id={member.id} />
                )
            }
        </>
    )
}