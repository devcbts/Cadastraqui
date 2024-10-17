import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'
import ButtonBase from "Components/ButtonBase"
import { useEffect, useRef, useState } from "react"
import candidateService from "services/candidate/candidateService"
import { NotificationService } from "services/notification"
import FormBankAccount from "../../Form_BankAccount"
import BankReport from '../../Form_BankAccount/components/BankReport'
import FormList from "../../FormList"
import FormListItem from "../../FormList/FormListItem"
import styles from './styles.module.scss'
import Indicator from 'Components/Indicator'
import useMemberIncomeView from './useMemberIncomeView'
import moneyInputMask from 'Components/MoneyFormInput/money-input-mask'

export default function MemberIncomeView({ member, onSelect, onAdd, onBack }) {
    // // showpagetype can be 'income', 'accounts' or 'report'
    const [showPageType, setShowPageType] = useState(null)
    const { handleDeleteIncome, incomeInfo, incomeStatus, isLoading, readOnlyUser } = useMemberIncomeView({
        page: showPageType,
        member
    })


    return (
        <>
            {!showPageType && (
                <FormList.Root title={"Renda Familiar"} isLoading={isLoading}>
                    <h2 className={styles.titleFullName}>{member.fullName} </h2>
                    <div className={styles.divRendaMediaFamiliar}>
                        <label className={styles.titleRendaMediaFamiliar}>Renda média cadastrada</label>

                        <spam className={styles.valoresRendaMediaFamiliar}>{moneyInputMask(incomeInfo?.data?.averageIncome)}</spam>
                    </div>
                    <FormList.List list={[
                        { type: 'income', label: 'Cadastro de renda', status: incomeStatus?.income },
                        { type: 'accounts', label: 'Contas bancárias', status: incomeStatus?.bank },
                        { type: 'report', label: 'Relatórios de contas e relacionamentos (CCS)', status: incomeStatus?.ccs },
                    ]}
                        render={(item) => {
                            return (
                                <FormListItem.Root text={item.label}>
                                    <FormListItem.Actions>
                                        <Indicator
                                            status={item.status}
                                        />
                                        <ButtonBase label={"visualizar"}
                                            onClick={() => setShowPageType(item.type)} />
                                    </FormListItem.Actions>
                                </FormListItem.Root>
                            )
                        }}>
                    </FormList.List>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '90%', gap: '100px' }}>
                        <ButtonBase onClick={onBack}><Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                    </div>
                </FormList.Root>)
            }
            {
                showPageType === "income" && (

                    <FormList.Root title={"Renda Familiar"} isLoading={isLoading}>
                        <h2 className={styles.titleFullName}>{member.fullName} </h2>
                        <div className={styles.divRendaMediaFamiliar}>
                            <label className={styles.titleRendaMediaFamiliar}>Renda média cadastrada</label>
                            <spam className={styles.valoresRendaMediaFamiliar}>{moneyInputMask(incomeInfo?.data?.averageIncome)}</spam>
                        </div>

                        {!readOnlyUser && <div className={styles.containerRendaCadastrada}>
                            <h3>Rendas Cadastradas</h3>
                            <div className={styles.containerRendaCadastradaSituacao}>
                                <h4>Situação do Cadastro de Rendas:</h4>
                                <span updated={incomeStatus?.income?.toString() ?? "false"}>{incomeStatus?.income ? 'Atualizada' : 'Atualização necessária'}</span>
                            </div>
                        </div>}
                        <div className={styles.containerNenhumaRenda}>
                            <FormList.List list={incomeInfo.monthlyIncome} text={`Nenhuma renda cadastrada para ${member.fullName}, clique abaixo para realizar o primeiro cadastro`} render={(item) => {
                                return (
                                    <FormListItem.Root text={item.income.label}>
                                        <FormListItem.Actions>
                                            <ButtonBase label={"visualizar"} onClick={() => onSelect({ member: member, income: item, info: incomeInfo?.info.find(e => e.employmentType === item.income.value) })} />
                                            {!readOnlyUser && <ButtonBase label={"excluir"} onClick={() => handleDeleteIncome(item)} danger />}
                                        </FormListItem.Actions>
                                    </FormListItem.Root>
                                )
                            }}>
                            </FormList.List>
                        </div>



                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '90%', gap: '100px' }}>
                            <ButtonBase onClick={() => setShowPageType(null)}><Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                            {!readOnlyUser && <ButtonBase label={"cadastrar renda"} onClick={() => onAdd({ member })} />}
                        </div>
                    </FormList.Root >
                )
            }

            {showPageType === 'accounts' && (
                <FormBankAccount id={member.id} onBack={() => setShowPageType(null)} />
            )}
            {showPageType === 'report' && (
                <BankReport id={member.id} onBack={() => setShowPageType(null)} />
            )}
        </>
    )
}