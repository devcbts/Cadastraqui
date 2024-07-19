import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'
import ButtonBase from "Components/ButtonBase"
import InputBase from "Components/InputBase"
import RowTextAction from "Components/RowTextAction"
import { useEffect, useState } from "react"
import candidateService from "services/candidate/candidateService"
import { NotificationService } from "services/notification"
import FormBankAccount from "../../Form_BankAccount"
import FormList from "../../FormList"
import FormListItem from "../../FormList/FormListItem"
import styles from './styles.module.scss'

export default function MemberIncomeView({ member, onSelect, onAdd, onBack }) {
    const { id, fullName } = member
    const [isLoading, setIsLoading] = useState(true)
    // MonthlyIncome stores an array with registered months
    // info stores the current additional information for each occupation (position)
    const [incomeInfo, setIncomeInfo] = useState({ monthlyIncome: [], info: [], data: {} })
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
            await candidateService.deleteIncome(deletedIncome.id, member.id)
            NotificationService.success({ text: 'Renda excluída' })
            setIncomeInfo((prev) => ({
                info: prev.info.filter(e => e.id !== deletedIncome.id),
                monthlyIncome: prev.monthlyIncome.filter(e => e.income.value !== deletedIncome.employmentType)
            }))
        } catch (err) {
            NotificationService.error({ text: 'Erro ao excluir renda' })
        }
    }
    return (
        <>
            {!showBankAccount ? (

                <FormList.Root title={"Renda Familiar"} isLoading={isLoading}>
                    <div className={styles.containerRenda}>
                        <h2>{fullName} </h2>
                        <InputBase disabled label={'Renda média cadastrada'} value={incomeInfo?.data?.averageIncome} error={null} />
                    </div>
                    <div className={styles.containerTeste}>
                        {
                            incomeInfo?.data?.hasBankAccount === null
                                ? <>
                                    <h3>Declaração e Comprovantes bancários</h3>
                                    <ButtonBase label={'Cadastrar declaração'} onClick={handleShowBankAccount} />
                                </>
                                : <>
                                    <RowTextAction text={'Declaração e Comprovantes bancários'} onClick={() => setShowBankAccount(true)} label={'visualizar'} />
                                </>
                        }

                        {
                            <RowTextAction
                                text={'Relatório de contas e relacionamentos (CCS)'}
                                label={'visualizar'}
                                /* onClick={handleReport} */
                                onClick={handleShowBankAccount}
                                className={styles.RowTextAction}
                            />
                        }

                    </div>
                    <div className={styles.containerRendaCadastrada}>
                        <h3>Rendas Cadastradas</h3>
                        <div className={styles.containerRendaCadastradaSituacao}>
                            <h4>Situação do Cadastro de Rendas:</h4>
                            <button>
                                Atualizar Informações
                            </button>
                        </div>
                    </div>
                    <div className={styles.containerNenhumaRenda}>
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
                    </div>



                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '90%', gap: '100px' }}>
                        <ButtonBase onClick={onBack}><Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                        <ButtonBase label={"cadastrar renda"} onClick={() => onAdd({ member })} />
                    </div>
                </FormList.Root >
            )
                : (
                    <FormBankAccount id={member.id} onBack={() => setShowBankAccount(false)} />
                )
            }
        </>
    )
}