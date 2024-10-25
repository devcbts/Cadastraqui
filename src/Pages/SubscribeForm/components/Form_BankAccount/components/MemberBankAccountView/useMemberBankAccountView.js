import candidateViewAtom from "Components/CandidateView/atom/candidateViewAtom"
import useAuth from "hooks/useAuth"
import useSubscribeFormPermissions from "Pages/SubscribeForm/hooks/useSubscribeFormPermissions"
import { useEffect, useMemo, useRef, useState } from "react"
import { useRecoilValue } from "recoil"
import applicationService from "services/application/applicationService"
import candidateService from "services/candidate/candidateService"
import { NotificationService } from "services/notification"
import socialAssistantService from "services/socialAssistant/socialAssistantService"
import ROLES from "utils/enums/role-types"

export default function useMemberBankAccountView({ memberId }) {
    const [isLoading, setIsLoading] = useState(true)
    const [bankingInfo, setBankingInfo] = useState({})
    const isMounted = useRef(null)
    const { canEdit, service } = useSubscribeFormPermissions()

    // TODO: fetch bank account information from SPECIFIC USER
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const information = await service?.getBankingAccountById(memberId)
                setBankingInfo(information)
            } catch (err) {

            }
            setIsLoading(false)
        }
        fetchData()
    }, [memberId])
    const handleRemove = (id) => {
        if (!canEdit) { return }
        const remove = async () => {
            try {
                await candidateService.removeBankingAccount(id)
                setBankingInfo((prev) => ({ ...prev, accounts: prev.accounts.filter(account => account.id !== id) }))
                NotificationService.success({ text: 'Conta bancária excluída' })
            } catch (err) {
                NotificationService.error({ text: err?.response?.data?.message })
            }
        }
        NotificationService.confirm({
            onConfirm: remove,
            text: 'Esta ação removerá os dados da conta atual e todos seus extratos vinculados',
            title: 'Tem certeza?',
        })

    }
    // const [isReportOpen, setIsReportOpen] = useState(false)
    // const handleReport = () => {
    //     setIsReportOpen(prev => !prev)
    // }
    useEffect(() => {
        if (!isMounted.current || !canEdit) {
            return
        }
        const updateBankDeclaration = async () => {

            try {

                if (bankingInfo?.isUser) {
                    await candidateService.updateIdentityInfo({ hasBankAccount: bankingInfo.hasBankAccount })
                } else {
                    await candidateService.updateFamilyMember(memberId, { hasBankAccount: bankingInfo.hasBankAccount })
                }
                NotificationService.success({ text: 'Informação atualizada', type: 'toast' })
            } catch (err) {
                NotificationService.error({ text: 'Não foi possível atualizar esta informação' })
            }
        }
        updateBankDeclaration()
    }, [bankingInfo.hasBankAccount, canEdit])

    const handleChangeBankDeclaration = () => {
        isMounted.current = true
        setBankingInfo((prev) => ({ ...prev, hasBankAccount: !prev.hasBankAccount }))
    }
    return {
        readOnlyUser: !canEdit, isLoading, bankingInfo, handleRemove, handleChangeBankDeclaration
    }
}