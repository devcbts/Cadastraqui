import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import useStepFormHook from "Pages/SubscribeForm/hooks/useStepFormHook";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import useControlForm from "hooks/useControlForm";
import { forwardRef, useEffect } from "react";
import { useRecoilState } from "recoil";
import monthAtom from "./atoms/month-atom";
import styles from './styles.module.scss';
import { Controller } from 'react-hook-form';
import { ReactComponent as Pencil } from 'Assets/icons/pencil.svg'
import { ReactComponent as Remove } from 'Assets/icons/close.svg'
// quantity = months that user needs to fullfill in order to proceed saving information
const MonthSelection = forwardRef(({ data, render = [], schema, viewMode = false, checkRegister = false }, ref) => {
    const { control, watch, setValue, getValues, trigger, formState: { errors } } = useControlForm({
        schema: schema,
        defaultValues: {
            months: [],
            quantity: data.quantity
        },
        initialData: data
    }, ref)
    const [monthSelected, setMonthSelected] = useRecoilState(monthAtom);
    const watchMonths = watch("months");
    // const { fields: months } = useFieldArray({
    //     control,
    //     name: 'months'
    // })
    useEffect(() => {
        // Get the current value (if API returns any) and prepend on the array
        const incomes = getValues("months") ?? []
        const quantity = data?.quantity
        let newArray;
        if (viewMode) {
            // If viewMode is true, means that we need to keep the months from API
            newArray = incomes.map((e) => {
                const date = new Date(e.date)
                return ({ ...e, dateString: date.toLocaleString("pt-br", { month: "long", year: "numeric" }) })
            })
        } else {
            // if viewMode is false, it means that we need to generate last (quantity) months from NOW
            newArray = Array.from({ length: quantity }).map((e, index) => {
                // current base date, to build the other ones
                // We need every *quantity months counting from TODAY's month - 1 (index start from 0)
                const currentDate = new Date();
                currentDate.setDate(1)
                currentDate.setMonth(currentDate.getMonth() - (index + 1));
                const dateString = currentDate.toLocaleString("pt-br", { month: "long", year: "numeric" })
                // check if API response (incomes) has any income with the current Date and Year
                const monthDataIncome = incomes.find(income => {
                    const incomeDate = new Date(income.date)
                    return incomeDate.getFullYear() === currentDate.getFullYear() && incomeDate.getMonth() === currentDate.getMonth()
                })
                // if TRUE return the current object formatted to display data string
                if (!!monthDataIncome) {
                    return { ...monthDataIncome, isUpdated: !monthDataIncome.skipMonth, dateString }
                } else {
                    return { ...e, isUpdated: false, dateString, date: currentDate, skipMonth: false }
                }

            })
        }
        // set the current incomes value to the newArray created, do it only ONCE when this component is rendered

        setValue("months",
            newArray.sort((a, b) => {
                const dateA = new Date(a.date), dateB = new Date(b.date)
                return dateA < dateB
            })
        )
        return () => {
            setMonthSelected(null)
        }
    }, [])

    const handleSave = (_, data) => {
        // Find the current month to be updated at "months" array, then update the entire array
        const monthsToUpdate = watchMonths.map(e => {
            if (e.date === monthSelected.date) {
                return { ...monthSelected, ...data, isUpdated: true }
            }
            return e
        })
        setValue("months", monthsToUpdate)
        trigger()
        setMonthSelected(null)

    }
    const { Steps,
        state: { activeStep, setData, setActiveStep },
        pages: { previous, next },
        max,
    } = useStepFormHook({
        render,
        onSave: handleSave,
        showStepper: false,
        viewMode: viewMode
    })
    const handleSelectMonth = (month) => {
        setActiveStep(1)
        setMonthSelected(month)
        setData(month)
    }

    const handlePrevious = () => {
        if (activeStep === 1) {
            setMonthSelected(null)
        } else {
            previous()
        }
    }
    // Render the current selected month data based on what month user has clicked
    // If NO month is selected, then the field to be send to API ("months") will stay the same as it is
    // Else, the other pages will be responsible for changing the data, and THIS component will save the new data to the specified "months" array 
    // setMonth is responsible for keep tracking of which month is selected, it's using recoil so the component isn't remounted each data change,
    // not triggering useEffect many times (it'd result on every month having 'isUpdated:true')
    return (
        <>
            {!monthSelected &&
                <>
                    <p className={styles.text}>Agora realize o cadastro para cada um dos meses abaixo, inserindo as informações correspondentes.</p>
                    {
                        watchMonths.map((month, index) => (
                            <div className={styles.wrapper}>
                                <div style={checkRegister ? { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '20px' } : {}} key={month.dateString}>
                                    <ButtonBase
                                        disabled={checkRegister ? month.skipMonth : false}
                                        label={month.dateString}
                                        onClick={() => handleSelectMonth(month)}
                                    />
                                    {(checkRegister && !viewMode) && <>
                                        <Controller name={`months.${index}.skipMonth`} control={control} render={({ field }) => {
                                            if (field.value) {
                                                // value is true = month must be skipped
                                                return <Pencil cursor={'pointer'} onClick={() => field.onChange(false)} width={20} height={20} />
                                            } else {
                                                // value is false = month must be registered
                                                return <Remove cursor={'pointer'} onClick={() => field.onChange(true)} width={20} height={20} />
                                            }
                                        }}>

                                        </Controller>
                                    </>
                                    }
                                </div>
                                {checkRegister && month.skipMonth && <>Não obteve renda</>}
                                {errors?.months?.[index]?.isUpdated?.message && <span className={styles.error}>{month.dateString} desatualizado</span>}

                            </div>
                        ))
                    }
                </>
            }
            {
                monthSelected && (
                    <>
                        <span className={styles.month}>{monthSelected.dateString}</span>
                        <fieldset disabled={viewMode}>
                            <Steps />
                        </fieldset>
                        {<div className={commonStyles.actions}>
                            <ButtonBase onClick={handlePrevious}>
                                <Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} />
                            </ButtonBase>
                            {activeStep !== max &&
                                <ButtonBase onClick={next}>
                                    <Arrow width="40px" />
                                </ButtonBase>
                            }
                            {
                                (activeStep === max && !viewMode) && (
                                    <ButtonBase onClick={next}>
                                        Salvar
                                    </ButtonBase>
                                )
                            }

                        </div>}
                    </>
                )
            }
        </>
    )
})

export default MonthSelection