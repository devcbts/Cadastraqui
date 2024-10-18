
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'
import ButtonBase from "Components/ButtonBase"
import RowTextAction from "Components/RowTextAction"
import FormList from "Pages/SubscribeForm/components/FormList"
import FormListItem from "Pages/SubscribeForm/components/FormList/FormListItem"
import { useEffect, useState } from "react"
import socialAssistantService from "services/socialAssistant/socialAssistantService"
import BankReport from "../BankReport"
import applicationService from 'services/application/applicationService'

export default function MemberBankAccount({ id, onSelect, applicationId, onBack }) {
    const [isLoading, setIsLoading] = useState(true)
    const [accounts, setAccounts] = useState([])
    // TODO: fetch bank account information from SPECIFIC USER
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const information = await applicationService.getBankingAccountById(applicationId, id)
                setAccounts(information)
            } catch (err) {

            }
            setIsLoading(false)
        }
        fetchData()
    }, [applicationId, id])

    const [isReportOpen, setIsReportOpen] = useState(false)
    const handleReport = () => {
        setIsReportOpen(prev => !prev)
    }
    return (
        <>
            {isReportOpen ?
                <BankReport applicationId={applicationId} id={id} onBack={handleReport} />
                : <>
                    <FormList.Root title={"Contas cadastradas"} isLoading={isLoading}>
                        <RowTextAction
                            text={'relatório de contas e relacionamentos (CCS)'}
                            label={'visualizar'}
                            onClick={handleReport}
                        />
                        <FormList.List list={accounts} text={`Nenhuma conta cadastrada para este membro familiar`} render={(item) => {
                            return (
                                <FormListItem.Root text={item.bankName}>
                                    <FormListItem.Actions>
                                        <ButtonBase label={"visualizar"} onClick={() => onSelect(item)} />
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
            }


        </>
    )
}