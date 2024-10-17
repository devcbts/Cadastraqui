import useAuth from "hooks/useAuth"
import candidateViewAtom from "Pages/SocialAssistant/SelectionProcess/CandidateView/atom/candidateViewAtom"
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
    const { currentApplication } = useRecoilValue(candidateViewAtom)
    const { auth } = useAuth()
    const readOnlyUser = useMemo(() => !["CANDIDATE", "RESPONSIBLE"].includes(auth?.role))
    // TODO: fetch bank account information from SPECIFIC USER
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const information =
                    readOnlyUser
                        ? await applicationService.getBankingAccountById(currentApplication, memberId)
                        : await candidateService.getBankingAccountById(memberId)
                setBankingInfo(information)
            } catch (err) {

            }
            setIsLoading(false)
        }
        fetchData()
    }, [memberId])
    const handleRemove = (id) => {
        if (readOnlyUser) { return }
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
        if (!isMounted.current || readOnlyUser) {
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
    }, [bankingInfo.hasBankAccount, readOnlyUser])

    const handleChangeBankDeclaration = () => {
        isMounted.current = true
        setBankingInfo((prev) => ({ ...prev, hasBankAccount: !prev.hasBankAccount }))
    }
    return {
        readOnlyUser, isLoading, bankingInfo, handleRemove, handleChangeBankDeclaration
    }
}