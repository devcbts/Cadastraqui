import { ReactComponent as Error } from 'Assets/icons/error.svg';
import { ReactComponent as Help } from 'Assets/icons/question-mark.svg';
import { ReactComponent as Upload } from 'Assets/icons/upload.svg';
import Spinner from 'Components/Loader/Spinner';
import moneyInputMask from "Components/MoneyFormInput/money-input-mask";
import MonthSelection from "Components/MonthSelection";
import monthAtom from 'Components/MonthSelection/atoms/month-atom';
import Tooltip from "Components/Tooltip";
import useTutorial from "hooks/useTutorial";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { useRecoilValue } from 'recoil';
import { api } from 'services/axios';
import { NotificationService } from 'services/notification';
import INCOME_SOURCE from "utils/enums/income-source";
import INCOME_TUTORIALS from "utils/enums/tutorials/income";
import METADATA_FILE_CATEGORY from 'utils/file/metadata-file-category';
import METADATA_FILE_TYPE from 'utils/file/metadata-file-type';
import monthSelectionSchema from "./schemas/month-selection-schema";
import styles from './styles.module.scss';
// quantity = months that user needs to fullfill in order to proceed saving information
const IncomeMonthSelection = forwardRef(({ data, render = [], viewMode }, ref) => {
    useTutorial(INCOME_TUTORIALS.MONTHS[data?.incomeSource])
    const [months, setMonths] = useState([])
    const handleUpdateMonth = (month, {
        loading, error, confirmSend, file
    }) => {
        console.log(`VALOR RECEBIDO`, month)
        setMonths((prev) => {
            const index = prev.findIndex(x => x.dateString === month.dateString)
            if (index < 0) {
                return [
                    ...prev,
                    {
                        loading: loading,
                        error: '',
                        confirmSend: false,
                        dateString: month.dateString,
                        file: null
                    }
                ]
            }
            const updatedMonths = [...prev]
            const item = updatedMonths[index]
            updatedMonths[index] = {
                ...item,
                loading: loading,
                error: error ?? item.error,
                confirmSend: confirmSend ?? item.confirmSend,
                file: file ?? item.file
            }
            return updatedMonths
        })
    }
    const handleAnalysis = async (file, currMonth) => {
        try {
            handleUpdateMonth(currMonth, {
                loading: true
            })
            const date = new Date(currMonth.date)
            const month = date.getMonth() + 1
            const year = date.getFullYear()
            const formData = new FormData()
            formData.append(`file_rendimentos-${month}-${year}`, file)
            formData.append(`file_metadatas`, JSON.stringify({
                [`metadata_rendimentos-${month}-${year}`]: {
                    type: METADATA_FILE_TYPE.BANK.INCOMEPROOF,
                    category: METADATA_FILE_CATEGORY.Finance,
                    source: data?.incomeSource,
                    date: `${year}-${month.toString().padStart(2, '0')}-01T00:00:00`
                }
            }))
            formData.append('nome', data.member.fullName)
            // formData.append('tries', currMonth.analysisTries)
            formData.append('id', currMonth.analysisId)
            console.log(currMonth.date)
            let error = ''
            let confirmSend = false
            const tries = (currMonth.analysisTries ?? 0) + 1
            api.post(`/rundocumentanalysis`, formData).then(async ({ data: response }) => {
                if (!response.data.legibilidade | !response.data.ratifiedReceiver | !response.data.coherent) {
                    error = 'Falha na análise do documento, envie novamente.'
                    const reason = []
                    if (!response.data.legibilidade) {
                        reason.push('ilegível')
                    }
                    if (!response.data.ratifiedReceiver) {
                        reason.push('titular diferente')
                    }
                    if (!response.data.coherent) {
                        reason.push('incoerente')
                    }
                    error += `Documento ${reason.join(', ')}.`
                }
                if (tries >= 3) {
                    error = 'Máximo de tentativas (3). Confirme o envio do documento.'
                    confirmSend = true
                }
                await ref.current.update(currMonth, {
                    analysisId: response.id,
                    analysisTries: tries,
                    grossAmount: String(response.data.grossAmount ?? (currMonth.grossAmount)),
                    file_document: !error ? file : null,
                    analysisComplete: !error && response.data.grossAmount !== null
                })
            }).finally(() => {
                handleUpdateMonth({ ...currMonth, analysisTries: (currMonth.analysisTries ?? 0) + 1 }, {
                    confirmSend,
                    error,
                    loading: false,
                    file
                })
            })
        } catch (err) {
        }
    }
    const inputRefs = useRef(new Map())
    const getInputRef = (month) => {
        if (!inputRefs.current.has(month.dateString)) {
            inputRefs.current.set(month.dateString, React.createRef());
        }
        return inputRefs.current.get(month.dateString);
    };
    const monthSelected = useRecoilValue(monthAtom)
    useEffect(() => {
        if (!monthSelected && months.some(x => x.confirmSend)) {
            for (const month of months) {
                if (!month.confirmSend) {
                    continue
                }
                NotificationService.confirm({
                    text: `Análise do documento de ${month.dateString} falhou 3 vezes. Deseja enviar mesmo assim?`,
                    title: 'Falha na análise',
                    onConfirm: async () => {
                        await ref.current.update(month, {
                            file_document: month.file
                        })
                        handleUpdateMonth(month, {
                            loading: false,
                            confirmSend: false,
                            error: '',
                            file: null
                        })
                    },
                    onCancel: () => {
                        console.log('canbcel action')
                        handleUpdateMonth(month, {
                            loading: false,
                            confirmSend: false,
                            error: '',
                            file: null
                        })
                    }
                })
            }
        }

    }, [monthSelected, months])
    return (
        <div className={[commonStyles.formcontainer, styles.container].join(' ')}>
            <h1 className={commonStyles.title}>Cadastrar Renda</h1>
            <p className={styles.user}>{data?.member?.fullName} - {INCOME_SOURCE.find(e => data?.incomeSource === e.value)?.label}</p>
            <MonthSelection
                ref={ref}
                render={render}
                data={data}
                viewMode={viewMode}
                schema={monthSelectionSchema(data.quantity, data.incomeSource)}
                sideInfo={(month) => {
                    return (viewMode
                        ? <Tooltip tooltip={'Renda obtida para fins do processo seletivo'} Icon={Help}><strong>{moneyInputMask(month?.liquidAmount)}</strong></Tooltip>
                        : !month.skipMonth &&
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
                            <input type='file'
                                hidden
                                accept='application/pdf'
                                ref={getInputRef(month)}
                                onChange={async (e) => {
                                    const file = e.target.files?.[0]
                                    if (!file) {
                                        return
                                    }
                                    if (file.size >= 10 * 1024 * 1024) {
                                        NotificationService.error({ text: 'Arquivo deve ser menor que 10MB' })
                                        return
                                    }
                                    await handleAnalysis(file, month)
                                }}
                            />
                            {months.find(x => x.dateString === month.dateString)?.loading
                                ? <Spinner size='20px' />
                                : <>
                                    <Upload
                                        style={{ cursor: 'pointer' }} onClick={() => {
                                            getInputRef(month).current.click()
                                        }} />
                                    {
                                        months.find(x => x.dateString === month.dateString)?.error
                                        && <Tooltip
                                            Icon={Error}
                                            tooltip={months.find(x => x.dateString === month.dateString)?.error}>
                                        </Tooltip>
                                    }
                                </>
                            }
                        </div>)
                }}
                checkRegister={true}
            />
        </div>
    )
})

export default IncomeMonthSelection