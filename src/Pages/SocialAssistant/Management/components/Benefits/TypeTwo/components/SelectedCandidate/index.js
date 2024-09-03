import ButtonBase from "Components/ButtonBase";
import InputBase from "Components/InputBase";
import { ReactComponent as Document } from 'Assets/icons/document.svg'
import Table from "Components/Table";
import RowActionInput from "Pages/SocialAssistant/Management/components/RowActionInput";
import { useLocation } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { NotificationService } from "services/notification";
import socialAssistantService from "services/socialAssistant/socialAssistantService";
import Loader from "Components/Loader";
import moneyInputMask from "Components/MoneyFormInput/money-input-mask";
import findLabel from "utils/enums/helpers/findLabel";
import FAMILY_RELATIONSHIP from "utils/enums/family-relationship";
import useBenefitsPDF from "../../../useBenefitsPDFInformation";
import { BlobProvider } from "@react-pdf/renderer";
import TypeTwoBenefitsPDF from "../../PDF";
export default function SelectedCandidateBenefitsTypeTwo() {
    const { state } = useLocation()
    const { scholarshipId } = state
    const [benefit, setBenefit] = useState({ typeTwoInfotmation: null, family: [], user: null })
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const fetchTypeTwoBenefits = async () => {
            try {
                setIsLoading(true)
                const information = await socialAssistantService.getTypeTwoBenefitsByScholarship(scholarshipId)
                setBenefit(information)
            } catch (err) {
                NotificationService.error({ text: err?.response?.data?.message })
            }
            setIsLoading(false)
        }
        fetchTypeTwoBenefits()
    }, [scholarshipId])
    const familyGroup = useMemo(() => {
        return benefit.family
    }, [benefit])
    const student = useMemo(() => {
        if (!benefit.typeTwoInfotmation) return {}
        const { ScholarshipCode, candidateName } = benefit?.typeTwoInfotmation ?? {}
        return ({ code: ScholarshipCode, name: candidateName })
    }, [benefit])
    const typeTwoInfo = useMemo(() => {
        if (!benefit.typeTwoInfotmation) return {}
        const { value, description } = benefit.typeTwoInfotmation.type2Benefits?.[0] ?? {}
        const { type2TermAccepted, application_id } = benefit.typeTwoInfotmation ?? {}
        return ({ value, description, type2TermAccepted, applicationId: application_id })
    }, [benefit])
    const handleUpdateScholarship = async ({
        ScholarshipCode,
        type2TermAccepted
    }) => {
        try {
            await socialAssistantService.updateScholarshipGranted(scholarshipId, {
                ScholarshipCode, type2TermAccepted
            })
            NotificationService.success({ text: 'Informação alterada', type: "toast" })
        } catch (err) {
        }
    }
    const handleUpdateTypeTwoInformation = async ({
        value,
        description
    }) => {
        try {
            await socialAssistantService.updateTypeTwoBenefits(scholarshipId, {
                value, description
            })
            NotificationService.success({ text: 'Informação alterada' })
        } catch (err) {
        }
    }
    const [typeTwoDescription, setTypeTwoDescription] = useState('')
    const benefitInfo = useBenefitsPDF(typeTwoInfo.applicationId)
    const handleOpenDocument = (url) => {
        window.open(url, '_blank')
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: 'max(600px,60%)' }}>
            <Loader loading={isLoading} />
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '24px', alignItems: 'baseline', flexWrap: 'wrap' }}>
                <label>Candidato(a): {student.name} </label>
                <RowActionInput
                    label="Cód. identificação bolsista (censo)"
                    buttonProps={{
                        label: 'salvar', onClick: async (v) => {
                            await handleUpdateScholarship({ ScholarshipCode: v })
                        }
                    }}
                    inputProps={{
                        defaultValue: student.code,

                    }}
                />

                <RowActionInput
                    label="Valor exato do total da ação de apoio"
                    buttonProps={{
                        label: 'salvar', onClick: async (v) => {
                            await handleUpdateTypeTwoInformation({ value: v })
                        }

                    }}
                    inputProps={{
                        defaultValue: typeTwoInfo.value,
                        isMoney: true
                    }}
                />

            </div>
            <div>
                <label> Descrição dos serviços usufruídos: </label>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'flex-start' }}>

                    <InputBase error={null} type="text-area" defaultValue={typeTwoInfo.description} onChange={(e) => {
                        setTypeTwoDescription(e.target.value)
                    }} />
                    <ButtonBase label={'salvar'} onClick={async () => {
                        await handleUpdateTypeTwoInformation({ description: typeTwoDescription })
                    }} />
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '32px' }}>

                <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
                    <label>Termo de benefícios</label>
                    <BlobProvider document={<TypeTwoBenefitsPDF benefit={benefitInfo} />}>
                        {({ url, loading }) => {
                            return loading
                                ? 'aguarde...'
                                : <Document height={30} width={30} cursor={'pointer'} onClick={() => handleOpenDocument(url)} />
                        }}
                    </BlobProvider>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
                    <label>Autorizar termo?</label>
                    <input type="checkbox"
                        defaultChecked={typeTwoInfo.type2TermAccepted}
                        onChange={async (e) => {
                            const { checked } = e.target
                            await handleUpdateScholarship({ type2TermAccepted: checked })

                        }} />
                </div>
            </div>
            <Table.Root
                headers={['nome', 'CPF', 'parentesco', 'profissão']}
            >

                {familyGroup?.map(e => (
                    <Table.Row>
                        <Table.Cell>{e.name}</Table.Cell>
                        <Table.Cell>{e.CPF}</Table.Cell>
                        <Table.Cell>{findLabel(FAMILY_RELATIONSHIP, e.relationship)}</Table.Cell>
                        <Table.Cell>{e.profession}</Table.Cell>
                    </Table.Row>
                ))
                }
            </Table.Root>
        </div>
    )
}