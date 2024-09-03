import ButtonBase from "Components/ButtonBase";
import InputBase from "Components/InputBase";
import Table from "Components/Table";
import { ReactComponent as Document } from 'Assets/icons/document.svg'
import CheckboxBase from "Components/CheckboxBase";
import { BlobProvider, PDFDownloadLink, usePDF } from "@react-pdf/renderer";
import TypeOneResponsiblePDF from "./PDF/Responsible";
import RowActionInput from "../../RowActionInput";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router";
import moneyInputMask from "Components/MoneyFormInput/money-input-mask";
import TYPE_ONE_BENEFITS from "utils/enums/type-one-benefits";
import socialAssistantService from "services/socialAssistant/socialAssistantService";
import stringToFloat from "utils/string-to-float";
import { formatCurrency } from "utils/format-currency";
import { NotificationService } from "services/notification";
import useBenefitsPDF from "../useBenefitsPDFInformation";
import TypeOneBenefitsPDF from "./PDF";
import Loader from "Components/Loader";
export default function BenefitsTypeOne() {
    const { state } = useLocation()
    const { courseId } = state
    const [students, setStudents] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [typeOneBenefit, setTypeOneBenefit] = useState([])
    useEffect(() => {
        const fetchScholarshipGranted = async () => {
            try {
                setIsLoading(true)
                const information = await Promise.all([
                    socialAssistantService.getGrantedScholarshipsByCourse(courseId),
                    socialAssistantService.getTypeOneBenefitsByCourse(courseId),
                ])
                setStudents(information[0])
                setTypeOneBenefit(information[1].typeOneInformation)
            } catch (err) {
                NotificationService.error({ text: err?.response?.data?.message })
            }
            setIsLoading(false)
        }
        fetchScholarshipGranted()
    }, [courseId])
    const handleUpdateScholarshipGranted = async ({ id, code, type1TermAccepted }) => {
        try {
            await socialAssistantService.updateScholarshipGranted(id, { ScholarshipCode: code, type1TermAccepted })
            setStudents((prev) => [...prev].map(e => {
                if (e.id === id) {
                    return ({ ...e, ScholarshipCode: code ?? e.ScholarshipCode, type1TermAccepted: type1TermAccepted ?? e.type1TermAccepted })
                }
                return e
            }))
            NotificationService.success({ text: 'Alteração realizada', type: "toast" })

        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })

        }
    }
    const handleChangeTypeOneBenefit = async () => {
        try {
            await socialAssistantService.updateTypeOneBenefits(courseId, typeOneBenefit.map(e => ({ ...e, type: e.benefitType })))
            NotificationService.success({ text: 'Valores alterados', type: "toast" })
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })

        }
    }
    // ref to store initial values on first change of typeOneBenefit, to update inputs with correct defaultValue
    const [defaultTypeOneValues, setDefaultTypeOneValues] = useState([])
    useEffect(() => {
        if (defaultTypeOneValues.length > 0) {
            return
        }
        setDefaultTypeOneValues(typeOneBenefit)
    }, [typeOneBenefit])

    const [currentDocument, setCurrentDocument] = useState({ id: null, url: null })
    // const [document, update] = usePDF()
    // useBenefitsPDF((benefit) => {
    //     update(<TypeOneBenefitsPDF benefit={benefit} />)
    // }, currentDocument)

    // useEffect(() => {
    //     if (document.blob && currentDocument) {
    //         const url = URL.createObjectURL(document.blob)
    //         window.open(url, '_blank')
    //         setCurrentDocument(null)
    //         update()
    //     }
    // }, [document])
    const benefit = useBenefitsPDF(currentDocument.id)
    useEffect(() => {
        if (!benefit) { return }
        if (currentDocument.url && currentDocument.id) {
            setTimeout(() => {
                window.open(currentDocument.url, '_blank')
                setCurrentDocument({ id: null, url: null })

            }
                , 0)
        }
    }, [currentDocument, benefit])
    return (
        <div>
            <Loader loading={isLoading} />
            <h2 style={{ textAlign: 'center' }}>Benefícios Tipo 1</h2>
            <label>Cód. instituição no censo: </label>
            <div style={{ display: "flex", flexDirection: 'column', marginTop: '12px' }}>
                <RowActionInput
                    label="Valores da ação de apoio"
                    inputProps={{
                        readOnly: true, isMoney: true,
                        value: formatCurrency(typeOneBenefit.reduce((acc, curr) => acc + curr.value, 0).toFixed(2)),
                        disabled: true
                    }}
                    buttonProps={{
                        label: 'salvar',
                        onClick: async () => {
                            await handleChangeTypeOneBenefit()
                        }
                    }}
                />
                {
                    TYPE_ONE_BENEFITS.filter(e => state?.announcement?.announcement?.types1.includes(e.value)).map((e) => (
                        <RowActionInput
                            key={e.value}
                            label={e.label}
                            inputProps={{
                                isMoney: true,
                                defaultValue: defaultTypeOneValues?.find(v => v.benefitType === e.value)?.value ?? moneyInputMask(0),
                                onChange: (v) => {
                                    setTypeOneBenefit((prev) => {
                                        const value = stringToFloat(v)
                                        if (prev.find(b => b.benefitType === e.value)) {
                                            return [...prev].map((benefit) => {
                                                if (benefit.benefitType === e.value) {
                                                    return ({ ...benefit, value })
                                                }
                                                return benefit
                                            })
                                        } else {
                                            return [...prev, { benefitType: e.value, value }]
                                        }
                                    })
                                }
                            }}
                        />

                    ))
                }
            </div>
            <Table.Root headers={['rank', 'candidato', 'CPF', 'Cód. Ident. bolsista (censo)', 'termo', 'autorizar termo?']}>
                {
                    students.map(student => (
                        <Table.Row key={student.id}>
                            <Table.Cell divider>{student.application.position}</Table.Cell>
                            <Table.Cell >{student.candidateName}</Table.Cell>
                            <Table.Cell >{student.candidateCPF}</Table.Cell>
                            <Table.Cell >
                                <RowActionInput buttonProps={{
                                    label: 'salvar', onClick: async (v) => {
                                        await handleUpdateScholarshipGranted({ id: student.id, code: v })
                                    }
                                }} inputProps={{ defaultValue: student.ScholarshipCode }} />
                            </Table.Cell>
                            <Table.Cell >
                                <BlobProvider document={
                                    student.application.id === currentDocument?.id
                                        ? <TypeOneBenefitsPDF key={student.application.id} benefit={benefit} />
                                        : <></>
                                }>
                                    {({ url, loading }) => {
                                        return (loading && !url) ? 'aguarde...' : <Document height={30} width={30} cursor={'pointer'} onClick={() =>
                                            setCurrentDocument({
                                                id: student.application.id, url: url
                                            })} />
                                    }}
                                </BlobProvider>

                                {/* {student.ScholarshipCode &&
                                    <Document height={30} width={30} cursor={'pointer'} onClick={() => setCurrentDocument(student.application.id)} />
                                } */}
                            </Table.Cell>
                            <Table.Cell >
                                <input type="checkbox" defaultChecked={student.type1TermAccepted} onChange={async (e) => {
                                    const { checked } = e.target
                                    await handleUpdateScholarshipGranted({ id: student.id, type1TermAccepted: checked })
                                }} />
                            </Table.Cell>
                        </Table.Row>
                    ))
                }
            </Table.Root>
        </div>
    )
}