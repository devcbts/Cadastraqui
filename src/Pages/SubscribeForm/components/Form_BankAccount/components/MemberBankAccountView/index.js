import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'
import ButtonBase from "Components/ButtonBase"
import CheckboxBase from "Components/CheckboxBase"
import RowTextAction from "Components/RowTextAction"
import FormList from "Pages/SubscribeForm/components/FormList"
import FormListItem from "Pages/SubscribeForm/components/FormList/FormListItem"
import { useEffect, useRef, useState } from "react"
import candidateService from "services/candidate/candidateService"
import { NotificationService } from "services/notification"
import BankReport from "../BankReport"
import Indicator from 'Components/Indicator'
import useMemberBankAccountView from './useMemberBankAccountView'
export default function MemberBankAccountView({ id, onSelect, onBack, onAdd }) {
    const { bankingInfo, readOnlyUser, isLoading, handleChangeBankDeclaration, handleRemove } = useMemberBankAccountView({ memberId: id })

    const [isReportOpen, setIsReportOpen] = useState(false)
    return (
        <>
            {isReportOpen ?
                <BankReport id={id} onBack={() => setIsReportOpen(false)} />
                : <>
                    <FormList.Root title={"Contas cadastradas"} isLoading={isLoading}>
                        <FormList.List list={bankingInfo.accounts} text={`Nenhuma conta cadastrada, clique abaixo para realizar o primeiro cadastro`} render={(item) => {
                            return (
                                <FormListItem.Root text={item.bankName}>
                                    <FormListItem.Actions>
                                        <Indicator
                                            status={item.isUpdated}
                                        />
                                        <ButtonBase label={"visualizar"} onClick={() => onSelect(item)} />
                                        {!readOnlyUser && <ButtonBase label={"excluir"} onClick={() => handleRemove(item.id)} danger />}
                                    </FormListItem.Actions>
                                </FormListItem.Root>
                            )
                        }}>
                            {!readOnlyUser
                                ? (!bankingInfo?.hasBankAccount || bankingInfo?.accounts?.length === 0) &&
                                <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center' }}>
                                    <input type="checkbox"
                                        checked={!bankingInfo.hasBankAccount}
                                        onChange={handleChangeBankDeclaration} />
                                    <h3>Não sou titular de nenhuma conta corrente ou poupança em quaisquer instituições financeiras</h3>
                                </div>
                                : bankingInfo?.accounts?.length === 0 && <h3>Não cadastrou ou declarou não possuir contas em quaisquer instituição financeira</h3>
                            }
                            {/* {(!bankingInfo?.hasBankAccount || bankingInfo?.accounts?.length === 0) &&
                                <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center' }}>
                                    {!readOnlyUser ?
                                        <>
                                            <input type="checkbox"
                                                checked={!bankingInfo.hasBankAccount}
                                                onChange={handleChangeBankDeclaration} />
                                            <h3>Não sou titular de nenhuma conta corrente ou poupança em quaisquer instituições financeiras</h3>
                                        </>
                                        : <h3>Não cadastrou ou declarou não possuir contas em quaisquer instituição financeira</h3>
                                    }
                                </div>
                            } */}
                        </FormList.List>

                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '80%' }}>

                            <ButtonBase onClick={onBack}><Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>

                            {(bankingInfo.hasBankAccount && !readOnlyUser) && <ButtonBase label={"cadastrar conta"} onClick={() => onAdd()} />}
                        </div>
                    </FormList.Root>
                </>
            }


        </>
    )
}