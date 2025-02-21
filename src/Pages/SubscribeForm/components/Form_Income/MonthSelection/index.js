import { ReactComponent as Help } from 'Assets/icons/question-mark.svg';
import { ReactComponent as Upload } from 'Assets/icons/upload.svg';
import moneyInputMask from "Components/MoneyFormInput/money-input-mask";
import MonthSelection from "Components/MonthSelection";
import Tooltip from "Components/Tooltip";
import useTutorial from "hooks/useTutorial";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import React, { forwardRef, useRef } from "react";
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
    const handleAnalysis = async (file, currMonth) => {
        try {
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
            formData.append('tries', currMonth.analysisTries)
            formData.append('id', currMonth.analysisId)
            console.log(currMonth.date)
            api.post(`/rundocumentanalysis`, formData).then(async ({ data: response }) => {
                await ref.current.update(currMonth, {
                    analysisId: response.id,
                    analysisTries: (currMonth.analysisTries ?? 0) + 1,
                    grossAmount: String(response.data.grossAmount ?? (currMonth.grossAmount)),
                    file_document: file
                })
            })
        } catch (err) {
            console.log(err)
        }
    }
    const inputRefs = useRef(new Map())
    const getInputRef = (month) => {
        if (!inputRefs.current.has(month.dateString)) {
            inputRefs.current.set(month.dateString, React.createRef());
        }
        return inputRefs.current.get(month.dateString);
    };
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
                        : <>
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
                            <Upload style={{ cursor: 'pointer' }} onClick={() => {
                                getInputRef(month).current.click()
                                console.log(ref.current.values())
                            }} />
                        </>)
                }}
                checkRegister={true}
            />
        </div>
    )
})

export default IncomeMonthSelection