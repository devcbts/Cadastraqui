import useAuth from "hooks/useAuth";
import candidateViewAtom from "Pages/SocialAssistant/SelectionProcess/CandidateView/atom/candidateViewAtom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import candidateService from "services/candidate/candidateService";
import { NotificationService } from "services/notification";
import socialAssistantService from "services/socialAssistant/socialAssistantService";

export default function useMemberIncomeView({
    page = null,
    member
}) {
    const { auth } = useAuth()
    const { currentApplication } = useRecoilValue(candidateViewAtom)
    const { id } = member
    const [isLoading, setIsLoading] = useState(true)
    // MonthlyIncome stores an array with registered months
    // info stores the current additional information for each occupation (position)
    const [incomeInfo, setIncomeInfo] = useState({ monthlyIncome: [], info: [], data: {} })
    const [incomeStatus, setIncomeStatus] = useState(null)
    const isMounted = useRef(false)
    const isAssistant = useMemo(() => auth.role === "ASSISTANT")
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const [incomes, status] =
                    isAssistant
                        ? await Promise.all([
                            socialAssistantService.getMemberIncomeInfo(currentApplication, id),
                            socialAssistantService.getMemberIncomeStatus(currentApplication, id),
                        ])

                        : await Promise.all([
                            candidateService.getMemberIncomeInfo(id),
                            candidateService.getMemberIncomeStatus(id),
                        ])
                if (incomes) {
                    setIncomeInfo(incomes)
                    setIncomeStatus(status)
                }
                {
                    !isAssistant && NotificationService.warn({
                        text: 'Importante! Precisa cadastrar suas contas bancárias e enviar os extratos mensais. Também é obrigatório enviar mensalmente o Relatório de contas e relacionamentos (CCS).'
                    })
                }
            } catch (err) {

            }
            setIsLoading(false)
        }
        if (!page) fetchData()
    }, [id, page, isAssistant])

    const handleDeleteIncome = async (item) => {
        if (isAssistant)
            return
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
    const handleBankDeclaration = () => {
        setIncomeInfo(prev => {
            const value = prev.data.hasBankAccount === null ? false : !prev.data.hasBankAccount
            return ({ ...prev, data: { ...prev.data, hasBankAccount: value } })
        })

    }
    // useEffect(() => {
    //     if (!isMounted.current || isAssistant) {
    //         return
    //     }
    //     const updateBankDeclaration = async () => {

    //         try {
    //             if (incomeInfo?.data?.isUser) {
    //                 await candidateService.updateIdentityInfo({ hasBankAccount: incomeInfo?.data?.hasBankAccount })
    //             } else {
    //                 await candidateService.updateFamilyMember(id, { hasBankAccount: incomeInfo?.data?.hasBankAccount })
    //             }
    //             NotificationService.success({ text: 'Informação atualizada', type: 'toast' })
    //         } catch (err) {
    //             NotificationService.error({ text: 'Não foi possível atualizar esta informação' })
    //             handleBankDeclaration()
    //         }
    //     }
    //     updateBankDeclaration()
    // }, [incomeInfo?.data?.hasBankAccount, isAssistant])

    return {
        isLoading,
        incomeInfo,
        incomeStatus,
        handleDeleteIncome,
        isAssistant,
    }
}