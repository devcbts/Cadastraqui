import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'
import ButtonBase from "Components/ButtonBase"
import RowTextAction from "Components/RowTextAction"
import FormList from "Pages/SubscribeForm/components/FormList"
import FormListItem from "Pages/SubscribeForm/components/FormList/FormListItem"
import { useEffect, useState } from "react"
import socialAssistantService from "services/socialAssistant/socialAssistantService"
import ViewBankAccount from "../../../View_BankAccount"
export default function MemberIncomeView({ member, onSelect, applicationId, onBack }) {
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
                const incomes = await socialAssistantService.getMemberIncomeInfo(applicationId, id)
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
                <>
                    <FormList.Root title={"Rendas cadastradas"} isLoading={isLoading}>
                        <h2>{fullName} </h2>
                        <RowTextAction text={"Declarações e Comprovantes bancários"} label={'visualizar'} onClick={handleShowBankAccount} />
                        <FormList.List list={incomeInfo.monthlyIncome} text={`Nenhuma renda cadastrada para ${fullName}`} render={(item) => {
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
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '80%' }}>
                        <ButtonBase onClick={onBack}><Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                    </div>
                </>
            )
                : (
                    <ViewBankAccount id={member.id} applicationId={applicationId} onBack={() => setShowBankAccount(false)} />
                )
            }
        </>
    )
}