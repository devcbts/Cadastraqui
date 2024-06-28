import { useEffect, useState } from "react"
import candidateService from "services/candidate/candidateService"
import FormList from "../../FormList"
import FormListItem from "../../FormList/FormListItem"
import ButtonBase from "Components/ButtonBase"
import RowTextAction from "Components/RowTextAction"
import FormBankAccount from "../../Form_BankAccount"
import InputBase from "Components/InputBase"
import { NotificationService } from "services/notification"

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
    const handleShowBankAccount = () => {
        setShowBankAccount(true)
    }
    const handleDeleteIncome = async (item) => {
        try {
            const deletedIncome = incomeInfo?.info.find(e => e.employmentType === item.income.value)
            console.log(incomeInfo)
            await candidateService.deleteIncome(deletedIncome.id, member.id)
            NotificationService.success({ text: 'Renda excluída' })
            setIncomeInfo((prev) => ({
                info: prev.info.filter(e => e.id !== deletedIncome.id),
                monthlyIncome: prev.monthlyIncome.filter(e => e.income.value !== deletedIncome.employmentType)
            }))
        } catch (err) {
            console.log(err)
            NotificationService.error({ text: 'Erro ao excluir renda' })
        }
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
                                    <ButtonBase label={"excluir"} onClick={() => handleDeleteIncome(item)} danger />
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